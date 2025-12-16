'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import useSWR from 'swr'
import { 
  Play, TrendingUp, Package, DollarSign, Users, Shield, Zap, 
  CheckCircle, MessageCircle, Phone, Check, Store, Globe, 
  PlayCircle, ArrowRight, Sparkles, Loader2, Send 
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

interface DropshipperPlan {
  id: string
  name: string
  interval: 'weekly' | 'monthly' | 'yearly'
  price: number
  description: string
  discount: number
}

// SWR fetcher function
const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

// Get features based on plan
const getPlanFeatures = (planId: string) => {
  const baseFeatures = [
    { icon: Check, text: '🎁 50-70% discount on all products' },
    { icon: Check, text: 'Wholesale pricing access' },
    { icon: Check, text: 'Zero Inventory Risk' },
    { icon: Check, text: '24/7 customer support' },
  ]

  if (planId === 'plan_starter') {
    return [
      ...baseFeatures,
      { icon: Check, text: '📣 Pay Ads Charge After Earning' },
      { icon: Check, text: '💰 25% Ads Commission on Profit' },
      { icon: Check, text: '🛡️ No Upfront Ads Cost (100% Safe)' },
    ]
  }

  if (planId === 'plan_scaling') {
    return [
      ...baseFeatures,
      { icon: Check, text: '📣 Pay Ads Charge After Earning' },
      { icon: Check, text: '🔥 Lower Ads Commission (18% only)' },
      { icon: Check, text: '🚀 Safe Scaling Framework' },
      { icon: Check, text: '⚡ Priority Order Processing' },
    ]
  }

  if (planId === 'plan_dominance') {
    return [
      ...baseFeatures,
      { icon: Check, text: '📣 Pay Ads Charge After Earning' },
      { icon: Check, text: '🔥 Lower Ads Commission (18% only)' },
      { icon: Check, text: '💎 Dedicated Account Manager' },
      { icon: Check, text: '📊 Advanced Profit Analytics' },
      { icon: Store, text: 'Premium Store Branding' },
    ]
  }

  return baseFeatures
}

const isPopular = (planId: string) => planId === 'plan_scaling'

export default function DropshippingSection() {
  const { user } = useUser()
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=I-U1NwHyGGI')
  const [processingPlan, setProcessingPlan] = useState<string | null>(null)
  const [showLeadForm, setShowLeadForm] = useState(false)
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

  const { data, error: plansError, isLoading } = useSWR('/api/dropshipper/plans', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
  })

  useEffect(() => {
    fetchVideoUrl()
  }, [])

  const fetchVideoUrl = async () => {
    try {
      const res = await fetch('/api/public/settings?key=how_it_works_video')
      const data = await res.json()
      if (data.success && data.value) {
        setVideoUrl(data.value)
      }
    } catch (err) {
      console.error('Error fetching video url:', err)
    }
  }

  const platforms = ['Shopify', 'Amazon', 'Flipkart', 'Meesho', 'Instagram', 'WhatsApp']

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

  const handleSelectPlan = async (plan: DropshipperPlan) => {
    if (!user) {
      alert('Please sign in to purchase a plan')
      window.location.href = '/sign-in'
      return
    }

    setProcessingPlan(plan.id)

    try {
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        alert('Failed to load payment gateway. Please try again.')
        setProcessingPlan(null)
        return
      }

      const orderResponse = await fetch('/api/payment/create-dropshipper-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          amount: plan.price,
          interval: plan.interval,
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Dropshipper Subscription',
        description: `${plan.name} - ${plan.description}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          const verifyResponse = await fetch('/api/payment/verify-dropshipper-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: plan.id,
              interval: plan.interval,
            }),
          })

          const verifyData = await verifyResponse.json()

          if (verifyData.success) {
            alert('🎉 Payment successful! Your dropshipper plan is now active!')
            window.location.href = '/account'
          } else {
            alert(`⚠️ Payment verification failed: ${verifyData.error || 'Please contact support.'}`)
          }
        },
        prefill: {
          name: user.fullName || '',
          email: user.primaryEmailAddress?.emailAddress || '',
        },
        theme: {
          color: '#1976d2',
        },
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      console.error('Payment error:', error)
      alert(error.message || 'Payment failed. Please try again.')
    } finally {
      setProcessingPlan(null)
    }
  }

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Up to 40% Discount',
      description: 'Get exclusive dropshipper pricing on all products'
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: 'No Inventory Risk',
      description: 'We handle storage and shipping for you'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'High Profit Margins',
      description: 'Earn ₹500-₹2000 per sale easily'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Dedicated Support',
      description: '24/7 support for all your queries'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Quality Guaranteed',
      description: 'All products are quality checked'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Fast Processing',
      description: 'Quick order processing and delivery'
    }
  ]

  const plans = data?.plans || []

  return (
    <section className="bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white py-16">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 text-center mb-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          🚀 Become a <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Dropshipper</span>
        </h2>
        <p className="text-xl md:text-2xl text-blue-200 mb-6">
          Start your own business with LOW investment. Earn up to ₹50,000/month!
        </p>
        
        <button
          onClick={() => window.open(videoUrl, '_blank')}
          className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 mb-4"
        >
          <Play className="w-6 h-6" fill="white" />
          <span>🎥 Watch How It Works</span>
        </button>
      </div>

      {/* Product Examples */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <h3 className="text-3xl font-bold text-center mb-4">💰 See Your Profit Potential</h3>
        <p className="text-center text-blue-200 mb-12 text-lg">
          We give you wholesale prices (up to 40% OFF). You sell at market price and keep the profit!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product 1 */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="relative h-64 bg-gray-50 p-4 flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60" alt="Premium Sneakers" className="object-contain h-full drop-shadow-lg" />
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full animate-bounce">
                HOT SELLER
              </span>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Sport Sneakers</h3>
              <div className="flex gap-2 mb-4 text-xs font-semibold text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">Shoe</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Fashion</span>
              </div>

              <div className="flex justify-between items-center mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-gray-500">Dropship Price</p>
                  <p className="text-2xl font-black text-blue-600">₹799</p>
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-gray-500">Market Price</p>
                  <p className="text-2xl font-black text-gray-400 line-through decoration-red-500 decoration-2">₹1,999</p>
                </div>
              </div>

              <div className="bg-green-600 rounded-xl p-4 text-white text-center mb-4 shadow-lg shadow-green-200">
                 <p className="text-xs font-bold opacity-90 mb-1 tracking-wider uppercase">Your Net Profit</p>
                 <p className="text-3xl font-black">₹1,200</p>
                 <p className="text-[10px] mt-1 opacity-80">Per Sale • Keep 100%</p>
              </div>
            </div>
          </div>

          {/* Product 2 */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="relative h-64 bg-gray-50 p-4 flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60" alt="Wireless Headphones" className="object-contain h-full drop-shadow-lg" />
              <span className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-black px-3 py-1 rounded-full">
                BEST TECH
              </span>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Noise Cancelling Headphones</h3>
              <div className="flex gap-2 mb-4 text-xs font-semibold text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">Electronics</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Audio</span>
              </div>

              <div className="flex justify-between items-center mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-gray-500">Dropship Price</p>
                  <p className="text-2xl font-black text-blue-600">₹1,200</p>
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-gray-500">Market Price</p>
                  <p className="text-2xl font-black text-gray-400 line-through decoration-red-500 decoration-2">₹3,499</p>
                </div>
              </div>

              <div className="bg-green-600 rounded-xl p-4 text-white text-center mb-4 shadow-lg shadow-green-200">
                 <p className="text-xs font-bold opacity-90 mb-1 tracking-wider uppercase">Your Net Profit</p>
                 <p className="text-3xl font-black">₹2,299</p>
                 <p className="text-[10px] mt-1 opacity-80">Per Sale • Keep 100%</p>
              </div>
            </div>
          </div>

          {/* Product 3 */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="relative h-64 bg-gray-50 p-4 flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60" alt="Smart Watch" className="object-contain h-full drop-shadow-lg" />
              <span className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse">
                TRENDING
              </span>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fitness Smart Watch Series 5</h3>
              <div className="flex gap-2 mb-4 text-xs font-semibold text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">Gadget</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Fitness</span>
              </div>

              <div className="flex justify-between items-center mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-gray-500">Dropship Price</p>
                  <p className="text-2xl font-black text-blue-600">₹450</p>
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-gray-500">Market Price</p>
                  <p className="text-2xl font-black text-gray-400 line-through decoration-red-500 decoration-2">₹1,499</p>
                </div>
              </div>

              <div className="bg-green-600 rounded-xl p-4 text-white text-center mb-4 shadow-lg shadow-green-200">
                 <p className="text-xs font-bold opacity-90 mb-1 tracking-wider uppercase">Your Net Profit</p>
                 <p className="text-3xl font-black">₹1,049</p>
                 <p className="text-[10px] mt-1 opacity-80">Per Sale • Keep 100%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profit Calculator */}
        <div className="mt-12 bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20">
          <h3 className="text-2xl font-bold text-center mb-8">📊 Monthly Earning Potential</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/95 rounded-2xl p-6 text-center text-gray-900 hover:scale-105 transition-transform">
              <div className="text-5xl font-black mb-2">5</div>
              <div className="text-sm opacity-70 mb-3">Sales/Day</div>
              <div className="text-2xl font-bold text-green-600">= ₹15,000/month</div>
            </div>
            <div className="bg-white/95 rounded-2xl p-6 text-center text-gray-900 hover:scale-105 transition-transform">
              <div className="text-5xl font-black mb-2">10</div>
              <div className="text-sm opacity-70 mb-3">Sales/Day</div>
              <div className="text-2xl font-bold text-green-600">= ₹30,000/month</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-center text-white hover:scale-105 transition-transform relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                🔥 Most Popular
              </div>
              <div className="text-5xl font-black mb-2">15</div>
              <div className="text-sm opacity-90 mb-3">Sales/Day</div>
              <div className="text-2xl font-bold">= ₹45,000/month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <h3 className="text-3xl font-bold text-center mb-12">✨ Why Join Our Dropshipping Program?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 hover:scale-105 transition-all">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white">
                {benefit.icon}
              </div>
              <h4 className="text-xl font-bold mb-2">{benefit.title}</h4>
              <p className="text-blue-200">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <h3 className="text-3xl font-bold text-center mb-12">🎯 How It Works - Simple 4 Steps</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: '1', title: 'Choose Your Plan', desc: 'Select a subscription plan that fits your business goals' },
            { num: '2', title: 'Get Access', desc: 'Instant access to dropshipper prices and products' },
            { num: '3', title: 'Start Selling', desc: 'Share products with customers and take orders' },
            { num: '4', title: 'Earn Profit', desc: 'We ship, you earn! Keep 100% of your profit margin' }
          ].map((step, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-3xl font-black shadow-lg">
                {step.num}
              </div>
              <h4 className="text-xl font-bold mb-2">{step.title}</h4>
              <p className="text-blue-200">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <h3 className="text-3xl font-bold text-center mb-12">💬 What Our Dropshippers Say</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { stars: '⭐⭐⭐⭐⭐', text: "I'm earning ₹35,000/month with just 2-3 hours of work daily. Best decision ever!", author: '- Rahul S., Mumbai' },
            { stars: '⭐⭐⭐⭐⭐', text: 'Low investment, high returns. The support team is amazing and always helpful.', author: '- Priya K., Delhi' },
            { stars: '⭐⭐⭐⭐⭐', text: 'Started 3 months ago, now making ₹50,000/month. Highly recommended!', author: '- Amit P., Bangalore' }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 text-gray-900 shadow-xl">
              <div className="text-2xl mb-3">{testimonial.stars}</div>
              <p className="text-lg italic mb-4 leading-relaxed">{testimonial.text}</p>
              <div className="font-bold text-gray-600">{testimonial.author}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Form Section */}
      <div className="max-w-3xl mx-auto px-4 mb-16">
        <button
          onClick={() => setShowLeadForm(!showLeadForm)}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-6 rounded-2xl font-bold text-xl transition-all shadow-lg hover:shadow-xl mb-6"
        >
          {showLeadForm ? '✕ Close Form' : '📝 Apply for Dropshipping Now'}
        </button>

        {showLeadForm && (
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            {submitted ? (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-green-800 mb-3">Request Submitted!</h3>
                <p className="text-green-700 text-lg mb-6">
                  Thank you for your interest. Our team will contact you shortly to onboard you as a dropshipper.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-green-600 hover:text-green-800 font-bold"
                >
                  Submit another response
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Join as a Seller</h2>
                  <p className="text-gray-600">Fill the form below to get approved for our dropshipping program</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                        placeholder="10-digit number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Where do you want to sell? (Select multiple)</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {platforms.map(platform => (
                        <label 
                          key={platform}
                          className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
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
                          <span className="ml-2 text-sm text-gray-700 font-semibold">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">Target Market</label>
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
                            <span className="ml-2 text-gray-700 font-medium">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Experience Level</label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
                      >
                        <option value="Beginner">Beginner (0-1 years)</option>
                        <option value="Intermediate">Intermediate (1-3 years)</option>
                        <option value="Expert">Expert (3+ years)</option>
                      </select>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors shadow-lg"
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
              </>
            )}
          </div>
        )}
      </div>

      {/* SHOPWAVE ADS BOOSTER SYSTEM */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-900 p-8 md:p-12 rounded-3xl shadow-2xl border border-indigo-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500 mb-4 text-xs font-black px-4 py-1.5 uppercase tracking-widest">
                Revolutionary
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
                SHOPWAVE ADS BOOSTER SYSTEM
              </h2>
              <p className="text-xl md:text-2xl text-blue-200 font-medium italic">
                "Pay Ads Charge After You Earn — <span className="text-white font-bold underline decoration-yellow-400 decoration-4 underline-offset-4">No Risk At All.</span>"
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl text-white">For ₹999 Plan</CardTitle>
                    <Badge className="bg-blue-600 hover:bg-blue-700 text-white">Beginner</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-white">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 rounded-full p-1 mt-0.5">
                      <Check size={14} strokeWidth={4} />
                    </div>
                    <span>Ads Commission = <span className="font-bold text-yellow-300 text-lg">25% of PROFIT</span></span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 rounded-full p-1 mt-0.5">
                      <Check size={14} strokeWidth={4} />
                    </div>
                    <span>Only on <b>Delivered</b> Orders</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 rounded-full p-1 mt-0.5">
                      <Check size={14} strokeWidth={4} />
                    </div>
                    <span>No Upfront Ads Cost</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 border-white/20 shadow-xl relative overflow-hidden md:scale-105">
                <Badge className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 hover:bg-yellow-500 font-bold">
                  BEST VALUE
                </Badge>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl text-white">For ₹1,999 & ₹2,999</CardTitle>
                    <Badge className="bg-purple-900/50 hover:bg-purple-900 text-white">Pro</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-white">
                  <div className="flex items-start gap-3">
                    <div className="bg-white text-purple-700 rounded-full p-1 mt-0.5">
                      <Check size={14} strokeWidth={4} />
                    </div>
                    <span>Ads Commission = <span className="font-bold text-yellow-300 text-lg">18% of PROFIT</span></span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-white text-purple-700 rounded-full p-1 mt-0.5">
                      <Check size={14} strokeWidth={4} />
                    </div>
                    <span>Only on <b>Delivered</b> Orders</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-white text-purple-700 rounded-full p-1 mt-0.5">
                      <Check size={14} strokeWidth={4} />
                    </div>
                    <span>Safe Scaling & High Volume</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/30 border-white/10">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2 text-white">
                  <Shield className="text-green-400" />
                  Why It's 100% Safe?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-white">
                  <div className="p-4 bg-white/5 rounded-xl text-center hover:bg-white/10 transition-colors">
                    <div className="font-bold text-red-300 text-lg mb-2">No Sale?</div>
                    <div className="text-sm">You pay ₹0. No hidden charges.</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl text-center hover:bg-white/10 transition-colors">
                    <div className="font-bold text-blue-300 text-lg mb-2">We Do The Ads</div>
                    <div className="text-sm">Expert team handles meta ads completely.</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl text-center hover:bg-white/10 transition-colors">
                    <div className="font-bold text-green-300 text-lg mb-2">Profit Only</div>
                    <div className="text-sm">Commission only on delivered profit.</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl text-center hover:bg-white/10 transition-colors border border-green-500/30">
                    <div className="font-bold text-yellow-400 text-lg mb-2">100% Safety</div>
                    <div className="text-sm">No Sales → No Payment.</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-4xl font-bold text-center mb-4">Choose Your <span className="text-blue-400">Dropshipping Plan</span></h2>
        <p className="text-center text-blue-200 mb-12 text-lg">Start your journey with Zero Inventory & High Profits!</p>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-blue-200">Loading plans...</p>
          </div>
        ) : plansError ? (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">Error loading plans. Please try again.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan: DropshipperPlan) => {
              const features = getPlanFeatures(plan.id)
              const popular = isPopular(plan.id)
              const isPremium = plan.id === 'plan_dominance'

              return (
                <Card 
                  key={plan.id} 
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                    popular ? 'border-blue-500 border-2 shadow-xl scale-105' : 
                    isPremium ? 'border-orange-400 border-2 bg-gradient-to-br from-orange-50 to-yellow-50' : 
                    'border-gray-200'
                  }`}
                >
                  {plan.discount > 0 && (
                    <Badge className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm px-3 py-1">
                      {plan.discount}% OFF
                    </Badge>
                  )}
                  
                  {popular && (
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-sm px-3 py-1">
                      BEST CHOICE
                    </Badge>
                  )}

                  {isPremium && (
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-sm px-3 py-1">
                      👑 ULTIMATE
                    </Badge>
                  )}

                  <CardHeader className="text-center pb-4 pt-16">
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {plan.description}
                    </CardDescription>
                    <div className="flex items-baseline justify-center gap-1 mt-4">
                      <span className="text-2xl font-semibold text-gray-700">₹</span>
                      <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                      <span className="text-sm text-gray-600 ml-1">/Lifetime Access</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pb-6">
                    {features.map((feature, index) => {
                      const Icon = feature.icon
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <Icon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature.text}</span>
                        </div>
                      )
                    })}
                  </CardContent>

                  <CardFooter>
                    <Button 
                      className={`w-full font-semibold text-base py-6 transition-all ${
                        popular ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' :
                        isPremium ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700' :
                        'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black'
                      }`}
                      onClick={() => handleSelectPlan(plan)}
                      disabled={processingPlan === plan.id}
                    >
                      {processingPlan === plan.id ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          Get {plan.name} Plan
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Customer Care */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20">
          <h3 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <Phone className="w-6 h-6 text-green-400" />
            Need Help? Contact Customer Care
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://wa.me/919157499884"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp: +91 9157499884</span>
            </a>
            <a
              href="https://wa.me/916392348674"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp: +91 6392 348 674</span>
            </a>
          </div>
          <p className="text-sm text-blue-200 mt-4 text-center">
            Our team is available 24/7 to assist you with any queries
          </p>
        </div>
      </div>
    </section>
  )
}