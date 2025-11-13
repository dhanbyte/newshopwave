// Verify all products are showing properly
async function verifyAllProducts() {
  console.log('🔍 Verifying All Products...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/products');
    if (!response.ok) {
      console.log('❌ API not responding. Please start server with: npm run dev');
      return;
    }
    
    const products = await response.json();
    console.log(`📦 Total Products: ${products.length}\n`);
    
    // Count by category
    const categories = {};
    const dbProducts = [];
    const jsonProducts = [];
    
    products.forEach(p => {
      // Count by category
      categories[p.category] = (categories[p.category] || 0) + 1;
      
      // Separate database vs JSON products
      if (p.isVendorProduct || (typeof p.id === 'number')) {
        dbProducts.push(p);
      } else {
        jsonProducts.push(p);
      }
    });
    
    console.log('📊 Products by Category:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} products`);
    });
    
    console.log(`\n📈 Product Sources:`);
    console.log(`  Database Products: ${dbProducts.length}`);
    console.log(`  JSON Products: ${jsonProducts.length}`);
    
    console.log(`\n✅ Key Categories Status:`);
    console.log(`  Tech: ${categories['Tech'] || 0} products ${categories['Tech'] > 0 ? '✅' : '❌'}`);
    console.log(`  Home: ${categories['Home'] || 0} products ${categories['Home'] > 0 ? '✅' : '❌'}`);
    console.log(`  Fashion: ${categories['Fashion'] || 0} products ${categories['Fashion'] > 0 ? '✅' : '❌'}`);
    console.log(`  New Arrivals: ${categories['New Arrivals'] || 0} products ${categories['New Arrivals'] > 0 ? '✅' : '❌'}`);
    
    if (dbProducts.length > 0) {
      console.log(`\n📦 Sample Database Products:`);
      dbProducts.slice(0, 3).forEach((p, i) => {
        console.log(`  ${i+1}. ${p.name} (${p.category})`);
      });
    }
    
    if (jsonProducts.length > 0) {
      console.log(`\n📄 Sample JSON Products:`);
      jsonProducts.slice(0, 3).forEach((p, i) => {
        console.log(`  ${i+1}. ${p.name} (${p.category})`);
      });
    }
    
    console.log(`\n🌐 Test URLs:`);
    console.log(`  Tech: http://localhost:3000/search?category=Tech`);
    console.log(`  Home: http://localhost:3000/search?category=Home`);
    console.log(`  Fashion: http://localhost:3000/search?category=Fashion`);
    console.log(`  New Arrivals: http://localhost:3000/search?category=New%20Arrivals`);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('Please make sure your Next.js server is running: npm run dev');
  }
}

verifyAllProducts();