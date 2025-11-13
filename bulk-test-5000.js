const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nczdoszfndzqyhawpahz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jemRvc3pmbmR6cXloYXdwYWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg0MjExMiwiZXhwIjoyMDc4NDE4MTEyfQ.81BC60TKJtd2abKR1eilZbfHjXktsqSGWw0VLYqXH5E'
);

async function create5000Products() {
  console.log('Creating 5000 test products...');
  
  const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Beauty', 'Automotive'];
  const brands = ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E'];
  
  const products = [];
  for (let i = 1; i <= 5000; i++) {
    products.push({
      vendor_id: 1,
      name: `Test Product ${i}`,
      description: `This is test product number ${i} with detailed description`,
      price: Math.floor(Math.random() * 5000) + 100,
      original_price: Math.floor(Math.random() * 7000) + 200,
      status: 'active',
      stock: Math.floor(Math.random() * 100) + 10,
      category: categories[Math.floor(Math.random() * categories.length)],
      brand: brands[Math.floor(Math.random() * brands.length)],
      weight: Math.floor(Math.random() * 1000) + 50,
      images: [`https://via.placeholder.com/300x300?text=Product${i}`]
    });
  }
  
  // Insert in batches of 1000
  let inserted = 0;
  for (let i = 0; i < products.length; i += 1000) {
    const batch = products.slice(i, i + 1000);
    console.log(`Inserting batch ${Math.floor(i/1000) + 1}/5 (${batch.length} products)...`);
    
    const { data, error } = await supabase
      .from('vendor_products')
      .insert(batch);
    
    if (error) {
      console.error('Batch error:', error);
    } else {
      inserted += batch.length;
      console.log(`Batch completed. Total inserted: ${inserted}`);
    }
    
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`Finished! Total products inserted: ${inserted}`);
  
  // Check final count
  const { count } = await supabase
    .from('vendor_products')
    .select('*', { count: 'exact', head: true });
  
  console.log(`Total products in database: ${count}`);
}

create5000Products();