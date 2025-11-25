
// @ts-nocheck
'use client'
import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cartStore'
import { useAddressBook } from '@/lib/addressStore'
import AddressForm from '@/components/AddressForm'
import { useOrders } from '@/lib/ordersStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Address, Order } from '@/lib/types'
import { CreditCard, Banknote, QrCode, ShieldCheck, Tag, CheckCircle, XCircle } from 'lucide-react'
import Image from 'next/image'
import Script from 'next/script'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/ClerkAuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'
import { referralService } from '@/lib/referralService'
import SpinWheel from '@/components/SpinWheel'
import { COD_CHARGE, getShippingDetails } from '@/lib/utils/shipping'
import ShippingDetails from '@/components/ShippingDetails'
import ProgressOfferBar from '@/components/ProgressOfferBar'

const paymentOptions = [
  { id: 'UPI', icon: QrCode, title: 'UPI / QR Code', description: 'Pay with any UPI app' },
  { id: 'Card', icon: CreditCard, title: 'Credit / Debit Card', description: 'Visa, Mastercard, RuPay & more' },
  { id: 'NetBanking', icon: Banknote, title: 'Net Banking', description: 'All major banks supported' },
  { id: 'COD', icon: Banknote, title: 'Cash on Delivery', description: 'Pay ₹25 on delivery' },
]

