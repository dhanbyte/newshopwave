'use client'
import { useState } from 'react'

export default function TestAPIPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const testAPI = async (endpoint: string, method = 'GET', body?: any) => {
    try {
      const options: RequestInit = { method }
      if (body) {
        options.headers = { 'Content-Type': 'application/json' }
        options.body = JSON.stringify(body)
      }
      
      const response = await fetch(endpoint, options)
      const data = await response.json()
      return { status: response.status, data }
    } catch (error) {
      return { error: error.message }
    }
  }

  const runAllTests = async () => {
    setLoading(true)
    const testResults: any = {}

    // Products API
    testResults.products = await testAPI('/api/products')
    testResults.productsLimited = await testAPI('/api/products?limit=5')
    
    // User Data API
    testResults.userData = await testAPI('/api/user-data?userId=test123&type=cart')
    testResults.userDataPost = await testAPI('/api/user-data', 'POST', {
      userId: 'test123',
      type: 'cart',
      data: [{ id: 1, name: 'Test Item' }]
    })

    // Health Check
    testResults.health = await testAPI('/api/health')

    // Categories
    testResults.categories = await testAPI('/api/categories')

    // Orders
    testResults.orders = await testAPI('/api/orders')

    // Reviews
    testResults.reviews = await testAPI('/api/reviews')

    setResults(testResults)
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Test Dashboard</h1>
      
      <button 
        onClick={runAllTests}
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-2 rounded mb-6 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Run All Tests'}
      </button>

      <div className="grid gap-4">
        {Object.entries(results).map(([key, result]: [string, any]) => (
          <div key={key} className="border rounded p-4">
            <h3 className="font-bold text-lg mb-2">{key}</h3>
            <div className="bg-gray-100 p-3 rounded text-sm">
              <div className="mb-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  result.status === 200 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                }`}>
                  {result.status || 'ERROR'}
                </span>
              </div>
              <pre className="overflow-auto max-h-40">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}