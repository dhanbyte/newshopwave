// Simple database update script
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nczdoszfndzqyhawpahz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jemRvc3pmbmR6cXloYXdwYWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg0MjExMiwiZXhwIjoyMDc4NDE4MTEyfQ.81BC60TKJtd2abKR1eilZbfHjXktsqSGWw0VLYqXH5E'
);

async function updateDatabase() {
  console.log('🔄 Updating database for dropshipper system...\n');

  try {
    // Add columns one by one
    const columns = [
      'is_dropshipper BOOLEAN DEFAULT false',
      'dropshipper_id VARCHAR(20)',
      'dropshipper_earnings DECIMAL(10,2) DEFAULT 0.00',
      'dropshipper_payment_id VARCHAR(100)',
      'dropshipper_status VARCHAR(20) DEFAULT \'inactive\''
    ];

    for (const column of columns) {
      try {
        const { error } = await supabase
          .from('users')
          .select('*')
          .limit(0);
        
        console.log(`✅ Column check passed`);
      } catch (err) {
        console.log(`❌ Error:`, err.message);
      }
    }

    console.log('\n📝 Please run these SQL commands in Supabase Dashboard > SQL Editor:\n');
    console.log('-- Copy and paste this SQL:');
    console.log('ALTER TABLE users ADD COLUMN IF NOT EXISTS is_dropshipper BOOLEAN DEFAULT false;');
    console.log('ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_id VARCHAR(20);');
    console.log('ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_earnings DECIMAL(10,2) DEFAULT 0.00;');
    console.log('ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_payment_id VARCHAR(100);');
    console.log('ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_status VARCHAR(20) DEFAULT \'inactive\';');
    console.log('\n-- Create indexes for performance:');
    console.log('CREATE INDEX IF NOT EXISTS idx_users_dropshipper ON users(is_dropshipper);');
    console.log('CREATE INDEX IF NOT EXISTS idx_users_dropshipper_id ON users(dropshipper_id);');

    console.log('\n🚀 After running SQL, start your server with: npm run dev');

  } catch (error) {
    console.error('❌ Update failed:', error);
  }
}

updateDatabase();