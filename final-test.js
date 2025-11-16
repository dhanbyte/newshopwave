// Final test - Database products on homepage
async function finalTest() {
  console.log('🏁 FINAL TEST - Database Products on Homepage\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/products');
    if (!response.ok) {
      console.log('❌ Server not running. Start with: npm run dev');
      return;
    }
    
    const products = await response.json();
    
    // Test each section like homepage does
    console.log('🏠 HOME SECTION:');
    const dbHome = products.filter(p => {
      const isCategory = p.category === 'Home' || p.category === 'Home & Kitchen';
      const isDatabase = typeof p.id === 'number' || p.isVendorProduct;
      return isCategory && isDatabase && (p.quantity > 0 || p.stock > 0);
    });
    console.log(`Database Home Products: ${dbHome.length}`);
    if (dbHome.length > 0) {
      console.log('✅ Sample:', dbHome[0].name);
    } else {
      console.log('❌ No database home products found');
    }
    
    console.log('\n📱 TECH SECTION:');
    const dbTech = products.filter(p => {
      const isCategory = p.category === 'Tech' || p.category === 'Electronics';
      const isDatabase = typeof p.id === 'number' || p.isVendorProduct;
      return isCategory && isDatabase && (p.quantity > 0 || p.stock > 0);
    });
    console.log(`Database Tech Products: ${dbTech.length}`);
    if (dbTech.length > 0) {
      console.log('✅ Sample:', dbTech[0].name);
    } else {
      console.log('❌ No database tech products found');
    }
    
    console.log('\n👕 FASHION SECTION:');
    const dbFashion = products.filter(p => {
      const isCategory = p.category === 'Fashion';
      const isDatabase = typeof p.id === 'number' || p.isVendorProduct;
      return isCategory && isDatabase && (p.quantity > 0 || p.stock > 0);
    });
    console.log(`Database Fashion Products: ${dbFashion.length}`);
    if (dbFashion.length > 0) {
      console.log('✅ Sample:', dbFashion[0].name);
    } else {
      console.log('❌ No database fashion products found');
    }
    
    console.log('\n✨ NEW ARRIVALS SECTION:');
    const dbNewArrivals = products.filter(p => {
      const isCategory = p.category === 'New Arrivals';
      const isDatabase = typeof p.id === 'number' || p.isVendorProduct;
      return isCategory && isDatabase && (p.quantity > 0 || p.stock > 0);
    });
    console.log(`Database New Arrivals Products: ${dbNewArrivals.length}`);
    if (dbNewArrivals.length > 0) {
      console.log('✅ Sample:', dbNewArrivals[0].name);
    } else {
      console.log('❌ No database new arrivals products found');
    }
    
    console.log('\n📊 SUMMARY:');
    console.log(`Total Products: ${products.length}`);
    console.log(`Database Products: ${products.filter(p => typeof p.id === 'number' || p.isVendorProduct).length}`);
    console.log(`JSON Products: ${products.filter(p => typeof p.id === 'string' && !p.isVendorProduct).length}`);
    
    const hasDbProducts = dbHome.length > 0 || dbTech.length > 0 || dbFashion.length > 0 || dbNewArrivals.length > 0;
    
    if (hasDbProducts) {
      console.log('\n🎉 SUCCESS: Database products will show on homepage!');
    } else {
      console.log('\n❌ ISSUE: No database products found for homepage sections');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

finalTest();