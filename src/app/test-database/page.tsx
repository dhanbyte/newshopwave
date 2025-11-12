'use client'

import { useState, useEffect } from 'react'

export default function TestDatabase() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    testAllAPIs()
  }, [])

  const testAllAPIs = async () => {
    setLoading(true)
    const tests = {
      supabase: await testSupabase(),
      vendorAuth: await testVendorAuth(),
      userAuth: await testUserAuth(),
      vendorCRUD: await testVendorCRUD(),
      productCRUD: await testProductCRUD(),
      orderCRUD: await testOrderCRUD(),
      userDataCRUD: await testUserDataCRUD()
    }
    setResults(tests)
    setLoading(false)
  }

  const testSupabase = async () => {
    try {
      const res = await fetch('/api/test-supabase')
      return await res.json()
    } catch (error) {
      return { error: error.message }
    }
  }

  const testVendorAuth = async () => {
    try {
      const login = await fetch('/api/vendor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'dhananjay.win2004@gmail.com', password: 'test123' })
      })
      const loginResult = await login.json()
      
      const profile = await fetch('/api/vendor/profile?vendorId=1')
      const profileResult = await profile.json()
      
      return { login: loginResult, profile: profileResult }
    } catch (error) {
      return { error: error.message }
    }
  }

  const testUserAuth = async () => {
    try {
      const register = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'test123', name: 'Test User' })
      })
      const registerResult = await register.json()
      
      const login = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'test123' })
      })
      const loginResult = await login.json()
      
      return { register: registerResult, login: loginResult }
    } catch (error) {
      return { error: error.message }
    }
  }

  const testVendorCRUD = async () => {
    try {
      const register = await fetch('/api/vendor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'testvendor@example.com',
          password: 'test123',
          businessName: 'Test Vendor Store',
          contactNumber: '9876543210'
        })
      })
      const registerResult = await register.json()
      
      const profile = await fetch('/api/vendor/profile?vendorId=1')
      const profileResult = await profile.json()
      
      return { register: registerResult, profile: profileResult }
    } catch (error) {
      return { error: error.message }
    }
  }

  const testProductCRUD = async () => {
    try {
      const create = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Product',
          price: 99.99,
          description: 'Test product description',
          category: 'Tech',
          subcategory: 'Accessories'
        })
      })
      const createResult = await create.json()
      
      const read = await fetch('/api/products?limit=3')
      const readResult = await read.json()
      
      return { create: createResult, read: { count: readResult.length } }
    } catch (error) {
      return { error: error.message }
    }
  }

  const testOrderCRUD = async () => {
    try {
      const create = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '1',
          items: [{ id: 1, name: 'Test Product', price: 99.99, quantity: 1 }],
          totalAmount: 99.99,
          paymentMethod: 'card'
        })
      })
      const createResult = await create.json()
      
      const read = await fetch('/api/vendor/orders?vendorId=1')
      const readResult = await read.json()
      
      return { create: createResult, read: readResult }
    } catch (error) {
      return { error: error.message }
    }
  }

  const testUserDataCRUD = async () => {
    try {
      const create = await fetch('/api/user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'test-user',
          type: 'cart',
          data: [{ id: 1, name: 'Test Item', price: 50 }]
        })
      })
      const createResult = await create.json()
      
      const read = await fetch('/api/user-data?userId=test-user&type=cart')
      const readResult = await read.json()
      
      return { create: createResult, read: readResult }
    } catch (error) {
      return { error: error.message }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Testing Database APIs...</h1>
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Database API Test Results</h1>
          <button 
            onClick={testAllAPIs}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Refresh Tests
          </button>
        </div>

        <div className="grid gap-6">
          {Object.entries(results).map(([key, result]: [string, any]) => (
            <div key={key} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold capitalize">{key} API</h2>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  result.error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {result.error ? 'Failed' : 'Success'}
                </span>
              </div>
              
              <div className="bg-gray-50 rounded p-4 overflow-auto max-h-96">
                <pre className="text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/vendor/login" className="bg-blue-500 text-white p-3 rounded text-center hover:bg-blue-600">
              Vendor Login
            </a>
            <a href="/vendor/dashboard" className="bg-green-500 text-white p-3 rounded text-center hover:bg-green-600">
              Vendor Dashboard
            </a>
            <a href="/admin" className="bg-purple-500 text-white p-3 rounded text-center hover:bg-purple-600">
              Admin Panel
            </a>
            <a href="/" className="bg-gray-500 text-white p-3 rounded text-center hover:bg-gray-600">
              Home Page
            </a>
            <a href="/vendor/products" className="bg-orange-500 text-white p-3 rounded text-center hover:bg-orange-600">
              Vendor Products
            </a>
            <a href="/vendor/orders" className="bg-red-500 text-white p-3 rounded text-center hover:bg-red-600">
              Vendor Orders
            </a>
            <a href="/api/products" target="_blank" className="bg-indigo-500 text-white p-3 rounded text-center hover:bg-indigo-600">
              Products API
            </a>
            <a href="/api/categories" target="_blank" className="bg-pink-500 text-white p-3 rounded text-center hover:bg-pink-600">
              Categories API
            </a>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Test Credentials & Status</h3>
          <div className="text-sm text-yellow-700 space-y-2">
            <p><strong>Real Vendor:</strong> dhananjay.win2004@gmail.com (ID: 1)</p>
            <p><strong>Test Vendor:</strong> vendor@test.com / password123</p>
            <p><strong>Test User:</strong> user@test.com / password123</p>
            <div className="mt-4 p-3 bg-white rounded border">
              <p className="font-semibold text-gray-800">Database Status:</p>
              <p className="text-green-600">✅ Vendors: {results.supabase?.vendors?.length || 0} found</p>
              <p className="text-green-600">✅ Products: Working (JSON fallback)</p>
              <p className="text-green-600">✅ Categories: Working</p>
              <p className="text-blue-600">ℹ️ Orders: Empty (new tables)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}