// src/app/api/payment/verify-dropshipper-payment/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import crypto from 'crypto'
import { getDatabase } from '../../../../lib/db'
import Razorpay from 'razorpay'

const supabase = getDatabase
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: Request) {
  try {
    const authObj = await auth()
    const userId = authObj.userId
    
    // We now allow guest verification. If not logged in, we verify and return success.
    // The user will be redirected to the Google Form regardless.
    
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      interval,
      name,
      phone,
      email,
    } = await request.json()

    console.log('Verifying payment:', { razorpay_order_id, razorpay_payment_id, planId, interval })

    // Determine the amount based on the selected plan (in paise)
    let amount = 0
    if (planId === 'plan_weekly') amount = 49 * 100
    else if (planId === 'plan_monthly') amount = 99 * 100
    else if (planId === 'plan_yearly') amount = 799 * 100
    else if (planId === 'plan_premium') amount = 1999 * 100
    else if (planId === 'plan_all_in_one_5000') amount = 5000 * 100

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const secret = process.env.RAZORPAY_KEY_SECRET!
    
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(text)
      .digest('hex')

    console.log('Signature check:', { generated: generatedSignature, received: razorpay_signature, match: generatedSignature === razorpay_signature })

    if (generatedSignature !== razorpay_signature) {
      console.error('Signature mismatch')
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Calculate subscription end date based on interval
    const now = new Date()
    let subscriptionEndDate = new Date(now)
    
    switch (interval) {
      case 'weekly':
        subscriptionEndDate.setDate(now.getDate() + 7)
        break
      case 'monthly':
        subscriptionEndDate.setMonth(now.getMonth() + 1)
        break
      case 'yearly':
        subscriptionEndDate.setFullYear(now.getFullYear() + 1)
        break
      case 'lifetime':
        subscriptionEndDate.setFullYear(now.getFullYear() + 10) // 10 years for lifetime
        break
    }

    // If user is logged in, update their subscription
    if (userId) {
      console.log('Fetching user from DB:', userId)
      const { data: dbUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_user_id', userId)
        .single()

      if (userError || !dbUser) {
        console.error('Error fetching user:', userError)
        // If user not in DB yet, we skip update but still return success for payment
      } else {
        console.log('User found:', dbUser.id)
        // Update user with dropshipper subscription details
        const { error: updateError } = await supabase
          .from('users')
          .update({
            is_dropshipper: true,
            dropshipper_status: 'active',
            dropshipper_plan_id: planId,
            dropshipper_plan_interval: interval,
            dropshipper_subscription_start: now.toISOString(),
            dropshipper_subscription_end: subscriptionEndDate.toISOString(),
            dropshipper_payment_id: razorpay_payment_id,
            name: name || dbUser.name,
            dropshipper_phone: phone || dbUser.dropshipper_phone,
            updated_at: now.toISOString(),
          })
          .eq('clerk_user_id', userId)

        if (updateError) {
          console.error('❌ Error updating user subscription:', updateError)
        }
      }
    }

    // Try to log the transaction in payments table
    try {
      await supabase
        .from('payments')
        .insert({
          clerk_user_id: userId || 'GUEST',
          razorpay_order_id,
          razorpay_payment_id,
          amount: amount,
          currency: 'INR',
          status: 'success',
          payment_type: 'dropshipper_subscription',
          plan_id: planId,
          plan_interval: interval,
          created_at: now.toISOString(),
          email: email || 'No Email Provided'
        })
    } catch (paymentLogError) {
      console.log('Payment log error (table may not exist):', paymentLogError)
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription activated',
      subscriptionEnd: subscriptionEndDate.toISOString(),
    })
  } catch (error: any) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify payment' },
      { status: 500 }
    )
  }
}


