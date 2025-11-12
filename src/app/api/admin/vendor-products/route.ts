import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/admin/vendor-products called')
    
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')

    let query = supabase
      .from('vendor_products')
      .select('*')
      .order('created_at', { ascending: false })

    if (vendorId) {
      query = query.eq('vendor_id', parseInt(vendorId))
    }

    const { data: products, error } = await query

    if (error) {
      throw new Error(`Supabase error: ${error.message}`)
    }

    return NextResponse.json({ 
      success: true, 
      products: products || []
    })
  } catch (error) {
    console.error('Error fetching vendor products:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch products' 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('PUT /api/admin/vendor-products called')
    
    const body = await request.json()
    console.log('Request body:', body)
    const { productId, status } = body

    if (!productId || !status) {
      console.log('Missing productId or status')
      return NextResponse.json({ 
        success: false, 
        message: 'Product ID and status required' 
      }, { status: 400 })
    }

    console.log(`Updating product ${productId} to status ${status}`)
    const { data: product, error } = await supabase
      .from('vendor_products')
      .update({ status })
      .eq('id', parseInt(productId))
      .select()
      .single()

    if (error || !product) {
      console.log('Product not found or update failed:', error)
      return NextResponse.json({ 
        success: false, 
        message: 'Product not found' 
      }, { status: 404 })
    }

    console.log('Product updated successfully')
    return NextResponse.json({ 
      success: true, 
      message: `Product ${status} successfully` 
    })
  } catch (error) {
    console.error('Error updating product status:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update product status' 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product ID required' 
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('vendor_products')
      .delete()
      .eq('id', parseInt(productId))

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json({ 
        success: false, 
        message: 'Product not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete product' 
    }, { status: 500 })
  }
}