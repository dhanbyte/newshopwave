'use client'

import { useState } from 'react'
import { Check, Loader2, Send } from 'lucide-react'

export default function DropshipperLeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    selling_platforms: [] as string[],
    market: 'National',
    experience: 'Beginner'
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const platforms = [
    'Shopify',
    'Amazon',
    'Flipkart',
    'Meesho',
    'Instagram',
    'WhatsApp'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (platform: string) => {
    setFormData(prev => {
      const current = prev.selling_platforms
      if (current.includes(platform)) {
        return { ...prev, selling_platforms: current.filter(p => p !== platform) }
      } else {
        return { ...prev, selling_platforms: [...current, platform] }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.success) {
        setSubmitted(true)
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Failed to submit form')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 p-8 rounded-xl text-center border border-green-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">Request Submitted!</h3>
        <p className="text-green-700">
          Thank you for your interest. Our team will contact you shortly to onboard you as a dropshipper.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="mt-6 text-green-600 hover:text-green-800 font-medium"
        >
          Submit another response
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Join as a Seller</h2>
        <p className="text-gray-600 mt-2">Fill the form below to get approved for our dropshipping program</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
              placeholder="10-digit number"
            />
          </div>
        </div>

        {/* Selling Platforms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Where do you want to sell? (Select multiple)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {platforms.map(platform => (
              <label 
                key={platform}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                  formData.selling_platforms.includes(platform)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  checked={formData.selling_platforms.includes(platform)}
                  onChange={() => handleCheckboxChange(platform)}
                />
                <span className="ml-2 text-sm text-gray-700 font-medium">{platform}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Market & Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Target Market</label>
            <div className="space-y-3">
              {['National', 'International', 'Both'].map(option => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="market"
                    value={option}
                    checked={formData.market === option}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
            >
              <option value="Beginner">Beginner (0-1 years)</option>
              <option value="Intermediate">Intermediate (1-3 years)</option>
              <option value="Expert">Expert (3+ years)</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors shadow-lg shadow-blue-200"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Application
            </>
          )}
        </button>
      </form>
    </div>
  )
}
