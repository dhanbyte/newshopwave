import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

const supabase = getDatabase

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    // Get earnings summary
    const { data: earnings, error: earningsError } = await supabase
      .from('affiliate_earnings')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (earningsError && earningsError.code !== 'PGRST116') {
      console.error('Error fetching earnings:', earningsError)
    }

    // Get recent commissions
    const { data: recentCommissions, error: commissionsError } = await supabase
      .from('affiliate_commissions')
      .select('*')
      .eq('affiliate_user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (commissionsError) {
      console.error('Error fetching commissions:', commissionsError)
    }

    // Get referral code
    const { data: referralData } = await supabase
      .from('referrals')
      .select('referral_code')
      .eq('referrer_id', userId)
      .limit(1)
      .single()

    // Default values if no data
    const stats = earnings || {
      total_referrals: 0,
      active_referrals: 0,
      total_orders_from_referrals: 0,
      total_commission_earned: 0,
      pending_commission: 0,
      approved_commission: 0,
      paid_commission: 0,
      current_tier: 'Bronze',
      commission_rate: 10.00
    }

    return NextResponse.json({
      success: true,
      stats,
      recentCommissions: recentCommissions || [],
      referralCode: referralData?.referral_code || null
    })
  } catch (error) {
    console.error('Error in affiliate stats:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}