'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import AdminProtection from '@/components/AdminProtection'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const isLoginPage = pathname === '/admin/login'
  
  useEffect(() => {
    setMounted(true)
    const checkAuth = () => {
      const adminAuth = sessionStorage.getItem('adminAuth')
      setIsAuthenticated(adminAuth === 'true')
    }
    checkAuth()
  }, [])
  
  if (!mounted) {
    return (
      <div className="min-h-screen items-center justify-center bg-gray-50 flex" suppressHydrationWarning>
         {/* Empty or simple loader to match until client takes over */}
      </div>
    )
  }
  
  return (
    <AdminProtection>
      {isLoginPage || !isAuthenticated ? (
        // Login page - no sidebar
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      ) : (
        // Authenticated - show sidebar
        <div className="flex min-h-screen bg-gray-50">
          <AdminSidebar />
          <main className="flex-1 ml-64">
            {children}
          </main>
        </div>
      )}
    </AdminProtection>
  )
}