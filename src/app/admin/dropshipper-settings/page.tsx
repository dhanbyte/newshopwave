'use client'
import { useState, useEffect } from 'react'

export default function DropshipperSettings() {
  const [price, setPrice] = useState(113)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchPrice()
  }, [])

  const fetchPrice = async () => {
    try {
      const response = await fetch('/api/admin/dropshipper-price')
      const data = await response.json()
      if (data.success) {
        setPrice(data.price)
      }
    } catch (error) {
      console.error('Error fetching price:', error)
    }
  }

  const updatePrice = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/dropshipper-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price })
      })
      const data = await response.json()
      if (data.success) {
        setMessage('✅ Price updated successfully!')
        setTimeout(() => setMessage(''), 3000)
        
        // Trigger event to update Footer
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('dropshipperPriceUpdated'))
        }
      } else {
        setMessage('❌ Failed to update price')
      }
    } catch (error) {
      setMessage('❌ Error updating price')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">💰 Dropshipper Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Registration Price</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Dropshipper Registration Price (₹)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
              className="w-full border rounded-lg px-3 py-2"
              min="1"
            />
          </div>
          
          <button
            onClick={updatePrice}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Price'}
          </button>
          
          {message && (
            <div className="text-sm font-medium">
              {message}
            </div>
          )}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Current Settings:</h3>
          <p className="text-sm text-gray-600">
            Registration Price: <span className="font-semibold">₹{price}</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This price will be shown to users when they try to become dropshippers
          </p>
        </div>
      </div>
    </div>
  )
}