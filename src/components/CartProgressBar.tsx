'use client'
import { motion } from 'framer-motion'
import { Gift, Truck, Check, Lock } from 'lucide-react'

interface CartProgressBarProps {
  cartValue: number
}

const MILESTONES = [
  { value: 399, label: '₹399', rewards: ['1 Gift (Prepaid)'], icon: Gift },
  { value: 699, label: '₹699', rewards: ['2 Gifts (Prepaid)'], icon: Gift },
  { value: 999, label: '₹999', rewards: ['3 Gifts + Free Delivery (Prepaid)'], icon: Gift },
]

export default function CartProgressBar({ cartValue }: CartProgressBarProps) {
  // Calculate progress percentage
  const maxMilestone = MILESTONES[MILESTONES.length - 1].value
  const progress = Math.min((cartValue / maxMilestone) * 100, 100)

  // Find current milestone and next milestone
  const currentMilestoneIndex = MILESTONES.findIndex(m => cartValue < m.value)
  const nextMilestone = currentMilestoneIndex === -1 
    ? null 
    : MILESTONES[currentMilestoneIndex]

  const gap = nextMilestone ? nextMilestone.value - cartValue : 0

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4 shadow-sm border border-purple-100">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Gift className="w-4 h-4 text-purple-600" />
          Rewards Progress
        </h3>
        <div className="text-xs font-semibold text-purple-700">
          ₹{cartValue}
        </div>
      </div>

      {/* Compact Progress Bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute h-full bg-gradient-to-r from-green-500 to-purple-500 rounded-full"
        />
      </div>

      {/* Compact Milestones */}
      <div className="flex justify-between text-xs mb-2">
        <span className={cartValue >= 399 ? 'text-green-600 font-semibold' : 'text-gray-400'}>
          ₹399
        </span>
        <span className={cartValue >= 699 ? 'text-green-600 font-semibold' : 'text-gray-400'}>
          ₹699
        </span>
        <span className={cartValue >= 999 ? 'text-green-600 font-semibold' : 'text-gray-400'}>
          ₹999
        </span>
      </div>

      {/* Current Rewards - Compact Inline */}
      <div className="flex flex-wrap gap-1.5">
        {cartValue >= 399 && (
          <div className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
            <Gift className="w-3 h-3" />
            1 Gift (Prepaid)
          </div>
        )}
        {cartValue >= 699 && (
          <div className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
            <Gift className="w-3 h-3" />
            2 Gifts (Prepaid)
          </div>
        )}
        {cartValue >= 999 && (
          <div className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full text-xs font-medium">
            <Gift className="w-3 h-3" />
            3 Gifts + Free Delivery (Prepaid)
          </div>
        )}
      </div>

      {/* COD Delivery Charge Notice */}
      <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
        <p className="text-xs text-blue-800">
          💳 <strong>Choose Prepaid</strong> at checkout for free delivery & gifts!
        </p>
        <p className="text-xs text-gray-600 mt-0.5">
          COD orders: ₹40 delivery + ₹25 COD charges apply
        </p>
      </div>

      {/* Next Milestone - Compact */}
      {nextMilestone && (
        <div className="mt-2 bg-orange-50 border border-orange-200 rounded-lg p-2 text-center">
          <p className="text-xs font-medium text-orange-800">
            🎯 Add ₹{gap} for {nextMilestone.rewards.join(' + ')}
          </p>
        </div>
      )}

      {/* All Unlocked - Compact */}
      {cartValue >= 999 && (
        <div className="mt-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-2 text-center">
          <div className="text-white text-xs font-bold">
            🎉 All Rewards Unlocked!
          </div>
        </div>
      )}
    </div>
  )
}
