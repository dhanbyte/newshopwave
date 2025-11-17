import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

const supabase = getDatabase

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json({
        success: false,
        error: 'Referral code is required'
      }, { status: 400 })
    }

    // Check if code exists and is active
    const { data: referral, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referral_code', code)
      .eq('status', 'pending')
      .single()

    if (error || !referral) {
      return NextResponse.json({
        success: true,
        valid: false,
        message: 'Invalid or expired referral code'
      })
    }

    return NextResponse.json({
      success: true,
      valid: true,
      referralCode: {
        code: referral.referral_code,
        referrerId: referral.referrer_id,
        rewardAmount: referral.reward_amount
      }
    })
  } catch (error) {
    console.error('Error validating referral code:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to validate referral code'
    }, { status: 500 })
  }
}