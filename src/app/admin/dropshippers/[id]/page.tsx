'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, TrendingUp, Package, DollarSign, CheckCircle, Plus, Minus, Download, Upload, MessageCircle, ShieldCheck } from 'lucide-react'
import { generateCustomerMessage, generateDropshipperMessage, openWhatsApp } from '@/lib/whatsappTemplates'

interface DropshipperStats {
  total_orders: number
  total_products_sold: number
  total_earnings: number
  delivered_orders: number
  pending_orders: number
  wallet_balance: number
}

interface Dropshipper {
  id: string
  dropshipper_id: string
  name: string
  email: string
  dropshipper_phone: string
  dropshipper_photo: string | null
  dropshipper_status: string
  dropshipper_earnings: number
  created_at: string
}

interface Order {
  _id: string
  orderId: string
  status: string
  total: number
  createdAt: string
  items?: any[]
  shippingAddress?: {
    name?: string
    phone?: string
    address?: string
    city?: string
    state?: string
    pincode?: string
  }
  invoice_url?: string
}

interface Transaction {
  id: string
  type: string
  amount: number
  balance_after: number
  note: string
  created_at: string
}

export default function DropshipperDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [dropshipper, setDropshipper] = useState<Dropshipper | null>(null)
  const [stats, setStats] = useState<DropshipperStats | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [walletAction, setWalletAction] = useState<'add' | 'remove'>('add')
  const [walletAmount, setWalletAmount] = useState('')
  const [walletNote, setWalletNote] = useState('')
  const [uploadingInvoice, setUploadingInvoice] = useState<string | null>(null)

  useEffect(() => {
    fetchDropshipperDetails()
  }, [params.id])

  const fetchDropshipperDetails = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/dropshippers/${params.id}`)
      const data = await response.json()

      if (data.success) {
        setDropshipper(data.dropshipper)
        setStats(data.stats)
        setOrders(data.orders || [])
        setTransactions(data.transactions || [])
      }
    } catch (error) {
      console.error('Error fetching dropshipper details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWalletOperation = async () => {
    if (!walletAmount || parseFloat(walletAmount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    try {
      const response = await fetch(`/api/admin/dropshippers/${params.id}/wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: walletAction,
          amount: parseFloat(walletAmount),
          note: walletNote
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(`Successfully ${walletAction === 'add' ? 'added' : 'removed'} ₹${walletAmount}`)
        setShowWalletModal(false)
        setWalletAmount('')
        setWalletNote('')
        fetchDropshipperDetails()
      } else {
        alert(data.error || 'Operation failed')
      }
    } catch (error) {
      console.error('Error updating wallet:', error)
      alert('Failed to update wallet')
    }
  }

  const handleInvoiceUpload = async (orderId: string, file: File) => {
    setUploadingInvoice(orderId)
    const formData = new FormData()
    formData.append('invoice', file)
    formData.append('orderId', orderId)

    try {
      const response = await fetch('/api/admin/orders/upload-invoice', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        alert('Invoice uploaded successfully!')
        fetchDropshipperDetails()
      } else {
        alert(data.error || 'Failed to upload invoice')
      }
    } catch (error) {
      console.error('Error uploading invoice:', error)
      alert('Failed to upload invoice')
    } finally {
      setUploadingInvoice(null)
    }
  }

  const handleWhatsAppShare = (order: Order, recipient: 'customer' | 'dropshipper') => {
    const phone = recipient === 'customer' 
      ? order.shippingAddress?.phone 
      : dropshipper?.dropshipper_phone

    if (!phone) {
      alert(`${recipient === 'customer' ? 'Customer' : 'Dropshipper'} phone number not available`)
      return
    }

    const message = recipient === 'customer'
      ? generateCustomerMessage({
          orderId: order.orderId,
          customerName: order.shippingAddress?.name,
          amount: order.total,
          address: order.shippingAddress?.address,
          city: order.shippingAddress?.city,
          state: order.shippingAddress?.state,
          pincode: order.shippingAddress?.pincode,
          invoiceUrl: order.invoice_url
        })
      : generateDropshipperMessage({
          orderId: order.orderId,
          customerName: order.shippingAddress?.name,
          customerPhone: order.shippingAddress?.phone,
          amount: order.total,
          address: order.shippingAddress?.address,
          city: order.shippingAddress?.city,
          state: order.shippingAddress?.state,
          pincode: order.shippingAddress?.pincode,
          invoiceUrl: order.invoice_url,
          dropshipperEarning: stats?.total_earnings
        })

    openWhatsApp(phone, message)
  }

  const generateOrdersReport = () => {
    if (orders.length === 0) {
      alert('No orders to export')
      return
    }

    const csvContent = [
      ['Order ID', 'Amount', 'Status', 'Date', 'Customer', 'Phone'].join(','),
      ...orders.map(order => [
        order.orderId,
        order.total,
        order.status,
        new Date(order.createdAt).toLocaleDateString(),
        order.shippingAddress?.name || 'N/A',
        order.shippingAddress?.phone || 'N/A'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${dropshipper?.name}_orders_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const generateTransactionsReport = () => {
    if (transactions.length === 0) {
      alert('No transactions to export')
      return
    }

    const csvContent = [
      ['Date', 'Type', 'Amount', 'Balance After', 'Note'].join(','),
      ...transactions.map(txn => [
        new Date(txn.created_at).toLocaleString(),
        txn.type,
        txn.amount,
        txn.balance_after,
        txn.note
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${dropshipper?.name}_transactions_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!dropshipper) {
    return (
      <div className="p-6">
        <p className="text-red-600">Dropshipper not found</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/admin/dropshippers')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Dropshippers
        </button>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            {dropshipper.dropshipper_photo ? (
              <img
                src={dropshipper.dropshipper_photo}
                alt={dropshipper.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                {dropshipper.name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">{dropshipper.name}</h1>
              <p className="text-gray-600">ID: {dropshipper.dropshipper_id}</p>
              <p className="text-gray-600">Phone: {dropshipper.dropshipper_phone || 'N/A'}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                dropshipper.dropshipper_status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {dropshipper.dropshipper_status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-gray-800">{stats?.total_orders || 0}</p>
            </div>
            <Package className="text-blue-500" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Products Sold</p>
              <p className="text-3xl font-bold text-gray-800">{stats?.total_products_sold || 0}</p>
            </div>
            <TrendingUp className="text-green-500" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Earnings</p>
              <p className="text-3xl font-bold text-gray-800">₹{stats?.total_earnings?.toLocaleString() || 0}</p>
            </div>
            <DollarSign className="text-yellow-500" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Delivered</p>
              <p className="text-3xl font-bold text-gray-800">{stats?.delivered_orders || 0}</p>
            </div>
            <CheckCircle className="text-purple-500" size={40} />
          </div>
        </div>
      </div>

      {/* Subscription & Payment Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 border-l-4 border-blue-600">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
           <ShieldCheck className="text-blue-600" /> Subscription & Payment Details
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
           <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Plan</p>
              <p className="text-lg font-black text-slate-900">{(dropshipper as any).dropshipper_plan_id || 'N/A'}</p>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">{(dropshipper as any).dropshipper_plan_interval || 'Standard'}</span>
           </div>
           <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payment Reference</p>
              <p className="text-lg font-mono font-bold text-blue-600">{(dropshipper as any).dropshipper_payment_id || 'NO_REF_FOUND'}</p>
              <p className="text-xs text-slate-500">Verified via Razorpay</p>
           </div>
           <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Member Since</p>
              <p className="text-lg font-bold text-slate-900">
                {new Date(dropshipper.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-xs text-green-600 font-bold italic">Status: {dropshipper.dropshipper_status}</p>
           </div>
        </div>
      </div>

      {/* Wallet Management */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">💰 Wallet Management</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Current Balance</p>
            <p className="text-4xl font-bold text-green-600">₹{stats?.wallet_balance?.toLocaleString() || 0}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setWalletAction('add')
                setShowWalletModal(true)
              }}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Plus size={20} />
              Add Money
            </button>
            <button
              onClick={() => {
                setWalletAction('remove')
                setShowWalletModal(true)
              }}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              <Minus size={20} />
              Remove Money
            </button>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">📦 Orders ({orders.length})</h2>
          <button 
            onClick={generateOrdersReport}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Download size={20} />
            Generate Report
          </button>
        </div>

        {orders.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Invoice</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">#{order.orderId}</td>
                    <td className="px-4 py-3 text-sm font-semibold">₹{order.total.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm">
                      {order.invoice_url ? (
                        <a href={order.invoice_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                          View
                        </a>
                      ) : (
                        <label className="cursor-pointer text-blue-600 hover:underline text-xs flex items-center gap-1">
                          <Upload size={12} />
                          {uploadingInvoice === order.orderId ? 'Uploading...' : 'Upload'}
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            disabled={uploadingInvoice === order.orderId}
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleInvoiceUpload(order.orderId, file)
                            }}
                          />
                        </label>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleWhatsAppShare(order, 'customer')}
                          className="text-green-600 hover:text-green-800 text-xs flex items-center gap-1"
                          title="Share with Customer"
                        >
                          <MessageCircle size={14} />
                          Customer
                        </button>
                        <button
                          onClick={() => handleWhatsAppShare(order, 'dropshipper')}
                          className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                          title="Share with Dropshipper"
                        >
                          <MessageCircle size={14} />
                          DS
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">💳 Transaction History</h2>
          <button 
            onClick={generateTransactionsReport}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            <Download size={20} />
            Export Report
          </button>
        </div>

        {transactions.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No transactions found</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{txn.type}</p>
                  <p className="text-sm text-gray-600">{txn.note}</p>
                  <p className="text-xs text-gray-500">{new Date(txn.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${txn.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Balance: ₹{txn.balance_after.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4">
              {walletAction === 'add' ? '➕ Add Money' : '➖ Remove Money'}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={walletAmount}
                onChange={(e) => setWalletAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Note (Optional)</label>
              <textarea
                value={walletNote}
                onChange={(e) => setWalletNote(e.target.value)}
                placeholder="Add a note..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleWalletOperation}
                className={`flex-1 px-4 py-2 rounded-lg text-white ${
                  walletAction === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowWalletModal(false)
                  setWalletAmount('')
                  setWalletNote('')
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
