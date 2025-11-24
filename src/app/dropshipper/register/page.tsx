'use client'
import { useAuth } from '@/context/ClerkAuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function DropshipperRegisterPage() {
  const { user, authLoading } = useAuth()
  const router = useRouter()

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

    // If logged in and not a dropshipper, redirect to account page
    // where they can see the "Become a Dropshipper" button
    router.replace('/account')
  }, [user, authLoading, router])

  // Show loading while checking auth
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">Checking login status...</p>
      </div>
    </div>
  )
}
