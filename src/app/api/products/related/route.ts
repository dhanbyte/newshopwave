import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'tech'
    const exclude = searchParams.get('exclude')
    const limit = parseInt(searchParams.get('limit') || '8')

    const { data: activeVendors } = await supabase
      .from('vendors')
      .select('id')
      .neq('status', 'suspended')
    
    const activeVendorIds = (activeVendors || []).map(v => v.id).filter(Boolean)

    let { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .limit(limit)

    if (exclude) {
      products = (products || []).filter(p => p.id !== exclude)
    }

    const formattedProducts = (products || []).map(product => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      slug: product.slug || product.id,
      image: (product.images && product.images[0]) || '/placeholder-product.jpg',
      price: {
        original: product.original_price || product.price,
        discounted: product.discount_price || product.price
      },
      ratings: {
        average: 4.5,
        count: Math.floor(Math.random() * 100) + 10
      },
      quantity: product.stock || 0
    }))

    return NextResponse.json({ success: true, products: formattedProducts })
  } catch (error) {
    console.error('Error fetching related products:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch related products' }, { status: 500 })
  }
}