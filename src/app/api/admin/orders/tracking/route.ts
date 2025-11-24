import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function PUT(req: NextRequest) {
  try {
    const { orderId, trackingId } = await req.json();

    if (!orderId || !trackingId) {
      return NextResponse.json(
        { success: false, error: 'Order ID and Tracking ID are required' },
        { status: 400 }
      );
    }

    // Update tracking ID in admin_orders table
    const { error } = await supabase
      .from('admin_orders')
      .update({ tracking_id: trackingId })
      .eq('order_id', orderId);

    if (error) {
      console.error('Error updating tracking ID:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in tracking API:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
