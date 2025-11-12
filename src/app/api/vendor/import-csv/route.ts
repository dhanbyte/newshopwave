import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.warn('Supabase URL or service role key not configured for /api/vendor/import-csv')
}

const supabase = createClient(SUPABASE_URL || '', SERVICE_ROLE_KEY || '')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const vendorId = body.vendorId
    const products = Array.isArray(body.products) ? body.products : []

    if (!vendorId) {
      return NextResponse.json({ success: false, message: 'Missing vendorId' }, { status: 400 })
    }

    if (!products.length) {
      return NextResponse.json({ success: false, message: 'No products provided' }, { status: 400 })
    }

    // Filter out rows that don't have essential data
    const validProducts = products.filter(p => {
      const hasTitle = p.Title && String(p.Title).trim()
      return hasTitle
    })

    if (!validProducts.length) {
      return NextResponse.json({ success: false, message: 'No usable rows found (need at least Title)' }, { status: 400 })
    }

    // Map incoming product objects (either Shopify CSV raw fields or our simplified mapped objects) to vendor_products table
    // Group products by Handle to merge multiple image rows
    const productGroups = new Map()
    validProducts.forEach(p => {
      const handle = p.Handle || 'default'
      if (!productGroups.has(handle)) {
        productGroups.set(handle, { ...p, allImages: [] })
      }
      
      // Collect images from all Image Src columns (Image Src 1, Image Src 2, etc.)
      Object.keys(p).forEach(key => {
        if (key.startsWith('Image Src') && p[key] && String(p[key]).trim()) {
          const position = parseInt(key.replace('Image Src ', '')) || 1
          productGroups.get(handle).allImages.push({
            url: String(p[key]).trim(),
            position: position
          })
        }
      })
      
      // Also handle single Images field for backward compatibility
      if (p.Images && String(p.Images).trim()) {
        productGroups.get(handle).allImages.push({
          url: String(p.Images).trim(),
          position: Number(p['Image Position']) || 1
        })
      }
    })

    const rows = Array.from(productGroups.values()).map((p: any) => {
      const productData: any = {
        vendor_id: Number(vendorId) || 1,
        name: String(p.Title || p.title || p.name || '').substring(0, 100),
        description: String(p.Dicribacian || p['Body (HTML)'] || p.description || p.body_html || '').substring(0, 1000),
        price: Number(p['Variant Price'] || p['variant_price'] || p.price || 0) || 0,
        status: (p.Published === 'TRUE' || String(p.published).toLowerCase() === 'true' || p.status === 'active') ? 'active' : 'pending'
      }

      // Optional fields
      if (p.Vendor && String(p.Vendor).trim()) productData.brand = String(p.Vendor).trim().substring(0, 50)
      if (p.vendor && String(p.vendor).trim()) productData.brand = String(p.vendor).trim().substring(0, 50)
      if (p.Cetegry && String(p.Cetegry).trim()) productData.category = String(p.Cetegry).trim().substring(0, 50)
      if (p.Type && String(p.Type).trim()) productData.category = String(p.Type).trim().substring(0, 50)
      if (p.type && String(p.type).trim()) productData.category = String(p.type).trim().substring(0, 50)
      if (p.Subcategory && String(p.Subcategory).trim()) productData.subcategory = String(p.Subcategory).trim().substring(0, 50)
      if (p.subcategory && String(p.subcategory).trim()) productData.subcategory = String(p.subcategory).trim().substring(0, 50)
  // Collect tags into a temporary import-only field to avoid inserting into DB when the
  // `vendor_products` table doesn't have a `tags` column (some Supabase projects may omit it).
  // We'll strip this field before the actual insert and reattach it to the API response.
  if (p.Tags && String(p.Tags).trim()) productData._import_tags = String(p.Tags).split(',').map((t: string) => t.trim()).filter(Boolean)
  if (p.tags && Array.isArray(p.tags)) productData._import_tags = p.tags

      // Handle grouped images sorted by position
      if (p.allImages && p.allImages.length) {
        // Remove duplicates and sort by position
        const uniqueImages = Array.from(new Set(p.allImages.map(img => img.url)))
          .map(url => {
            const imgObj = p.allImages.find(img => img.url === url)
            return { url, position: imgObj?.position || 1 }
          })
        
        const sortedImages = uniqueImages
          .sort((a, b) => a.position - b.position)
          .map(img => img.url)
          .filter(url => url && /\.(jpe?g|png|gif|webp|avif|svg)(\?|$)/i.test(url))
        if (sortedImages.length) productData.images = sortedImages
      }

  // stock, weight (we will not attempt to write SKU column to DB to avoid schema errors)
      if (p['Variant Grams'] && !isNaN(Number(p['Variant Grams']))) productData.weight = Number(p['Variant Grams'])
      if (p['variant_grams'] && !isNaN(Number(p['variant_grams']))) productData.weight = Number(p['variant_grams'])
      if (p['Variant Inventory Qty'] && !isNaN(Number(p['Variant Inventory Qty']))) productData.stock = Number(p['Variant Inventory Qty'])
      if (p.stock && !isNaN(Number(p.stock))) productData.stock = Number(p.stock)

      // Dimensions
      if (p.Length && !isNaN(Number(p.Length))) productData.length = Number(p.Length)
      if (p.Height && !isNaN(Number(p.Height))) productData.height = Number(p.Height)
      if (p.Width && !isNaN(Number(p.Width))) productData.width = Number(p.Width)
      if (p['Variant Compare At Price'] && !isNaN(Number(p['Variant Compare At Price']))) productData.original_price = Number(p['Variant Compare At Price'])

      // AI enhancement - extract dimensions and weight from description
      if (productData.description) {
        const description = productData.description
        
        // Extract dimensions (LxWxH format)
        const dimensionRegex = /(\d+\.?\d*)\s*[x×]\s*(\d+\.?\d*)\s*[x×]\s*(\d+\.?\d*)/i
        const dimMatch = description.match(dimensionRegex)
        if (dimMatch && !productData.length) {
          productData.length = parseFloat(dimMatch[1])
          productData.width = parseFloat(dimMatch[2])
          productData.height = parseFloat(dimMatch[3])
        }
        
        // Extract weight
        const weightRegex = /(\d+\.?\d*)\s*(grams?|kg|g)\b/i
        const weightMatch = description.match(weightRegex)
        if (weightMatch && !productData.weight) {
          let weight = parseFloat(weightMatch[1])
          if (weightMatch[2].toLowerCase().includes('kg')) {
            weight = weight * 1000
          }
          productData.weight = weight
        }
      }

      return productData
    })

    // Generate SKUs for response (do not rely on DB having a sku column)
    const generatedSkus = rows.map((r: any) => {
      const base = (r.name || 'product').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const short = Math.random().toString(36).slice(2, 8)
      return `${vendorId}_${base}_${short}`
    })

    // Insert in batches to avoid very large requests
    const BATCH = 100
    let processed = 0
    const insertedRows: any[] = []
    for (let i = 0; i < rows.length; i += BATCH) {
      // For safety, clone chunk and remove any import-only fields that may not map to DB columns
      const chunk = rows.slice(i, i + BATCH).map((r: any) => {
        const copy = { ...r }
        // Remove temporary import-only tags field so Supabase insert won't fail if `tags` column is missing
        if (copy._import_tags) delete copy._import_tags
        return copy
      })
      const { data, error } = await supabase
        .from('vendor_products')
        .insert(chunk)
        .select('id, name, images')

      if (error) {
        console.error('Supabase insert error', error)
        return NextResponse.json({ success: false, message: error.message || 'Insert failed' }, { status: 500 })
      }

      const got = data || []
      processed += got.length
      // attach generated SKUs to returned rows (match by chunk index)
      for (let j = 0; j < got.length; j++) {
        const globalIndex = i + j
        const genSku = generatedSkus[globalIndex]
        // Reattach any import-time tags into the response object (do not attempt to write them to DB)
        const original = rows[globalIndex] || {}
        const tagsFromImport = original._import_tags || []
        insertedRows.push({ ...got[j], generated_sku: genSku, tags: tagsFromImport })
      }
    }

    return NextResponse.json({ success: true, processed, inserted: processed, updated: 0, rows: insertedRows })
  } catch (error) {
    console.error('Error in /api/vendor/import-csv', error)
    return NextResponse.json({ success: false, message: (error instanceof Error ? error.message : 'Unknown error') }, { status: 500 })
  }
}
