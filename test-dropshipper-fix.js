/**
 * Test Script for Dropshipper Registration Fix
 * 
 * This script helps verify that the dropshipper registration fix is working correctly.
 * Run this in browser console after attempting dropshipper registration.
 */

const testDropshipperFix = {
  // Test 1: Verify API endpoint exists
  async testEndpointExists() {
    console.log('🧪 Test 1: Checking if registration endpoint exists...');
    try {
      const response = await fetch('/api/dropshipper/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) // Empty body to trigger validation
      });
      const data = await response.json();
      
      if (data.error && data.error.includes('required')) {
        console.log('✅ Endpoint exists and validates input');
        return true;
      }
      console.log('⚠️ Unexpected response:', data);
      return false;
    } catch (error) {
      console.error('❌ Endpoint test failed:', error);
      return false;
    }
  },

  // Test 2: Verify verification endpoint
  async testVerificationEndpoint(userId, email) {
    console.log('🧪 Test 2: Checking verification endpoint...');
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (email) params.append('email', email);
      
      const response = await fetch(`/api/dropshipper/verify?${params}`);
      const data = await response.json();
      
      console.log('Verification result:', data);
      
      if (data.success) {
        console.log('✅ User found:', {
          email: data.user.email,
          is_dropshipper: data.user.is_dropshipper,
          dropshipper_id: data.user.dropshipper_id
        });
        return true;
      } else {
        console.log('⚠️ User not found or not a dropshipper');
        return false;
      }
    } catch (error) {
      console.error('❌ Verification test failed:', error);
      return false;
    }
  },

  // Test 3: Check user refresh
  async testUserRefresh(userId, email) {
    console.log('🧪 Test 3: Testing user refresh endpoint...');
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (email) params.append('email', email);
      params.append('t', Date.now()); // Cache buster
      
      const response = await fetch(`/api/user/refresh?${params}`);
      const data = await response.json();
      
      console.log('Refresh result:', data);
      
      if (data.success && data.user) {
        console.log('✅ User refresh successful');
        console.log('User data:', {
          email: data.user.email,
          clerk_user_id: data.user.clerk_user_id,
          is_dropshipper: data.user.is_dropshipper,
          dropshipper_id: data.user.dropshipper_id
        });
        return true;
      } else {
        console.log('⚠️ User refresh failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Refresh test failed:', error);
      return false;
    }
  },

  // Run all tests
  async runAllTests(userId, email) {
    console.log('🚀 Starting Dropshipper Fix Tests...\n');
    
    const results = {
      endpointExists: await this.testEndpointExists(),
      verification: await this.testVerificationEndpoint(userId, email),
      refresh: await this.testUserRefresh(userId, email)
    };
    
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    console.log('Endpoint Exists:', results.endpointExists ? '✅' : '❌');
    console.log('Verification:', results.verification ? '✅' : '❌');
    console.log('User Refresh:', results.refresh ? '✅' : '❌');
    console.log('========================');
    
    const allPassed = Object.values(results).every(r => r === true);
    console.log('\n' + (allPassed ? '✅ All tests passed!' : '⚠️ Some tests failed'));
    
    return results;
  }
};

// Usage instructions
console.log(`
╔════════════════════════════════════════════════════════════╗
║  Dropshipper Registration Fix - Test Script                ║
╚════════════════════════════════════════════════════════════╝

To test the fix, run:

1. Basic endpoint test:
   await testDropshipperFix.testEndpointExists()

2. Verify specific user:
   await testDropshipperFix.testVerificationEndpoint('user_id', 'email@example.com')

3. Test user refresh:
   await testDropshipperFix.testUserRefresh('user_id', 'email@example.com')

4. Run all tests:
   await testDropshipperFix.runAllTests('user_id', 'email@example.com')

Replace 'user_id' and 'email@example.com' with actual values.
`);

// Make it globally available
if (typeof window !== 'undefined') {
  window.testDropshipperFix = testDropshipperFix;
}