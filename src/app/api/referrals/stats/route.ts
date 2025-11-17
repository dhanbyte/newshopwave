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

    // Get stats from referral_stats table
    const { data: stats, error } = await supabase
      .from('referral_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching referral stats:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch stats'
      }, { status: 500 })
    }

    // If no stats exist, return default values
    if (!stats) {
      return NextResponse.json({
        success: true,
        stats: {
          total_referrals: 0,
          successful_referrals: 0,
          total_earned: 0,
          pending_rewards: 0
        }
      })
    }

    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Error in referral stats:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}