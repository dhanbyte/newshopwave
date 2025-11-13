import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/admin/vendor-products called')
    
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')

    // Fetch all products without limit using pagination
    let allProducts = []
    let from = 0
    const batchSize = 1000
    let hasMore = true

    while (hasMore) {
      let query = supabase
        .from('vendor_products')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, from + batchSize - 1)

      if (vendorId) {
        query = query.eq('vendor_id', parseInt(vendorId))
      }

      const { data: batch, error } = await query
      
      if (error) {
        throw new Error(`Supabase error: ${error.message}`)
      }

      if (batch && batch.length > 0) {
        allProducts = [...allProducts, ...batch]
        from += batchSize
        hasMore = batch.length === batchSize
      } else {
        hasMore = false
      }
    }

    console.log(`Fetched ${allProducts.length} total products from database`)

    if (allProducts.length === 0) {
      console.log('No products found in database')
    }

    return NextResponse.json({ 
      success: true, 
      products: allProducts || []
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
    const { productId, status, name, category, subcategory, price, originalPrice, brand, stock, weight, length, width, height, description } = body

    if (!productId) {
      console.log('Missing productId')
      return NextResponse.json({ 
        success: false, 
        message: 'Product ID required' 
      }, { status: 400 })
    }

    // Build update object based on provided fields
    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (name !== undefined) updateData.name = name
    if (category !== undefined) updateData.category = category
    if (subcategory !== undefined) updateData.subcategory = subcategory
    if (price !== undefined) updateData.price = price
    if (originalPrice !== undefined) updateData.original_price = originalPrice
    if (brand !== undefined) updateData.brand = brand
    if (stock !== undefined) updateData.stock = stock
    if (weight !== undefined) updateData.weight = weight
    if (length !== undefined) updateData.length = length
    if (width !== undefined) updateData.width = width
    if (height !== undefined) updateData.height = height
    if (description !== undefined) updateData.description = description
    if (body.images !== undefined) updateData.images = body.images

    console.log(`Updating product ${productId} with:`, updateData)
    const { data: product, error } = await supabase
      .from('vendor_products')
      .update(updateData)
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
      message: 'Product updated successfully' 
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update product' 
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