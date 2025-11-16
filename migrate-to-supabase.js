// Migration script to import MongoDB data to Supabase
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Read the JSON file
const vendorProducts = JSON.parse(fs.readFileSync('../../Desktop/shpowaveMedia/photos-test.vendorproducts.json', 'utf8'));

async function migrateData() {
  console.log(`Migrating ${vendorProducts.length} vendor products...`);
  
  const transformedProducts = vendorProducts.map(product => ({
    vendor_id: product.vendorId,
    name: product.name,
    category: product.category,
    subcategory: product.subcategory,
    price: product.price,
    original_price: product.originalPrice,
    images: product.images,
    description: product.description,
    stock: product.stock,
    brand: product.brand,
    status: product.status || 'active'
  }));

  const { data, error } = await supabase
    .from('vendor_products')
    .insert(transformedProducts);

  if (error) {
    console.error('Migration failed:', error);
  } else {
    console.log('Migration successful!', data?.length || transformedProducts.length, 'products migrated');
  }
}

migrateData();