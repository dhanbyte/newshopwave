import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { vendorId } = await request.json()
    
    if (!vendorId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Vendor ID required' 
      }, { status: 400 })
    }

    const sampleOrders = [
      {
        order_id: `ORD-${Date.now()}-1`,
        vendor_id: vendorId,
        user_id: 'test-customer-1',
        user_email: 'customer1@test.com',
        items: [{
          productId: '5785',
          name: 'Customize 300ml Stainless Steel Mug',
          price: 199,
          quantity: 2,
          image: 'https://Shopwave.b-cdn.net/Custom%20Print%20Products/6_6cbab775-d2f1-40aa-b598-5fe7c1943372.webp'
        }],
        total: 398,
        status: 'pending',
        shipping_address: {
          street: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          pincode: '123456'
        }
      },
      {
        order_id: `ORD-${Date.now()}-2`,
        vendor_id: vendorId,
        user_id: 'test-customer-2',
        user_email: 'customer2@test.com',
        items: [{
          productId: '6537',
          name: 'Customize Stainless Steel Vacuum Water Bottle',
          price: 149,
          quantity: 1,
          image: 'https://Shopwave.b-cdn.net/Custom%20Print%20Products/0213f03e-c450-4e28-8ace-47a577a423b4.webp'
        }],
        total: 149,
        status: 'processing',
        shipping_address: {
          street: '456 Test Avenue',
          city: 'Test City',
          state: 'Test State',
          pincode: '123457'
        }
      },
      {
        order_id: `ORD-${Date.now()}-3`,
        vendor_id: vendorId,
        user_id: 'test-customer-3',
        user_email: 'customer3@test.com',
        items: [{
          productId: '14085',
          name: 'Customize Plastic Sports Bottle',
          price: 249,
          quantity: 1,
          image: 'https://Shopwave.b-cdn.net/Custom%20Print%20Products/02_fca261be-a87a-4802-abe9-19da6e291f44.webp'
        }],
        total: 249,
        status: 'delivered',
        shipping_address: {
          street: '789 Test Road',
          city: 'Test City',
          state: 'Test State',
          pincode: '123458'
        }
      }
    ]

    const { data: createdOrders, error } = await supabase
      .from('vendor_orders')
      .insert(sampleOrders)
      .select()

    if (error) throw error
    
    return NextResponse.json({ 
      success: true, 
      message: `Created ${createdOrders?.length || 0} test orders`,
      orders: createdOrders
    })
  } catch (error) {
    console.error('Error creating test orders:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create test orders' 
    }, { status: 500 })
  }
}