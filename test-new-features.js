const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nczdoszfndzqyhawpahz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jemRvc3pmbmR6cXloYXdwYWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg0MjExMiwiZXhwIjoyMDc4NDE4MTEyfQ.81BC60TKJtd2abKR1eilZbfHjXktsqSGWw0VLYqXH5E';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log('🚀 Starting ShopWave Feature Tests...\n');

  // Test 1: Create Settings Table and Set Dropshipper Price to ₹999
  console.log('📝 Test 1: Setting Dropshipper Price to ₹999');
  try {
    // First, ensure settings table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('settings')
      .select('*')
      .limit(1);

    if (tableError && tableError.code === '42P01') {
      console.log('⚠️  Settings table does not exist. Creating it...');
      // Table doesn't exist, we need to run migration
      console.log('❌ Please run supabase-migration-settings-table.sql in Supabase dashboard first');
      return;
    }

    // Upsert dropshipper price
    const { data: priceData, error: priceError } = await supabase
      .from('settings')
      .upsert({
        key: 'dropshipper_price',
        value: '999',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      })
      .select();

    if (priceError) {
      console.log('❌ Error setting price:', priceError.message);
    } else {
      console.log('✅ Dropshipper price set to ₹999');
      console.log('   Data:', priceData);
    }
  } catch (error) {
    console.log('❌ Error in Test 1:', error.message);
  }

  console.log('\n---\n');

  // Test 2: Create Product Review
  console.log('📝 Test 2: Creating Product Review');
  try {
    const { data: tableCheck, error: tableError } = await supabase
      .from('product_reviews')
      .select('*')
      .limit(1);

    if (tableError && tableError.code === '42P01') {
      console.log('❌ Product reviews table does not exist. Please run supabase-migration-reviews-table.sql');
    } else {
      // Create a test review
      const testReview = {
        product_id: 'test-product-123',
        user_id: 'test-user-456',
        user_name: 'Test User',
        user_email: 'test@example.com',
        rating: 5,
        title: 'Excellent Product!',
        review_text: 'This is a test review. Product quality is amazing!',
        verified_purchase: true
      };

      const { data: reviewData, error: reviewError } = await supabase
        .from('product_reviews')
        .insert(testReview)
        .select();

      if (reviewError) {
        console.log('❌ Error creating review:', reviewError.message);
      } else {
        console.log('✅ Review created successfully');
        console.log('   Review ID:', reviewData[0].id);
        console.log('   Rating:', reviewData[0].rating, '⭐');
        console.log('   Title:', reviewData[0].title);
      }
    }
  } catch (error) {
    console.log('❌ Error in Test 2:', error.message);
  }

  console.log('\n---\n');

  // Test 3: Create Referral Code
  console.log('📝 Test 3: Creating Referral Code');
  try {
    const { data: tableCheck, error: tableError } = await supabase
      .from('referrals')
      .select('*')
      .limit(1);

    if (tableError && tableError.code === '42P01') {
      console.log('❌ Referrals table does not exist. Please run supabase-migration-referrals-table.sql');
    } else {
      // Generate referral code
      const referralCode = `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      const testReferral = {
        referrer_id: 'test-user-789',
        referrer_email: 'referrer@example.com',
        referral_code: referralCode,
        reward_amount: 50,
        status: 'pending'
      };

      const { data: referralData, error: referralError } = await supabase
        .from('referrals')
        .insert(testReferral)
        .select();

      if (referralError) {
        console.log('❌ Error creating referral:', referralError.message);
      } else {
        console.log('✅ Referral code created successfully');
        console.log('   Code:', referralData[0].referral_code);
        console.log('   Reward: ₹', referralData[0].reward_amount);
        console.log('   Status:', referralData[0].status);
      }
    }
  } catch (error) {
    console.log('❌ Error in Test 3:', error.message);
  }

  console.log('\n---\n');

  // Test 4: Fetch Dropshipper Price
  console.log('📝 Test 4: Fetching Dropshipper Price');
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'dropshipper_price')
      .single();

    if (error) {
      console.log('❌ Error fetching price:', error.message);
    } else {
      console.log('✅ Current dropshipper price: ₹', data.value);
    }
  } catch (error) {
    console.log('❌ Error in Test 4:', error.message);
  }

  console.log('\n---\n');

  // Test 5: Get Review Stats
  console.log('📝 Test 5: Getting Review Statistics');
  try {
    const { data: reviews, error } = await supabase
      .from('product_reviews')
      .select('rating')
      .eq('product_id', 'test-product-123');

    if (error) {
      console.log('❌ Error fetching reviews:', error.message);
    } else if (reviews && reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      console.log('✅ Review Statistics:');
      console.log('   Total Reviews:', reviews.length);
      console.log('   Average Rating:', avgRating.toFixed(1), '⭐');
    } else {
      console.log('ℹ️  No reviews found for test product');
    }
  } catch (error) {
    console.log('❌ Error in Test 5:', error.message);
  }

  console.log('\n---\n');

  // Test 6: Get Referral Stats
  console.log('📝 Test 6: Getting Referral Statistics');
  try {
    const { data: stats, error } = await supabase
      .from('referral_stats')
      .select('*')
      .eq('user_id', 'test-user-789')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.log('❌ Error fetching stats:', error.message);
    } else if (stats) {
      console.log('✅ Referral Statistics:');
      console.log('   Total Referrals:', stats.total_referrals);
      console.log('   Successful:', stats.successful_referrals);
      console.log('   Total Earned: ₹', stats.total_earned);
    } else {
      console.log('ℹ️  No referral stats yet (will be created after first referral)');
    }
  } catch (error) {
    console.log('❌ Error in Test 6:', error.message);
  }

  console.log('\n✨ Tests Complete!\n');
}

// Run the tests
runTests().catch(console.error);