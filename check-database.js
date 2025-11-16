// Check database users
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nczdoszfndzqyhawpahz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jemRvc3pmbmR6cXloYXdwYWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg0MjExMiwiZXhwIjoyMDc4NDE4MTEyfQ.81BC60TKJtd2abKR1eilZbfHjXktsqSGWw0VLYqXH5E'
);

async function checkDatabase() {
  console.log('🔍 Checking database...\n');
  
  try {
    // Get all users
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, name, clerk_user_id, is_dropshipper, dropshipper_id')
      .limit(10);
    
    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }
    
    console.log('📋 Users in database:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Clerk ID: ${user.clerk_user_id}`);
      console.log(`   Dropshipper: ${user.is_dropshipper ? '✅' : '❌'}`);
      console.log(`   Dropshipper ID: ${user.dropshipper_id || 'None'}`);
      console.log('');
    });
    
    // Check for specific email patterns
    const emailPattern = 'dhananjay';
    const { data: matchingUsers } = await supabase
      .from('users')
      .select('*')
      .ilike('email', `%${emailPattern}%`);
    
    if (matchingUsers && matchingUsers.length > 0) {
      console.log('🎯 Found matching users:');
      matchingUsers.forEach(user => {
        console.log(`- ${user.email} (ID: ${user.id})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

checkDatabase();