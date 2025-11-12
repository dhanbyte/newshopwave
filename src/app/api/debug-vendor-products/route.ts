import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: allVendorProducts } = await supabase
      .from('vendor_products')
      .select('*')
    
    const { data: activeVendorProducts } = await supabase
      .from('vendor_products')
      .select('*')
      .eq('status', 'active')
    
    return NextResponse.json({
      success: true,
      totalVendorProducts: allVendorProducts?.length || 0,
      activeVendorProducts: activeVendorProducts?.length || 0,
      allProducts: (allVendorProducts || []).map(p => ({
        id: p.id.toString(),
        name: p.name,
        status: p.status,
        vendorId: p.vendor_id,
        price: p.price,
        stock: p.stock
      })),
      activeProducts: (activeVendorProducts || []).map(p => ({
        id: p.id.toString(),
        name: p.name,
        status: p.status,
        vendorId: p.vendor_id,
        price: p.price,
        stock: p.stock
      }))
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    })
  }
}
