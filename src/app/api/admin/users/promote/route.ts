import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId, state, district } = await request.json()
    
    if (!userId || !state || !district) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID, state, and district are required' 
      }, { status: 400 })
    }

    // Update user to be admin with specific region
    const { error } = await supabase
      .from('users')
      .update({ 
        is_admin: true,
        admin_state: state,
        admin_district: district,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId) // Check if userId is clerk_user_id or uuid. Assuming clerk_user_id unique match.
    
    if (error) {
      console.error('Error promoting user:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to promote user: ' + error.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'User promoted to Admin successfully'
    })
  } catch (error) {
    console.error('Error in promote admin:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
}
