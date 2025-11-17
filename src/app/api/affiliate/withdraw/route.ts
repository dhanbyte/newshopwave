import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

const supabase = getDatabase

const MINIMUM_WITHDRAWAL = 500

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      amount,
      paymentMethod,
      paymentDetails
    } = await request.json()

    if (!userId || !amount || !paymentMethod || !paymentDetails) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Check minimum withdrawal amount
    if (amount < MINIMUM_WITHDRAWAL) {
      return NextResponse.json({
        success: false,
        error: `Minimum withdrawal amount is ₹${MINIMUM_WITHDRAWAL}`
      }, { status: 400 })
    }

    // Get user's available balance
    const { data: earnings, error: earningsError } = await supabase
      .from('affiliate_earnings')
      .select('approved_commission')
      .eq('user_id', userId)
      .single()

    if (earningsError || !earnings) {
      return NextResponse.json({
        success: false,
        error: 'Unable to fetch earnings'
      }, { status: 500 })
    }

    if (earnings.approved_commission < amount) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient approved balance'
      }, { status: 400 })
    }

    // Create withdrawal request
    const { data: withdrawal, error: withdrawalError } = await supabase
      .from('affiliate_withdrawals')
      .insert({
        user_id: userId,
        amount,
        payment_method: paymentMethod,
        payment_details: paymentDetails,
        status: 'pending'
      })
      .select()
      .single()

    if (withdrawalError) {
      console.error('Error creating withdrawal:', withdrawalError)
      return NextResponse.json({
        success: false,
        error: 'Failed to create withdrawal request'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      withdrawal,
      message: 'Withdrawal request submitted successfully'
    })
  } catch (error) {
    console.error('Error in withdrawal:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}