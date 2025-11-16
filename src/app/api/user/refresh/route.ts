import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const email = searchParams.get('email')

    if (!userId && !email) {
      return NextResponse.json({ success: false, error: 'User ID or email required' })
    }

    // Try to find user by clerk_user_id first, then by email
    let user = null;
    let error = null;
    
    if (userId) {
      const result = await supabase
        .from('users')
        .select(`
          *,
          is_dropshipper,
          dropshipper_id,
          dropshipper_earnings,
          dropshipper_status,
          dropshipper_photo,
          dropshipper_phone,
          dropshipper_address
        `)
        .eq('clerk_user_id', userId)
        .maybeSingle();
      
      user = result.data;
      error = result.error;
    }
    
    // If not found by clerk_user_id, try by email
    if (!user && email) {
      const result = await supabase
        .from('users')
        .select(`
          *,
          is_dropshipper,
          dropshipper_id,
          dropshipper_earnings,
          dropshipper_status,
          dropshipper_photo,
          dropshipper_phone,
          dropshipper_address
        `)
        .eq('email', email)
        .maybeSingle();
      
      user = result.data;
      error = result.error;
      
      // If found by email, update clerk_user_id
      if (user && userId && !user.clerk_user_id) {
        await supabase
          .from('users')
          .update({ clerk_user_id: userId })
          .eq('email', email);
      }
    }

    if (error) {
      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({ 
      success: true, 
      user: user 
    })

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to refresh user data' })
  }
}