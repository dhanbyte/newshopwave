import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    if (!userId) return NextResponse.json([]);
    
    const { data } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
    return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  try {
    const { userId, amount, bankDetails } = await req.json();

    if (!userId || !amount || !bankDetails) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (amount < 1000) {
      return NextResponse.json({ success: false, error: 'Minimum withdrawal amount is ₹1000' }, { status: 400 });
    }

    // Check Balance
    const { data: user } = await supabase
      .from('users')
      .select('dropshipper_earnings')
      .eq('clerk_user_id', userId)
      .single();

    const currentBalance = user?.dropshipper_earnings || 0;

    if (currentBalance < amount) {
      return NextResponse.json({ success: false, error: 'Insufficient wallet balance' }, { status: 400 });
    }

    // 1. Deduct Balance immediately
    const { error: updateError } = await supabase
      .from('users')
      .update({ dropshipper_earnings: currentBalance - amount })
      .eq('clerk_user_id', userId);

    if (updateError) throw updateError;

    // 2. Insert Withdrawal Record
    const { error: insertError } = await supabase
      .from('withdrawals')
      .insert({
        user_id: userId,
        amount: amount,
        status: 'pending',
        bank_details: bankDetails
      });

    if (insertError) {
      // Rollback balance deduction if insert fails
      console.error('Withdrawal insert failed, rolling back balance:', insertError);
      await supabase
        .from('users')
        .update({ dropshipper_earnings: currentBalance }) // Restore original
        .eq('clerk_user_id', userId);
      throw insertError;
    }

    // 3. Record transaction
    const { error: txError } = await supabase
      .from('wallet_transactions')
      .insert({
        user_id: userId,
        amount: amount,
        type: 'debit',
        description: 'Withdrawal Request',
        status: 'pending'
      });

    if (txError) {
      console.error('Error recording transaction:', txError);
      // Don't fail the request if transaction recording fails
    }

    return NextResponse.json({ success: true, message: 'Withdrawal request submitted successfully' });

  } catch (error) {
    console.error('Withdrawal request failed:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit request' }, { status: 500 });
  }
}
