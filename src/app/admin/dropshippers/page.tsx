'use client'
import { useState, useEffect } from 'react'

export default function DroppshippersPage() {
  const [dropshippers, setDropshippers] = useState([])
  const [loading, setLoading] = useState(true)
  const [registrationPrice, setRegistrationPrice] = useState(113)
  const [newPrice, setNewPrice] = useState(113)
  const [selectedDropshipper, setSelectedDropshipper] = useState(null)

  useEffect(() => {
    fetchDropshippers()
    fetchRegistrationPrice()
  }, [])

  const fetchDropshippers = async () => {
    try {
      const response = await fetch('/api/admin/dropshippers')
      const data = await response.json()
      if (data.success) {
        setDropshippers(data.dropshippers)
      }
    } catch (error) {
      console.error('Error fetching dropshippers:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRegistrationPrice = async () => {
    try {
      const response = await fetch('/api/admin/dropshipper-price')
      const data = await response.json()
      if (data.success) {
        setRegistrationPrice(data.price)
        setNewPrice(data.price)
      }
    } catch (error) {
      console.error('Error fetching price:', error)
    }
  }

  const updatePrice = async () => {
    try {
      const response = await fetch('/api/admin/dropshipper-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: newPrice })
      })
      const data = await response.json()
      if (data.success) {
        setRegistrationPrice(newPrice)
        alert('✅ Registration price updated!')
      }
    } catch (error) {
      alert('❌ Failed to update price')
    }
  }

  const updateDropshipperStatus = async (dropshipperId: string, status: string) => {
    try {
      const response = await fetch('/api/admin/dropshippers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dropshipperId, status })
      })
      const data = await response.json()
      if (data.success) {
        alert(`✅ Dropshipper ${status} successfully!`)
        fetchDropshippers()
        setSelectedDropshipper(null)
      }
    } catch (error) {
      alert('❌ Failed to update status')
    }
  }

  if (selectedDropshipper) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedDropshipper(null)}
            className="text-blue-600 hover:text-blue-800"
          >
            {'< Back to Dropshippers'}
          </button>
          <h1 className="text-3xl font-bold">🏷️ Dropshipper Details</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-6 pb-4 border-b">
            <div>
              <h2 className="text-2xl font-bold">{selectedDropshipper.dropshipper_id}</h2>
              <p className="text-gray-600">{selectedDropshipper.name}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${
              selectedDropshipper.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : selectedDropshipper.status === 'suspended'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {selectedDropshipper.status || 'active'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-3">Contact Information</h3>
              <div className="space-y-2">
                <p><strong>Email:</strong> {selectedDropshipper.email}</p>
                <p><strong>Phone:</strong> {selectedDropshipper.phone}</p>
                <p><strong>Address:</strong> {selectedDropshipper.address || 'N/A'}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Account Details</h3>
              <div className="space-y-2">
                <p><strong>Joined:</strong> {new Date(selectedDropshipper.created_at).toLocaleDateString()}</p>
                <p><strong>Payment ID:</strong> {selectedDropshipper.payment_id || 'N/A'}</p>
                <p><strong>User ID:</strong> {selectedDropshipper.user_id || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Actions</h3>
            <div className="flex gap-3">
              {selectedDropshipper.status !== 'suspended' && (
                <button
                  onClick={() => updateDropshipperStatus(selectedDropshipper.dropshipper_id, 'suspended')}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                >
                  Suspend
                </button>
              )}
              {selectedDropshipper.status !== 'blocked' && (
                <button
                  onClick={() => updateDropshipperStatus(selectedDropshipper.dropshipper_id, 'blocked')}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Block
                </button>
              )}
              {selectedDropshipper.status !== 'active' && (
                <button
                  onClick={() => updateDropshipperStatus(selectedDropshipper.dropshipper_id, 'active')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Activate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🏷️ Dropshippers Management</h1>
      
      {/* Registration Price Settings */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">💰 Registration Price Settings</h2>
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Current Price: ₹{registrationPrice}
            </label>
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(parseInt(e.target.value) || 0)}
              className="border rounded-lg px-3 py-2 w-32"
              min="1"
            />
          </div>
          <button
            onClick={updatePrice}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Update Price
          </button>
        </div>
      </div>

      {/* Dropshippers List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">All Dropshippers ({dropshippers.length})</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
            <p className="text-gray-600">Loading dropshippers...</p>
          </div>
        ) : dropshippers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p>No dropshippers found</p>
          </div>
        ) : (
          <div className="divide-y">
            {dropshippers.map((dropshipper: any) => (
              <button
                key={dropshipper.id}
                onClick={() => setSelectedDropshipper(dropshipper)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      🏷️ {dropshipper.dropshipper_id}
                    </h3>
                    <p className="text-gray-600">{dropshipper.name}</p>
                    <p className="text-sm text-gray-500">{dropshipper.email}</p>
                    <p className="text-sm text-gray-500">{dropshipper.phone}</p>
                    {dropshipper.address && (
                      <p className="text-sm text-gray-500">{dropshipper.address}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      Joined: {new Date(dropshipper.created_at).toLocaleDateString()}
                    </div>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs ${
                      dropshipper.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : dropshipper.status === 'suspended'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {dropshipper.status || 'active'}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}