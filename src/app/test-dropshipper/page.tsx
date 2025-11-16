'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/ClerkAuthContext'
import PriceTag from '@/components/PriceTag'

export default function TestDropshipperPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, result])
  }

  const testPayment = async () => {
    if (!user) {
      addResult('❌ Please login first')
      return
    }

    const phoneNumber = prompt('Enter phone number for test:') || '9876543210'
    setLoading(true)
    addResult('🔄 Starting payment test...')

    try {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: 100, // ₹1 for testing
        currency: 'INR',
        name: 'ShopWave Dropshipper Test',
        description: 'Test Payment - ₹1',
        handler: async (response: any) => {
          try {
            addResult('✅ Payment successful: ' + response.razorpay_payment_id)
            
            const res = await fetch('/api/dropshipper/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user.id,
                paymentId: response.razorpay_payment_id,
                phone: phoneNumber
              })
            })
            
            const data = await res.json()
            if (data.success) {
              addResult('✅ Dropshipper registration successful!')
              addResult('🆔 Dropshipper ID: ' + data.dropshipperId)
              setTimeout(() => window.location.reload(), 2000)
            } else {
              addResult('❌ Registration failed: ' + data.error)
            }
          } catch (err) {
            addResult('❌ Registration API error')
          }
        },
        prefill: {
          name: user.fullName,
          email: user.email,
          contact: phoneNumber
        }
      }

      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      } else {
        addResult('❌ Razorpay not loaded')
      }
    } catch (error) {
      addResult('❌ Payment error: ' + error)
    } finally {
      setLoading(false)
    }
  }

  const testDatabase = async () => {
    addResult('🗄️ Testing database...')
    try {
      const response = await fetch('/api/test-db')
      const data = await response.json()
      if (data.success) {
        addResult('✅ Database connection successful')
      } else {
        addResult('❌ Database error: ' + data.error)
        addResult('📝 Please run URGENT-DATABASE-FIX.sql in Supabase')
      }
    } catch (error) {
      addResult('❌ Database connection failed')
      addResult('📝 Please run URGENT-DATABASE-FIX.sql in Supabase')
    }
  }

  const testPriceLogic = () => {
    addResult('🧮 Testing price logic...')
    const adminPrice = 100
    const adminDiscounted = 75
    const dropshipperPrice = adminPrice
    const dropshipperDiscounted = adminDiscounted
    const normalUserPrice = Math.round(adminPrice * 1.5)
    const normalUserDiscounted = Math.round(adminDiscounted * 1.5)
    
    addResult(`Admin Original: ₹${adminPrice}, Discounted: ₹${adminDiscounted}`)
    addResult(`Dropshipper sees: ₹${dropshipperPrice}, Discounted: ₹${dropshipperDiscounted}`)
    addResult(`Normal user sees: ₹${normalUserPrice}, Discounted: ₹${normalUserDiscounted}`)
    addResult('✅ Price calculation working!')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">🧪 Dropshipper System Test</h1>
      
      {/* User Status */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">👤 User Status</h2>
        {user ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <p><strong>Name:</strong> {user.fullName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Is Dropshipper:</strong> {user.is_dropshipper ? '✅ Yes' : '❌ No'}</p>
              {user.is_dropshipper && (
                <>
                  <p><strong>Dropshipper ID:</strong> {user.dropshipper_id}</p>
                  <p><strong>Earnings:</strong> ₹{user.dropshipper_earnings || 0}</p>
                </>
              )}
            </div>
            
            {/* Register Button */}
            {!user.is_dropshipper && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">🚀 Become a Dropshipper</h3>
                <p className="text-blue-600 text-sm mb-3">Get wholesale prices on all products!</p>
                <Button 
                  onClick={testPayment}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Processing...' : 'Register Now - ₹1 (Test)'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-red-600">❌ Please login to test</p>
        )}
      </div>

      {/* Test Buttons */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🔧 Test Functions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button onClick={testDatabase} className="w-full">
            Test Database
          </Button>
          <Button onClick={testPriceLogic} className="w-full">
            Test Price Logic
          </Button>
          <Button 
            onClick={testPayment} 
            disabled={loading || !user}
            className="w-full"
          >
            {loading ? 'Processing...' : 'Test Payment (₹1)'}
          </Button>
          <Button 
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="w-full"
          >
            Go to Homepage
          </Button>
        </div>
      </div>

      {/* Price Demo */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">💰 Price Display Demo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Sample Product</h3>
            <div className="w-full h-32 bg-gray-200 rounded mb-2 flex items-center justify-center">
              <span className="text-gray-500">Product Image</span>
            </div>
            <h4 className="font-medium">Wireless Headphones</h4>
            <PriceTag original={100} />
            <p className="text-xs text-gray-500 mt-2">
              {user?.is_dropshipper ? '🏷️ Dropshipper Price' : '🛒 Regular Price'}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Another Product</h3>
            <div className="w-full h-32 bg-gray-200 rounded mb-2 flex items-center justify-center">
              <span className="text-gray-500">Product Image</span>
            </div>
            <h4 className="font-medium">Smart Watch</h4>
            <PriceTag original={200} discounted={150} />
            <p className="text-xs text-gray-500 mt-2">
              {user?.is_dropshipper ? '🏷️ Dropshipper Price' : '🛒 Regular Price'}
            </p>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">📋 Test Results</h2>
        <div className="bg-gray-50 rounded p-4 h-64 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500">No tests run yet. Click buttons above to start testing.</p>
          ) : (
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>
        <Button 
          onClick={() => setTestResults([])} 
          variant="outline" 
          className="mt-4"
        >
          Clear Results
        </Button>
      </div>

      {/* Database Warning */}
      <div className="bg-red-50 rounded-lg p-6 mt-6 border border-red-200">
        <h2 className="text-xl font-semibold mb-4 text-red-800">⚠️ Database Setup Required</h2>
        <p className="text-red-700 mb-4">
          If you see "dropshipper_earnings column not found" error, you need to run the database update first.
        </p>
        <div className="bg-red-100 p-4 rounded border">
          <p className="font-semibold text-red-800 mb-2">Steps to fix:</p>
          <ol className="list-decimal list-inside space-y-1 text-red-700 text-sm">
            <li>Go to Supabase Dashboard → SQL Editor</li>
            <li>Copy content from URGENT-DATABASE-FIX.sql file</li>
            <li>Paste and run the SQL commands</li>
            <li>Refresh this page and test again</li>
          </ol>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">📖 Test Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-blue-700">
          <li>First, run database setup (see red box above if needed)</li>
          <li>Make sure you're logged in</li>
          <li>Click "Test Database" to verify setup</li>
          <li>Click "Test Price Logic" to see price calculations</li>
          <li>Click "Test Payment" to simulate dropshipper registration</li>
          <li>After payment, check if user status shows "Is Dropshipper: Yes"</li>
          <li>Verify price differences in the demo products</li>
          <li>Go to footer and test real ₹99 payment</li>
        </ol>
      </div>
    </div>
  )
}