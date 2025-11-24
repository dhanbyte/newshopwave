'use client'
import { useState, useEffect } from 'react'
import React from 'react'
import { User, Package, Heart, MapPin, LifeBuoy, LogOut, ChevronRight, Edit, Gift, Star, Wallet, CreditCard, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Script from 'next/script'
import AddressManager from '../../components/AddressManager'
import ReferralManager from '../../components/ReferralManager'
import { useOrders } from '../../lib/ordersStore'
import { useWishlist } from '../../lib/wishlistStore'
import { useAuth } from '../../context/ClerkAuthContext'
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Button } from '../../components/ui/button'
import { useToast } from '../../hooks/use-toast'
import LoadingSpinner from '../../components/LoadingSpinner'
import { referralService } from '../../lib/referralService'

const accountSections = {
  DASHBOARD: 'DASHBOARD',
  ADDRESSES: 'ADDRESSES',
  EDIT_PROFILE: 'EDIT_PROFILE',
  REFERRALS: 'REFERRALS',
  WALLET: 'WALLET',
}

const AuthForm = () => {
    return (
        <div className="mx-auto max-w-sm card p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Login or Sign Up</h1>
            <p className="text-sm text-gray-500 mb-4">Choose an option to continue</p>
            <div className="space-y-4">
                <SignInButton mode="modal">
                    <Button className="w-full">
                        Sign In
                    </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                    <Button variant="outline" className="w-full">
                        Sign Up
                    </Button>
                </SignUpButton>
            </div>
        </div>
    );
};

const EditProfileSection = ({ onBack }: { onBack: () => void }) => {
    const { user, updateUserProfile } = useAuth();
    const [fullName, setFullName] = useState(user?.fullName || '');
    const { toast } = useToast();

    const handleSave = async () => {
        if (!fullName.trim()) {
            toast({ title: "Name Required", description: "Please enter your full name.", variant: "destructive" });
            return;
        }
        await updateUserProfile({ fullName });
        toast({ title: "Profile Updated!", description: "Your name has been updated successfully." });
        onBack();
    };

    return (
        <div className="card p-6">
             <button onClick={onBack} className="text-sm text-brand font-semibold mb-4">&larr; Back to Account</button>
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <div className="space-y-4">
                 <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 text-sm mt-1"
                    />
                </div>
                <Button onClick={handleSave} className="w-full">
                    Save Changes
                </Button>
            </div>
        </div>
    );
};

