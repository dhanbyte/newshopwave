// Check users table structure
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nczdoszfndzqyhawpahz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jemRvc3pmbmR6cXloYXdwYWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg0MjExMiwiZXhwIjoyMDc4NDE4MTEyfQ.81BC60TKJtd2abKR1eilZbfHjXktsqSGWw0VLYqXH5E'
);

async function checkUsersTable() {
  console.log('🔍 Checking users table structure...\n');

  try {
    // Get table columns
    const { data: columns, error: colError } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_name = 'users' 
          ORDER BY ordinal_position;
        `
      });

    if (colError) {
      console.log('❌ Error getting columns:', colError.message);
      
      // Try alternative method
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('*')
        .limit(1);
      
      if (userError) {
        console.log('❌ Users table error:', userError.message);
      } else {
        console.log('✅ Users table accessible');
        if (users && users.length > 0) {
          console.log('📋 Available columns:', Object.keys(users[0]));
        }
      }
    } else {
      console.log('📋 Users table columns:');
      columns.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type})`);
      });
    }

    // Test specific user lookup
    console.log('\n🔍 Testing user lookup...');
    const testUserId = 'user_32E8jCINs6pz0hGjARnIAtvGGY4'; // Your user ID
    
    // Try different column names
    const possibleColumns = ['user_id', 'id', 'clerk_id', 'external_id'];
    
    for (const col of possibleColumns) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq(col, testUserId)
          .limit(1);
        
        if (!error && data && data.length > 0) {
          console.log(`✅ Found user using column: ${col}`);
          console.log('👤 User data:', data[0]);
          break;
        } else if (error) {
          console.log(`❌ Column ${col} error:`, error.message);
        } else {
          console.log(`⚠️ Column ${col} exists but no user found`);
        }
      } catch (err) {
        console.log(`❌ Column ${col} failed:`, err.message);
      }
    }

  } catch (error) {
    console.error('❌ Check failed:', error);
  }
}

checkUsersTable();