import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const maxDuration = 10
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')

    if (!vendorId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Vendor ID required' 
      }, { status: 400 })
    }
    
    // Get product count
    const { count: productCount } = await supabase
      .from('vendor_products')
      .select('*', { count: 'exact', head: true })
      .eq('vendor_id', parseInt(vendorId))
    
    // Get order stats
    const { count: totalOrders } = await supabase
      .from('vendor_orders')
      .select('*', { count: 'exact', head: true })
      .eq('vendor_id', parseInt(vendorId))
    
    const { count: pendingOrders } = await supabase
      .from('vendor_orders')
      .select('*', { count: 'exact', head: true })
      .eq('vendor_id', parseInt(vendorId))
      .eq('status', 'pending')
    
    // Get total earnings
    const { data: earnings } = await supabase
      .from('vendor_orders')
      .select('total')
      .eq('vendor_id', parseInt(vendorId))
      .neq('status', 'cancelled')
    
    const totalEarnings = earnings?.reduce((sum, order) => sum + (order.total || 0), 0) || 0
    
    const stats = {
      totalProducts: productCount || 0,
      totalOrders: totalOrders || 0,
      totalEarnings,
      pendingOrders: pendingOrders || 0
    }

    return NextResponse.json({ 
      success: true, 
      stats
    })
  } catch (error) {
    console.error('Error fetching vendor stats:', error)
    
    return NextResponse.json({ 
      success: true,
      stats: {
        totalProducts: 0,
        totalOrders: 0,
        totalEarnings: 0,
        pendingOrders: 0
      }
    })
  }
}
