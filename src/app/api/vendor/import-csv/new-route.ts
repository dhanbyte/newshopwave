
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.warn('Supabase URL or service role key not configured for /api/vendor/import-csv/new-route');
}

const supabase = createClient(SUPABASE_URL || '', SERVICE_ROLE_KEY || '');

const getColumn = (row: any, potentialNames: string[]) => {
  const rowKeys = Object.keys(row);
  for (const pName of potentialNames) {
    const pNameLower = pName.toLowerCase();
    for (const rKey of rowKeys) {
      if (rKey.trim().toLowerCase() === pNameLower) {
        const value = row[rKey];
        if (value !== undefined && value !== null && String(value).trim() !== '') {
          return String(value).trim();
        }
      }
    }
  }
  return '';
};

const parsePrice = (price: string) => {
  if (!price) return 0;
  const cleanedPrice = price.replace(/[^\d.]/g, '');
  return parseFloat(cleanedPrice) || 0;
};

const generateSku = (title: string, vendorId: number) => {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const random = Math.random().toString(36).substring(2, 8);
  return `${vendorId}_${base}_${random}`;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const vendorId = body.vendorId;
    const products = Array.isArray(body.products) ? body.products : [];

    if (!vendorId) {
      return NextResponse.json({ success: false, message: 'Missing vendorId' }, { status: 400 });
    }

    if (!products.length) {
      return NextResponse.json({ success: false, message: 'No products provided' }, { status: 400 });
    }

    // Group products by handle to merge image rows
    const productGroups = new Map();
    products.forEach((p, index) => {
        const handle = getColumn(p, ['Handle', 'handle']);
        const title = getColumn(p, ['Title', 'title', 'Product Name']);

        // If there's no title, it's probably not a valid product row
        if (!title) return;

        // Use the handle as the key, or if it's missing, use the title to group.
        // As a last resort, use the index to treat it as a unique product.
        const groupKey = handle || title || `unique-product-${index}`;

        if (!productGroups.has(groupKey)) {
            productGroups.set(groupKey, { ...p, allImages: [] });
        }

        const group = productGroups.get(groupKey);

        // Collect image from 'Image Src' column
        const imageSrc = getColumn(p, ['Image Src']);
        if (imageSrc && !group.allImages.includes(imageSrc)) {
            group.allImages.push(imageSrc);
        }
    });

    if (productGroups.size === 0) {
        return NextResponse.json({ success: false, message: 'No usable products found in the CSV.' }, { status: 400 });
    }

    const rows = Array.from(productGroups.values()).map((p: any) => {
      const title = getColumn(p, ['Title', 'title', 'Product Name']);
      const productData: any = {
        vendor_id: Number(vendorId),
        name: title.substring(0, 100),
        description: getColumn(p, ['Body (HTML)', 'description', 'Description']).substring(0, 5000),
        price: parsePrice(getColumn(p, ['Variant Price', 'Price'])),
        original_price: parsePrice(getColumn(p, ['Variant Compare At Price', 'Compare at Price'])),
        images: p.allImages,
        status: 'pending',
        sku: generateSku(title, Number(vendorId)),
        category: getColumn(p, ['Category', 'category', 'Type']) || 'Uncategorized',
        subcategory: getColumn(p, ['Subcategory', 'subcategory']) || '',
        stock: parseInt(getColumn(p, ['Variant Inventory Qty', 'Stock', 'stock']), 10) || 0,
        weight: parseInt(getColumn(p, ['Variant Grams', 'Weight', 'weight']), 10) || 0,
        brand: getColumn(p, ['Vendor', 'brand', 'Brand']) || '',
      };
      return productData;
    });

    const BATCH_SIZE = 100;
    const insertedRows: any[] = [];
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const chunk = rows.slice(i, i + BATCH_SIZE);
      const { data, error } = await supabase
        .from('vendor_products')
        .insert(chunk)
        .select();

      if (error) {
        console.error('Supabase insert error', error);
        return NextResponse.json({ success: false, message: error.message || 'Insert failed' }, { status: 500 });
      }
      if (data) {
        insertedRows.push(...data);
      }
    }

    return NextResponse.json({ success: true, processed: insertedRows.length, inserted: insertedRows.length, rows: insertedRows });
  } catch (error) {
    console.error('Error in /api/vendor/import-csv/new-route', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
