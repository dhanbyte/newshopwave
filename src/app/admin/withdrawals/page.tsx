'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, Search } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [filter, setFilter] = useState('all')

  const fetchWithdrawals = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/withdrawals')
      const data = await res.json()
      if (data.success) {
        setWithdrawals(data.data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWithdrawals()
  }, [])

  const handleAction = async (id: number, status: 'approved' | 'rejected') => {
    if (!confirm(`Are you sure you want to ${status} this request?`)) return

    try {
      const res = await fetch('/api/admin/withdrawals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: "Success", description: `Request ${status} successfully` })
        fetchWithdrawals()
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" })
      }
    } catch (error) {
       toast({ title: "Error", description: "Operation failed", variant: "destructive" })
    }
  }

  const filteredWithdrawals = withdrawals.filter(w => {
    if (filter === 'all') return true
    return w.status === filter
  })

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Withdrawal Requests</h1>
        <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map(f => (
                <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm capitalize ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                    {f}
                </button>
            ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-500">User</th>
              <th className="p-4 font-medium text-gray-500">Amount</th>
              <th className="p-4 font-medium text-gray-500">Bank Details</th>
              <th className="p-4 font-medium text-gray-500">Status</th>
              <th className="p-4 font-medium text-gray-500">Date</th>
              <th className="p-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredWithdrawals.map((w) => (
              <tr key={w.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium">{w.user?.name || 'Unknown'}</div>
                  <div className="text-xs text-gray-500">{w.user?.email}</div>
                  <div className="text-xs text-gray-500">{w.user?.phone}</div>
                </td>
                <td className="p-4 font-bold text-green-600">₹{w.amount}</td>
                <td className="p-4 text-sm">
                  {w.bank_details ? (
                    <div className="space-y-1">
                        <div><span className="text-gray-500">Bank:</span> {w.bank_details.bankName}</div>
                        <div><span className="text-gray-500">A/C:</span> {w.bank_details.accountNo}</div>
                        <div><span className="text-gray-500">IFSC:</span> {w.bank_details.ifsc}</div>
                        <div><span className="text-gray-500">Name:</span> {w.bank_details.holderName}</div>
                    </div>
                  ) : 'N/A'}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                    ${w.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      w.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {w.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(w.created_at).toLocaleDateString()}
                </td>
                <td className="p-4">
                  {w.status === 'pending' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAction(w.id, 'approved')}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Approve"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleAction(w.id, 'rejected')}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Reject (Refund to Wallet)"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredWithdrawals.length === 0 && (
                <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">No requests found</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
