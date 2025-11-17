import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

const supabase = getDatabase

export async function POST(request: NextRequest) {
  try {
    const { userId, userEmail } = await request.json()

    if (!userId || !userEmail) {
      return NextResponse.json({
        success: false,
        error: 'User ID and email are required'
      }, { status: 400 })
    }

    // Generate unique referral code
    const code = `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Create referral entry
    const { data: referral, error } = await supabase
      .from('referrals')
      .insert({
        referrer_id: userId,
        referrer_email: userEmail,
        referral_code: code,
        reward_amount: 50, // ₹50 reward per successful referral
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating referral code:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to generate referral code'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      code: referral.referral_code,
      message: 'Referral code generated successfully'
    })
  } catch (error) {
    console.error('Error in generate referral:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}