export default function Checkout(){
  const { user, loading: authLoading } = useAuth()
  const { items, subtotal, totalDiscount, totalShipping, totalTax, total, clearCartFromDB } = useCart()
  const { addresses, save, setDefault } = useAddressBook()
  const { placeOrder } = useOrders()
  const router = useRouter()
  const { toast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined)
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Coins states
  const [userCoins, setUserCoins] = useState(0)
  const [coinsToUse, setCoinsToUse] = useState(0)
  const [coinsDiscount, setCoinsDiscount] = useState(0)
  const [coinsApplied, setCoinsApplied] = useState(false)
  const [showWelcomeBonus, setShowWelcomeBonus] = useState(false)
  const [showSpinWheel, setShowSpinWheel] = useState(false)
  const [orderCompleted, setOrderCompleted] = useState(false)
  
  // Calculate COD charge if COD is selected
  const codCharge = paymentMethod === 'COD' ? COD_CHARGE : 0
  
  // Calculate final total with coins discount and COD charge
  const finalTotal = total - coinsDiscount + codCharge
  
  // Get shipping details
  const shippingDetails = getShippingDetails(items.map(item => ({
    id: item.id,
    qty: item.qty,
    weight: item.weight,
    name: item.name,
    category: item.category
  })))

  useEffect(() => {
    if (!authLoading && !user) {
        router.replace('/account');
        return;
    }
    if (!authLoading && user && items.length === 0) {
      router.replace('/');
    }
  }, [items, router, user, authLoading]);

  useEffect(() => {
    // Show form automatically if no addresses are saved
    if (addresses.length === 0) {
      setShowForm(true);
    }
  }, [addresses.length]);

  // Auto-select Prepaid (UPI) for dropshippers
  useEffect(() => {
    if (user?.is_dropshipper && paymentMethod === 'Online') {
      setPaymentMethod('UPI'); // Prepaid option
    }
  }, [user?.is_dropshipper]);

  // Fetch user coins - always ensure 5 coins minimum
  useEffect(() => {
    const fetchUserCoins = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/user-data?userId=${user.id}&type=coins`)
          if (response.ok) {
            const coins = await response.json()
            if (coins === null || coins === undefined) {
              // New user - set 5 coins
              setUserCoins(5)
              await fetch('/api/user-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, type: 'coins', data: 5 })
              })
            } else {
              setUserCoins(coins)
            }
          }
        } catch (error) {
          console.error('Error fetching user coins:', error)
          setUserCoins(5)
        }
      }
    }
    fetchUserCoins()
  }, [user])

  // Track wallet balance separately for real-time updates
  const [walletBalance, setWalletBalance] = useState(0);

  // Refresh wallet balance for dropshippers
  useEffect(() => {
    const refreshWalletBalance = async () => {
      if (user?.is_dropshipper && user?.id) {
        try {
          // Fetch latest balance from Supabase
          const response = await fetch(`/api/user/balance?userId=${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setWalletBalance(data.balance || user.dropshipper_earnings || 0);
          } else {
            // Fallback to user object
            setWalletBalance(user.dropshipper_earnings || 0);
          }
        } catch (error) {
          console.error('Error refreshing wallet balance:', error);
          setWalletBalance(user.dropshipper_earnings || 0);
        }
      }
    };
    refreshWalletBalance();
    
    // Refresh every 5 seconds while on checkout page
    const interval = setInterval(refreshWalletBalance, 5000);
    return () => clearInterval(interval);
  }, [user?.id, user?.is_dropshipper, user?.dropshipper_earnings]);

  const handleCoinsChange = (value: number) => {
    const maxCoins = Math.min(userCoins, Math.floor(total))
    const coinsToApply = Math.max(0, Math.min(maxCoins, value))
    setCoinsToUse(coinsToApply)
    // Don't apply discount until user clicks Apply
    if (!coinsApplied) {
      setCoinsDiscount(0)
    }
  }

  const applyCoins = () => {
    setCoinsDiscount(coinsToUse)
    setCoinsApplied(true)
  }

  const removeCoins = () => {
    setCoinsDiscount(0)
    setCoinsApplied(false)
    setCoinsToUse(0)
  }

  const redirectToWhatsApp = (order: Order) => {
    const adminPhoneNumber = "919638883833"; // Your WhatsApp number
    
    const itemsText = order.items.map(item => 
        `- ${item.name} (Qty: ${item.qty}) - ₹${(item.price * item.qty).toLocaleString('en-IN')}`
    ).join('\n');

    const message = `
*New Order Received!* ✨

*Order ID:* #${order.id}
*Customer:* ${order.address.fullName}
*Phone:* ${order.address.phone}

---
*Items:*
${itemsText}

---
*Subtotal:* ₹${subtotal.toLocaleString('en-IN')}
*Shipping:* ₹${totalShipping.toLocaleString('en-IN')}
*Tax:* ₹${totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
*Total:* *₹${order.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}*
*Payment:* ${order.payment}
---

*Shipping Address:*
${order.address.line1}
${order.address.line2 ? order.address.line2 : ''}
${order.address.city}, ${order.address.state} - ${order.address.pincode}
${order.address.landmark ? `Landmark: ${order.address.landmark}` : ''}
    `;

    const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(message.trim())}`;
    
    // Redirect to WhatsApp
    window.location.href = whatsappUrl;
  };

  const handleSuccessfulPayment = async () => {
    console.log('🎉 Processing successful payment...');
    
    try {
      const addr = addresses.find(a => a.default) || addresses[0]
      if (!addr || !user) {
        console.log('❌ Missing address or user data');
        toast({ title: "Error", description: "Missing order information", variant: 'destructive' });
        setIsProcessing(false);
        return;
      }
      
      console.log('📝 Creating order for user:', user.id);
      const newOrder = await placeOrder(
        user.id, 
        items, 
        addr, 
        finalTotal, 
        paymentMethod as any, 
undefined
      )
      
      console.log('✅ Order created:', newOrder.id);
      
      // Register user in admin system
      try {
        await fetch('/api/register-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            email: user.emailAddresses?.[0]?.emailAddress || user.id,
            fullName: user.fullName || 'User',
            phone: user.phoneNumbers?.[0]?.phoneNumber || ''
          })
        })
      } catch (error) {
        console.error('Error registering user:', error)
      }
      
      // Save order to admin system
      try {
        await fetch('/api/place-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            items: items.map(item => ({
              productId: item.id,
              name: item.name,
              price: item.price,
              quantity: item.qty,
              image: item.image
            })),
            total: finalTotal,
            paymentMethod: paymentMethod,
            paymentId: 'razorpay_payment_id',
            shippingAddress: {
              name: addr.fullName,
              phone: addr.phone,
              address: addr.line1,
              city: addr.city,
              state: addr.state,
              pincode: addr.pincode
            }
          })
        })
      } catch (error) {
        console.error('Error saving order to admin:', error)
      }
      
      // Deduct coins if applied
      if (coinsApplied && coinsToUse > 0) {
        console.log('💰 Deducting coins:', coinsToUse);
        try {
          await fetch('/api/user-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              userId: user.id, 
              type: 'coins', 
              data: userCoins - coinsToUse 
            })
          })
        } catch (error) {
          console.error('Error deducting coins:', error)
        }
      }
      
      // Track influencer conversion if referral from influencer
      const influencerRef = sessionStorage.getItem('influencerRef')
      if (influencerRef) {
        console.log('📊 Recording influencer conversion:', influencerRef);
        try {
          await fetch('/api/referrals/record', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              influencerId: influencerRef,
              productId: items[0]?.id, // First product for tracking
              action: 'conversion',
              orderAmount: finalTotal,
              orderId: newOrder.id
            })
          })
          sessionStorage.removeItem('influencerRef')
        } catch (error) {
          console.error('Failed to track influencer conversion:', error)
        }
      }
      
      console.log('🛒 Clearing cart...');
      await clearCartFromDB(user.id);
      
      // Show spin wheel after order completion
      console.log('🎯 Setting spin wheel to show...');
      setOrderCompleted(true)
      setShowSpinWheel(true)
      
      // Force show spin wheel after a small delay
      setTimeout(() => {
        console.log('🎯 Force showing spin wheel...');
        setShowSpinWheel(true)
      }, 500)
      
      console.log('✅ Order process completed successfully');
      toast({ 
        title: "🎉 Order Placed Successfully!", 
        description: `Order #${newOrder.id} confirmed. Try your luck to win coins!` 
      });
      
      // Don't redirect automatically - let spin wheel handle it
      return; // Stop here to show spin wheel
      
    } catch (error) {
      console.error('💥 Order placement failed:', error);
      toast({ 
        title: "Order Failed", 
        description: "Payment successful but order creation failed. Contact support.", 
        variant: 'destructive' 
      });
      setIsProcessing(false);
    }
  }

  const handleOnlinePayment = async () => {
    console.log('🚀 Payment initiated by user');
    setIsProcessing(true);
    
    const addr = addresses.find(a => a.default) || addresses[0]
    if (!addr) {
      console.log('❌ No address found');
      toast({ title: "Error", description: "Please add and select a delivery address.", variant: 'destructive' });
      setShowForm(true);
      setIsProcessing(false);
      return;
    }

    console.log('💰 Payment amount:', finalTotal);
    console.log('📦 Items:', items.length);
    console.log('🏠 Address:', addr.fullName);

    try {
      console.log('🔄 Creating Razorpay order...');
      const res = await fetch('/api/phonepe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalTotal }),
      });

      const order = await res.json();
      console.log('📋 Razorpay response:', order);

      if (!res.ok) {
        console.log('❌ Razorpay order creation failed:', order.error);
        toast({ title: "Payment Error", description: order.error || 'Payment gateway error', variant: 'destructive' });
        setIsProcessing(false);
        return;
      }
      
      const razorpayKeyId = order.key;
      
      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'ShopWave',
        description: 'Online Shopping Payment',
        image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/shopwave-logo.png',
        order_id: order.orderId,
        handler: async function (response: any) {
          console.log('✅ Payment SUCCESS:', response.razorpay_payment_id);
          console.log('🔐 Verifying payment...');
          
          try {
            // Verify payment signature
            const verifyResponse = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            
            const verifyResult = await verifyResponse.json();
            
            if (verifyResult.success) {
              console.log('✅ Payment verified successfully');
              console.log('📝 Creating order in database...');
              handleSuccessfulPayment();
            } else {
              console.log('❌ Payment verification failed:', verifyResult.error);
              toast({ 
                title: "Payment Verification Failed", 
                description: "Payment could not be verified. Contact support if amount was deducted.", 
                variant: 'destructive' 
              });
              setIsProcessing(false);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast({ 
              title: "Verification Error", 
              description: "Unable to verify payment. Contact support if amount was deducted.", 
              variant: 'destructive' 
            });
            setIsProcessing(false);
          }
        },
        prefill: {
          name: addr.fullName,
          contact: addr.phone,
          email: user?.emailAddresses?.[0]?.emailAddress || '',
        },
        notes: {
          address: `${addr.line1}, ${addr.city}`,
          customer_id: user?.id || '',
        },
        theme: {
          color: '#3b82f6'
        },
        modal: {
          ondismiss: function() {
            console.log('❌ Payment modal dismissed by user');
            setIsProcessing(false);
          }
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: 'Pay using Net Banking',
                instruments: [
                  {
                    method: 'netbanking'
                  }
                ]
              },
              utib: {
                name: 'Pay using UPI',
                instruments: [
                  {
                    method: 'upi'
                  }
                ]
              }
            },
            sequence: ['block.utib', 'block.banks'],
            preferences: {
              show_default_blocks: true
            }
          }
        }
      };

      console.log('🎯 Opening Razorpay modal...');
      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        console.log('❌ Payment FAILED:', response.error);
        toast({ 
          title: "Payment Failed", 
          description: response.error.description || 'Payment was not successful', 
          variant: 'destructive' 
        });
        setIsProcessing(false);
      });
      
      rzp.open();

    } catch (error) {
      console.error('💥 Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : "Payment initiation failed";
      toast({ title: "Error", description: errorMessage, variant: 'destructive' });
      setIsProcessing(false);
    }
  }
  
  if (authLoading) {
    return <div className="flex justify-center py-10"><LoadingSpinner /></div>;
  }

  if (items.length === 0 || !user) {
    return null;
  }

  const handleCODOrder = async () => {
    console.log('🚀 COD Order initiated by user');
    setIsProcessing(true);
    
    const addr = addresses.find(a => a.default) || addresses[0]
    if (!addr) {
      console.log('❌ No address found');
      toast({ title: "Error", description: "Please add and select a delivery address.", variant: 'destructive' });
      setShowForm(true);
      setIsProcessing(false);
      return;
    }

    try {
      console.log('📝 Processing COD order for user:', user?.id);

      // 1. Call API First (Handles Wallet Deduction & Supabase Order)
      // This is critical for Dropshippers to ensure funds are deducted BEFORE order is confirmed locally
      const apiResponse = await fetch('/api/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user!.id,
          items: items.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.qty,
            image: item.image
          })),
          total: finalTotal,
          paymentMethod: 'COD',
          paymentId: 'cod_order',
          shippingAddress: {
            name: addr.fullName,
            phone: addr.phone,
            address: addr.line1,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode
          }
        })
      });

      const apiResult = await apiResponse.json();

      if (!apiResult.success) {
        throw new Error(apiResult.error || 'Failed to place order');
      }

      console.log('✅ API Order created:', apiResult.orderId);

      // 2. Create Firebase Order (For UI/Client State)
      // We pass the orderId from API to keep them in sync
      const newOrder = await placeOrder(
        user!.id, 
        items, 
        addr, 
        finalTotal, 
        'COD' as any, 
        apiResult.orderId
      )
      
      console.log('✅ COD Order created:', newOrder.id);
      
      // Register user in admin system (Background)
      try {
        await fetch('/api/register-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user!.id,
            email: user!.emailAddresses?.[0]?.emailAddress || user!.id,
            fullName: user!.fullName || 'User',
            phone: user!.phoneNumbers?.[0]?.phoneNumber || ''
          })
        })
      } catch (error) {
        console.error('Error registering user:', error)
      }
      
      // Deduct coins if applied
      if (coinsApplied && coinsToUse > 0) {
        console.log('💰 Deducting coins:', coinsToUse);
        try {
          await fetch('/api/user-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              userId: user!.id, 
              type: 'coins', 
              data: userCoins - coinsToUse 
            })
          })
        } catch (error) {
          console.error('Error deducting coins:', error)
        }
      }
      
      console.log('🛒 Clearing cart...');
      await clearCartFromDB(user!.id);
      
      // Show spin wheel after order completion
      console.log('🎯 Setting spin wheel to show...');
      setOrderCompleted(true)
      setShowSpinWheel(true)
      
      console.log('✅ COD Order process completed successfully');
      toast({ 
        title: "🎉 Order Placed Successfully!", 
        description: user?.is_dropshipper 
          ? `Order #${newOrder.id} confirmed. Amount deducted from wallet.`
          : `Order #${newOrder.id} confirmed. Pay ₹${finalTotal} on delivery!` 
      });
      
    } catch (error: any) {
      console.error('💥 COD Order placement failed:', error);
      toast({ 
        title: "Order Failed", 
        description: error.message || "COD order creation failed. Please try again.", 
        variant: 'destructive' 
      });
      setIsProcessing(false);
    }
  }

  const handleAction = () => {
    // For dropshippers, always use wallet-based flow (both Prepaid and COD)
    if (user?.is_dropshipper) {
      handleCODOrder(); // This already handles wallet deduction
    } else if (paymentMethod === 'COD') {
      handleCODOrder();
    } else {
      handleOnlinePayment(); // Razorpay for regular customers
    }
  }

  const handleSaveAddress = async (addr: Omit<Address, 'id'>) => {
    if (user) {
      try {
        const addressToSave = editingAddress ? { ...editingAddress, ...addr } : addr;
        await save(user.id, addressToSave);
        setShowForm(false);
        setEditingAddress(undefined);
        toast({
          title: "Address Saved",
          description: "Your delivery address has been saved successfully.",
        });
      } catch (error) {
        console.error('Failed to save address:', error);
        toast({
          title: "Error",
          description: "Failed to save address. Please try again.",
          variant: "destructive"
        });
      }
    }
  }

  const handleSetDefault = async (addressId: string) => {
    if (user) {
        await setDefault(user.id, addressId);
    }
  }

  const handleSpinWin = async (wonCoins: number) => {
    const newCoins = userCoins - (coinsApplied ? coinsToUse : 0) + wonCoins
    setUserCoins(newCoins)
    
    try {
      await fetch('/api/user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user?.id, 
          type: 'coins', 
          data: newCoins 
        })
      })
    } catch (error) {
      console.error('Error updating coins:', error)
    }
  }

  const handleSpinClose = () => {
    setShowSpinWheel(false)
    if (orderCompleted) {
      router.push('/account')
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="grid gap-6 md:grid-cols-[1fr_360px] md:items-start">
        <div className="space-y-4">
          <h1 className="mb-4 text-2xl font-bold">Checkout</h1>
          <ProgressOfferBar />
          <div className="card p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Delivery Address</h2>
              {!showForm && <button onClick={() => { setEditingAddress(undefined); setShowForm(true); }} className="text-sm font-semibold text-brand hover:underline">+ Add New</button>}
            </div>

            {!showForm ? (
              <div className="space-y-3">
                {addresses.map((a) => (
                  <div key={a.id} className={`rounded-lg border p-3 cursor-pointer transition-all ${a.default ? 'border-brand ring-2 ring-brand/20' : 'border-gray-200 hover:border-gray-400'}`} onClick={() => a.id && handleSetDefault(a.id)}>
                    <div className="font-semibold text-sm">{a.fullName} — {a.phone}</div>
                    <div className="text-sm text-gray-600">{a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} - {a.pincode}</div>
                    {a.landmark && <div className="text-xs text-gray-500">Landmark: {a.landmark}</div>}
                    {a.default && <div className="mt-1 text-xs font-bold text-green-600">Default Address</div>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3">
                <AddressForm 
                  action={handleSaveAddress}
                  initial={editingAddress} 
                  onCancel={() => { if(addresses.length > 0) { setShowForm(false); setEditingAddress(undefined); } }} 
                />
              </div>
            )}
          </div>
          

        </div>
        <div className="card sticky top-24 p-4">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <div className="relative h-14 w-14 shrink-0">
                  <Image src={item.image} alt={item.name} fill className="rounded-md object-cover" />
                </div>
                <div className="flex-grow">
                  <div className="line-clamp-1 font-medium">{item.name}</div>
                  {item.customName && (
                    <div className="text-xs text-blue-600 font-medium">Custom: "{item.customName}"</div>
                  )}
                  <div className="text-xs text-gray-500">Qty: {item.qty}</div>
                </div>
                <div className="font-medium">₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal (MRP)</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{totalDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between font-medium">
              <span>Item Total</span>
              <span>₹{(subtotal - totalDiscount).toLocaleString('en-IN')}</span>
            </div>
             <div className="flex justify-between">
                  <span>Shipping ({shippingDetails.totalWeightKg}kg)</span>
                  <span>
                    {user?.is_dropshipper 
                      ? `₹${shippingDetails.shippingCost}` 
                      : (totalShipping > 0 ? `₹${totalShipping}` : 'Free')
                    }
                  </span>
              </div>
              {codCharge > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>COD Charges</span>
                  <span>₹{codCharge}</span>
                </div>
              )}
          </div>
          

          
          <div className="mt-3 flex justify-between font-semibold border-t pt-3">
            <span>Total Amount</span>
            <div className="text-right">
              {coinsDiscount > 0 && (
                <div className="text-sm text-gray-500 line-through">
                  ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              )}
              <span className="text-lg">₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
          
          <div className="mt-4">
              <h3 className="text-md font-semibold mb-2">Payment Method</h3>
              
              {user?.is_dropshipper && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-800 font-medium">Wallet Balance</span>
                    <span className="text-lg font-bold text-blue-900">₹{walletBalance.toLocaleString()}</span>
                  </div>
                  
                  {paymentMethod === 'COD' && walletBalance < finalTotal && (
                    <div className="mt-2 bg-red-50 p-2 rounded border border-red-100">
                        <p className="text-xs text-red-600 font-semibold mb-1">Insufficient Balance!</p>
                        <p className="text-xs text-red-500 mb-2">Required: ₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <Link href="/account" className="block w-full text-center text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors">
                            Recharge Wallet Now
                        </Link>
                    </div>
                  )}

                  {paymentMethod === 'COD' && walletBalance >= finalTotal && (
                    <p className="text-xs text-blue-600 mt-1">
                      Note: For COD orders, the full amount will be deducted from your wallet upfront.
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                  {user?.is_dropshipper ? (
                    // Dropshipper-specific payment options
                    <>
                      <div>
                        <label className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all ${paymentMethod !== 'COD' ? 'border-brand ring-2 ring-brand/20' : 'border-gray-200 hover:border-gray-400'}`}>
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="Prepaid" 
                            checked={paymentMethod !== 'COD'} 
                            onChange={() => setPaymentMethod('UPI')} 
                            className="h-4 w-4 text-brand focus:ring-brand" 
                          />
                          <CreditCard className="h-6 w-6 text-gray-600" />
                          <div>
                            <div className="font-semibold text-sm">Prepaid (Wallet Pay)</div>
                            <div className="text-xs text-gray-500">Pay from wallet, no COD charges</div>
                          </div>
                        </label>
                      </div>
                      <div>
                        <label className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-brand ring-2 ring-brand/20' : 'border-gray-200 hover:border-gray-400'}`}>
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="COD" 
                            checked={paymentMethod === 'COD'} 
                            onChange={() => setPaymentMethod('COD')} 
                            className="h-4 w-4 text-brand focus:ring-brand" 
                          />
                          <Banknote className="h-6 w-6 text-gray-600" />
                          <div>
                            <div className="font-semibold text-sm">COD (Wallet Pay + ₹25)</div>
                            <div className="text-xs text-gray-500">Deduct from wallet, collect cash on delivery</div>
                          </div>
                        </label>
                      </div>
                    </>
                  ) : (
                    // Regular customer payment options
                    paymentOptions.map(opt => (
                      <div key={opt.id}>
                        <label className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all ${paymentMethod === opt.id ? 'border-brand ring-2 ring-brand/20' : 'border-gray-200 hover:border-gray-400'}`}>
                          <input type="radio" name="paymentMethod" value={opt.id} checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} className="h-4 w-4 text-brand focus:ring-brand" />
                          <opt.icon className="h-6 w-6 text-gray-600" />
                          <div>
                            <div className="font-semibold text-sm">{opt.title}</div>
                            <div className="text-xs text-gray-500">{opt.description}</div>
                          </div>
                        </label>
                      </div>
                    ))
                  )}
              </div>
          </div>

          <Button 
              onClick={() => {
                // Check if address exists
                if (addresses.length === 0) {
                  // Show address form
                  setShowForm(true);
                  // Scroll to address section
                  const addressSection = document.querySelector('h2');
                  addressSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  // Show toast
                  toast({
                    title: "📍 Address Required",
                    description: "Please add a delivery address to continue",
                    variant: "destructive"
                  });
                  return;
                }
                // Proceed with payment
                handleAction();
              }} 
              className="mt-4 w-full" 
              disabled={isProcessing}
          >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  {user?.is_dropshipper ? 'Processing Wallet Payment...' : (paymentMethod === 'COD' ? 'Placing Order...' : 'Processing Payment...')}
                </div>
              ) : addresses.length === 0 ? (
                '📍 Add Delivery Address First'
              ) : (
                user?.is_dropshipper
                  ? `Pay from Wallet & Place Order - ₹${finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : (paymentMethod === 'COD' 
                      ? `Place COD Order - ₹${finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : `Pay ₹${finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
              )}
          </Button>
          
          <Button variant="link" asChild className="mt-2 w-full">
            <Link href="/cart">Edit Cart</Link>
          </Button>
          
          <div className="mt-6 space-y-4">
            <ShippingDetails items={items.map(item => ({
              id: item.id,
              qty: item.qty,
              weight: item.weight,
              name: item.name,
              category: item.category
            }))} />
            
            <div className="card flex items-center gap-4 bg-green-50 p-4 border-green-200">
              <ShieldCheck className="h-10 w-10 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800">100% Safe & Secure Payments</h3>
                <p className="text-xs text-green-700 mt-1">
                  Your payment is fully protected. If you don't receive your product, we guarantee a refund.
                </p>
              </div>
            </div>
            
            <div className="card p-4 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Need Help? Call Us!</h3>
              <a href="tel:+919157499884" className="flex items-center gap-2 text-blue-700 font-medium">
                📞 +91 91574 99884
              </a>
              <p className="text-xs text-blue-600 mt-1">Available 9 AM - 9 PM for order assistance</p>
            </div>
            
            <div className="card p-4 bg-orange-50 border-orange-200">
              <h3 className="font-semibold text-orange-800 mb-2">📦 Dropshipping & Wholesale</h3>
              <p className="text-sm text-orange-700 mb-2">
                DROPSHIPPING के लिए या WHOLESALE PAYMENT के लिए ORDER करें
              </p>
              <a href="tel:+919157499884" className="flex items-center gap-2 text-orange-700 font-medium">
                📞 +91 91574 99884
              </a>
              <p className="text-xs text-orange-600 mt-1">Special rates for bulk orders & dropshipping</p>
            </div>
          </div>
        </div>
      </div>
      
      <SpinWheel 
        isOpen={showSpinWheel}
        onClose={handleSpinClose}
        onWin={handleSpinWin}
      />
    </>
  )
}
