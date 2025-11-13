// Simple API test
async function testAPI() {
  console.log('🧪 Testing API...');
  
  try {
    const response = await fetch('http://localhost:3000/api/products');
    
    if (!response.ok) {
      console.log('❌ API response not OK:', response.status);
      return;
    }
    
    const products = await response.json();
    console.log(`📦 Total products: ${products.length}`);
    
    // Count by category
    const categories = {};
    products.forEach(p => {
      if (p.category) {
        categories[p.category] = (categories[p.category] || 0) + 1;
      }
    });
    
    console.log('\n📊 Products by category:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`${cat}: ${count} products`);
    });
    
    // Show database products
    const dbProducts = products.filter(p => 
      typeof p.id === 'number' || 
      (typeof p.id === 'string' && /^\d+$/.test(p.id))
    );
    
    console.log(`\n📦 Database products: ${dbProducts.length}`);
    if (dbProducts.length > 0) {
      console.log('Sample database products:');
      dbProducts.slice(0, 3).forEach((p, i) => {
        console.log(`${i+1}. ${p.name} (${p.category})`);
      });
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testAPI();