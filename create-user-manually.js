// Create user manually
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nczdoszfndzqyhawpahz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jemRvc3pmbmR6cXloYXdwYWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg0MjExMiwiZXhwIjoyMDc4NDE4MTEyfQ.81BC60TKJtd2abKR1eilZbfHjXktsqSGWw0VLYqXH5E'
);

async function createUser() {
  const userData = {
    clerk_user_id: 'user_32E8jCINs6pz0hGjARnIAtvGGY4',
    email: 'dhananjay.win2004@gmail.com',
    name: 'Dhananjay Singh',
    password: 'clerk_auth', // Placeholder since using Clerk
    referral_code: 'DS' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    is_dropshipper: true,
    dropshipper_id: 'DS499884' + Date.now().toString().slice(-3),
    dropshipper_status: 'active',
    dropshipper_earnings: 0,
    dropshipper_payment_id: 'manual_payment_' + Date.now()
  };
  
  console.log('🔄 Creating user:', userData.email);
  
  try {
    // Create user
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) {
      console.log('❌ Error:', error.message);
    } else {
      console.log('✅ Success! Created user:');
      console.log('📧 Email:', data.email);
      console.log('🆔 Dropshipper ID:', data.dropshipper_id);
      console.log('👤 Clerk ID:', data.clerk_user_id);
      console.log('🚀 Dropshipper Status:', data.is_dropshipper ? 'Active' : 'Inactive');
    }
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

createUser();