'use client'
import { useCartWithUser } from '@/hooks/useCartWithUser'
import { useAuth } from '@/context/ClerkAuthContext'
import { useEffect, useState } from 'react'

export default function CartOfferBanner() {
  const { user } = useAuth()
  const { deliveryInfo, total } = useCartWithUser()
  const { giftTier, isFreeDelivery, gifts, deliveryCharge } = deliveryInfo
  const [animateGift, setAnimateGift] = useState(0)
  
  // Hide offer banner for dropshippers
  if (user?.is_dropshipper) {
    return (
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-blue-600">📦</span>
          <span className="text-blue-800 font-medium">Dropshipper Shipping</span>
        </div>
        <div className="text-blue-700 text-sm mt-2 space-y-1">
          <p>• Delivery Charge: ₹40 (Always applies)</p>
          <p>• COD Charge: ₹25 (Cash on Delivery)</p>
          <p>• No free gifts or delivery offers</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (giftTier > 0) {
      setAnimateGift(giftTier)
      const timer = setTimeout(() => setAnimateGift(0), 2000)
      return () => clearTimeout(timer)
    }
  }, [giftTier])

  const cartTotal = total - deliveryCharge - deliveryInfo.codCharge - (total * 0.08)

  return (
    <div className="space-y-3">
      {/* Delivery Status */}
      <div className={`p-4 rounded-lg transition-all duration-500 ${
        isFreeDelivery 
          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
          : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            {isFreeDelivery ? (
              <p className="font-semibold">🎉 Free Delivery Unlocked!</p>
            ) : (
              <div>
                <p className="font-semibold">🚚 Add ₹{399 - Math.floor(cartTotal)} more for Free Delivery!</p>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (cartTotal / 399) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gift Tiers */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg">
        <h3 className="font-semibold mb-3">🎁 Gift Offers</h3>
        <div className="space-y-2">
          {[
            { tier: 1, amount: 399, gifts: 1 },
            { tier: 2, amount: 699, gifts: 2 },
            { tier: 3, amount: 999, gifts: 3 }
          ].map(({ tier, amount, gifts: giftCount }) => (
            <div 
              key={tier}
              className={`flex items-center justify-between p-2 rounded transition-all duration-500 ${
                giftTier >= tier 
                  ? 'bg-white/20 border-2 border-yellow-300' 
                  : 'bg-white/10'
              } ${animateGift === tier ? 'animate-pulse scale-105' : ''}`}
            >
              <span className="flex items-center gap-2">
                {giftTier >= tier ? (
                  <span className="text-yellow-300">
                    {'🎁'.repeat(giftCount)}
                  </span>
                ) : (
                  <span className="text-gray-300">🔒</span>
                )}
                <span className={giftTier >= tier ? 'font-semibold' : ''}>
                  ₹{amount}+ → {giftCount} Free Gift{giftCount > 1 ? 's' : ''}
                </span>
              </span>
              {giftTier >= tier && (
                <span className="text-yellow-300 font-bold animate-bounce">✓</span>
              )}
            </div>
          ))}
        </div>

        {/* Current Gifts */}
        {gifts.length > 0 && (
          <div className="mt-4 p-3 bg-white/20 rounded-lg">
            <h4 className="font-medium mb-2">Your Free Gifts:</h4>
            <div className="grid grid-cols-1 gap-2">
              {gifts.map((gift, index) => (
                <div 
                  key={gift.id} 
                  className={`flex items-center gap-3 p-2 bg-white/10 rounded animate-fadeIn`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <img src={gift.image} alt={gift.name} className="w-10 h-10 rounded object-cover" />
                  <span className="text-sm font-medium">{gift.name}</span>
                  <span className="ml-auto text-yellow-300">🎁</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}