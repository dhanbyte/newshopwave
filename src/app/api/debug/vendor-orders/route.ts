import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: allOrders } = await supabase
      .from('vendor_orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    return NextResponse.json({ 
      success: true, 
      orders: allOrders || [],
      count: allOrders?.length || 0,
      vendorIds: [...new Set((allOrders || []).map(o => o.vendor_id))]
    })

  } catch (error) {
    console.error('Error fetching debug orders:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch orders'
    })
  }
}