// Test subcategories in New Arrivals
const { NEWARRIVALS_PRODUCTS } = require('./src/lib/data/newarrivals.ts');

console.log('🔍 Testing New Arrivals subcategories...');

// Get unique subcategories
const subcategories = [...new Set(NEWARRIVALS_PRODUCTS.map(p => p.subcategory))];
console.log('📋 Available subcategories in New Arrivals:');
subcategories.forEach((sub, index) => {
  const count = NEWARRIVALS_PRODUCTS.filter(p => p.subcategory === sub).length;
  console.log(`${index + 1}. ${sub} (${count} products)`);
});

console.log('\n🔍 Testing specific subcategory filters...');

// Test LED Lights subcategory
const ledLights = NEWARRIVALS_PRODUCTS.filter(p => p.subcategory === 'LED Lights');
console.log(`LED Lights: ${ledLights.length} products`);

// Test Car Accessories subcategory  
const carAccessories = NEWARRIVALS_PRODUCTS.filter(p => p.subcategory === 'Car Accessories');
console.log(`Car Accessories: ${carAccessories.length} products`);

// Test Kitchen Appliances subcategory
const kitchenAppliances = NEWARRIVALS_PRODUCTS.filter(p => p.subcategory === 'Kitchen Appliances');
console.log(`Kitchen Appliances: ${kitchenAppliances.length} products`);

console.log('\n✅ Subcategory filtering should work correctly');
console.log('📝 URLs to test:');
console.log('- /search?category=New%20Arrivals&subcategory=LED%20Lights');
console.log('- /search?category=New%20Arrivals&subcategory=Car%20Accessories');
console.log('- /search?category=New%20Arrivals&subcategory=Kitchen%20Appliances');