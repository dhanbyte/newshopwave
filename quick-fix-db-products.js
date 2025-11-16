// Quick fix to check why database products are not showing
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nczdoszfndzqyhawpahz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jemRvc3pmbmR6cXloYXdwYWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg0MjExMiwiZXhwIjoyMDc4NDE4MTEyfQ.81BC60TKJtd2abKR1eilZbfHjXktsqSGWw0VLYqXH5E'
);

async function checkAndFixProducts() {
  console.log('🔍 Checking database products...');
  
  // Check all products
  const { data: allProducts, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log(`📦 Found ${allProducts?.length || 0} products in database`);
  
  if (allProducts && allProducts.length > 0) {
    console.log('\n📋 All products:');
    allProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Subcategory: ${product.subcategory}`);
      console.log(`   Price: ₹${product.price}`);
      console.log(`   Stock: ${product.quantity}`);
      console.log('');
    });
  }
  
  // Test API endpoint
  console.log('🌐 Testing API endpoint...');
  try {
    const response = await fetch('http://localhost:3000/api/products');
    if (response.ok) {
      const apiProducts = await response.json();
      const dbProducts = apiProducts.filter(p => p.isVendorProduct === false && !p.id.startsWith('tech_') && !p.id.startsWith('home_') && !p.id.startsWith('fashion_') && !p.id.startsWith('na_'));
      
      console.log(`📡 API returned ${apiProducts.length} total products`);
      console.log(`📦 Database products in API: ${dbProducts.length}`);
      
      if (dbProducts.length > 0) {
        console.log('\n📋 Database products from API:');
        dbProducts.slice(0, 5).forEach((product, index) => {
          console.log(`${index + 1}. ${product.name} (${product.category})`);
        });
      }
    } else {
      console.log('❌ API request failed');
    }
  } catch (error) {
    console.log('❌ API test failed:', error.message);
  }
}

checkAndFixProducts().catch(console.error);