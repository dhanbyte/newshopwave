'use client'
import { useState, useEffect } from 'react'
import { Copy, Share2, TrendingUp, DollarSign, Users, ShoppingCart } from 'lucide-react'
import { Button } from './ui/button'
import { useAuth } from '../context/ClerkAuthContext'

interface AffiliateStats {
  total_referrals: number
  active_referrals: number
  total_orders_from_referrals: number
  total_commission_earned: number
  pending_commission: number
  approved_commission: number
  paid_commission: number
  current_tier: string
  commission_rate: number
}

interface Commission {
  id: string
  order_id: string
  order_amount: number
  commission_amount: number
  status: string
  created_at: string
}

export default function AffiliateDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<AffiliateStats | null>(null)
  const [recentCommissions, setRecentCommissions] = useState<Commission[]>([])
  const [referralCode, setReferralCode] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (user?.id) {
      fetchAffiliateStats()
    }
  }, [user?.id])

  const fetchAffiliateStats = async () => {
    try {
      const response = await fetch(`/api/affiliate/stats?userId=${user?.id}`)
      const data = await response.json()
      
      if (data.success) {
        setStats(data.stats)
        setRecentCommissions(data.recentCommissions)
        setReferralCode(data.referralCode || '')
      }
    } catch (error) {
      console.error('Error fetching affiliate stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAffiliateLink = () => {
    if (typeof window !== 'undefined' && referralCode) {
      return `${window.location.origin}?ref=${referralCode}`
    }
    return ''
  }

  const copyLink = () => {
    const link = getAffiliateLink()
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareWhatsApp = () => {
    const link = getAffiliateLink()
    const message = `🎉 Hey! Check out ShopWave - amazing products at great prices! Use my link to get started: ${link}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'bg-purple-100 text-purple-800'
      case 'Gold': return 'bg-yellow-100 text-yellow-800'
      case 'Silver': return 'bg-gray-100 text-gray-800'
      default: return 'bg-orange-100 text-orange-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600'
      case 'approved': return 'text-blue-600'
      case 'pending': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading affiliate data...</div>
  }

  if (!referralCode) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">💰 Become an Affiliate</h2>
        <p className="text-gray-600 mb-4">
          Start earning 10% commission on every purchase made by your referrals!
        </p>
        <Button
          onClick={async () => {
            const response = await fetch('/api/referrals/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user?.id, userEmail: user?.email })
            })
            const data = await response.json()
            if (data.success) {
              setReferralCode(data.code)
              fetchAffiliateStats()
            }
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Generate Affiliate Link
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">💰 Affiliate Dashboard</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getTierColor(stats?.current_tier || 'Bronze')}`}>
            {stats?.current_tier} - {stats?.commission_rate}%
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-blue-100 text-sm">Total Earned</p>
            <p className="text-2xl font-bold">₹{stats?.total_commission_earned?.toFixed(2) || '0.00'}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Pending</p>
            <p className="text-2xl font-bold">₹{stats?.pending_commission?.toFixed(2) || '0.00'}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Approved</p>
            <p className="text-2xl font-bold">₹{stats?.approved_commission?.toFixed(2) || '0.00'}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Paid Out</p>
            <p className="text-2xl font-bold">₹{stats?.paid_commission?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Referrals</p>
              <p className="text-2xl font-bold">{stats?.total_referrals || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-full">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold">{stats?.total_orders_from_referrals || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Referrals</p>
              <p className="text-2xl font-bold">{stats?.active_referrals || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Affiliate Link */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-bold text-lg mb-4">🔗 Your Affiliate Link</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={getAffiliateLink()}
            readOnly
            className="flex-1 px-4 py-2 border rounded-lg bg-gray-50"
          />
          <Button onClick={copyLink} variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button onClick={shareWhatsApp} className="bg-green-600 hover:bg-green-700">
            <Share2 className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          💡 Share this link and earn {stats?.commission_rate}% commission on every purchase!
        </p>
      </div>

      {/* Recent Commissions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-bold text-lg mb-4">📈 Recent Commissions</h3>
        {recentCommissions.length > 0 ? (
          <div className="space-y-3">
            {recentCommissions.map((commission) => (
              <div key={commission.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Order #{commission.order_id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(commission.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">₹{commission.commission_amount.toFixed(2)}</p>
                  <p className={`text-sm capitalize ${getStatusColor(commission.status)}`}>
                    {commission.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No commissions yet. Start sharing your link!
          </p>
        )}
      </div>

      {/* Tier Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-bold text-lg mb-4">🏆 Tier Progress</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Bronze (10%)</span>
              <span className="text-sm">Silver (12%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${Math.min(((stats?.total_referrals || 0) / 11) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats?.total_referrals || 0} / 11 referrals to Silver
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}