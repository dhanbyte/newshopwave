import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const email = searchParams.get('email')

    console.log('=== USER REFRESH REQUEST ===')
    console.log('Params:', { userId, email })

    if (!userId && !email) {
      return NextResponse.json({ success: false, error: 'User ID or email required' })
    }

    // Try to find user by clerk_user_id first, then by email
    let user = null;
    let error = null;
    
    if (userId) {
      console.log('Fetching user by clerk_user_id:', userId)
      const result = await supabase
        .from('users')
        .select('*')
        .eq('clerk_user_id', userId)
        .maybeSingle();
      
      user = result.data;
      error = result.error;
      console.log('Result by clerk_user_id:', { found: !!user, error: error?.message })
    }
    
    // If not found by clerk_user_id, try by email
    if (!user && email) {
      console.log('Fetching user by email:', email)
      const result = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      
      user = result.data;
      error = result.error;
      console.log('Result by email:', { found: !!user, error: error?.message })
      
      // If found by email but missing clerk_user_id, update it
      if (user && userId && !user.clerk_user_id) {
        console.log('Updating clerk_user_id for user found by email')
        const { error: updateError } = await supabase
          .from('users')
          .update({ clerk_user_id: userId })
          .eq('email', email);
        
        if (updateError) {
          console.error('Failed to update clerk_user_id:', updateError)
        } else {
          console.log('✅ clerk_user_id updated successfully')
          user.clerk_user_id = userId; // Update local copy
        }
      }
    }

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ success: false, error: error.message })
    }

    if (!user) {
      console.log('⚠️ User not found')
      return NextResponse.json({ 
        success: false, 
        error: 'User not found',
        searched: { userId, email }
      })
    }

    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      is_dropshipper: user.is_dropshipper,
      dropshipper_id: user.dropshipper_id
    })

    return NextResponse.json({ 
      success: true, 
      user: user 
    })

  } catch (error: any) {
    console.error('Exception in user refresh:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to refresh user data',
      details: error.message 
    })
  }
}