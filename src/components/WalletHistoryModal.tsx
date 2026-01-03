'use client'

import { useEffect, useState } from 'react'
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Clock, 
  Search,
  X 
} from 'lucide-react'

interface Transaction {
  id: string
  created_at: string
  amount: number
  type: 'credit' | 'debit'
  description: string
  reference_id?: string
  status: string
}

export default function WalletHistoryModal({ userId, onClose }: { userId: string, onClose: () => void }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/user/wallet-history?userId=${userId}`)
        const data = await res.json()
        if (data.success) {
          setTransactions(data.transactions)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [userId])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div>
            <h2 className="text-xl font-black text-gray-900">Wallet Transactions</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">History & Ledger</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-bold text-gray-400">Loading Ledger...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200">
                <Search className="w-8 h-8" />
              </div>
              <p className="font-bold text-gray-400">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${
                        tx.type === 'credit' 
                          ? 'bg-green-50 text-green-600' 
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {tx.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="text-sm font-black text-gray-900">{tx.description}</div>
                        <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 mt-0.5 uppercase tracking-tighter">
                          <Clock className="w-3 h-3" />
                          {new Date(tx.created_at).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-base font-black ${
                        tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                        {tx.status}
                      </div>
                    </div>
                  </div>
                  {tx.reference_id && (
                    <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Ref ID:</span>
                      <span className="text-[10px] font-mono font-bold text-gray-600 bg-gray-50 px-2 py-0.5 rounded">{tx.reference_id}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
