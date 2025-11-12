import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { userId, items, totalAmount, shippingAddress, paymentMethod } = await request.json();
    
    if (!userId || !items || !items.length || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        items: JSON.stringify(items),
        total_amount: totalAmount,
        status: 'pending',
        shipping_address: JSON.stringify(shippingAddress),
        payment_method: paymentMethod
      })
      .select()
      .single();
      
    if (orderError) {
      throw orderError;
    }
    
    // 2. Process referral if this is user's first order
    const { data: user } = await supabase
      .from('users')
      .select('referred_by, has_made_purchase')
      .eq('id', userId)
      .single();
    
    if (user && user.referred_by && !user.has_made_purchase) {
      // Calculate referral reward (₹5 for orders < ₹100, ₹10 for ≥ ₹100)
      const rewardAmount = totalAmount < 100 ? 5 : 10;
      
      // Add reward to referrer's balance
      await supabase
        .from('users')
        .update({
          referral_balance: supabase.sql`referral_balance + ${rewardAmount}`,
          total_earned: supabase.sql`total_earned + ${rewardAmount}`
        })
        .eq('id', user.referred_by);
      
      // Record the referral reward
      await supabase
        .from('referral_rewards')
        .insert({
          referrer_id: user.referred_by,
          referee_id: userId,
          order_id: order.id,
          amount: rewardAmount,
          order_amount: totalAmount,
          status: 'completed'
        });
      
      // Mark user as having made a purchase
      await supabase
        .from('users')
        .update({ has_made_purchase: true })
        .eq('id', userId);
    }
    
    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Order created successfully'
    });
    
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
