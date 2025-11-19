import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, items, total, paymentMethod, paymentId, shippingAddress } = body;

    if (!userId || !items || !total) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    console.log('📦 Creating order with userId:', userId)
    
    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create new order in admin_orders with shipping address
    const { data: order, error: orderError } = await supabase
      .from('admin_orders')
      .insert({
        order_id: orderId,
        user_id: userId,
        items: JSON.stringify(items),
        total_amount: total,
        status: 'pending',
        shipping_address: JSON.stringify(shippingAddress),
        payment_method: paymentMethod,
        payment_id: paymentId
      })
      .select()
      .single()

    if (orderError) {
      throw orderError
    }

    console.log('✅ Order saved with userId:', order.user_id)

    // Create vendor orders for vendor products
    const vendorOrders = [];
    console.log('🔍 Checking items for vendor products:', items.map(i => ({ id: i.id, name: i.name })));
    
    for (const item of items) {
      // Check if this is a vendor product
      const { data: vendorProduct } = await supabase
        .from('vendor_products')
        .select('*')
        .eq('id', item.id)
        .single()
      
      console.log(`🔍 Item ${item.id} vendor product:`, vendorProduct ? 'Found' : 'Not found');
      
      if (vendorProduct) {
        console.log('📦 Creating vendor order for:', vendorProduct.name, 'Vendor:', vendorProduct.vendor_id);
        
        const { data: vendorOrder, error: vendorOrderError } = await supabase
          .from('vendor_orders')
          .insert({
            order_id: orderId,
            vendor_id: vendorProduct.vendor_id,
            customer_email: userId,
            vendor_total: item.price * item.quantity,
            status: 'pending'
          })
          .select()
          .single()
        
        if (!vendorOrderError) {
          vendorOrders.push(vendorOrder)
          console.log('✅ Vendor order created successfully')
        }
      }
    }
    
    console.log(`📊 Created ${vendorOrders.length} vendor orders`);

    return NextResponse.json({ 
      success: true, 
      order,
      orderId,
      vendorOrdersCreated: vendorOrders.length,
      message: 'Order placed successfully' 
    });

  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to place order' 
    }, { status: 500 });
  }
}
