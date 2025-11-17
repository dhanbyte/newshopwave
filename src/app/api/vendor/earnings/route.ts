import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')

    if (!vendorId || vendorId === 'null' || vendorId === 'undefined') {
      return NextResponse.json({ 
        success: false, 
        message: 'Valid Vendor ID required' 
      }, { status: 400 })
    }

    const { data: vendor } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', vendorId)
      .single()

    const { data: orders } = await supabase
      .from('vendor_orders')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false })

    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const thisMonthEarnings = (orders || [])
      .filter(order => new Date(order.created_at) >= thisMonth && order.status === 'delivered')
      .reduce((sum, order) => sum + (order.total || 0), 0)

    const lastMonthEarnings = (orders || [])
      .filter(order => {
        const orderDate = new Date(order.created_at)
        return orderDate >= lastMonth && orderDate < thisMonth && order.status === 'delivered'
      })
      .reduce((sum, order) => sum + (order.total || 0), 0)

    const transactions = (orders || [])
      .filter(order => order.status === 'delivered')
      .slice(0, 10)
      .map(order => ({
        orderId: order.order_id,
        amount: order.total,
        date: order.created_at,
        status: 'Completed'
      }))

    const earnings = {
      totalEarnings: vendor?.total_earnings || 0,
      pendingPayments: vendor?.pending_payments || 0,
      thisMonth: thisMonthEarnings,
      lastMonth: lastMonthEarnings,
      transactions
    }

    return NextResponse.json({ 
      success: true, 
      earnings 
    })
  } catch (error) {
    console.error('Error fetching earnings:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch earnings' 
    }, { status: 500 })
  }
}