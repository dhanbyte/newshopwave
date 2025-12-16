// src/app/dropshipper/plans/page.tsx
'use client'
import useSWR from 'swr'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Check, Store, Globe, Package, PlayCircle, Shield, TrendingUp, Zap, ArrowRight, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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

  // Starter Plan (₹999)
  if (planId === 'plan_starter') {
    return [
      ...baseFeatures,
      { icon: Check, text: '📣 Pay Ads Charge After Earning' },
      { icon: Check, text: '💰 25% Ads Commission on Profit' },
      { icon: Check, text: '🛡️ No Upfront Ads Cost (100% Safe)' },
    ]
  }

  // Scaling Plan (₹1,999)
  if (planId === 'plan_scaling') {
    return [
      ...baseFeatures,
      { icon: Check, text: '📣 Pay Ads Charge After Earning' },
      { icon: Check, text: '🔥 Lower Ads Commission (18% only)' },
      { icon: Check, text: '🚀 Safe Scaling Framework' },
      { icon: Check, text: '⚡ Priority Order Processing' },
    ]
  }

  // Dominance Plan (₹2,999)
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

// Check if plan is popular
const isPopular = (planId: string) => planId === 'plan_scaling'

export default function PublicPlansPage() {
  const { user } = useUser()
  const [processingPlan, setProcessingPlan] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=I-U1NwHyGGI')
  
  const { data, error, isLoading } = useSWR('/api/dropshipper/plans', fetcher, {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plans...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error loading plans. Please try again.</p>
        </div>
      </div>
    )
  }

  const plans = data?.plans || []

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
          Choose Your <span className="text-blue-600">Dropshipping Plan</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
          Start your journey with Zero Inventory & High Profits!
        </p>
        
        {/* Watch Video Button */}
        <Button
          onClick={() => window.open(videoUrl, '_blank')}
          variant="outline"
          size="lg"
          className="group bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-400 transition-all"
        >
          <PlayCircle className="w-5 h-5 mr-2 text-blue-600 group-hover:scale-110 transition-transform" />
          <span className="font-semibold">Watch How It Works</span>
        </Button>
      </section>

      {/* SHOPWAVE ADS BOOSTER SYSTEM SECTION */}
      <section className="max-w-6xl mx-auto px-4 mb-12">
        <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-900 text-white p-8 md:p-12 rounded-3xl shadow-2xl border border-indigo-500/30 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500 mb-4 text-xs font-black px-4 py-1.5 uppercase tracking-widest">
                Revolutionary
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-white">
                SHOPWAVE ADS BOOSTER SYSTEM
              </h2>
              <p className="text-xl md:text-2xl text-blue-200 font-medium italic">
                "Pay Ads Charge After You Earn — <span className="text-white font-bold underline decoration-yellow-400 decoration-4 underline-offset-4">No Risk At All.</span>"
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {/* Plan 999 Breakdown */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl text-white">For ₹999 Plan</CardTitle>
                    <Badge className="bg-blue-600 hover:bg-blue-700 text-white">Beginner</Badge>
                  </div>
                  <div className="h-px bg-white/20 w-full"></div>
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
                  <div className="flex items-center gap-3 text-sm text-blue-200 mt-4 bg-blue-900/40 p-3 rounded-lg">
                    <Globe size={18} />
                    <span>Perfect for getting your first sales!</span>
                  </div>
                </CardContent>
              </Card>

              {/* Plan 1999 & 2999 Breakdown */}
              <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 border-white/20 shadow-xl relative overflow-hidden md:scale-105">
                <Badge className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 hover:bg-yellow-500 font-bold">
                  BEST VALUE
                </Badge>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl text-white">For ₹1,999 & ₹2,999</CardTitle>
                    <Badge className="bg-purple-900/50 hover:bg-purple-900 text-white">Pro</Badge>
                  </div>
                  <div className="h-px bg-white/20 w-full"></div>
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
                  <div className="flex items-center gap-3 text-sm text-purple-200 mt-4 bg-purple-900/40 p-3 rounded-lg">
                    <Package size={18} />
                    <span>Maximize your earnings!</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Safety Guarantee */}
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
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
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
                {/* Discount Badge */}
                {plan.discount > 0 && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-sm px-3 py-1">
                    {plan.discount}% OFF
                  </Badge>
                )}
                
                {/* Popular Badge */}
                {popular && (
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-sm px-3 py-1">
                    BEST CHOICE
                  </Badge>
                )}

                {/* Premium Badge */}
                {isPremium && (
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm px-3 py-1">
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
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-semibold">Limited Time Offer</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            🚀 Become a Dropshipper
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            Start earning with wholesale prices - Just ₹49!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-300" />
              <div className="text-left">
                <div className="text-sm text-blue-200">Average Profit</div>
                <div className="text-xl font-bold text-white">₹500-₹2000 per sale</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl">
              <Zap className="w-6 h-6 text-yellow-300" />
              <div className="text-left">
                <div className="text-sm text-blue-200">Active Dropshippers</div>
                <div className="text-xl font-bold text-white">10,000+</div>
              </div>
            </div>
          </div>

          <Button 
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            onClick={() => window.location.href = '/dropshipper/register'}
          >
            Start Your Journey Now
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </section>
    </main>
  )
}