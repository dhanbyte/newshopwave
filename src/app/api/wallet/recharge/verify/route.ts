import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, amount } = await req.json();

    if (!userId || !amount) {
        return NextResponse.json({ success: false, error: "Missing userId or amount" }, { status: 400 });
    }

    // Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    // Update Wallet Balance
    // 1. Get current balance
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('dropshipper_earnings')
      .eq('clerk_user_id', userId)
      .single();

    if (fetchError) {
        console.error('Error fetching user:', fetchError);
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const currentBalance = user?.dropshipper_earnings || 0;
    const newBalance = currentBalance + Number(amount);

    console.log(`💰 Recharging Wallet: User ${userId}, Amount +${amount}, New Balance: ${newBalance}`);

    // 2. Update balance
    const { error: updateError } = await supabase
      .from('users')
      .update({ dropshipper_earnings: newBalance })
      .eq('clerk_user_id', userId);

    if (updateError) {
        console.error('Error updating balance:', updateError);
        throw updateError;
    }

    // 3. Record transaction
    const { error: txError } = await supabase
      .from('wallet_transactions')
      .insert({
        user_id: userId,
        amount: Number(amount),
        type: 'credit',
        description: 'Wallet Recharge',
        reference_id: razorpay_payment_id,
        status: 'completed'
      });

    if (txError) {
      console.error('Error recording transaction:', txError);
      // Don't fail the request if transaction recording fails
    }

    return NextResponse.json({ success: true, newBalance });

  } catch (error) {
    console.error('Recharge verification failed:', error);
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 });
  }
}
