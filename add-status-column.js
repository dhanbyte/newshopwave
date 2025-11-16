const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addStatusColumn() {
  try {
    console.log('Adding status column to products table...');
    
    // Add status column if it doesn't exist
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';
        
        UPDATE products 
        SET status = 'active' 
        WHERE status IS NULL OR status = '';
        
        CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
      `
    });

    if (alterError) {
      console.error('Error adding status column:', alterError);
      return;
    }

    console.log('✅ Status column added successfully!');
    
    // Test by fetching products with status
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name, status')
      .limit(5);

    if (fetchError) {
      console.error('Error fetching products:', fetchError);
      return;
    }

    console.log('Sample products with status:');
    products.forEach(p => {
      console.log(`- ${p.name}: ${p.status || 'NULL'}`);
    });

  } catch (error) {
    console.error('Script error:', error);
  }
}

addStatusColumn();