import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    // Fetch all withdrawals
    // Note: We are manually joining users because foreign key might not be set up perfectly for auto-join
    const { data: withdrawals, error } = await supabase
      .from('withdrawals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Fetch user details for these withdrawals
    const userIds = withdrawals.map(w => w.user_id);
    const { data: users } = await supabase
      .from('users')
      .select('clerk_user_id, name, email, phone, dropshipper_id')
      .in('clerk_user_id', userIds);

    // Combine data
    const enrichedWithdrawals = withdrawals.map(w => {
      const user = users?.find(u => u.clerk_user_id === w.user_id);
      return {
        ...w,
        user: user || { name: 'Unknown', email: 'Unknown', phone: 'Unknown' }
      };
    });

    return NextResponse.json({ success: true, data: enrichedWithdrawals });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, status, adminNote } = await req.json();
    
    // 1. Get current withdrawal status to prevent double processing
    const { data: current, error: fetchError } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('id', id)
        .single();
        
    if (fetchError || !current) throw new Error('Withdrawal not found');
    if (current.status !== 'pending') throw new Error('Request already processed');

    // 2. Update status
    const { error: updateError } = await supabase
      .from('withdrawals')
      .update({ status, admin_note: adminNote }) // Ensure your table has admin_note or remove this
      .eq('id', id);
      
    if (updateError) throw updateError;
    
    // 3. If Rejected, Refund the amount to wallet
    if (status === 'rejected') {
        // Fetch current balance
        const { data: user } = await supabase
            .from('users')
            .select('dropshipper_earnings')
            .eq('clerk_user_id', current.user_id)
            .single();
            
        const currentBalance = user?.dropshipper_earnings || 0;
        const refundAmount = Number(current.amount);
        
        // Refund
        await supabase
            .from('users')
            .update({ dropshipper_earnings: currentBalance + refundAmount })
            .eq('clerk_user_id', current.user_id);
            
        console.log(`Refunded ₹${refundAmount} to user ${current.user_id}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Withdrawal update failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
