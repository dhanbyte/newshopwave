import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for unlimited access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)



export async function POST(request: Request) {
  try {
    const body = await request.json()
    const vendorId = body.vendorId
    const products = Array.isArray(body.products) ? body.products : []

    console.log('Received vendorId:', vendorId, 'Type:', typeof vendorId)
    
    if (!vendorId) {
      return NextResponse.json({ success: false, message: 'Missing vendorId' }, { status: 400 })
    }

    // Ensure vendor exists or create default vendor
    try {
      const { data: existingVendor } = await supabaseAdmin
        .from('vendors')
        .select('id')
        .eq('id', vendorId)
        .single()
      
      if (!existingVendor) {
        console.log('Creating default vendor with ID:', vendorId)
        const { error: vendorError } = await supabaseAdmin
          .from('vendors')
          .insert({
            id: vendorId,
            email: `vendor${vendorId}@shopwave.com`,
            password: 'default123',
            vendor_id: `VENDOR_${vendorId}`,
            name: `Default Vendor ${vendorId}`,
            business_name: `Business ${vendorId}`,
            status: 'active'
          })
        
        if (vendorError) {
          console.error('Error creating vendor:', vendorError)
        } else {
          console.log('Default vendor created successfully')
        }
      }
    } catch (vendorCheckError) {
      console.log('Vendor check/creation error (continuing anyway):', vendorCheckError)
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
        name: String(p.Title || p.title || p.name || '').substring(0, 255),
        description: String(p['Body (HTML)'] || p.description || '').substring(0, 1000),
        price: Number(p['Variant Price'] || p.price || 0) || 0,
        original_price: Number(p['Variant Compare At Price'] || 0) || 0,
        status: 'pending',
        stock: Number(p['Variant Inventory Qty'] || 100),
        category: String(p.Type || p.category || '').substring(0, 100) || null,
        brand: String(p.Vendor || p.brand || '').substring(0, 100) || null,
        weight: Number(p['Variant Grams'] || 0) || 0
      }

      // Handle images
      const images = []
      Object.keys(p).forEach(key => {
        if (key.startsWith('Image Src') && p[key] && String(p[key]).trim()) {
          images.push(String(p[key]).trim())
        }
      })
      if (images.length > 0) {
        productData.images = images
      }



      return productData
    })

    // Generate SKUs for response (do not rely on DB having a sku column)
    const generatedSkus = rows.map((r: any) => {
      const base = (r.name || 'product').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const short = Math.random().toString(36).slice(2, 8)
      return `${vendorId}_${base}_${short}`
    })

    // Remove import-only fields from all rows
    const cleanRows = rows.map((r: any) => {
      const copy = { ...r }
      if (copy._import_tags) delete copy._import_tags
      return copy
    })
    
    console.log(`Processing ${cleanRows.length} products in optimized batches`)
    
    // Use multiple parallel batches for faster processing
    const BATCH_SIZE = 1000
    const batches = []
    for (let i = 0; i < cleanRows.length; i += BATCH_SIZE) {
      batches.push(cleanRows.slice(i, i + BATCH_SIZE))
    }
    
    console.log(`Created ${batches.length} batches of max ${BATCH_SIZE} products each`)
    
    let totalProcessed = 0
    const allInsertedRows = []
    
    // Process batches sequentially to avoid overwhelming the database
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex]
      console.log(`Processing batch ${batchIndex + 1}/${batches.length} with ${batch.length} products`)
      
      try {
        const { data, error } = await supabaseAdmin
          .from('vendor_products')
          .insert(batch)
          .select('id, name, images')

        if (error) {
          console.error(`Batch ${batchIndex + 1} failed:`, error)
          // Continue with next batch instead of failing completely
          continue
        }

        const batchInserted = data || []
        totalProcessed += batchInserted.length
        allInsertedRows.push(...batchInserted)
        
        console.log(`Batch ${batchIndex + 1} completed: ${batchInserted.length} products inserted`)
        
        // Small delay between batches to prevent rate limiting
        if (batchIndex < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      } catch (batchError) {
        console.error(`Batch ${batchIndex + 1} exception:`, batchError)
        continue
      }
    }
    
    console.log(`All batches completed. Total processed: ${totalProcessed} out of ${cleanRows.length} products`)
    
    // Attach generated SKUs to returned rows
    const finalRows = allInsertedRows.map((row, index) => {
      const genSku = generatedSkus[index] || `DSIN-${Math.random().toString(36).slice(2, 8)}`
      const original = rows[index] || {}
      const tagsFromImport = original._import_tags || []
      return { ...row, generated_sku: genSku, tags: tagsFromImport }
    })
    
    const processed = totalProcessed

    return NextResponse.json({ success: true, processed, inserted: processed, updated: 0, rows: finalRows })
  } catch (error) {
    console.error('Error in /api/vendor/import-csv', error)
    return NextResponse.json({ success: false, message: (error instanceof Error ? error.message : 'Unknown error') }, { status: 500 })
  }
}
