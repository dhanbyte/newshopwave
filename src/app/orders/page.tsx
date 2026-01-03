'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useAuth } from '@/context/ClerkAuthContext'
import { useUser } from '@clerk/nextjs'
import OrderTracker from '@/components/OrderTracker'
import OrderPhotoUpload from '@/components/OrderPhotoUpload'
import { Card } from '@/components/ui/card'
import { 
  Package,
  PlusCircle, 
  Upload, 
  Filter, 
  User as UserIcon, 
  Building2, 
  CreditCard, 
  PhoneCall, 
  Info,
  ChevronDown,
  Truck,
  CheckCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import BulkOrderModal from '@/components/BulkOrderModal'
import WalletHistoryModal from '@/components/WalletHistoryModal'

type OrderItem = {
  productId: string
  name: string
  price: number
  qty: number
  image?: string
  customName?: string | null
}

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | string

type OrderSummary = {
  id: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  payment: string
  address: {
    fullName: string
    line1: string
    city: string
    pincode: string
  }
  createdAt: string | number | Date
  isDropshipperOrder?: boolean
  dropshipperProfit?: number
  trackingStatus?: string
  trackingNumber?: string
  estimatedDelivery?: string
  trackingUpdates?: any[]
}

type OrdersResponse = {
  success: boolean
  orders: OrderSummary[]
}

export default function OrdersPage() {
  const { user, refreshUserData } = useAuth()
  const { user: clerkUser, isLoaded } = useUser()
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { toast } = useToast()

  // Dropshipper Dashboard States
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [profile, setProfile] = useState<any>({
    bank_details: { holderName: '', accountNumber: '', ifsc: '', bankName: '', upiId: '' },
    store_name: '',
    whatsapp_number: '',
    gst_number: ''
  })
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [showWalletHistory, setShowWalletHistory] = useState(false)

  // Fetch Profile Effect
  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.is_dropshipper && (user?.id || clerkUser?.id)) {
        try {
          const userId = clerkUser?.id || user?.id;
          const res = await fetch(`/api/user/profile?userId=${userId}`);
          const data = await res.json();
          if (data.success && data.profile) {
            setProfile(prev => ({ ...prev, ...data.profile }));
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };
    fetchProfile();
  }, [user?.is_dropshipper, user?.id, clerkUser?.id]);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const userId = clerkUser?.id || user?.id;
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, profile })
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Success", description: "Profile updated successfully!" });
        setShowProfileModal(false);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update profile", variant: "destructive" });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const fetchOrders = useCallback(async () => {
    try {
      const userId = clerkUser?.id || user?.id
      if (!userId) {
        setOrders([])
        return
      }

      const response = await fetch(`/api/user/orders?userId=${userId}`)
      const data = (await response.json()) as Partial<OrdersResponse>

      if (data?.success && Array.isArray(data.orders)) {
        setOrders(data.orders)
      } else {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }, [clerkUser?.id, user?.id])

