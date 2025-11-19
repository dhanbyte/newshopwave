import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const email = searchParams.get('email')

    console.log('=== DROPSHIPPER VERIFICATION ===')
    console.log('Checking for:', { userId, email })

    if (!userId && !email) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID or email required' 
      }, { status: 400 })
    }

    // Build query to find user
    let query = supabase.from('users').select('*')
    
    if (userId && email) {
      query = query.or(`clerk_user_id.eq.${userId},email.eq.${email}`)
    } else if (userId) {
      query = query.eq('clerk_user_id', userId)
    } else if (email) {
      query = query.eq('email', email)
    }

    const { data: users, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    if (!users || users.length === 0) {
      console.log('❌ No user found')
      return NextResponse.json({ 
        success: false, 
        message: 'User not found in database',
        searched: { userId, email }
      })
    }

    const user = users[0]
    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      clerk_user_id: user.clerk_user_id,
      is_dropshipper: user.is_dropshipper,
      dropshipper_id: user.dropshipper_id,
      dropshipper_status: user.dropshipper_status
    })

    return NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        clerk_user_id: user.clerk_user_id,
        is_dropshipper: user.is_dropshipper,
        dropshipper_id: user.dropshipper_id,
        dropshipper_status: user.dropshipper_status,
        dropshipper_payment_id: user.dropshipper_payment_id,
        dropshipper_phone: user.dropshipper_phone,
        name: user.name
      },
      message: user.is_dropshipper 
        ? `User is a registered dropshipper with ID: ${user.dropshipper_id}` 
        : 'User exists but is not a dropshipper yet'
    })

  } catch (error: any) {
    console.error('Exception:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Verification failed',
      details: error.message 
    }, { status: 500 })
  }
}