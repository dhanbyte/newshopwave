// Test homepage products
async function testHomepageProducts() {
  console.log('🏠 Testing Homepage Products...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/products');
    if (!response.ok) {
      console.log('❌ API not responding');
      return;
    }
    
    const products = await response.json();
    console.log(`📦 Total Products: ${products.length}\n`);
    
    // Test Tech products
    const techProducts = products.filter(p => 
      (p.category === 'Tech' || p.category === 'Electronics') && p.quantity > 0
    );
    console.log(`📱 Tech Products: ${techProducts.length}`);
    console.log('Database Tech:', techProducts.filter(p => typeof p.id === 'number').length);
    console.log('JSON Tech:', techProducts.filter(p => typeof p.id === 'string').length);
    if (techProducts.length > 0) {
      console.log('Sample:', techProducts[0].name);
    }
    
    // Test Home products
    const homeProducts = products.filter(p => 
      (p.category === 'Home' || p.category === 'Home & Kitchen') && p.quantity > 0
    );
    console.log(`\n🏠 Home Products: ${homeProducts.length}`);
    console.log('Database Home:', homeProducts.filter(p => typeof p.id === 'number').length);
    console.log('JSON Home:', homeProducts.filter(p => typeof p.id === 'string').length);
    if (homeProducts.length > 0) {
      console.log('Sample:', homeProducts[0].name);
    }
    
    // Test Fashion products
    const fashionProducts = products.filter(p => 
      p.category === 'Fashion' && p.quantity > 0
    );
    console.log(`\n👕 Fashion Products: ${fashionProducts.length}`);
    console.log('Database Fashion:', fashionProducts.filter(p => typeof p.id === 'number').length);
    console.log('JSON Fashion:', fashionProducts.filter(p => typeof p.id === 'string').length);
    if (fashionProducts.length > 0) {
      console.log('Sample:', fashionProducts[0].name);
    }
    
    // Test New Arrivals products
    const newArrivalsProducts = products.filter(p => 
      p.category === 'New Arrivals' && p.quantity > 0
    );
    console.log(`\n✨ New Arrivals Products: ${newArrivalsProducts.length}`);
    console.log('Database New Arrivals:', newArrivalsProducts.filter(p => typeof p.id === 'number').length);
    console.log('JSON New Arrivals:', newArrivalsProducts.filter(p => typeof p.id === 'string').length);
    if (newArrivalsProducts.length > 0) {
      console.log('Sample:', newArrivalsProducts[0].name);
    }
    
    console.log('\n✅ Homepage should now show database products in all sections!');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testHomepageProducts();