const stats = useMemo(() => {
  const dsOrders = orders.filter(o => o.isDropshipperOrder)
  return {
    totalOrders: dsOrders.length,
    totalRevenue: dsOrders.reduce((acc, o) => acc + (o.total || 0), 0),
    totalProfit: dsOrders.reduce((acc, o) => acc + (o.dropshipperProfit || 0), 0),
    pendingPayouts: dsOrders
      .filter(o => o.status === 'delivered')
      .reduce((acc, o) => acc + (o.dropshipperProfit || 0), 0)
  }
}, [orders])

  useEffect(() => {
    if (isLoaded) {
      if (user?.id || clerkUser?.id) {
        void fetchOrders()
      } else {
        setIsLoading(false)
      }
    }
  }, [user, clerkUser, isLoaded, fetchOrders])

  if (!isLoaded || isLoading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user && !clerkUser) {
    return (
      <div className="card p-8 text-center">
        <h2 className="text-lg font-medium text-gray-700">Please Login</h2>
        <p className="mt-1 text-sm text-gray-500">Login to view your order history.</p>
        <Link
          href="/sign-in"
          className="mt-4 inline-block rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
        >
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Your Orders</h1>
        
        {user?.is_dropshipper && (
          <div className="flex gap-2">
            <button 
              onClick={() => setShowProfileModal(true)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-brand" />
              Profile & Bank
            </button>
            <button 
              onClick={() => setShowBulkModal(true)}
              className="px-4 py-2 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand/90 transition-colors shadow-sm flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Bulk Order (Excel)
            </button>
          </div>
        )}
      </div>

      {user?.is_dropshipper && orders.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Orders</span>
            </div>
            <div className="text-2xl font-black text-gray-900">{stats.totalOrders}</div>
          </div>
          
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-brand/20 transition-colors cursor-pointer group"
               onClick={() => setShowWalletHistory(true)}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-50 group-hover:bg-brand/10 rounded-lg transition-colors">
                <Truck className="w-4 h-4 text-purple-600 group-hover:text-brand" />
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Revenue</span>
            </div>
            <div className="text-2xl font-black text-gray-900 group-hover:text-brand transition-colors">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
            <div className="text-[10px] font-bold text-brand mt-1 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">View Ledger →</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-brand/10 shadow-sm ring-1 ring-brand/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-brand/10 rounded-lg">
                <PlusCircle className="w-4 h-4 text-brand" />
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Profit</span>
            </div>
            <div className="text-2xl font-black text-brand">₹{stats.totalProfit.toLocaleString('en-IN')}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-green-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <CreditCard className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Withdrawable</span>
            </div>
            <div className="text-2xl font-black text-green-600">₹{stats.pendingPayouts.toLocaleString('en-IN')}</div>
          </div>
        </div>
      )}
      {!orders.length && (
        <div className="rounded-2xl border bg-white p-8 text-center text-gray-600">
          <h2 className="text-lg font-medium text-gray-700">No orders placed yet.</h2>
          <p className="mt-1 text-sm text-gray-500">When you place an order, it will appear here.</p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
          >
            Continue Shopping
          </Link>
        </div>
      )}
      <div className="space-y-4">
        {orders.map((order) => {
          const createdAt = new Date(order.createdAt)
          const placedOn = Number.isNaN(createdAt.getTime())
            ? null
            : createdAt.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })

          const statusBadge =
            order.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : order.status === 'processing'
              ? 'bg-blue-100 text-blue-800'
              : order.status === 'shipped'
              ? 'bg-purple-100 text-purple-800'
              : order.status === 'delivered'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'

          return (
            <div key={order.id} className="card p-4">
              <div className="mb-2 flex flex-col items-start justify-between border-b pb-2 sm:flex-row sm:items-center">
                <div>
                  <div className="font-semibold">
                    Order <span className="text-brand">#{order.id}</span>
                    {order.isDropshipperOrder && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Dropshipper</span>
                    )}
                    {order.payment === 'COD' && order.status === 'pending' && (
                      <span className="ml-2 text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">
                        RTO Risk: Avg
                      </span>
                    )}
                  </div>
                  {placedOn && (
                    <div className="text-xs text-gray-500">
                      Placed on: {placedOn}
                    </div>
                  )}
                </div>
                <div className="mt-2 text-sm sm:mt-0">
                  {order.isDropshipperOrder && order.dropshipperProfit && order.dropshipperProfit > 0 ? (
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        Customer Total: ₹{order.total.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-gray-600">
                        Your Cost: ₹{(order.total - order.dropshipperProfit).toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs font-semibold text-green-600">
                        Profit: ₹{order.dropshipperProfit.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ) : (
                    <div className="font-medium">
                      Total: ₹{order.total.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              </div>

              {/* Tracking Status */}
              {(order.trackingNumber || order.status !== 'pending') && (
                <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tracking Status</span>
                    {order.trackingNumber && (
                      <span className="text-[10px] bg-brand/10 text-brand px-2 py-0.5 rounded-full font-bold">
                        {order.trackingStatus || 'Processing'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-brand/10 text-brand'}`}>
                      {order.status === 'delivered' ? <CheckCircle className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                      {order.trackingNumber && (
                        <div className="text-[10px] text-gray-500 font-mono">
                          Courier ID: {order.trackingNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-3 space-y-2">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 text-sm">
                    <div className="relative h-12 w-12 shrink-0">
                      <Image
                        src={item.image || '/images/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="hover:underline">{item.name}</div>
                      {item.customName && (
                        <div className="mt-1 text-xs font-medium text-blue-600">
                          Custom: &quot;{item.customName}&quot;
                        </div>
                      )}
                      <div className="text-xs text-gray-500">Qty: {item.qty}</div>
                    </div>
                    <div className="text-gray-700">
                      ₹{(item.price * item.qty).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Tracking Section */}
              <div className="mb-6">
                <OrderTracker 
                  status={order.trackingStatus || order.status}
                  trackingNumber={order.trackingNumber}
                  estimatedDelivery={order.estimatedDelivery}
                  updates={order.trackingUpdates}
                />
              </div>

              {/* Photo Cashback Section - Only for delivered orders > ₹499 */}
              {order.status.toLowerCase() === 'delivered' && order.total >= 499 && (
                <div className="mb-6 px-2">
                  <OrderPhotoUpload 
                    orderId={order.id}
                    userId={clerkUser?.id || user?.id || ''}
                    orderTotal={order.total}
                    onUploadSuccess={() => {
                      refreshUserData();
                    }}
                  />
                </div>
              )}

              <div className="flex flex-col justify-between border-t pt-2 text-sm sm:flex-row sm:items-start">
                <div className="text-gray-600">
                  <span className="font-medium">Status:</span>
                  <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadge}`}>
                    {order.status}
                  </span>
                  <div className="mt-1 text-xs text-gray-500">
                    Payment: <span className="font-medium">{order.payment}</span>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 sm:text-right">
                  <div className="font-medium">Deliver to:</div>
                  <div className="text-xs text-gray-500">
                    {order.address.fullName}, {order.address.line1}, {order.address.city}{' '}
                    {order.address.pincode}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-brand" />
                Profile & Bank Details
              </h2>
              <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-gray-600">
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Store Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Store Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Store Name (Shows on Bill)</label>
                    <input 
                      type="text" 
                      value={profile.store_name}
                      onChange={(e) => setProfile({...profile, store_name: e.target.value})}
                      placeholder="e.g. My Fashion Store"
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">WhatsApp Number</label>
                    <input 
                      type="text" 
                      value={profile.whatsapp_number}
                      onChange={(e) => setProfile({...profile, whatsapp_number: e.target.value})}
                      placeholder="10-digit number"
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Bank Account Details
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Account Holder Name</label>
                    <input 
                      type="text" 
                      value={profile.bank_details.holderName}
                      onChange={(e) => setProfile({...profile, bank_details: {...profile.bank_details, holderName: e.target.value}})}
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Account Number</label>
                    <input 
                      type="text" 
                      value={profile.bank_details.accountNumber}
                      onChange={(e) => setProfile({...profile, bank_details: {...profile.bank_details, accountNumber: e.target.value}})}
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">IFSC Code</label>
                    <input 
                      type="text" 
                      value={profile.bank_details.ifsc}
                      onChange={(e) => setProfile({...profile, bank_details: {...profile.bank_details, ifsc: e.target.value}})}
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand uppercase"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">UPI ID (Optional)</label>
                    <input 
                      type="text" 
                      value={profile.bank_details.upiId}
                      onChange={(e) => setProfile({...profile, bank_details: {...profile.bank_details, upiId: e.target.value}})}
                      placeholder="name@upi"
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowProfileModal(false)}>Cancel</Button>
              <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                {isSavingProfile ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Order Modal */}
      {showBulkModal && (
        <BulkOrderModal 
          userId={clerkUser?.id || user?.id || ''} 
          onClose={() => setShowBulkModal(false)}
          onSuccess={() => {
            fetchOrders();
            toast({ title: "Success", description: "Bulk orders placed successfully!" });
          }}
        />
      )}

      {/* Wallet History Modal */}
      {showWalletHistory && (
        <WalletHistoryModal 
          userId={clerkUser?.id || user?.id || ''} 
          onClose={() => setShowWalletHistory(false)}
        />
      )}
    </div>
  )
}
