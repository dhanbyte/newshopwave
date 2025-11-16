
'use client'
import { useState, useEffect } from 'react'
import React from 'react'
import { User, Package, Heart, MapPin, LifeBuoy, LogOut, ChevronRight, Edit, Gift, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
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
// Coins components removed

const accountSections = {
  DASHBOARD: 'DASHBOARD',
  ADDRESSES: 'ADDRESSES',
  EDIT_PROFILE: 'EDIT_PROFILE',
  REFERRALS: 'REFERRALS',
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


export default function AccountPage() {
  const { user, loading, logout } = useAuth()
  const [activeSection, setActiveSection] = useState(accountSections.DASHBOARD)
  const [referralStats, setReferralStats] = useState({ totalEarned: 0, totalReferrals: 0 })
  const { hasNewOrder, orders } = useOrders()
  const { hasNewItem } = useWishlist()
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [userCoins, setUserCoins] = useState(5)
  const [usedScratchCards, setUsedScratchCards] = useState<string[]>([])
  const [usedSpins, setUsedSpins] = useState<string[]>([])

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

  // Fetch user data including dropshipper info
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return
      
      try {
        // Refresh user data from database (try both userId and email)
        const userResponse = await fetch(`/api/user/refresh?userId=${user.id}&email=${user.email}`)
        if (userResponse.ok) {
          const userData = await userResponse.json()
          if (userData.success && userData.user) {
            // Update user context with fresh data
            console.log('Fresh user data:', userData.user)
            // Force page reload if dropshipper status found
            if (userData.user.is_dropshipper && !user.is_dropshipper) {
              setTimeout(() => window.location.reload(), 1000)
            }
          }
        }
        
        // Get coins
        const coinsResponse = await fetch(`/api/user-data?userId=${user.id}&type=coins`)
        if (coinsResponse.ok) {
          const coins = await coinsResponse.json()
          setUserCoins(coins || 5)
        }
        
        // Get used scratch cards
        const scratchResponse = await fetch(`/api/user-data?userId=${user.id}&type=scratchCards`)
        if (scratchResponse.ok) {
          const used = await scratchResponse.json()
          setUsedScratchCards(used || [])
        }
        
        // Get used spins
        const spinsResponse = await fetch(`/api/user-data?userId=${user.id}&type=usedSpins`)
        if (spinsResponse.ok) {
          const usedSpinsList = await spinsResponse.json()
          setUsedSpins(usedSpinsList || [])
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
      // COINS section removed
      case accountSections.DASHBOARD:
      default:
        return (
          <div>
            <div className="card p-4 md:p-6 mb-6">
                <div className="flex items-center gap-4">
                    <UserButton afterSignOutUrl="/" />
                    <div>
                        <h2 className="text-xl font-bold">{user.fullName || 'Welcome!'}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Dropshipper: {user.is_dropshipper ? '✅ Yes' : '❌ No'}
                          {user.dropshipper_id && ` | ID: ${user.dropshipper_id}`}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <DashboardCard icon={Package} title="My Orders" href="/orders" hasNotification={hasNewOrder} />
                <DashboardCard icon={Heart} title="Wishlist" href="/wishlist" hasNotification={hasNewItem} />
                <DashboardCard icon={MapPin} title="My Addresses" onClick={() => setActiveSection(accountSections.ADDRESSES)} />
                <DashboardCard icon={Edit} title="Edit Profile" onClick={() => setActiveSection(accountSections.EDIT_PROFILE)} />
            </div>

            {/* Dropshipper Section */}
            {user.is_dropshipper ? (
              <div className="card p-4 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <h3 className="font-bold text-blue-800 mb-2">🚀 Dropshipper Dashboard</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Dropshipper ID</p>
                    <p className="font-bold text-blue-600">{user.dropshipper_id || 'Loading...'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Earnings</p>
                    <p className="font-bold text-green-600">₹{user.dropshipper_earnings || 0}</p>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">✨ You get wholesale prices on all products!</p>
              </div>
            ) : (
              <div className="card p-4 mb-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                <h3 className="font-bold text-orange-800 mb-2">🚀 Become a Dropshipper</h3>
                <p className="text-orange-700 text-sm mb-3">Get wholesale prices on all products!</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700"
                  >
                    Join Now - ₹113
                  </button>
                  <button 
                    onClick={async () => {
                      try {
                        // Test simple API first
                        const testResponse = await fetch('/api/test-simple');
                        const testData = await testResponse.json();
                        console.log('Test API:', testData);
                        
                        // Test user refresh
                        const response = await fetch(`/api/user/refresh?userId=${user.id}&email=${user.email}`);
                        const data = await response.json();
                        console.log('User data:', data);
                        
                        alert(`Test API: ${testData.success}\nUser API: ${data.success}\nCheck console for details`);
                        
                        if (data.success && data.user?.is_dropshipper) {
                          window.location.reload();
                        }
                      } catch (err) {
                        console.error('Debug error:', err);
                        alert('Error: ' + err.message);
                      }
                    }}
                    className="bg-gray-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700"
                  >
                    Debug
                  </button>
                </div>
              </div>
            )}

            {/* Coins & Try Your Luck Card - Hidden */}

            {/* Referral Stats Banner - Hidden */}

            <div className="card p-4">
                 <AccountLink title="Logout" icon={LogOut} onClick={logout} />
            </div>
          </div>
        )
    }
  }



  return (
     <motion.div
      key={activeSection}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="mx-auto max-w-2xl"
    >
      {renderSection()}
    </motion.div>
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
      <div className="card p-4 text-center flex flex-col items-center justify-center h-full relative">
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