const WalletSection = ({ onBack, userBalance, onUpdateBalance }: { onBack: () => void, userBalance: number, onUpdateBalance: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'recharge' | 'withdraw'>('recharge');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({ accountNo: '', ifsc: '', holderName: '', bankName: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  // Fetch history
  useEffect(() => {
    if(user?.id) {
        fetch(`/api/wallet/transactions?userId=${user.id}`)
            .then(res => res.json())
            .then(data => setHistory(data))
            .catch(err => console.error('Error fetching transactions:', err));
    }
  }, [user?.id]);

  const handleRecharge = async () => {
    if (!amount || Number(amount) <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    try {
      // 1. Create Order
      const res = await fetch('/api/phonepe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      const order = await res.json();
      
      if (!order.success) throw new Error('Failed to create order');

      // 2. Open Razorpay
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: 'ShopWave Wallet',
        description: 'Wallet Recharge',
        order_id: order.orderId,
        handler: async function (response: any) {
          try {
             const verifyRes = await fetch('/api/wallet/recharge/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    userId: user?.id,
                    amount: Number(amount)
                })
             });
             const verifyData = await verifyRes.json();
             if (verifyData.success) {
                toast({ title: "Recharge Successful", description: `₹${amount} added to wallet.` });
                onUpdateBalance();
                setAmount('');
                // Refresh transaction history
                fetch(`/api/wallet/transactions?userId=${user?.id}`)
                  .then(res => res.json())
                  .then(setHistory);
             } else {
                toast({ title: "Verification Failed", description: verifyData.error, variant: "destructive" });
             }
          } catch (err) {
             console.error(err);
             toast({ title: "Error", description: "Payment verification failed", variant: "destructive" });
          }
          setIsProcessing(false);
        },
        prefill: {
            name: user?.fullName,
            email: user?.email,
            contact: user?.phone
        },
        theme: { color: '#3b82f6' }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      rzp.on('payment.failed', function (response: any){
        toast({ title: "Payment Failed", description: response.error.description, variant: "destructive" });
        setIsProcessing(false);
      });

    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) < 1000) {
        toast({ title: "Invalid Amount", description: "Minimum withdrawal is ₹1000", variant: "destructive" });
        return;
    }
    if (Number(withdrawAmount) > userBalance) {
        toast({ title: "Insufficient Balance", description: "You don't have enough funds.", variant: "destructive" });
        return;
    }
    if (!bankDetails.accountNo || !bankDetails.ifsc || !bankDetails.holderName) {
        toast({ title: "Missing Details", description: "Please fill all bank details", variant: "destructive" });
        return;
    }

    setIsProcessing(true);
    try {
        const res = await fetch('/api/wallet/withdraw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user?.id,
                amount: Number(withdrawAmount),
                bankDetails
            })
        });
        const data = await res.json();
        if (data.success) {
            toast({ title: "Request Submitted", description: "Withdrawal request submitted successfully." });
            onUpdateBalance();
            setWithdrawAmount('');
            // Refresh history
            fetch(`/api/wallet/transactions?userId=${user?.id}`)
              .then(res => res.json())
              .then(setHistory);
        } else {
            toast({ title: "Failed", description: data.error, variant: "destructive" });
        }
    } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Failed to submit request", variant: "destructive" });
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
        <button onClick={onBack} className="text-sm text-brand font-semibold">&larr; Back to Account</button>
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-blue-100 mb-1">Total Balance</p>
            <h2 className="text-4xl font-bold">₹{userBalance.toLocaleString()}</h2>
        </div>

        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button 
                onClick={() => setActiveTab('recharge')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'recharge' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Add Money
            </button>
            <button 
                onClick={() => setActiveTab('withdraw')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'withdraw' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Withdraw
            </button>
        </div>

        {activeTab === 'recharge' ? (
            <div className="card p-6 space-y-4">
                <h3 className="font-bold text-lg">Recharge Wallet</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                    <input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount (e.g. 500)"
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>
                <div className="bg-yellow-50 p-3 rounded-md text-xs text-yellow-800">
                    Note: Wallet recharge is non-refundable. You can use this balance for dropshipping orders.
                </div>
                <Button onClick={handleRecharge} disabled={isProcessing} className="w-full">
                    {isProcessing ? 'Processing...' : 'Add Money'}
                </Button>
            </div>
        ) : (
            <div className="card p-6 space-y-4">
                <h3 className="font-bold text-lg">Request Withdrawal</h3>
                {userBalance < 1000 ? (
                    <div className="bg-red-50 p-4 rounded-lg text-red-800 text-sm">
                        Minimum withdrawal amount is ₹1000. Your current balance is ₹{userBalance}.
                    </div>
                ) : (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Amount (Min ₹1000)</label>
                            <input 
                                type="number" 
                                value={withdrawAmount} 
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                placeholder="Enter amount"
                                className="w-full rounded-lg border px-3 py-2"
                            />
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-medium text-sm text-gray-900">Bank Details</h4>
                            <input 
                                type="text" 
                                placeholder="Account Holder Name"
                                value={bankDetails.holderName}
                                onChange={(e) => setBankDetails({...bankDetails, holderName: e.target.value})}
                                className="w-full rounded-lg border px-3 py-2 text-sm"
                            />
                            <input 
                                type="text" 
                                placeholder="Bank Name"
                                value={bankDetails.bankName}
                                onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                                className="w-full rounded-lg border px-3 py-2 text-sm"
                            />
                            <input 
                                type="text" 
                                placeholder="Account Number"
                                value={bankDetails.accountNo}
                                onChange={(e) => setBankDetails({...bankDetails, accountNo: e.target.value})}
                                className="w-full rounded-lg border px-3 py-2 text-sm"
                            />
                            <input 
                                type="text" 
                                placeholder="IFSC Code"
                                value={bankDetails.ifsc}
                                onChange={(e) => setBankDetails({...bankDetails, ifsc: e.target.value})}
                                className="w-full rounded-lg border px-3 py-2 text-sm"
                            />
                        </div>
                        <Button onClick={handleWithdraw} disabled={isProcessing} className="w-full">
                            {isProcessing ? 'Submitting...' : 'Submit Request'}
                        </Button>
                    </>
                )}
            </div>
        )}

        {/* History */}
        <div className="card p-6">
            <h3 className="font-bold text-lg mb-4">Transaction History</h3>
            <div className="space-y-3">
                {history.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No transactions yet.</p>
                ) : (
                    history.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                            <div>
                                <p className="font-medium">{item.description}</p>
                                <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold ${item.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.type === 'credit' ? '+' : '-'}₹{item.amount}
                                </p>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    item.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {item.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
  );
};

export default function AccountPage() {
  const { user, loading, logout, refreshUserData } = useAuth()
  const [activeSection, setActiveSection] = useState(accountSections.DASHBOARD)
  const [referralStats, setReferralStats] = useState({ totalEarned: 0, totalReferrals: 0 })
  const { hasNewOrder, orders } = useOrders()
  const { hasNewItem } = useWishlist()
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [dropshipperPrice, setDropshipperPrice] = useState(113)

  useEffect(() => {
    const loadReferralStats = async () => {
      if (!user?.id) return
      try {
        const stats = await referralService.getReferralStats(user.id)
        setReferralStats({
          totalEarned: stats?.totalEarned || 0,
          totalReferrals: stats?.totalReferrals || 0
        })
      } catch (error) {
        console.error('Error loading referral stats:', error)
      } finally {
        setIsLoadingStats(false)
      }
    }
    
    loadReferralStats()
  }, [user?.id])

  // Fetch dropshipper price
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('/api/admin/dropshipper-price?t=' + Date.now())
        const data = await response.json()
        if (data.success) {
          setDropshipperPrice(data.price)
        }
      } catch (error) {
        console.error('Error fetching dropshipper price:', error)
      }
    }
    
    fetchPrice()
    
    // Listen for price updates
    const handlePriceUpdate = () => {
      fetchPrice()
    }
    
    window.addEventListener('dropshipperPriceUpdated', handlePriceUpdate)
    
    return () => {
      window.removeEventListener('dropshipperPriceUpdated', handlePriceUpdate)
    }
  }, [])

  // Fetch user data including dropshipper info
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return
      
      try {
        // Use context method to refresh and update global state
        const updatedUser = await refreshUserData();
        
        if (updatedUser) {
            console.log('Fresh user data:', updatedUser)
            // Only reload once if dropshipper status changed
            if (updatedUser.is_dropshipper && !user.is_dropshipper) {
              const hasReloaded = sessionStorage.getItem('dropshipper_reload_done')
              if (!hasReloaded) {
                sessionStorage.setItem('dropshipper_reload_done', 'true')
                setTimeout(() => window.location.reload(), 1000)
              }
            }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    
    fetchUserData()
  }, [user?.id])
  
  if (loading) {
    return <div className="flex justify-center py-10"><LoadingSpinner /></div>
  }

  if (!user) {
    return <AuthForm />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case accountSections.ADDRESSES:
        return <AddressManager onBack={() => setActiveSection(accountSections.DASHBOARD)} />
      case accountSections.EDIT_PROFILE:
        return <EditProfileSection onBack={() => setActiveSection(accountSections.DASHBOARD)} />
      case accountSections.WALLET:
        return <WalletSection onBack={() => setActiveSection(accountSections.DASHBOARD)} userBalance={user.dropshipper_earnings || 0} onUpdateBalance={refreshUserData} />
      case accountSections.REFERRALS:
        return (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <button 
                onClick={() => setActiveSection(accountSections.DASHBOARD)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Back to dashboard"
              >
                <ChevronRight className="h-5 w-5 rotate-180" />
              </button>
              <h2 className="text-xl font-bold">Referral Program</h2>
            </div>
            <ReferralManager />
          </div>
        )
      case accountSections.DASHBOARD:
      default:
        return (
          <div className="space-y-6">
            {/* Premium Profile Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6 text-white shadow-xl">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
              
              <div className="relative flex items-center gap-4">
                <div className="flex-shrink-0">
                  <UserButton afterSignOutUrl="/" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{user.fullName || 'Welcome!'}</h2>
                  <p className="text-white/90 text-sm mb-2">{user.email}</p>
                  <div className="flex items-center gap-2 text-xs">
                    {user.is_dropshipper ? (
                      <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
                        Dropshipper Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        Regular Customer
                      </span>
                    )}
                    {user.dropshipper_id && (
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full font-mono">
                        ID: {user.dropshipper_id}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Dropshipper Dashboard */}
            {user.is_dropshipper ? (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">🚀 Dropshipper Dashboard</h3>
                    <p className="text-sm text-gray-600">Manage your business operations</p>
                  </div>
                  <button 
                    onClick={() => setActiveSection(accountSections.WALLET)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                  >
                    💰 Manage Wallet
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Dropshipper ID */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Dropshipper ID</p>
                        <p className="text-lg font-bold text-gray-800 font-mono">{user.dropshipper_id || 'Loading...'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Balance */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Wallet className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Wallet Balance</p>
                        <p className="text-lg font-bold text-green-600">₹{(user.dropshipper_earnings || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Total Orders */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Package className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Total Orders</p>
                        <p className="text-lg font-bold text-gray-800">{orders.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benefits Banner */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 text-2xl">✨</div>
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">Wholesale Pricing Active</p>
                      <p className="text-sm text-gray-600">You're getting special dropshipper prices on all products!</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Become Dropshipper CTA */
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-4xl">🚀</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-orange-800 mb-2">Become a Dropshipper</h3>
                    <p className="text-gray-700 mb-4">Start your own business with wholesale prices and zero inventory!</p>
                    <ul className="space-y-2 mb-4 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        Get wholesale prices on all products
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        No inventory needed - we handle shipping
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        Earn profits on every sale
                      </li>
                    </ul>
                    <button 
                      onClick={() => {
                        sessionStorage.setItem('openDropshipperModal', 'true')
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
                      }}
                      className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
                    >
                      Join Now - Only ₹{dropshipperPrice}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions Grid */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <DashboardCard icon={Package} title="My Orders" href="/orders" hasNotification={hasNewOrder} />
                <DashboardCard icon={Heart} title="Wishlist" href="/wishlist" hasNotification={hasNewItem} />
                <DashboardCard icon={MapPin} title="My Addresses" onClick={() => setActiveSection(accountSections.ADDRESSES)} />
                <DashboardCard icon={Edit} title="Edit Profile" onClick={() => setActiveSection(accountSections.EDIT_PROFILE)} />
                {user.is_dropshipper && (
                  <DashboardCard 
                    icon={Wallet} 
                    title="My Wallet" 
                    onClick={() => setActiveSection(accountSections.WALLET)} 
                    subtitle={`₹${(user.dropshipper_earnings || 0).toLocaleString()}`} 
                  />
                )}
                <DashboardCard icon={Gift} title="Referrals" onClick={() => setActiveSection(accountSections.REFERRALS)} />
              </div>
            </div>

            {/* Logout */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <AccountLink title="Logout" icon={LogOut} onClick={logout} />
            </div>
          </div>
        )
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="mx-auto max-w-2xl"
      >
        {renderSection()}
      </motion.div>
    </>
  )
}

const DashboardCard = ({ 
  icon: Icon, 
  title, 
  subtitle,
  href, 
  onClick, 
  hasNotification 
}: { 
  icon: React.ElementType, 
  title: string, 
  subtitle?: string,
  href?: string, 
  onClick?: () => void, 
  hasNotification?: boolean 
}) => {
  const content = (
      <div className="card p-4 text-center flex flex-col items-center justify-center h-full relative hover:shadow-md transition-shadow">
          {hasNotification && <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full blinking-dot"></div>}
          <div className="p-2 mb-2 rounded-full bg-indigo-50">
            <Icon className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-sm">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  
  return <button onClick={onClick} className="w-full">{content}</button>;
};

const AccountLink = ({ title, icon: Icon, onClick }: { title: string, icon: React.ElementType, onClick?: () => void }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-gray-600" />
            <span className="font-medium">{title}</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
)
