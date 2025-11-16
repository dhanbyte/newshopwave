// Manual dropshipper update script
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nczdoszfndzqyhawpahz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jemRvc3pmbmR6cXloYXdwYWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg0MjExMiwiZXhwIjoyMDc4NDE4MTEyfQ.81BC60TKJtd2abKR1eilZbfHjXktsqSGWw0VLYqXH5E'
);

async function manualUpdate() {
  const email = 'dhananjay.win2004@gmail.com'; // Your email
  const dropshipperId = 'DS499884' + Date.now().toString().slice(-3);
  
  console.log('🔄 Manual dropshipper update for:', email);
  
  try {
    // Update user as dropshipper
    const { data, error } = await supabase
      .from('users')
      .update({
        is_dropshipper: true,
        dropshipper_id: dropshipperId,
        dropshipper_status: 'active',
        dropshipper_earnings: 0,
        dropshipper_payment_id: 'manual_' + Date.now()
      })
      .eq('email', email)
      .select();
    
    if (error) {
      console.log('❌ Error:', error.message);
    } else if (data && data.length > 0) {
      console.log('✅ Success! Updated user:', data[0]);
      console.log('🆔 Dropshipper ID:', dropshipperId);
    } else {
      console.log('⚠️ No user found with email:', email);
    }
    
    // Verify update
    const { data: verifyData } = await supabase
      .from('users')
      .select('email, is_dropshipper, dropshipper_id')
      .eq('email', email)
      .single();
    
    console.log('🔍 Verification:', verifyData);
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

manualUpdate();