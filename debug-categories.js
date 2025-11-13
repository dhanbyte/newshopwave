// Debug categories
const { TECH_PRODUCTS } = require('./src/lib/data/tech.ts');
const { HOME_PRODUCTS } = require('./src/lib/data/home.ts');
const { FASHION_PRODUCTS } = require('./src/lib/data/fashion.ts');
const { NEWARRIVALS_PRODUCTS } = require('./src/lib/data/newarrivals.ts');

console.log('📊 JSON Products Count:');
console.log('Tech:', TECH_PRODUCTS.length);
console.log('Home:', HOME_PRODUCTS.length);
console.log('Fashion:', FASHION_PRODUCTS.length);
console.log('New Arrivals:', NEWARRIVALS_PRODUCTS.length);

console.log('\n🔍 Sample products:');
console.log('Tech sample:', TECH_PRODUCTS[0]?.name || 'None');
console.log('Home sample:', HOME_PRODUCTS[0]?.name || 'None');
console.log('Fashion sample:', FASHION_PRODUCTS[0]?.name || 'None');
console.log('New Arrivals sample:', NEWARRIVALS_PRODUCTS[0]?.name || 'None');

// Test API
async function testAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    if (response.ok) {
      const products = await response.json();
      console.log('\n🌐 API Products:');
      console.log('Total:', products.length);
      
      const byCategory = {};
      products.forEach(p => {
        byCategory[p.category] = (byCategory[p.category] || 0) + 1;
      });
      
      Object.entries(byCategory).forEach(([cat, count]) => {
        console.log(`${cat}: ${count}`);
      });
    }
  } catch (e) {
    console.log('API not running');
  }
}

testAPI();