'use client'
import { useState, useEffect } from 'react'

export default function TestDropshipperAPI() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    testAPIs()
  }, [])

  const testAPIs = async () => {
    const tests: any = {}
    
    try {
      // Test 1: Dropshipper Price API
      console.log('Testing dropshipper price API...')
      const priceRes = await fetch('/api/admin/dropshipper-price')
      const priceData = await priceRes.json()
      tests.priceAPI = {
        status: priceRes.ok ? '✅ Working' : '❌ Failed',
        data: priceData,
        url: '/api/admin/dropshipper-price'
      }
    } catch (err: any) {
      tests.priceAPI = {
        status: '❌ Error',
        error: err.message,
        url: '/api/admin/dropshipper-price'
      }
    }

    try {
      // Test 2: Dropshippers List API
      console.log('Testing dropshippers list API...')
      const listRes = await fetch('/api/admin/dropshippers')
      const listData = await listRes.json()
      tests.listAPI = {
        status: listRes.ok ? '✅ Working' : '❌ Failed',
        data: listData,
        count: listData.dropshippers?.length || 0,
        url: '/api/admin/dropshippers'
      }
    } catch (err: any) {
      tests.listAPI = {
        status: '❌ Error',
        error: err.message,
        url: '/api/admin/dropshippers'
      }
    }

    try {
      // Test 3: User Refresh API
      console.log('Testing user refresh API...')
      const userRes = await fetch('/api/user/refresh?userId=test&email=test@example.com')
      const userData = await userRes.json()
      tests.userRefreshAPI = {
        status: userRes.ok ? '✅ Working' : '❌ Failed',
        data: userData,
        url: '/api/user/refresh'
      }
    } catch (err: any) {
      tests.userRefreshAPI = {
        status: '❌ Error',
        error: err.message,
        url: '/api/user/refresh'
      }
    }

    setResults(tests)
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">🧪 Dropshipper API Test Results</h1>
      
      {loading ? (
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <p>Testing APIs...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(results).map(([key, value]: [string, any]) => (
            <div key={key} className="bg-white rounded-lg shadow p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{key}</h2>
                <span className="text-2xl">{value.status}</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="font-semibold">URL:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">{value.url}</code>
                </div>
                
                {value.count !== undefined && (
                  <div className="flex gap-2">
                    <span className="font-semibold">Count:</span>
                    <span>{value.count}</span>
                  </div>
                )}
                
                {value.error && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 mt-2">
                    <span className="font-semibold text-red-700">Error:</span>
                    <p className="text-red-600 mt-1">{value.error}</p>
                  </div>
                )}
                
                {value.data && (
                  <details className="mt-3">
                    <summary className="cursor-pointer font-semibold text-blue-600 hover:text-blue-800">
                      View Response Data
                    </summary>
                    <pre className="bg-gray-50 p-4 rounded mt-2 overflow-x-auto text-xs">
                      {JSON.stringify(value.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          ))}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 mb-3">📋 Summary</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>✅ Working APIs: {Object.values(results).filter((r: any) => r.status.includes('✅')).length}</p>
              <p>❌ Failed APIs: {Object.values(results).filter((r: any) => r.status.includes('❌')).length}</p>
              <p>📊 Total Tests: {Object.keys(results).length}</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              setLoading(true)
              testAPIs()
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            🔄 Re-run Tests
          </button>
        </div>
      )}
    </div>
  )
}