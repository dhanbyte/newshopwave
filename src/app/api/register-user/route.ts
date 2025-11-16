import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, email, fullName, phone } = body;

    if (!userId || !email || !fullName) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    // Check if user already exists (include dropshipper fields)
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*, is_dropshipper, dropshipper_id, dropshipper_earnings, dropshipper_status')
      .or(`clerk_user_id.eq.${userId},email.eq.${email}`)
      .maybeSingle();
      
    // If user exists by email but different clerk_user_id, update clerk_user_id
    if (existingUser && !existingUser.clerk_user_id) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ clerk_user_id: userId })
        .eq('email', email);
      
      if (!updateError) {
        // Fetch updated user data
        const { data: updatedUser } = await supabase
          .from('users')
          .select('*, is_dropshipper, dropshipper_id, dropshipper_earnings, dropshipper_status')
          .eq('email', email)
          .single();
        
        return NextResponse.json({ 
          success: true, 
          user: updatedUser,
          message: 'User linked successfully' 
        });
      }
    }
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing user:', checkError);
    }

    if (existingUser) {
      return NextResponse.json({ 
        success: true, 
        user: existingUser,
        message: 'User already exists' 
      });
    }

    // Create new user with minimal required fields
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        clerk_user_id: userId,
        email,
        name: fullName || 'User',
        referral_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
        is_dropshipper: false,
        dropshipper_earnings: 0
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      user,
      message: 'User registered successfully' 
    });

  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to register user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}