import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID required' 
      })
    }

    console.log('🔍 Fetching orders for userId:', userId)
    
    const { data: orders, error } = await supabase
      .from('admin_orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ 
        success: true, 
        orders: []
      })
    }

    console.log('📦 Found orders:', orders?.length || 0)

    // Transform orders to match frontend format
    const transformedOrders = (orders || []).map(order => {
      let items = []
      try {
        items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items || []
      } catch (e) {
        items = []
      }

      return {
        id: order.order_id,
        items: items.map(item => ({
          productId: item.productId || item.id,
          name: item.name,
          price: item.price,
          qty: item.quantity || item.qty,
          image: item.image,
          customName: item.customName || null
        })),
        total: order.total_amount,
        status: order.status,
        payment: 'COD',
        address: {
          fullName: 'N/A',
          line1: 'N/A',
          city: 'N/A',
          pincode: 'N/A'
        },
        createdAt: order.created_at
      }
    })

    return NextResponse.json({ 
      success: true, 
      orders: transformedOrders 
    })

  } catch (error) {
    console.error('Error fetching user orders:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch orders',
      orders: []
    })
  }
}
