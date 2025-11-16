'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs'
import { useWishlist } from '@/lib/wishlistStore'
import { useCart } from '@/lib/cartStore'
import { useAddressBook } from '@/lib/addressStore'
import { useOrders } from '@/lib/ordersStore'
import { useNotificationStore } from '@/lib/notificationStore'

export interface CustomUser {
  id: string
  fullName?: string
  email?: string
  createdAt?: number
  referralCode?: string
  is_dropshipper?: boolean
  dropshipper_id?: string
  dropshipper_earnings?: number
  dropshipper_status?: string
}

interface AuthContextType {
  user: CustomUser | null
  loading: boolean
  updateUserProfile: (profileData: Partial<CustomUser>) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  updateUserProfile: async () => {},
  logout: () => {},
});

export const ClerkAuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser, isLoaded } = useUser()
  const { signOut } = useClerkAuth()
  const [user, setUser] = useState<CustomUser | null>(null)
  const [loading, setLoading] = useState(true)

  const { init: initWishlist, clear: clearWishlist } = useWishlist()
  const { init: initCart, clear: clearCart } = useCart()
  const { init: initAddresses, clear: clearAddresses } = useAddressBook()
  const { init: initOrders, clear: clearOrders } = useOrders()
  const { init: initNotifications, clear: clearNotifications } = useNotificationStore()

  const initializeStoresForUser = (userId: string) => {
    initWishlist(userId)
    initCart(userId)
    initAddresses(userId)
    initOrders(userId)
    initNotifications(userId)
  }

  const clearAllStores = () => {
    clearWishlist()
    clearCart()
    clearAddresses()
    clearOrders()
    clearNotifications()
  }

  const saveUserToDatabase = async (userData: any) => {
    try {
      const response = await fetch('/api/register-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.id,
          email: userData.email,
          fullName: userData.fullName || 'User',
          phone: userData.phone || ''
        })
      })
      const result = await response.json()
      if (result.success && result.user) {
        // Update user with dropshipper data from database
        setUser(prev => prev ? {
          ...prev,
          is_dropshipper: result.user.is_dropshipper,
          dropshipper_id: result.user.dropshipper_id,
          dropshipper_earnings: result.user.dropshipper_earnings,
          dropshipper_status: result.user.dropshipper_status
        } : null)
      } else {
        // Try to find user by email if not found by userId
        const emailResponse = await fetch('/api/user/refresh?email=' + userData.email)
        const emailResult = await emailResponse.json()
        if (emailResult.success && emailResult.user) {
          setUser(prev => prev ? {
            ...prev,
            is_dropshipper: emailResult.user.is_dropshipper,
            dropshipper_id: emailResult.user.dropshipper_id,
            dropshipper_earnings: emailResult.user.dropshipper_earnings,
            dropshipper_status: emailResult.user.dropshipper_status
          } : null)
        }
      }
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }

  const trackReferralSignup = (referralCode: string, newUserId: string) => {
    // Fire and forget - completely async, no waiting
    setTimeout(() => {
      fetch('/api/referrals/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralCode, newUserId })
      }).catch(() => {})
    }, 0)
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isLoaded) {
          if (clerkUser) {
            const customUser: CustomUser = {
              id: clerkUser.id,
              email: clerkUser.primaryEmailAddress?.emailAddress,
              fullName: clerkUser.fullName || clerkUser.firstName || 'User',
              createdAt: clerkUser.createdAt ? new Date(clerkUser.createdAt).getTime() : Date.now(),
            }
            setUser(customUser)
            
            // Initialize stores immediately - no async
            initializeStoresForUser(customUser.id)
            
            // Handle redirect immediately
            if (typeof window !== 'undefined') {
              const savedPath = localStorage.getItem('redirectAfterAuth')
              if (savedPath && savedPath !== '/' && !window.location.pathname.includes('/sign-in')) {
                localStorage.removeItem('redirectAfterAuth')
                window.location.href = savedPath
                return // Exit early for redirect
              }
            }
            
            // Load user data including dropshipper info
            const userDataWithPhone = {
              ...customUser,
              phone: clerkUser.primaryPhoneNumber?.phoneNumber || ''
            }
            await saveUserToDatabase(userDataWithPhone)
            
            // Handle referral tracking in background
            if (typeof window !== 'undefined') {
              const urlParams = new URLSearchParams(window.location.search)
              const referralCode = urlParams.get('ref')
              if (referralCode) {
                trackReferralSignup(referralCode, customUser.id)
              }
            }
          } else {
            setUser(null)
            clearAllStores()
          }
          setLoading(false)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setLoading(false)
        // Set user to null on error to prevent infinite loading
        setUser(null)
      }
    }
    
    initAuth()
  }, [clerkUser, isLoaded])

  const updateUserProfile = async (profileData: Partial<CustomUser>) => {
    if (!user) return
    
    try {
      const updatedUser = { ...user, ...profileData }
      setUser(updatedUser)
      await saveUserToDatabase(updatedUser)
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut()
      setUser(null)
      clearAllStores()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      updateUserProfile, 
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)