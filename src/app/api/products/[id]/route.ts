import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Try to find in vendor_products first, then regular products
    let product = null
    let error = null
    
    // First try vendor_products
    const { data: vendorProduct, error: vendorError } = await supabase
      .from('vendor_products')
      .select('*')
      .or(`id.eq.${id},slug.eq.${id}`)
      .single()
    
    if (vendorProduct && !vendorError) {
      // Transform vendor product
      product = {
        id: vendorProduct.id,
        name: vendorProduct.name,
        description: vendorProduct.description,
        price: vendorProduct.price,
        original_price: vendorProduct.original_price,
        image: Array.isArray(vendorProduct.images) && vendorProduct.images.length > 0 ? vendorProduct.images[0] : null,
        extra_images: Array.isArray(vendorProduct.images) ? vendorProduct.images.slice(1) : [],
        category: vendorProduct.category,
        subcategory: vendorProduct.subcategory,
        brand: vendorProduct.brand,
        stock: vendorProduct.stock,
        weight: vendorProduct.weight,
        slug: vendorProduct.slug
      }
    } else {
      // Try regular products
      const { data: regularProduct, error: regularError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      
      product = regularProduct
      error = regularError
    }
    
    if (error || !product) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      data: product 
    });
    
  } catch (error) {
    console.error('Error in GET /api/products/[id]:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch product' 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const updateData = await request.json();
        
        const { data: product, error } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', id)
          .select()
          .single()
        
        if (error || !product) {
            return NextResponse.json({ 
                success: false, 
                error: 'Product not found' 
            }, { status: 404 });
        }

        return NextResponse.json({ 
            success: true,
            data: product 
        });
        
    } catch (error) {
        console.error('Error in PUT /api/products/[id]:', error);
        return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to update product' 
        }, { status: 500 });
    }
}

export async function POST() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
    
  } catch (error) {
    console.error('Error in DELETE /api/products/[id]:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete product' 
    }, { status: 500 });
  }
}