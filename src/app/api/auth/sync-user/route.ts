import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (existingUser) {
      return NextResponse.json({ 
        success: true, 
        user: existingUser,
        message: 'User already synced' 
      });
    }

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        user_id: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        full_name: user.fullName || user.firstName + ' ' + user.lastName || 'User',
        phone: user.primaryPhoneNumber?.phoneNumber || '',
        coins: 5,
        referral_code: Math.random().toString(36).substring(2, 10).toUpperCase()
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      success: true, 
      user: newUser,
      message: 'User synced successfully' 
    });

  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to sync user' 
    }, { status: 500 });
  }
}