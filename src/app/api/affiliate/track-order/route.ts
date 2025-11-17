import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

const supabase = getDatabase

export async function POST(request: NextRequest) {
  try {
    const {
      affiliateCode,
      orderId,
      orderAmount,
      referredUserId,
      referredEmail,
      productDetails
    } = await request.json()

    if (!affiliateCode || !orderId || !orderAmount) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Find the affiliate by referral code
    const { data: referral, error: fetchError } = await supabase
      .from('referrals')
      .select('*')
      .eq('referral_code', affiliateCode)
      .single()

    if (fetchError || !referral) {
      return NextResponse.json({
        success: false,
        error: 'Invalid affiliate code'
      }, { status: 400 })
    }

    // Get affiliate's current commission rate
    const { data: earnings } = await supabase
      .from('affiliate_earnings')
      .select('commission_rate')
      .eq('user_id', referral.referrer_id)
      .single()

    const commissionRate = earnings?.commission_rate || 10.00
    const commissionAmount = (orderAmount * commissionRate) / 100

    // Create commission record
    const { data: commission, error: commissionError } = await supabase
      .from('affiliate_commissions')
      .insert({
        affiliate_user_id: referral.referrer_id,
        affiliate_email: referral.referrer_email,
        referred_user_id: referredUserId,
        referred_email: referredEmail,
        order_id: orderId,
        order_amount: orderAmount,
        commission_rate: commissionRate,
        commission_amount: commissionAmount,
        product_details: productDetails || null,
        status: 'pending'
      })
      .select()
      .single()

    if (commissionError) {
      console.error('Error creating commission:', commissionError)
      return NextResponse.json({
        success: false,
        error: 'Failed to track commission'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      commission,
      message: `Commission of ₹${commissionAmount} tracked successfully`
    })
  } catch (error) {
    console.error('Error tracking affiliate order:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}