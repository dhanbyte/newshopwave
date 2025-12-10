'use client'
import { useState, useEffect } from 'react'

export default function DropshipperSettings() {
  const [price, setPrice] = useState(113)
  const [videoUrl, setVideoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // Fetch Price
      const priceRes = await fetch('/api/admin/dropshipper-price')
      const priceData = await priceRes.json()
      if (priceData.success) {
        setPrice(priceData.price)
      }

      // Fetch Video URL
      const videoRes = await fetch('/api/admin/settings?key=how_it_works_video')
      const videoData = await videoRes.json()
      if (videoData.success) {
        setVideoUrl(videoData.value || 'https://www.youtube.com/watch?v=I-U1NwHyGGI')
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const updateSettings = async () => {
    setLoading(true)
    try {
      // Update Price (using existing endpoint)
      const pricePromise = fetch('/api/admin/dropshipper-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price })
      })

      // Update Video URL (using new endpoint)
      const videoPromise = fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'how_it_works_video', value: videoUrl })
      })

      const [priceRes, videoRes] = await Promise.all([pricePromise, videoPromise])
      const priceData = await priceRes.json()
      const videoData = await videoRes.json()

      if (priceData.success && videoData.success) {
        setMessage('✅ Settings updated successfully!')
        setTimeout(() => setMessage(''), 3000)
        
        // Trigger event to update Footer or other components if needed
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('dropshipperPriceUpdated'))
        }
      } else {
        setMessage('❌ Failed to update settings')
      }
    } catch (error) {
      setMessage('❌ Error updating settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">💰 Dropshipper Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Configuration</h2>
        
        <div className="space-y-6">
          {/* Price Setting */}
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
            <p className="text-xs text-gray-500 mt-1">
              Amount users pay to register as a dropshipper.
            </p>
          </div>

          {/* Video URL Setting */}
          <div>
            <label className="block text-sm font-medium mb-2">
              "How It Works" Video Link (YouTube)
            </label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="text-xs text-gray-500 mt-1">
              The video linked in the "Watch How It Works" button on the Join page.
            </p>
          </div>
          
          <button
            onClick={updateSettings}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
          
          {message && (
            <div className={`text-sm font-medium text-center p-2 rounded ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}