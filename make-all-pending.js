const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nczdoszfndzqyhawpahz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jemRvc3pmbmR6cXloYXdwYWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg0MjExMiwiZXhwIjoyMDc4NDE4MTEyfQ.81BC60TKJtd2abKR1eilZbfHjXktsqSGWw0VLYqXH5E'
);

async function makeAllPending() {
  console.log('Making all products pending...');
  
  const { data, error } = await supabase
    .from('vendor_products')
    .update({ status: 'pending' })
    .neq('status', 'pending'); // Only update non-pending products
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('All products set to pending status');
  }
  
  // Check counts
  const { data: pending } = await supabase
    .from('vendor_products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');
    
  const { data: active } = await supabase
    .from('vendor_products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');
  
  console.log(`Pending: ${pending?.length || 0}, Active: ${active?.length || 0}`);
}

makeAllPending();