import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Get all products with subcategories from both tables
    const [vendorProductsResult, regularProductsResult] = await Promise.all([
      supabase
        .from('vendor_products')
        .select('subcategory')
        .eq('status', 'active')
        .not('subcategory', 'is', null)
        .not('subcategory', 'eq', ''),
      supabase
        .from('products')
        .select('subcategory')
        .or('status.eq.active,status.is.null')
        .not('subcategory', 'is', null)
        .not('subcategory', 'eq', '')
    ])

    if (vendorProductsResult.error || regularProductsResult.error) {
      console.error('Error fetching products:', vendorProductsResult.error || regularProductsResult.error)
      return NextResponse.json([])
    }

    // Combine both product arrays
    const allProducts = [...(vendorProductsResult.data || []), ...(regularProductsResult.data || [])]

    // Count products by subcategory
    const subcategoryCounts = {}
    allProducts.forEach(product => {
      const subcategory = product.subcategory
      if (subcategory) {
        subcategoryCounts[subcategory] = (subcategoryCounts[subcategory] || 0) + 1
      }
    })

    // Convert to array and sort by count
    const sortedSubcategories = Object.entries(subcategoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20) // Top 20

    return NextResponse.json(sortedSubcategories)
  } catch (error) {
    console.error('Error in top-subcategories API:', error)
    return NextResponse.json([])
  }
}