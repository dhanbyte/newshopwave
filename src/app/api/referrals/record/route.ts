import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

const supabase = getDatabase

export async function POST(request: NextRequest) {
  try {
    const { referralCode, newUserId, newUserEmail } = await request.json()

    if (!referralCode || !newUserId || !newUserEmail) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Find the referral by code
    const { data: referral, error: fetchError } = await supabase
      .from('referrals')
      .select('*')
      .eq('referral_code', referralCode)
      .eq('status', 'pending')
      .single()

    if (fetchError || !referral) {
      return NextResponse.json({
        success: false,
        error: 'Invalid referral code'
      }, { status: 400 })
    }

    // Update referral with new user info
    const { error: updateError } = await supabase
      .from('referrals')
      .update({
        referred_user_id: newUserId,
        referred_email: newUserEmail,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', referral.id)

    if (updateError) {
      console.error('Error updating referral:', updateError)
      return NextResponse.json({
        success: false,
        error: 'Failed to record referral'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Referral recorded successfully'
    })
  } catch (error) {
    console.error('Error recording referral:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}