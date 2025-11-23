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

    console.log('Fetching products for vendorId:', vendorId)
    
    const { data: products, error } = await supabase
      .from('vendor_products')
      .select('*')
      .eq('vendor_id', parseInt(vendorId))
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json({ 
        success: true, 
        products: []
      })
    }

    console.log('Found products:', products?.length || 0)

    return NextResponse.json({ 
      success: true, 
      products: products || []
    })
  } catch (error) {
    console.error('Error fetching vendor products:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch products',
      products: []
    }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()
    const { vendorId } = productData

    if (!vendorId) {
      return NextResponse.json({
        success: false,
        message: 'Vendor ID is required'
      }, { status: 400 })
    }

    console.log('Creating product for vendorId:', vendorId)
    
    // First, verify that the vendor exists
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('id, status')
      .eq('id', parseInt(vendorId))
      .single()

    if (vendorError || !vendor) {
      console.error('Vendor not found:', vendorError)
      return NextResponse.json({
        success: false,
        message: 'Vendor not found. Please make sure you are logged in as a registered vendor.'
      }, { status: 404 })
    }

    if (vendor.status !== 'approved') {
      return NextResponse.json({
        success: false,
        message: 'Your vendor account is not approved yet. Please wait for admin approval.'
      }, { status: 403 })
    }

    console.log('Product images:', productData.images)
    console.log('Images length:', productData.images?.length || 0)

    const { data: product, error } = await supabase
      .from('vendor_products')
      .insert({
        vendor_id: parseInt(vendorId),
        name: productData.name || 'Untitled Product',
        description: productData.description || '',
        images: productData.images || [],
        price: parseFloat(productData.price) || 0,
        original_price: parseFloat(productData.originalPrice) || parseFloat(productData.price) || 0,
        stock: parseInt(productData.stock) || 0,
        category: productData.category || '',
        subcategory: productData.subcategory || '',
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      
      // Provide more specific error messages
      if (error.message.includes('foreign key constraint')) {
        return NextResponse.json({
          success: false,
          message: 'Failed to save product: Vendor account not found in database. Please contact support.'
        }, { status: 500 })
      }
      
      throw new Error(error.message || 'Failed to create product')
    }

    console.log('Product created successfully:', product.id)

    return NextResponse.json({
      success: true,
      product,
      productId: product.id
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create product'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const requestData = await request.json()
    const { productId, updateImagesOnly, ...updateData } = requestData
    
    if (!productId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product ID required' 
      }, { status: 400 })
    }
    
    console.log('Updating product:', productId, 'Data:', updateData)
    
    // Prepare update data
    const dataToUpdate: any = {
      updated_at: new Date().toISOString()
    }
    
    if (updateImagesOnly) {
      dataToUpdate.images = updateData.images || []
    } else {
      dataToUpdate.name = updateData.name || 'Untitled Product'
      dataToUpdate.description = updateData.description || ''
      dataToUpdate.images = updateData.images || []
      dataToUpdate.price = parseFloat(updateData.price) || 0
      dataToUpdate.original_price = parseFloat(updateData.originalPrice) || parseFloat(updateData.price) || 0
      dataToUpdate.stock = parseInt(updateData.stock) || 0
      dataToUpdate.category = updateData.category || ''
      dataToUpdate.subcategory = updateData.subcategory || ''
    }
    
    const { data: updatedProduct, error } = await supabase
      .from('vendor_products')
      .update(dataToUpdate)
      .eq('id', parseInt(productId))
      .select()
      .single()
    
    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ 
        success: false, 
        message: error.message || 'Failed to update product'
      }, { status: 500 })
    }
    
    if (!updatedProduct) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product not found' 
      }, { status: 404 })
    }
    
    console.log('Product updated successfully:', updatedProduct.id)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product updated successfully',
      product: updatedProduct
    })
    
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to update product'
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
      throw error
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
