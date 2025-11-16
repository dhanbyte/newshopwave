const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nczdoszfndzqyhawpahz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jemRvc3pmbmR6cXloYXdwYWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg0MjExMiwiZXhwIjoyMDc4NDE4MTEyfQ.81BC60TKJtd2abKR1eilZbfHjXktsqSGWw0VLYqXH5E'
);

async function simpleTest() {
  // Insert simple product
  const { data, error } = await supabase
    .from('vendor_products')
    .insert({
      vendor_id: 1,
      name: 'Simple Test Product',
      price: 999,
      status: 'active',
      stock: 100
    })
    .select();
  
  console.log('Insert result:', data, 'Error:', error);
  
  // Check products
  const { data: products } = await supabase
    .from('vendor_products')
    .select('*');
  
  console.log('Total products:', products?.length || 0);
  if (products?.length > 0) {
    console.log('Sample product:', products[0]);
  }
}

simpleTest();