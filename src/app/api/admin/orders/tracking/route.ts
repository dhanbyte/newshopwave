import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function PUT(req: NextRequest) {
  try {
    const { 
      orderId, 
      trackingId, 
      trackingStatus, 
      estimatedDelivery, 
      trackingUpdates 
    } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (trackingId !== undefined) updateData.tracking_number = trackingId;
    if (trackingStatus !== undefined) updateData.tracking_status = trackingStatus;
    if (estimatedDelivery !== undefined) updateData.estimated_delivery = estimatedDelivery;
    if (trackingUpdates !== undefined) updateData.tracking_updates = JSON.stringify(trackingUpdates);

    // Update in multiple tables to ensure consistency
    const tables = ['admin_orders', 'orders', 'vendor_orders'];
    const results = await Promise.all(
      tables.map(table => 
        supabase
          .from(table)
          .update(updateData)
          .or(`order_id.eq.${orderId},id.eq.${orderId}`)
      )
    );

    const errors = results.filter(r => r.error).map(r => r.error);
    
    // Send Notification to user if trackingStatus changed
    if (trackingStatus) {
      // First find the user_id for this order
      const { data: orderData } = await supabase
        .from('admin_orders')
        .select('user_id')
        .eq('order_id', orderId)
        .maybeSingle();

      if (orderData?.user_id) {
        const statusLabels: any = {
          'pending': '⏳ Order Pending',
          'in_transit': '🚚 Order In Transit',
          'out_for_delivery': '🎁 Out for Delivery',
          'delivered': '✅ Order Delivered',
          'returned': '↩️ Order Returned'
        };

        await supabase
          .from('user_notifications')
          .insert({
            user_id: orderData.user_id,
            title: statusLabels[trackingStatus] || '📦 Order Update',
            message: `Your order #${orderId} has been updated to ${trackingStatus.replace('_', ' ')}.`,
            type: 'order',
            metadata: { order_id: orderId, status: trackingStatus }
          });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Tracking information updated successfully' 
    });
  } catch (error: any) {
    console.error('Error in tracking API:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
