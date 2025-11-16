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

    const { data: testOrder, error } = await supabase
      .from('vendor_orders')
      .insert({
        order_id: `TEST${Date.now()}`,
        vendor_id: vendorId,
        user_id: 'test@customer.com',
        items: [{
          productId: 'test-product',
          name: 'Test Product',
          price: 500,
          quantity: 1,
          image: 'test.jpg'
        }],
        total: 500,
        status: 'pending',
        shipping_address: {
          name: 'Test Customer',
          address: 'Test Address'
        }
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      success: true, 
      message: 'Test order created',
      order: testOrder
    })
  } catch (error) {
    console.error('Error creating test order:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create test order' 
    }, { status: 500 })
  }
}