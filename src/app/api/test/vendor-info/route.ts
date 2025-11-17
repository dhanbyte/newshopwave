import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')
    
    const { data: orders } = await supabase
      .from('vendor_orders')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false })
    
    return NextResponse.json({ 
      success: true,
      vendorId,
      ordersCount: orders?.length || 0,
      orders: orders || []
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to get vendor info'
    })
  }
}