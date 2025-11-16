import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching pending products from Supabase...')
    
    // Get all pending vendor products with images
    const { data: pendingProducts, error } = await supabase
      .from('vendor_products')
      .select('id, name, description, images, price, original_price, stock, status, created_at, vendor_id')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to fetch pending products' 
      })
    }
    
    console.log(`Found ${pendingProducts?.length || 0} pending products`)
    
    // Transform the data to match expected format
    const transformedProducts = (pendingProducts || []).map(product => ({
      _id: product.id.toString(),
      name: product.name,
      description: product.description,
      images: product.images,
      price: product.price,
      stock: product.stock,
      category: product.category,
      createdAt: product.created_at
    }))

    return NextResponse.json({ 
      success: true, 
      products: transformedProducts 
    })
  } catch (error) {
    console.error('Error fetching pending products:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch pending products' 
    })
  }
}