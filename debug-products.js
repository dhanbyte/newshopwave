const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ixcvqjqvqjqvqjqvqjqv.supabase.co',
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4Y3ZxanF2cWpxdnFqcXZxanF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTY0NzY4NCwiZXhwIjoyMDUxMjIzNjg0fQ.abc123',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function checkProducts() {
  try {
    console.log('Checking vendor products...');
    
    const { data: allProducts, error: allError } = await supabase
      .from('vendor_products')
      .select('id, name, status, category')
      .limit(10);
    
    if (allError) {
      console.error('Error fetching all products:', allError);
      return;
    }
    
    console.log('All products:', allProducts);
    
    const { data: approvedProducts, error: approvedError } = await supabase
      .from('vendor_products')
      .select('id, name, status, category')
      .eq('status', 'approved')
      .limit(10);
    
    if (approvedError) {
      console.error('Error fetching approved products:', approvedError);
      return;
    }
    
    console.log('Approved products:', approvedProducts);
    
    // Check if we need to approve some products
    if (approvedProducts.length === 0 && allProducts.length > 0) {
      console.log('No approved products found. Approving first 5 products...');
      
      const productsToApprove = allProducts.slice(0, 5);
      
      for (const product of productsToApprove) {
        const { error: updateError } = await supabase
          .from('vendor_products')
          .update({ status: 'approved' })
          .eq('id', product.id);
        
        if (updateError) {
          console.error(`Error approving product ${product.id}:`, updateError);
        } else {
          console.log(`Approved product: ${product.name}`);
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkProducts();