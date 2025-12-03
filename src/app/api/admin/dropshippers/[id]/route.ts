import { NextResponse } from 'next/server'
import { getDatabase } from '../../../../../lib/db'

const supabase = getDatabase

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const dropshipperId = params.id

    // Fetch dropshipper details
    const { data: dropshipper, error: dropshipperError } = await supabase
      .from('users')
      .select('*')
      .eq('dropshipper_id', dropshipperId)
      .eq('is_dropshipper', true)
      .single()

    if (dropshipperError || !dropshipper) {
      return NextResponse.json({
        success: false,
        error: 'Dropshipper not found'
      }, { status: 404 })
    }

    // Fetch orders for this dropshipper
    const { data: orders, error: ordersError } = await supabase
      .from('admin_orders')
      .select('*')
      .eq('dropshipperId', dropshipperId)
      .order('createdAt', { ascending: false })

    // Calculate stats
    const allOrders = orders || []
    const stats = {
      total_orders: allOrders.length,
      total_products_sold: allOrders.reduce((sum, order) => {
        const items = order.items || []
        return sum + items.reduce((itemSum: number, item: any) => itemSum + (item.quantity || 0), 0)
      }, 0),
      total_earnings: dropshipper.dropshipper_earnings || 0,
      delivered_orders: allOrders.filter(o => o.status === 'delivered').length,
      pending_orders: allOrders.filter(o => o.status === 'pending' || o.status === 'processing').length,
      wallet_balance: dropshipper.dropshipper_earnings || 0
    }

    // Fetch transactions (if table exists)
    let transactions = []
    try {
      const { data: txnData } = await supabase
        .from('dropshipper_transactions')
        .select('*')
        .eq('dropshipper_id', dropshipperId)
        .order('created_at', { ascending: false })
        .limit(50)
      
      transactions = txnData || []
    } catch (e) {
      // Table might not exist yet
      console.log('Transactions table not found, skipping')
    }

    return NextResponse.json({
      success: true,
      dropshipper,
      stats,
      orders: allOrders,
      transactions
    })
  } catch (error) {
    console.error('Error fetching dropshipper details:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch dropshipper details'
    }, { status: 500 })
  }
}
