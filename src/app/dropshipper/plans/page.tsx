// src/app/dropshipper/plans/page.tsx
'use client'
import useSWR from 'swr'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Check, Store, Globe, Package } from 'lucide-react'
import styles from './page.module.css'

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
    { icon: Check, text: 'No inventory needed' },
    { icon: Check, text: '24/7 customer support' },
  ]

  // Monthly Plan (₹299) - Videos + 30% Ad Share
  if (planId === 'plan_monthly') {
    return [
      ...baseFeatures,
      { icon: Check, text: '📹 Product promotion videos' },
      { icon: Check, text: '💰 30% profit share from ads' },
      { icon: Check, text: 'Priority support' },
    ]
  }

  // Yearly Plan (₹999) - Full Business Solution
  if (planId === 'plan_yearly') {
    return [
      ...baseFeatures,
      { icon: Check, text: '📹 Product promotion videos' },
      { icon: Check, text: '📱 Meta Ads support + 20% profit share' },
      { icon: Check, text: 'Dedicated account manager' },
      { icon: Check, text: 'Custom branding options' },
    ]
  }

  // Premium Plan - Enterprise
  if (planId === 'plan_premium') {
    return [
      ...baseFeatures,
      { icon: Check, text: '📹 Product promotion videos' },
      { icon: Check, text: '📱 Meta Ads support + 20% profit share' },
      { icon: Store, text: 'Shopify store setup' },
      { icon: Globe, text: 'Free subdomain' },
      { icon: Package, text: 'Product listing service' },
      { icon: Check, text: 'Advanced analytics dashboard' },
    ]
  }

  return baseFeatures
}

// Check if plan is popular
const isPopular = (planId: string) => planId === 'plan_monthly'

export default function PublicPlansPage() {
  const { user } = useUser()
  const [processingPlan, setProcessingPlan] = useState<string | null>(null)
  
  const { data, error, isLoading } = useSWR('/api/dropshipper/plans', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
  })

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

  if (isLoading) return <div className={styles.loading}>Loading plans…</div>
  if (error) return <div className={styles.error}>Error loading plans.</div>

  const plans = data?.plans || []

  return (
    <main className={styles.plansPage}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Choose Your Plan</h1>
        <p className={styles.subtitle}>
          Start dropshipping today with exclusive wholesale prices
        </p>
      </section>

      <div className={styles.cardsWrapper}>
        <section className={styles.cardsContainer}>
          {plans.map((plan: DropshipperPlan) => {
            const features = getPlanFeatures(plan.id)
            const popular = isPopular(plan.id)

            return (
              <article 
                key={plan.id} 
                className={`${styles.planCard} ${popular ? styles.popular : ''} ${plan.id === 'plan_premium' ? styles.premium : ''}`}
              >
                {/* Discount Badge - Only show if discount > 0 */}
                {plan.discount > 0 && (
                  <div className={styles.discountBadge}>{plan.discount}% OFF</div>
                )}
                
                {/* Popular Badge */}
                {popular && (
                  <div className={styles.popularBadge}>POPULAR</div>
                )}

                {/* Premium Badge */}
                {plan.id === 'plan_premium' && (
                  <div className={styles.premiumBadge}>⭐ BEST VALUE</div>
                )}

                <div className={styles.planHeader}>
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <p className={styles.planDesc}>{plan.description}</p>
                  <div className={styles.priceSection}>
                    <span className={styles.currency}>₹</span>
                    <span className={styles.price}>{plan.price}</span>
                    <span className={styles.period}>/{plan.interval}</span>
                  </div>
                </div>

                <div className={styles.features}>
                  {features.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <div key={index} className={styles.feature}>
                        <Icon className={styles.checkIcon} size={16} />
                        <span>{feature.text}</span>
                      </div>
                    )
                  })}
                </div>

                <button 
                  className={styles.ctaButton}
                  onClick={() => handleSelectPlan(plan)}
                  disabled={processingPlan === plan.id}
                >
                  {processingPlan === plan.id ? 'Processing...' : 'Get Started'}
                </button>
              </article>
            )
          })}
        </section>
      </div>

    </main>
  )
}
