'use client'

import { useState } from 'react'

export default function SimpleAddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const vendorData = localStorage.getItem('vendorData')
    if (!vendorData) {
      alert('Please login first')
      window.location.href = '/vendor/login'
      return
    }

    const vendor = JSON.parse(vendorData)
    
    try {
      const response = await fetch('/api/vendor/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: vendor.id || vendor._id,
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          category: 'Tech',
          subcategory: 'Accessories',
          status: 'pending'
        })
      })

      const result = await response.json()
      if (result.success) {
        alert('Product added successfully!')
        setFormData({ name: '', price: '', description: '' })
      } else {
        alert('Failed to add product: ' + result.message)
      }
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Simple Add Product</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Product Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Price</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full border rounded px-3 py-2 h-24"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
      
      <div className="mt-6">
        <a href="/vendor/dashboard" className="text-blue-600 hover:underline">
          Back to Dashboard
        </a>
      </div>
    </div>
  )
}