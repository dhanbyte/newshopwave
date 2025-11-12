import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    const { data: testOrder, error } = await supabase
      .from('vendor_orders')
      .insert({
        order_id: `TEST-${Date.now()}`,
        vendor_id: 1, // Use numeric ID for Supabase
        user_id: 'test-customer@example.com',
        items: [{
          productId: 'test-product-1',
          name: 'Test Product',
          price: 100,
          quantity: 1,
          image: 'https://example.com/image.jpg'
        }],
        total: 100,
        status: 'pending',
        shipping_address: {
          name: 'Test Customer',
          address: 'Test Address',
          city: 'Test City',
          pincode: '123456'
        }
      })
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test vendor order created',
      order: testOrder
    })

  } catch (error) {
    console.error('Error creating test order:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create test order'
    })
  }
}