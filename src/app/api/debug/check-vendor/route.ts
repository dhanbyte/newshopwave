import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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

    // Check if vendor exists
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('id, email, business_name, brand_name, status, created_at')
      .eq('id', parseInt(vendorId))
      .single()

    if (vendorError || !vendor) {
      return NextResponse.json({
        success: false,
        message: 'Vendor not found',
        error: vendorError?.message,
        vendorId: parseInt(vendorId)
      })
    }

    // Check vendor products count
    const { data: products, error: productsError } = await supabase
      .from('vendor_products')
      .select('id, name, status')
      .eq('vendor_id', parseInt(vendorId))

    return NextResponse.json({
      success: true,
      vendor: {
        id: vendor.id,
        email: vendor.email,
        businessName: vendor.business_name,
        brandName: vendor.brand_name,
        status: vendor.status,
        createdAt: vendor.created_at
      },
      products: {
        total: products?.length || 0,
        list: products || []
      },
      canAddProducts: vendor.status === 'approved'
    })
  } catch (error) {
    console.error('Error checking vendor:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to check vendor',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
