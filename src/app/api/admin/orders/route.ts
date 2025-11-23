import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch both regular orders and vendor orders
    const [ordersResult, adminOrdersResult, vendorOrdersResult] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('admin_orders').select('*').order('created_at', { ascending: false }),
      supabase.from('vendor_orders').select('*').order('created_at', { ascending: false })
    ]);
    
    const regularOrders = ordersResult.data || [];
    const adminOrders = adminOrdersResult.data || [];
    const vendorOrders = vendorOrdersResult.data || [];
    
    // Create a map of order_id to shipping address from admin_orders and regular orders
    const addressMap = new Map();
    [...regularOrders, ...adminOrders].forEach(o => {
      const addr = o.shipping_address || o.address;
      if (addr) {
        // Handle both string and object formats
        const parsedAddr = typeof addr === 'string' ? JSON.parse(addr) : addr;
        if (o.order_id) addressMap.set(o.order_id, parsedAddr);
        if (o.id) addressMap.set(o.id.toString(), parsedAddr);
      }
    });

    // Get dropshipper details for vendor orders from users table
    const vendorOrdersWithDetails = await Promise.all(
      vendorOrders.map(async (order) => {
        // Get dropshipper details from users table
        const { data: dropshipper } = await supabase
          .from('users')
          .select('name, phone, dropshipper_address, email, dropshipper_id, dropshipper_phone')
          .eq('dropshipper_id', order.vendor_id)
          .eq('is_dropshipper', true)
          .maybeSingle();
        
        console.log('Dropshipper lookup for vendor_id:', order.vendor_id, 'Found:', !!dropshipper);
        
        // Use the address from the main order record (admin_orders)
        const shippingAddress = addressMap.get(order.order_id);

        return {
          ...order,
          _id: order.id,
          orderId: order.order_id,
          userId: order.customer_email,
          total: order.vendor_total,
          createdAt: order.created_at,
          isDropshipperOrder: true,
          dropshipperId: dropshipper?.dropshipper_id || order.vendor_id,
          dropshipperSellingPrice: order.customer_total || order.selling_price,
          isVendorOrder: true,
          orderType: 'vendor',
          shippingAddress: shippingAddress || (dropshipper ? {
            name: dropshipper.name,
            phone: dropshipper.dropshipper_phone || dropshipper.phone,
            address: dropshipper.dropshipper_address,
            email: dropshipper.email
          } : null)
        };
      })
    );
    
    const markedVendorOrders = vendorOrdersWithDetails;
    
    // Mark regular orders with a flag  
    const markedRegularOrders = regularOrders.map(order => ({
      ...order,
      _id: order.id,
      orderId: order.order_id || order.id,
      userId: order.user_id,
      total: order.total,
      createdAt: order.created_at,
      isDropshipperOrder: false,
      orderType: 'regular',
      shippingAddress: order.shipping_address || order.address || null
    }));
    
    // Mark admin orders with a flag
    const markedAdminOrders = adminOrders.map(order => ({
      ...order,
      _id: order.id,
      orderId: order.order_id,
      userId: order.user_id,
      total: order.total_amount,
      createdAt: order.created_at,
      items: order.items ? JSON.parse(order.items) : [],
      isDropshipperOrder: false,
      orderType: 'admin',
      shippingAddress: order.shipping_address || order.address || null
    }));
    
    // Combine and sort by creation date
    const allOrders = [...markedRegularOrders, ...markedAdminOrders, ...markedVendorOrders]
      .sort((a, b) => new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime());
    
    return NextResponse.json({ 
      success: true, 
      orders: allOrders,
      regularOrdersCount: regularOrders.length,
      adminOrdersCount: adminOrders.length,
      vendorOrdersCount: vendorOrders.length,
      totalOrders: allOrders.length
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
    
    // Try admin_orders table
    const { data: adminOrder, error: adminError } = await supabase
      .from('admin_orders')
      .update({ status, updated_at: new Date().toISOString() })
      .or(`order_id.eq.${orderId},id.eq.${orderId}`)
      .select()
      .single();
    
    if (!adminError && adminOrder) {
      console.log('✅ Admin order updated successfully:', adminOrder.order_id, 'Status:', adminOrder.status);
      return NextResponse.json({ success: true, order: adminOrder });
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