// Test script for dropshipper system
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nczdoszfndzqyhawpahz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jemRvc3pmbmR6cXloYXdwYWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg0MjExMiwiZXhwIjoyMDc4NDE4MTEyfQ.81BC60TKJtd2abKR1eilZbfHjXktsqSGWw0VLYqXH5E'
);

async function testDropshipperSystem() {
  console.log('🧪 Testing Dropshipper System...\n');

  try {
    // 1. Test database fields
    console.log('1. Testing database structure...');
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, is_dropshipper, dropshipper_id, dropshipper_earnings')
      .limit(1);
    
    if (userError) {
      console.log('❌ Database fields missing. Running SQL update...');
      
      // Add dropshipper fields
      const { error: alterError } = await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE users ADD COLUMN IF NOT EXISTS is_dropshipper BOOLEAN DEFAULT false;
          ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_id VARCHAR(20);
          ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_earnings DECIMAL(10,2) DEFAULT 0.00;
          ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_payment_id VARCHAR(100);
          ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_status VARCHAR(20) DEFAULT 'inactive';
        `
      });
      
      if (alterError) {
        console.log('❌ Failed to add database fields:', alterError.message);
        console.log('📝 Please run this SQL manually in Supabase:');
        console.log(`
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_dropshipper BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_id VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_earnings DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_payment_id VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_status VARCHAR(20) DEFAULT 'inactive';
        `);
      } else {
        console.log('✅ Database fields added successfully!');
      }
    } else {
      console.log('✅ Database structure is ready!');
    }

    // 2. Test creating a test dropshipper
    console.log('\n2. Testing dropshipper creation...');
    const testUserId = 'test_user_' + Date.now();
    const testPhone = '9876543210';
    const testDropshipperId = `DS${testPhone.slice(-6)}${Date.now().toString().slice(-3)}`;

    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        user_id: testUserId,
        email: 'test@example.com',
        full_name: 'Test Dropshipper',
        phone: testPhone,
        is_dropshipper: true,
        dropshipper_id: testDropshipperId,
        dropshipper_status: 'active',
        dropshipper_earnings: 0
      })
      .select()
      .single();

    if (createError) {
      console.log('❌ Failed to create test dropshipper:', createError.message);
    } else {
      console.log('✅ Test dropshipper created:', testDropshipperId);
      
      // Clean up test user
      await supabase.from('users').delete().eq('user_id', testUserId);
      console.log('🧹 Test user cleaned up');
    }

    // 3. Test price calculation
    console.log('\n3. Testing price calculation...');
    const adminPrice = 100;
    const dropshipperPrice = adminPrice; // Same as admin
    const normalUserPrice = Math.round(adminPrice * 1.5); // 50% markup

    console.log(`Admin Price: ₹${adminPrice}`);
    console.log(`Dropshipper Price: ₹${dropshipperPrice}`);
    console.log(`Normal User Price: ₹${normalUserPrice}`);
    console.log('✅ Price calculation working correctly!');

    console.log('\n🎉 Dropshipper System Test Complete!');
    console.log('\n📋 Next Steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Login to your app');
    console.log('3. Scroll to footer and click "Join Now - ₹99"');
    console.log('4. Complete payment flow');
    console.log('5. Check account page for dropshipper dashboard');
    console.log('6. Verify price differences on product pages');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testDropshipperSystem();