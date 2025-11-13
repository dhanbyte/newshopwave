const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nczdoszfndzqyhawpahz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jemRvc3pmbmR6cXloYXdwYWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg0MjExMiwiZXhwIjoyMDc4NDE4MTEyfQ.81BC60TKJtd2abKR1eilZbfHjXktsqSGWw0VLYqXH5E'
);

async function testDatabase() {
  console.log('Testing database connection...');
  
  // Check vendor_products table
  const { data: products, error: productsError } = await supabase
    .from('vendor_products')
    .select('*')
    .limit(5);
  
  console.log('Vendor products:', products?.length || 0, 'Error:', productsError);
  
  // Insert test product
  const testProduct = {
    vendor_id: 1,
    name: 'Direct Test Product',
    description: 'Test description',
    price: 999,
    status: 'active',
    handle: 'direct-test-' + Date.now(),
    images: ['https://via.placeholder.com/300x300?text=DirectTest']
  };
  
  const { data: inserted, error: insertError } = await supabase
    .from('vendor_products')
    .insert(testProduct)
    .select();
  
  console.log('Insert result:', inserted, 'Error:', insertError);
  
  // Check again
  const { data: afterInsert } = await supabase
    .from('vendor_products')
    .select('*')
    .limit(5);
  
  console.log('After insert:', afterInsert?.length || 0);
}

testDatabase();