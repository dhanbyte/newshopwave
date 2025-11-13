import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100000) // Use high limit to get all products

    return NextResponse.json({ 
      success: true, 
      products: products || []
    })
  } catch (error) {
    console.error('Error fetching admin products:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch products' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()
    
    const { data: savedProduct, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        original_price: productData.price,
        image: productData.image,
        category: productData.category,
        subcategory: productData.subcategory,
        tertiary_category: productData.tertiaryCategory,
        quantity: productData.stock || 0
      })
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product added successfully',
      product: savedProduct
    })
  } catch (error) {
    console.error('Error adding admin product:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to add product' 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { productId, status } = await request.json()

    if (!productId || !status) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product ID and status required' 
      }, { status: 400 })
    }

    const { data: product, error } = await supabase
      .from('products')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', productId)
      .select()
      .single()

    if (error || !product) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product not found' 
      }, { status: 404 })
    }

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
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) {
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
