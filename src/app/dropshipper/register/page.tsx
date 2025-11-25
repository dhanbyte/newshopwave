'use client'
import { useAuth } from '@/context/ClerkAuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import DropshipperRegistrationModal from '@/components/DropshipperRegistrationModal'
import { useToast } from '@/hooks/use-toast'
import Script from 'next/script'

export default function DropshipperRegisterPage() {
  const { user, authLoading, refreshUserData } = useAuth()
  const router = useRouter()
  const [showModal, setShowModal] = useState(true) // Start with true
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) return

    // If not logged in, redirect to account page (which will show login)
    if (!user) {
      router.replace('/account')
      return
    }

    // If already a dropshipper, redirect to account
    if (user.is_dropshipper) {
      router.replace('/account')
      return
    }

    // If logged in and not a dropshipper, redirect to plans page
    router.replace('/dropshipper/plans')
  }, [user, authLoading, router])

  const handleSubmit = async (formData: any) => {
    setLoading(true)
    try {
      // Step 1: Get dropshipper price
      const priceRes = await fetch('/api/admin/dropshipper-price')
      const priceData = await priceRes.json()
      const amount = priceData.success ? priceData.price : 49

      // Step 2: Create Razorpay order
      const orderRes = await fetch('/api/phonepe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      })
      const order = await orderRes.json()

      if (!order.success) {
        throw new Error('Failed to create payment order')
      }

      // Step 3: Open Razorpay payment
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: 'ShopWave Dropshipper',
        description: 'Dropshipper Registration Fee',
        order_id: order.orderId,
        handler: async function (response: any) {
          try {
            // Step 4: Verify payment
            const verifyRes = await fetch('/api/wallet/recharge/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user?.id,
                amount: amount
              })
            })
            const verifyData = await verifyRes.json()

            if (!verifyData.success) {
              throw new Error('Payment verification failed')
            }

            // Step 5: Payment successful, now register as dropshipper
            const registrationRes = await fetch('/api/dropshipper/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user?.id,
                email: user?.email,
                paymentId: response.razorpay_payment_id,
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                accountNumber: formData.accountNumber,
                ifsc: formData.ifsc,
                bankName: formData.bankName,
                photo: null, // We'll handle photo upload separately if needed
                aadharPhoto: null,
                aadharNumber: null
              })
            })

            const registrationData = await registrationRes.json()

            if (registrationData.success) {
              toast({
                title: 'Registration Successful!',
                description: `Welcome Dropshipper! Your ID: ${registrationData.dropshipperId}`,
              })

              // Refresh user data
              await refreshUserData()

              // Redirect to account
              setTimeout(() => router.push('/account'), 1500)
            } else {
              throw new Error(registrationData.error || 'Registration failed')
            }
          } catch (err: any) {
            console.error('Registration error:', err)
            toast({
              title: 'Registration Failed',
              description: err.message || 'Something went wrong after payment',
              variant: 'destructive',
            })
          } finally {
            setLoading(false)
          }
        },
        prefill: {
          name: user?.fullName,
          email: user?.email,
          contact: formData.phone
        },
        theme: { color: '#3b82f6' }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
      
      rzp.on('payment.failed', function (response: any) {
        toast({
          title: 'Payment Failed',
          description: response.error.description,
          variant: 'destructive',
        })
        setLoading(false)
      })

    } catch (error: any) {
      console.error('Payment/Registration error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      })
      setLoading(false)
    }
  }

  // Show loading while checking auth
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Checking login status...</p>
        </div>
      </div>
    )
  }

  // If user is already a dropshipper, show message
  if (user.is_dropshipper) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">You're already a Dropshipper!</h2>
          <p className="text-gray-600 mb-4">Redirecting to your account...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="min-h-screen bg-gray-50 py-12">
        <DropshipperRegistrationModal 
          isOpen={showModal}
          onClose={() => router.push('/account')}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </>
  )
}
