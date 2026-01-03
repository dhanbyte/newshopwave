
// @ts-nocheck
'use client'
import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cartStore'
import { useAddressBook } from '@/lib/addressStore'
import AddressForm from '@/components/AddressForm'
import { useOrders } from '@/lib/ordersStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import TrustBadges from '@/components/TrustBadges';
import DeliveryEstimate from '@/components/DeliveryEstimate';
import type { Address, Order } from '@/lib/types'
import { CreditCard, Banknote, QrCode, ShieldCheck, Tag, CheckCircle, XCircle, Video, ArrowRight, Lock, Truck, Zap, MessageCircle, MapPin, ChevronRight, Gift } from 'lucide-react'
import Image from 'next/image'
import Script from 'next/script'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/ClerkAuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'
import SpinWheel from '@/components/SpinWheel'
import { getShippingDetails } from '@/lib/utils/shipping'
import ShippingDetails from '@/components/ShippingDetails'
import ProgressOfferBar from '@/components/ProgressOfferBar'
import { GiftGallery, GIFTS } from '@/components/GiftCard'

const paymentOptions = [
  { id: 'UPI', icon: QrCode, title: 'UPI / QR Code', description: 'Pay with any UPI app' },
  { id: 'Card', icon: CreditCard, title: 'Credit / Debit Card', description: 'Visa, Mastercard, RuPay & more' },
  { id: 'NetBanking', icon: Banknote, title: 'Net Banking', description: 'All major banks supported' },
]

