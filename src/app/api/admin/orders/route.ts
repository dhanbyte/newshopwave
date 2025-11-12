import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch both regular orders and vendor orders
    const [ordersResult, vendorOrdersResult] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('vendor_orders').select('*').order('created_at', { ascending: false })
    ]);
    
    const adminOrders = ordersResult.data || [];
    const vendorOrders = vendorOrdersResult.data || [];
    
    // Mark vendor orders with a flag
    const markedVendorOrders = vendorOrders.map(order => ({
      ...order,
      isVendorOrder: true,
      orderType: 'vendor'
    }));
    
    // Mark admin orders with a flag
    const markedAdminOrders = adminOrders.map(order => ({
      ...order,
      isVendorOrder: false,
      orderType: 'admin'
    }));
    
    // Combine and sort by creation date
    const allOrders = [...markedAdminOrders, ...markedVendorOrders]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return NextResponse.json({ 
      success: true, 
      orders: allOrders,
      adminOrdersCount: adminOrders.length,
      vendorOrdersCount: vendorOrders.length
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    console.log('🔄 Updating order:', { orderId, status });

    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    // Try to update in orders table first
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .or(`order_id.eq.${orderId},id.eq.${orderId}`)
      .select()
      .single();
    
    if (!orderError && order) {
      console.log('✅ Order updated successfully:', order.order_id, 'Status:', order.status);
      return NextResponse.json({ success: true, order });
    }
    
    // If not found in orders, try vendor_orders
    const { data: vendorOrder, error: vendorError } = await supabase
      .from('vendor_orders')
      .update({ status, updated_at: new Date().toISOString() })
      .or(`order_id.eq.${orderId},id.eq.${orderId}`)
      .select()
      .single();
    
    if (!vendorError && vendorOrder) {
      console.log('✅ Vendor order updated successfully:', vendorOrder.order_id, 'Status:', vendorOrder.status);
      return NextResponse.json({ success: true, order: vendorOrder });
    }

    console.log('❌ Order not found for update:', orderId);
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
  } catch (error) {
    console.error('❌ Error updating order:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}