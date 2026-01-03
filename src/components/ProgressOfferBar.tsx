'use client'
import { useCart } from '@/lib/cartStore'
import { getGiftTier } from '@/lib/data/gifts'
import { Gift } from 'lucide-react'

export default function ProgressOfferBar() {
  const { subtotal, totalDiscount } = useCart()
  const itemTotal = subtotal - totalDiscount
  
  const giftTiers = [399, 699, 999]
  const nextTier = giftTiers.find(tier => tier > itemTotal) || 999
  
  // Calculate progress relative to current goal
  const prevTier = [...giftTiers].reverse().find(t => t <= itemTotal) || 0
  const range = nextTier - prevTier
  const currentProgress = itemTotal >= 999 ? 100 : Math.min(((itemTotal - prevTier) / (nextTier - prevTier)) * 100, 100)
  
  // Determine overall completion for visual bar
  const totalProgress = Math.min((itemTotal / 999) * 100, 100)
  
  return (
    <div className="bg-white rounded-2xl border border-brand/20 shadow-sm overflow-hidden mb-6">
      <div className="bg-brand/5 p-4 md:p-5">
        {itemTotal >= 999 ? (
           <div className="flex items-center justify-center gap-2 text-green-600 font-black animate-pulse">
             <Gift className="h-6 w-6" />
             <span className="text-base md:text-lg">MAXIMUM REWARDS UNLOCKED!</span>
           </div>
        ) : (
           <div className="text-center leading-tight">
             <span className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wide">Add</span>
             <span className="text-2xl md:text-3xl font-black text-brand mx-2">₹{nextTier - itemTotal}</span>
             <span className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wide">more for</span>
             <span className="block text-brand font-black text-xl md:text-2xl mt-1 uppercase w-full">
               {itemTotal < 399 ? '1 Free Gift' : itemTotal < 699 ? '2nd Free Gift' : '3rd Free Gift'}
             </span>
           </div>
        )}
      </div>
      
      {/* Progress Bar Visuals */}
      <div className="px-4 pb-4 bg-white pt-3">
        <div className="relative h-3 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-brand rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(251,146,60,0.5)]"
            style={{ width: `${totalProgress}%` }}
          />
          {/* Ticks */}
          <div className="absolute top-0 left-[40%] w-0.5 h-full bg-white/50" />
          <div className="absolute top-0 left-[70%] w-0.5 h-full bg-white/50" />
        </div>
        
        <div className="flex justify-between text-[10px] md:text-xs font-black text-slate-400 mt-2 uppercase tracking-wide">
          <div className={itemTotal >= 399 ? 'text-brand' : ''}>
            <div>₹399</div>
            <div>1 Gift</div>
          </div>
          <div className={`text-center ${itemTotal >= 699 ? 'text-brand' : ''}`}>
            <div>₹699</div>
            <div>2 Gifts</div>
          </div>
          <div className={`text-right ${itemTotal >= 999 ? 'text-brand' : ''}`}>
            <div>₹999</div>
            <div>3 Gifts</div>
          </div>
        </div>
      </div>
    </div>
  )
}