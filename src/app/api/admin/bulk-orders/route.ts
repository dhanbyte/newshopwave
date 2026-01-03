import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { userId, orders } = await req.json();

    if (!userId || !orders || !Array.isArray(orders)) {
      return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
    }

    // 1. Get User Balance
    const { data: user } = await supabase
      .from('users')
      .select('dropshipper_earnings, is_dropshipper')
      .eq('clerk_user_id', userId)
      .single();

    if (!user?.is_dropshipper) {
      return NextResponse.json({ success: false, error: 'User is not a dropshipper' }, { status: 403 });
    }

    // Calculate batch total (Cost to dropshipper)
    // For now we assume product names match. Ideal flow would require mapping to IDs.
    // Simplifying: we treat each row as a single order.
    const batchTotal = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    if (user.dropshipper_earnings < batchTotal) {
      return NextResponse.json({ 
        success: false, 
        error: `Insufficient balance. Required ₹${batchTotal}, available ₹${user.dropshipper_earnings}` 
      }, { status: 400 });
    }

    // 2. Process Batch
    const ordersToInsert = orders.map(o => ({
      order_id: `BLK-${uuidv4().slice(0, 8)}`,
      user_id: userId,
      status: 'pending',
      total: o.total,
      shipping_address: JSON.stringify({
        name: o.customerName,
        phone: o.phone,
        address: o.address,
        city: o.city,
        state: o.province,
        pincode: o.zip
      }),
      payment_method: 'COD', // Defaulting to wallet-based COD for bulk
      is_dropshipper_order: true,
      dropshipper_selling_price: o.total + 100, // Default markup if not provided
      items: JSON.stringify([{
        name: o.productName,
        quantity: o.quantity,
        price: o.total / o.quantity
      }])
    }));

    const { error: insertError } = await supabase
      .from('admin_orders')
      .insert(ordersToInsert);

    if (insertError) throw insertError;

    // 3. Deduct Balance
    const { error: updateError } = await supabase
      .from('users')
      .update({ dropshipper_earnings: user.dropshipper_earnings - batchTotal })
      .eq('clerk_user_id', userId);

    if (updateError) {
      // Rollback (simplified)
      console.error('Failed to deduct balance after bulk insert:', updateError);
    }

    return NextResponse.json({ 
      success: true, 
      count: orders.length,
      totalDeducted: batchTotal,
      message: `${orders.length} orders processed successfully`
    });

  } catch (error: any) {
    console.error('Bulk order failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
