// Simple test to check New Arrivals products
const { NEWARRIVALS_PRODUCTS } = require('./src/lib/data/newarrivals.ts');

console.log('🔍 Testing New Arrivals products...');
console.log('📦 Total New Arrivals products:', NEWARRIVALS_PRODUCTS.length);

if (NEWARRIVALS_PRODUCTS.length > 0) {
  console.log('\n📋 Sample products:');
  NEWARRIVALS_PRODUCTS.slice(0, 5).forEach((product, index) => {
    console.log(`${index + 1}. ${product.name}`);
    console.log(`   Category: ${product.category}`);
    console.log(`   Subcategory: ${product.subcategory}`);
    console.log(`   Price: ₹${product.price.discounted} (was ₹${product.price.original})`);
    console.log(`   Stock: ${product.quantity}`);
    console.log('');
  });
  
  console.log('✅ New Arrivals products are available in the data file');
  console.log('📝 Next steps:');
  console.log('1. Restart your Next.js development server');
  console.log('2. Visit /search?category=New%20Arrivals');
  console.log('3. Products should now be visible');
} else {
  console.log('❌ No New Arrivals products found');
}