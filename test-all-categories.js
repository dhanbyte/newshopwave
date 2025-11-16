// Test script to verify all categories are working
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nczdoszfndzqyhawpahz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jemRvc3pmbmR6cXloYXdwYWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg0MjExMiwiZXhwIjoyMDc4NDE4MTEyfQ.81BC60TKJtd2abKR1eilZbfHjXktsqSGWw0VLYqXH5E';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAllCategories() {
  console.log('🧪 Testing all categories...\n');
  
  const categories = ['Tech', 'Home', 'Fashion', 'New Arrivals'];
  
  for (const category of categories) {
    console.log(`🔍 Testing category: ${category}`);
    
    try {
      // Check database products
      const { data: dbProducts, error } = await supabase
        .from('products')
        .select('id, name, category, subcategory')
        .eq('category', category);
      
      if (error) {
        console.log(`❌ Database error for ${category}:`, error.message);
      } else {
        console.log(`📦 Database products for ${category}: ${dbProducts?.length || 0}`);
        if (dbProducts && dbProducts.length > 0) {
          dbProducts.slice(0, 3).forEach((product, index) => {
            console.log(`   ${index + 1}. ${product.name} (${product.subcategory})`);
          });
        }
      }
      
      // Check JSON products
      let jsonCount = 0;
      try {
        if (category === 'Tech') {
          const { TECH_PRODUCTS } = require('./src/lib/data/tech.ts');
          jsonCount = TECH_PRODUCTS.length;
        } else if (category === 'Home') {
          const { HOME_PRODUCTS } = require('./src/lib/data/home.ts');
          jsonCount = HOME_PRODUCTS.length;
        } else if (category === 'Fashion') {
          const { FASHION_PRODUCTS } = require('./src/lib/data/fashion.ts');
          jsonCount = FASHION_PRODUCTS.length;
        } else if (category === 'New Arrivals') {
          const { NEWARRIVALS_PRODUCTS } = require('./src/lib/data/newarrivals.ts');
          jsonCount = NEWARRIVALS_PRODUCTS.length;
        }
        console.log(`📄 JSON products for ${category}: ${jsonCount}`);
      } catch (err) {
        console.log(`❌ Error loading JSON for ${category}:`, err.message);
      }
      
      const totalProducts = (dbProducts?.length || 0) + jsonCount;
      console.log(`📊 Total products for ${category}: ${totalProducts}`);
      
      if (totalProducts > 0) {
        console.log(`✅ ${category} category is working!`);
      } else {
        console.log(`❌ ${category} category has no products!`);
      }
      
    } catch (error) {
      console.log(`❌ Error testing ${category}:`, error.message);
    }
    
    console.log(''); // Empty line for spacing
  }
}

async function testSubcategories() {
  console.log('🔍 Testing subcategories...\n');
  
  const testCases = [
    { category: 'Tech', subcategory: 'Headphones' },
    { category: 'Tech', subcategory: 'Mobile Accessories' },
    { category: 'Home', subcategory: 'Kitchenware' },
    { category: 'Home', subcategory: 'Food Storage' },
    { category: 'Fashion', subcategory: 'T-Shirts' },
    { category: 'Fashion', subcategory: 'Jeans' },
    { category: 'New Arrivals', subcategory: 'LED Lights' },
    { category: 'New Arrivals', subcategory: 'Car Accessories' }
  ];
  
  for (const testCase of testCases) {
    console.log(`🔍 Testing: ${testCase.category} > ${testCase.subcategory}`);
    
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('id, name, category, subcategory')
        .eq('category', testCase.category)
        .eq('subcategory', testCase.subcategory);
      
      if (error) {
        console.log(`❌ Error:`, error.message);
      } else {
        console.log(`📦 Found ${products?.length || 0} products`);
        if (products && products.length > 0) {
          products.forEach((product, index) => {
            console.log(`   ${index + 1}. ${product.name}`);
          });
        }
      }
    } catch (error) {
      console.log(`❌ Error:`, error.message);
    }
    
    console.log('');
  }
}

async function main() {
  console.log('🧪 Category Testing Script\n');
  console.log('='.repeat(50) + '\n');
  
  await testAllCategories();
  
  console.log('='.repeat(50) + '\n');
  
  await testSubcategories();
  
  console.log('✅ Testing completed!');
  console.log('\n📝 URLs to test in browser:');
  console.log('- http://localhost:3000/search?category=Tech');
  console.log('- http://localhost:3000/search?category=Home');
  console.log('- http://localhost:3000/search?category=Fashion');
  console.log('- http://localhost:3000/search?category=New%20Arrivals');
  console.log('- http://localhost:3000/search?category=Tech&subcategory=Headphones');
  console.log('- http://localhost:3000/search?category=Home&subcategory=Kitchenware');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testAllCategories, testSubcategories };