export default function Checkout(){
  const { user, loading: authLoading } = useAuth()
  const { items, subtotal, totalDiscount, totalShipping, total, clearCartFromDB, init: initCart } = useCart()
  const { addresses, save, setDefault, init: initAddress } = useAddressBook()
  const { placeOrder } = useOrders()
  const router = useRouter()
  const { toast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined)
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Persisted Guest States
  const [isGuest, setIsGuest] = useState(false)
  const [guestPhone, setGuestPhone] = useState('')
  const [showGuestOptions, setShowGuestOptions] = useState(false)
  
  // Coins states
  const [userCoins, setUserCoins] = useState(0)
  const [coinsToUse, setCoinsToUse] = useState(0)
  const [coinsDiscount, setCoinsDiscount] = useState(0)
  const [coinsApplied, setCoinsApplied] = useState(false)
  const [showSpinWheel, setShowSpinWheel] = useState(false)
  const [orderCompleted, setOrderCompleted] = useState(false)
  const [isSyncing, setIsSyncing] = useState(true)
  
  // Dropshipper specific states
  const [sellingPrice, setSellingPrice] = useState<number>(0)
  const [dropshipperOrderType, setDropshipperOrderType] = useState<'prepaid' | 'cod'>('cod')
  const [confirmationType, setConfirmationType] = useState<'direct' | 'call'>('direct')
  const [orderNote, setOrderNote] = useState('')
  const [phoneError, setPhoneError] = useState('')
  
  const finalTotal = total - coinsDiscount

  // Effect to load guest status from session storage
  useEffect(() => {
    const savedIsGuest = localStorage.getItem('isGuest') === 'true';
    const savedGuestPhone = localStorage.getItem('guestPhone') || '';
    if (savedIsGuest) {
      setIsGuest(true);
      setGuestPhone(savedGuestPhone);
    }
    if (savedIsGuest) {
      setIsGuest(true);
      setGuestPhone(savedGuestPhone);
    }
  }, []);

  // Init stores
  useEffect(() => {
    if (user?.id) {
      initCart(user.id);
      initAddress(user.id);
    } else if (isGuest) {
      initCart('guest');
      initAddress('guest');
    }
  }, [user?.id, isGuest, initCart, initAddress]);
  
  useEffect(() => {
    if (user?.is_dropshipper && sellingPrice === 0 && finalTotal > 0) {
      setSellingPrice(Math.ceil(finalTotal + 100));
    }
  }, [user?.is_dropshipper, finalTotal]);
  
  useEffect(() => {
    if (!authLoading && !user && !isGuest && !orderCompleted) {
        setShowGuestOptions(true);
    } else {
        setShowGuestOptions(false);
    }
    
    if (!authLoading && items.length === 0 && !isGuest && !user && !orderCompleted) {
      const timer = setTimeout(() => {
        if (items.length === 0 && !orderCompleted && !isGuest && !user) {
          router.replace('/');
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (!authLoading) {
      const timer = setTimeout(() => setIsSyncing(false), 800);
      return () => clearTimeout(timer);
    }
  }, [items, router, user, authLoading, isGuest, orderCompleted]);

  useEffect(() => {
    if (addresses.length === 0 && (user || isGuest)) {
      setShowForm(true);
    }
  }, [addresses.length, isGuest, user]);

  useEffect(() => {
    const fetchUserCoins = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/user-data?userId=${user.id}&type=coins`)
          if (response.ok) {
            const coins = await response.json()
            if (coins === null || coins === undefined) {
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
          setUserCoins(5)
        }
      }
    }
    fetchUserCoins()
  }, [user])

  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    const refreshWalletBalance = async () => {
      if (user?.is_dropshipper && user?.id) {
        try {
          const response = await fetch(`/api/user/balance?userId=${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setWalletBalance(data.balance || user.dropshipper_earnings || 0);
          } else {
            setWalletBalance(user.dropshipper_earnings || 0);
          }
        } catch (error) {
          setWalletBalance(user.dropshipper_earnings || 0);
        }
      }
    };
    refreshWalletBalance();
    const interval = setInterval(refreshWalletBalance, 5000);
    return () => clearInterval(interval);
  }, [user?.id, user?.is_dropshipper]);

  const handleSuccessfulPayment = async (razorpayResponse?: any) => {
    console.log('🚀 Finalizing order after payment...');
    try {
      const addr = addresses.find(a => a.default) || addresses[0]
      if (!addr) {
        console.error('❌ NO ADDRESS FOUND FOR ORDER');
        toast({ title: "Address Error", description: "Could not find delivery address for order.", variant: 'destructive' });
        setIsProcessing(false);
        return;
      }
      
      const effectiveUserId = user?.id || 'guest_' + Date.now();
      const effectiveUserEmail = user?.emailAddresses?.[0]?.emailAddress || 'guest@example.com';
      const effectiveFullName = user?.fullName || addr.fullName || 'Guest User';
      const effectivePhone = guestPhone || user?.phoneNumbers?.[0]?.phoneNumber || addr.phone || '';
      
      const currentCartValue = subtotal - totalDiscount;
      const eligibleGifts = GIFTS.filter(g => currentCartValue >= g.threshold).map(g => ({
         id: `gift-${g.id}`,
         qty: 1,
         weight: 0,
         name: `FREE GIFT: ${g.name}`,
         category: 'gift',
         price: 0,
         image: g.image,
         variantId: 'gift',
         slug: 'gift'
      }));
      
      const allItems = [...items, ...eligibleGifts];
      
      const dropshipperInfo = user?.is_dropshipper ? {
        sellingPrice,
        orderType: dropshipperOrderType,
        confirmation: confirmationType,
        note: orderNote
      } : undefined;

      console.log('📝 Placing order in Firebase...');
      const newOrder = await placeOrder(
        effectiveUserId, 
        allItems, 
        addr, 
        finalTotal, 
        paymentMethod as any, 
        razorpayResponse?.razorpay_payment_id || 'online_payment',
        dropshipperInfo
      )
      
      console.log('✅ Order placed:', newOrder.id);
      setOrderCompleted(true)
      setIsProcessing(false)
      
      // Start background tasks
      try {
        await fetch('/api/register-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: effectiveUserId, email: effectiveUserEmail, fullName: effectiveFullName, phone: effectivePhone })
        });
        
        await fetch('/api/place-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: effectiveUserId,
            items: allItems.map(item => ({ productId: item.id, name: item.name, price: item.price, quantity: item.qty, image: item.image })),
            total: finalTotal,
            paymentMethod: paymentMethod,
            paymentId: razorpayResponse?.razorpay_payment_id || 'online_payment',
            shippingAddress: { name: addr.fullName, phone: addr.phone, address: addr.line1, city: addr.city, state: addr.state, pincode: addr.pincode },
            ...(user?.is_dropshipper && { dropshipperSellingPrice: sellingPrice, dropshipperOrderType: dropshipperOrderType, confirmationType: confirmationType, orderNote: orderNote })
          })
        });
      } catch (bgError) {
        console.warn('⚠️ Background order registration failed (non-critical):', bgError);
      }
      
      if (user && coinsApplied && coinsToUse > 0) {
        try {
          await fetch('/api/user-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, type: 'coins', data: userCoins - coinsToUse })
          })
        } catch (error) {}
      }
      
      console.log('🛒 Clearing cart...');
      await clearCartFromDB(effectiveUserId);
      setShowSpinWheel(true);
      toast({ title: "🎉 Order Placed!", description: `Order #${newOrder.id} is confirmed.` });
      
    } catch (error) {
      console.error('💥 ERROR FINALIZING ORDER:', error);
      toast({ title: "Order Placement Error", description: error.message || "Failed to create order in database. Please contact support with your payment ID.", variant: 'destructive' });
      setIsProcessing(false);
    }
  }

  const handleOnlinePayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    console.log('💳 Initiating Payment for ₹', finalTotal);
    
    const addr = addresses.find(a => a.default) || addresses[0]
    if (!addr) {
      toast({ title: "Address Required", description: "Please add a delivery address first.", variant: 'destructive' });
      setShowForm(true);
      setIsProcessing(false);
      return;
    }

    try {
      const res = await fetch('/api/phonepe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalTotal }),
      });
      const order = await res.json();
      if (!res.ok) {
        toast({ title: "Payment Error", description: order.error || 'Payment gateway failed', variant: 'destructive' });
        setIsProcessing(false);
        return;
      }
      
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: 'ShopWave',
        description: 'Order Payment',
        image: 'https://ik.imagekit.io/b5qewhvhb/tach/shopwave-logo.png',
        order_id: order.orderId,
        handler: async function (response: any) {
            console.log('✅ Payment successful, verifying signature...');
            try {
              const verifyResponse = await fetch('/api/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature })
              });
              const verifyResult = await verifyResponse.json();
              if (verifyResult.success) {
                console.log('✅ Verification successful. Finalizing order...');
                await handleSuccessfulPayment(response);
              } else {
                console.error('❌ Verification failed');
                toast({ title: "Verification Failed", description: "Payment verification failed. If amount was deducted, contact support.", variant: 'destructive' });
                setIsProcessing(false);
              }
            } catch (error) {
              console.error('❌ Error during verification:', error);
              toast({ title: "System Error", description: "Payment verification failed due to a system error.", variant: 'destructive' });
              setIsProcessing(false);
            }
        },
        prefill: { name: addr.fullName, contact: addr.phone, email: user?.emailAddresses?.[0]?.emailAddress || '' },
        theme: { color: '#fb923c' },
        modal: { ondismiss: () => { console.log('❌ Payment modal closed'); setIsProcessing(false); } }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('❌ Payment Initiation Error:', error);
      toast({ title: "Error", description: "Connection failed. Please check your internet.", variant: 'destructive' });
      setIsProcessing(false);
    }
  }

  const handleSaveAddress = async (addr: Omit<Address, 'id'>) => {
    if (user) {
      await save(user.id, editingAddress ? { ...editingAddress, ...addr } : addr);
    } else if (isGuest) {
      save('guest', { ...addr, id: 'guest-address', default: true });
    }
    setShowForm(false);
    setEditingAddress(undefined);
  }

  const handleSpinWin = async (wonCoins: number) => {
    const newCoins = userCoins - (coinsApplied ? coinsToUse : 0) + wonCoins
    setUserCoins(newCoins)
    if (user) {
      await fetch('/api/user-data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, type: 'coins', data: newCoins }) })
    }
  }

  const handleSpinClose = () => {
    setShowSpinWheel(false)
    if (orderCompleted) router.push('/account')
  }

  if (authLoading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  if (orderCompleted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-white animate-in zoom-in duration-500">
        <div className="w-32 h-32 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-100 ring-[12px] ring-green-50/50 animate-bounce">
          <CheckCircle className="w-16 h-16" strokeWidth={3} />
        </div>
        <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">ORDER PLACED! 🎉</h2>
        <p className="text-slate-500 font-bold mb-10 max-w-sm text-lg leading-tight uppercase tracking-wider">Your package is ready to ship. Keep your phone handy! 🚚</p>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Button asChild className="h-16 font-black text-lg rounded-3xl bg-brand hover:scale-[1.05] transition-transform shadow-2xl shadow-brand/30"><Link href="/account">Track My Order 📦</Link></Button>
          <Button variant="ghost" asChild className="h-14 font-black rounded-3xl text-slate-400 hover:text-brand"><Link href="/">Back to Shop 🛍️</Link></Button>
        </div>
        <SpinWheel isOpen={showSpinWheel} onClose={handleSpinClose} onWin={handleSpinWin} />
      </div>
    );
  }

  if (items.length === 0 && !isGuest && !user && !showGuestOptions) return null;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      {showGuestOptions && (
        <div className="fixed inset-0 bg-slate-900/95 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-6"><ShieldCheck className="w-10 h-10" /></div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Guest Checkout</h2>
              <p className="text-slate-400 font-bold text-xs mt-3 uppercase tracking-widest leading-relaxed">Enter your mobile number to start your shopping journey</p>
            </div>
            <div className="space-y-6">
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black border-r border-slate-100 pr-4">+91</span>
                <input type="tel" maxLength={10} placeholder="98765 43210" value={guestPhone} onChange={(e) => { setGuestPhone(e.target.value.replace(/\D/g, '')); setPhoneError(''); }} className={`w-full h-16 pl-20 pr-6 bg-slate-50 border-2 rounded-[24px] text-xl font-black placeholder:text-slate-200 focus:ring-8 focus:ring-brand/5 transition-all outline-none ${phoneError ? 'border-red-500' : 'border-slate-100 focus:border-brand'}`} />
              </div>
              <button onClick={() => { 
                if (guestPhone.length !== 10) { setPhoneError('Invalid Number'); return; } 
                localStorage.setItem('isGuest', 'true');
                localStorage.setItem('guestPhone', guestPhone);
                setIsGuest(true); 
                setShowGuestOptions(false); 
              }} className="w-full h-16 bg-brand text-white font-black text-xl rounded-[24px] shadow-2xl shadow-brand/30 transition-all active:scale-95 group overflow-hidden relative">
                <span className="relative z-10 flex items-center justify-center gap-2">Continue 🛍️</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[20deg]" />
              </button>
              <div className="text-center">
                 <Link href="/login" className="text-[10px] font-black text-slate-400 hover:text-brand uppercase tracking-widest">Already have an account? Login</Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-[1fr_380px] md:items-start max-w-7xl mx-auto px-4 py-8">
        <div className="md:col-span-1 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Lock className="w-6 h-6 md:w-8 md:h-8 text-brand" />
            Secure Checkout
          </h1>
          <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-lg border border-green-100">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span className="text-xs font-bold text-green-700 uppercase tracking-wide">100% Safe</span>
          </div>
        </div>

        {/* TRUST BLOCK */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 border-green-100 mb-4">
          <h3 className="text-xs md:text-sm font-black text-green-800 mb-3 md:mb-4 uppercase tracking-wide flex items-center gap-2">
            <span className="bg-green-200 text-green-800 p-1 rounded">✨</span> Why Prepaid?
          </h3>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
             <div className="flex items-start gap-2 backdrop-blur-sm bg-white/40 p-2 md:p-3 rounded-xl border border-green-100/50">
               <Truck className="w-4 h-4 md:w-5 md:h-5 text-green-600 mt-0.5" />
               <div className="leading-tight">
                 <p className="font-black text-xs md:text-sm text-slate-800">Fast Dispatch</p>
                 <p className="text-[10px] md:text-xs font-medium text-slate-500 mt-0.5">Dispatched within 24hrs</p>
               </div>
             </div>
             <div className="flex items-start gap-2 backdrop-blur-sm bg-white/40 p-2 md:p-3 rounded-xl border border-green-100/50">
               <Zap className="w-4 h-4 md:w-5 md:h-5 text-green-600 mt-0.5" />
               <div className="leading-tight">
                 <p className="font-black text-xs md:text-sm text-slate-800">3-5 Days Delivery</p>
                 <p className="text-[10px] md:text-xs font-medium text-slate-500 mt-0.5">Super fast shipping</p>
               </div>
             </div>
             <div className="flex items-start gap-2 backdrop-blur-sm bg-white/40 p-2 md:p-3 rounded-xl border border-green-100/50">
                <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-green-600 mt-0.5" />
               <div className="leading-tight">
                 <p className="font-black text-xs md:text-sm text-slate-800">Zero Fraud</p>
                 <p className="text-[10px] md:text-xs font-medium text-slate-500 mt-0.5">Prepaid is most secure</p>
               </div>
             </div>
             <div className="flex items-start gap-2 backdrop-blur-sm bg-white/40 p-2 md:p-3 rounded-xl border border-green-100/50">
               <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 mt-0.5" />
               <div className="leading-tight">
                 <p className="font-black text-xs md:text-sm text-slate-800">Support</p>
                 <p className="text-[10px] md:text-xs font-medium text-slate-500 mt-0.5">WhatsApp help available</p>
               </div>
             </div>
          </div>
        </div>

        <ProgressOfferBar />

        {/* 1. Address Section */}
        <section className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-50 px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex justify-between items-center">
             <h2 className="text-sm md:text-lg font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
               <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs md:text-sm">1</div>
               Delivery Details
             </h2>
             {(editingAddress || addresses.length > 0) && !showForm && (
               <button onClick={() => { setEditingAddress(editingAddress || addresses[0]); setShowForm(true); }} className="text-[10px] md:text-xs font-bold text-brand hover:text-brand/80 border border-brand/20 px-3 py-1 rounded-full bg-brand/5">
                 CHANGE
               </button>
             )}
          </div>
          
          <div className="p-4 md:p-6">
            {!showForm && (editingAddress || addresses.length > 0) ? (
              <div className="group relative bg-slate-50 rounded-xl md:rounded-2xl p-4 border-2 border-slate-100 hover:border-brand/30 transition-all cursor-pointer" onClick={() => { setEditingAddress(editingAddress || addresses[0]); setShowForm(true); }}>
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="mt-1 bg-white p-2 rounded-full shadow-sm text-brand">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black text-sm md:text-base text-slate-900">{(editingAddress || addresses[0]).fullName}</h3>
                      <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Home</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium mb-1 line-clamp-2">{(editingAddress || addresses[0]).line1}, {(editingAddress || addresses[0]).city}, {(editingAddress || addresses[0]).state} - {(editingAddress || addresses[0]).pincode}</p>
                    <p className="text-xs md:text-sm font-bold text-slate-900">+91 {(editingAddress || addresses[0]).phone}</p>
                    <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-green-600 bg-green-50 w-fit px-2 py-1 rounded-lg">
                      <CheckCircle className="w-3 h-3" /> Area Serviceable
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-slate-300 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ) : (
               <AddressForm action={handleSaveAddress} initial={editingAddress} prefillPhone={guestPhone} onCancel={() => { setShowForm(false); setEditingAddress(undefined); }} />
            )}
          </div>
        </section>

        {/* 2. Payment Section */}
        <section className={`bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-500 ${!editingAddress && addresses.length === 0 || showForm ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
           <div className="bg-slate-50 px-4 md:px-6 py-3 border-b border-slate-100">
             <h2 className="text-sm md:text-lg font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
               <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs md:text-sm">2</div>
               Payment Method
             </h2>
           </div>

           <div className="p-3 md:p-6 space-y-2 md:space-y-4">
              {/* UPI Option */}
              <button
                onClick={() => setPaymentMethod('UPI')}
                className={`w-full relative overflow-hidden flex flex-col items-start gap-2 p-3 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all group text-left ${
                  paymentMethod === 'UPI'
                    ? 'border-green-500 bg-green-50 ring-4 ring-green-100 shadow-xl shadow-green-100'
                    : 'border-slate-100 hover:border-green-200 hover:bg-green-50/30'
                }`}
              >
                {paymentMethod === 'UPI' && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-xl uppercase tracking-wider shadow-sm">
                    Recommended
                  </div>
                )}
                
                <div className="flex items-center gap-3 w-full">
                  <div className={`h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center text-xl md:text-2xl shadow-sm border transition-colors ${paymentMethod === 'UPI' ? 'bg-green-100 border-green-200 text-green-600' : 'bg-white border-slate-100 text-slate-400'}`}>
                    <QrCode className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-black text-sm md:text-base ${paymentMethod === 'UPI' ? 'text-green-800' : 'text-slate-700'}`}>Pay with UPI / QR</h3>
                    <p className="text-[10px] md:text-xs font-semibold text-slate-400">GooglePay, PhonePe, Paytm</p>
                  </div>
                  <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'UPI' ? 'border-green-500 bg-green-500 text-white scale-110' : 'border-slate-200'}`}>
                    {paymentMethod === 'UPI' && <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />}
                  </div>
                </div>
                
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-md transition-colors ${paymentMethod === 'UPI' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                   <Zap className="w-3 h-3" /> Fastest & Safest
                </div>
              </button>

              {/* Card Option */}
              <button
                onClick={() => setPaymentMethod('CARD')}
                className={`w-full flex items-center gap-3 md:gap-4 p-3 rounded-xl md:rounded-2xl border-2 transition-all group text-left ${
                  paymentMethod === 'CARD'
                    ? 'border-brand bg-brand/5 ring-4 ring-brand/10'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className={`h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center shadow-sm border transition-colors ${paymentMethod === 'CARD' ? 'bg-white border-brand/20 text-brand' : 'bg-white border-slate-100 text-slate-400'}`}>
                  <CreditCard className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-black text-sm md:text-base ${paymentMethod === 'CARD' ? 'text-brand' : 'text-slate-700'}`}>Credit / Debit Card</h3>
                  <p className="text-[10px] md:text-xs font-semibold text-slate-400">Visa, Mastercard, RuPay</p>
                </div>
                <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'CARD' ? 'border-brand bg-brand text-white scale-110' : 'border-slate-200'}`}>
                    {paymentMethod === 'CARD' && <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />}
                </div>
              </button>

              {/* NetBanking Option */}
              <button
                onClick={() => setPaymentMethod('NETBANKING')}
                className={`w-full flex items-center gap-3 md:gap-4 p-3 rounded-xl md:rounded-2xl border-2 transition-all group text-left ${
                  paymentMethod === 'NETBANKING'
                    ? 'border-brand bg-brand/5 ring-4 ring-brand/10'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className={`h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center shadow-sm border transition-colors ${paymentMethod === 'NETBANKING' ? 'bg-white border-brand/20 text-brand' : 'bg-white border-slate-100 text-slate-400'}`}>
                  <Banknote className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="flex-1">
                   <h3 className={`font-black text-sm md:text-base ${paymentMethod === 'NETBANKING' ? 'text-brand' : 'text-slate-700'}`}>Net Banking</h3>
                   <p className="text-[10px] md:text-xs font-semibold text-slate-400">All Major Banks Supported</p>
                </div>
                 <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'NETBANKING' ? 'border-brand bg-brand text-white scale-110' : 'border-slate-200'}`}>
                    {paymentMethod === 'NETBANKING' && <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />}
                </div>
              </button>

              {/* Desktop Pay Button */}
              <div className="hidden md:block pt-4">
                 <Button
                  onClick={handleOnlinePayment}
                  className="w-full h-16 mt-2 text-xl font-black rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-2xl shadow-green-500/30 hover:scale-[1.02] active:scale-95 transition-all text-white"
                  disabled={isProcessing || items.length === 0}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex flex-col items-center leading-tight">
                      <span>PAY ₹{finalTotal.toLocaleString()} & PLACE ORDER</span>
                      <span className="text-[10px] font-bold text-green-100 mt-1 opacity-90 uppercase tracking-wide">100% Secure • Instant Confirmation</span>
                    </div>
                  )}
                </Button>
              </div>
           </div>
        </section>
      </div>

        {/* Column 2: Sticky Summary */}
        {/* Column 2: Sticky Summary */}
        <div className="md:sticky md:top-24 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 flex justify-between items-center text-white">
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2"><div className="bg-white/10 p-1.5 rounded-lg">🛍️</div> Order Summary</h2>
              <span className="bg-white/10 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border border-white/10">{items.length} Items</span>
            </div>
            
            <div className="p-6">
              {items.length > 0 ? (
                <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 group-hover:border-brand/30 transition-all">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                        )}
                      </div>
                      <div className="flex-grow min-w-0 flex flex-col justify-center">
                        <h4 className="font-bold text-slate-900 line-clamp-2 text-sm leading-tight">{item.name}</h4>
                        <div className="flex items-center justify-between mt-1.5">
                           <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">Qty: {item.qty}</div>
                           <span className="block font-black text-slate-900 text-sm">₹{(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 mb-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <div className="text-4xl mb-2 opacity-30">🛒</div>
                  <p className="text-slate-400 font-bold text-sm">Cart is empty</p>
                </div>
              )}
              
              <div className="space-y-3 pt-6 border-t-2 border-dashed border-slate-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-500">Subtotal</span>
                  <span className="font-black text-slate-900">₹{subtotal.toLocaleString()}</span>
                </div>
                
                {totalDiscount > 0 && (
                  <div className="flex justify-between items-center text-sm">
                     <span className="font-bold text-green-600 flex items-center gap-1"><Tag className="w-3 h-3" /> Savings</span>
                     <span className="font-black text-green-600">-₹{totalDiscount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-500">Delivery</span>
                  <span className={`font-black ${totalShipping === 0 ? 'text-green-600' : 'text-slate-900'}`}>
                    {totalShipping === 0 ? 'FREE' : `₹${totalShipping}`}
                  </span>
                </div>
                
                <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-base font-black text-slate-900">Total to Pay</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter text-brand">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

               {/* Desktop Pay Button */}
               <div className="hidden md:block mt-6">
                  <Button 
                    onClick={handleOnlinePayment} 
                    className="w-full h-14 text-lg font-black rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all active:scale-95" 
                    disabled={isProcessing || items.length === 0}
                  >
                    {isProcessing ? 'Processing...' : `Pay ₹${finalTotal.toLocaleString()}`}
                  </Button>
                  <p className="text-center text-[10px] font-bold text-slate-400 mt-3 flex items-center justify-center gap-1.5 uppercase tracking-wide opacity-70">
                    <ShieldCheck className="h-3.5 w-3.5" /> 100% Secure Payment
                  </p>
               </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-5 border border-green-100 flex items-center gap-4 shadow-sm">
             <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-green-500 shadow-sm border border-green-100 shrink-0">
               <ShieldCheck className="h-6 w-6" />
             </div>
             <div>
               <h4 className="font-black text-sm text-slate-900 mb-0.5">Top-notch Security</h4>
               <p className="text-xs font-semibold text-slate-500 leading-tight">Your payment details are encrypted and safe.</p>
             </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 p-4 md:hidden z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-safe animation-slide-up">
        <Button 
          onClick={handleOnlinePayment}
          className="w-full h-16 text-lg font-black rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-xl shadow-green-500/30 hover:scale-[1.02] active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5"
          disabled={isProcessing || items.length === 0}
        >
          {isProcessing ? (
             <div className="flex items-center gap-2">
               <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               Processing...
             </div>
          ) : (
            <>
              <span className="text-lg leading-none mt-1">PAY ₹{finalTotal.toLocaleString()} & PLACE ORDER</span>
              <span className="text-[10px] font-bold text-green-100 opacity-90 uppercase tracking-wide">100% Secure • Instant Confirmation</span>
            </>
          )}
        </Button>
      </div>
      <SpinWheel isOpen={showSpinWheel} onClose={handleSpinClose} onWin={handleSpinWin} />
    </>
  );
}
