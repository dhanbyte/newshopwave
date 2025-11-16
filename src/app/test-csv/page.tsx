'use client'
import { useState } from 'react'

export default function TestCSV() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testCSVUpload = async () => {
    setLoading(true)
    try {
      const testData = {
        vendorId: 1,
        products: [
          {
            name: 'Test Product 1',
            description: 'Test description',
            price: 100,
            stock: 10,
            category: 'Test Category',
            sku: 'TEST-001'
          },
          {
            name: 'Test Product 2', 
            description: 'Another test',
            price: 200,
            stock: 5,
            category: 'Test Category',
            sku: 'TEST-002'
          }
        ]
      }

      const response = await fetch('/api/vendor/import-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })
      
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error.message}`)
    }
    setLoading(false)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">CSV Import Test</h1>
      <button 
        onClick={testCSVUpload}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? 'Testing...' : 'Test CSV Import'}
      </button>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {result || 'Click button to test CSV import'}
      </pre>
    </div>
  )
}