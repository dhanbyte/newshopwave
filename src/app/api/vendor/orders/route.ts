import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const maxDuration = 15

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!vendorId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Vendor ID required' 
      })
    }

    console.log('Fetching orders for vendorId:', vendorId)
    
    // Return empty orders for now since table doesn't exist
    return NextResponse.json({ 
      success: true,
      orders: []
    })

  } catch (error) {
    console.error('Error fetching vendor orders:', error)
    return NextResponse.json({ 
      success: true,
      orders: []
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { orderId, status } = await request.json()

    const updateData: any = { 
      status, 
      updated_at: new Date().toISOString()
    }

    if (status === 'shipped') updateData.shipped_at = new Date().toISOString()
    if (status === 'delivered') updateData.delivered_at = new Date().toISOString()
    if (status === 'cancelled') updateData.cancelled_at = new Date().toISOString()

    const { data: order, error } = await supabase
      .from('vendor_orders')
      .update(updateData)
      .eq('id', parseInt(orderId))
      .select()
      .single()

    if (error || !order) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order not found' 
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Order ${status} successfully`,
      order 
    })

  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update order' 
    })
  }
}
