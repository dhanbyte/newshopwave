import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { data: vendorOrders } = await supabase
      .from('vendor_orders')
      .select('*')
      .limit(10)
    
    const { data: adminOrders } = await supabase
      .from('orders')
      .select('*')
      .limit(10)
    
    return NextResponse.json({ 
      success: true,
      vendorOrdersCount: vendorOrders?.length || 0,
      adminOrdersCount: adminOrders?.length || 0,
      sampleVendorOrders: (vendorOrders || []).map(o => ({
        orderId: o.order_id,
        vendorId: o.vendor_id,
        status: o.status,
        total: o.total
      })),
      sampleAdminOrders: (adminOrders || []).map(o => ({
        orderId: o.order_id,
        userId: o.user_id,
        status: o.status,
        total: o.total
      }))
    })
  } catch (error) {
    console.error('Debug orders error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
