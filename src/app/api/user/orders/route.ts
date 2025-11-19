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
    
    // First, check if user is a dropshipper
    const { data: userData } = await supabase
      .from('users')
      .select('is_dropshipper, dropshipper_id')
      .eq('clerk_user_id', userId)
      .maybeSingle()
    
    const isDropshipper = userData?.is_dropshipper === true
    const dropshipperId = userData?.dropshipper_id
    
    console.log('👤 User type:', isDropshipper ? 'Dropshipper' : 'Regular customer', dropshipperId)
    
    // Fetch regular customer orders
    const { data: customerOrders, error: customerError } = await supabase
      .from('admin_orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (customerError) {
      console.error('Error fetching customer orders:', customerError)
    }

    let allOrders = customerOrders || []

    // If user is a dropshipper, also fetch their vendor orders
    if (isDropshipper && dropshipperId) {
      console.log('📦 Fetching dropshipper orders for:', dropshipperId)
      
      const { data: vendorOrders, error: vendorError } = await supabase
        .from('vendor_orders')
        .select('*')
        .eq('vendor_id', dropshipperId)
        .order('created_at', { ascending: false })
      
      if (vendorError) {
        console.error('Error fetching vendor orders:', vendorError)
      } else {
        console.log('📦 Found vendor orders:', vendorOrders?.length || 0)
        
        // Transform vendor orders to match the format
        const transformedVendorOrders = (vendorOrders || []).map(order => ({
          order_id: order.order_id,
          user_id: userId,
          items: order.items || '[]',
          total_amount: order.customer_total || order.vendor_total,
          status: order.status,
          created_at: order.created_at,
          isDropshipperOrder: true,
          dropshipperProfit: (order.customer_total || 0) - (order.vendor_total || 0)
        }))
        
        allOrders = [...allOrders, ...transformedVendorOrders]
      }
    }

    console.log('📦 Total orders found:', allOrders.length)

    // Transform orders to match frontend format
    const transformedOrders = allOrders.map(order => {
      let items = []
      try {
        items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items || []
      } catch (e) {
        items = []
      }

      // Parse shipping address
      let shippingAddress = {
        fullName: 'N/A',
        line1: 'N/A',
        city: 'N/A',
        pincode: 'N/A'
      }
      
      try {
        if (order.shipping_address) {
          const parsedAddress = typeof order.shipping_address === 'string' 
            ? JSON.parse(order.shipping_address) 
            : order.shipping_address
          
          shippingAddress = {
            fullName: parsedAddress.fullName || parsedAddress.name || 'N/A',
            line1: parsedAddress.line1 || parsedAddress.address || parsedAddress.street || 'N/A',
            city: parsedAddress.city || 'N/A',
            pincode: parsedAddress.pincode || parsedAddress.zip || 'N/A'
          }
        }
      } catch (e) {
        console.error('Error parsing shipping address:', e)
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
        payment: order.payment_method || 'COD',
        address: shippingAddress,
        createdAt: order.created_at,
        isDropshipperOrder: order.isDropshipperOrder || false,
        dropshipperProfit: order.dropshipperProfit || 0
      }
    })

    // Sort by created_at
    transformedOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

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