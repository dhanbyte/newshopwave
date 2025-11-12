import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product ID required' 
      }, { status: 400 })
    }

    console.log('Approving product ID:', productId)

    // Update product status to active (approved)
    const { data: product, error } = await supabase
      .from('vendor_products')
      .update({ 
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', parseInt(productId))
      .select()
      .single()

    if (error || !product) {
      console.error('Error updating product:', error)
      return NextResponse.json({ 
        success: false, 
        message: 'Product not found' 
      }, { status: 404 })
    }

    console.log('Product approved successfully:', product.name, 'Status:', product.status);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product approved and will now show on website',
      product,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error approving product:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to approve product' 
    }, { status: 500 })
  }
}