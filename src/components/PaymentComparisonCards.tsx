'use client'
import { motion } from 'framer-motion'
import { Tag, Gift, Truck, Zap, Shield, CheckCircle, XCircle, Sparkles } from 'lucide-react'

interface PaymentComparisonCardsProps {
  cartTotal: number
  selectedMethod: 'COD' | 'PREPAID'
  onMethodChange: (method: 'COD' | 'PREPAID') => void
}

// Smart Discount Calculator - Max ₹50
export function calculatePrepaidDiscount(cartValue: number): number {
  const discount15Percent = cartValue * 0.15
  const finalDiscount = Math.min(discount15Percent, 50)
  return Math.round(finalDiscount)
}

export default function PaymentComparisonCards({
  cartTotal,
  selectedMethod,
  onMethodChange,
}: PaymentComparisonCardsProps) {
  const COD_FEE = 25
  const DELIVERY_CHARGE = 40
  const GIFT_VALUE = 347

  const prepaidDiscount = calculatePrepaidDiscount(cartTotal)
  const totalSavings = prepaidDiscount + COD_FEE + DELIVERY_CHARGE
  
  const codTotal = cartTotal + COD_FEE
  const prepaidTotal = cartTotal - prepaidDiscount

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      {/* COD Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`relative rounded-2xl p-6 border-2 transition-all cursor-pointer ${
          selectedMethod === 'COD'
            ? 'border-gray-400 bg-gray-50'
            : 'border-gray-200 bg-white opacity-75 hover:opacity-100'
        }`}
        onClick={() => onMethodChange('COD')}
      >
        {/* Not Recommended Badge */}
        <div className="absolute -top-3 right-4 bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-bold">
          NOT RECOMMENDED
        </div>

        {/* Radio Button */}
        <div className="flex items-center gap-3 mb-4">
          <input
            type="radio"
            name="payment"
            value="COD"
            checked={selectedMethod === 'COD'}
            onChange={() => onMethodChange('COD')}
            className="w-5 h-5 text-gray-600"
          />
          <h3 className="text-lg font-bold text-gray-700">Cash on Delivery</h3>
        </div>

        {/* Disadvantages */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <span>No instant discount</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <span>₹{COD_FEE} COD handling charges</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <span>No free gifts included</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <span>Standard processing time</span>
          </div>
        </div>

        {/* Total */}
        <div className="border-t-2 border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">You Pay on Delivery</span>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">₹{codTotal.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Includes ₹{COD_FEE} COD fee</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Prepaid Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`relative rounded-2xl p-6 border-4 transition-all cursor-pointer ${
          selectedMethod === 'PREPAID'
            ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
            : 'border-green-300 bg-gradient-to-br from-green-50/50 to-emerald-50/50 hover:shadow-md'
        }`}
        onClick={() => onMethodChange('PREPAID')}
      >
        {/* Savings Badge */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="absolute -top-3 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg"
        >
          SAVE ₹{totalSavings} 🎉
        </motion.div>

        {/* Radio Button */}
        <div className="flex items-center gap-3 mb-4">
          <input
            type="radio"
            name="payment"
            value="PREPAID"
            checked={selectedMethod === 'PREPAID'}
            onChange={() => onMethodChange('PREPAID')}
            className="w-5 h-5 text-green-600"
          />
          <h3 className="text-lg font-bold text-green-700 flex items-center gap-2">
            Online Payment
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </h3>
        </div>

        {/* Benefits */}
        <div className="space-y-3 mb-6">
          {/* Instant Discount */}
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm p-3 rounded-lg shadow-sm">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Tag className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-gray-900">Instant Discount</div>
              <div className="text-green-600 font-bold">Save ₹{prepaidDiscount}</div>
            </div>
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          </div>

          {/* Free Gifts */}
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm p-3 rounded-lg shadow-sm">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-gray-900">3 Free Gifts</div>
              <div className="text-purple-600 font-bold">Worth ₹{GIFT_VALUE}</div>
            </div>
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          </div>

          {/* Free Delivery */}
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm p-3 rounded-lg shadow-sm">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-gray-900">Free Delivery</div>
              <div className="text-blue-600 font-bold">Save ₹{DELIVERY_CHARGE}</div>
            </div>
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          </div>

          {/* Priority Processing */}
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm p-3 rounded-lg shadow-sm">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-gray-900">Priority Processing</div>
              <div className="text-orange-600 font-bold">Faster Delivery</div>
            </div>
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          </div>
        </div>

        {/* Total */}
        <div className="border-t-2 border-green-300 pt-4">
          <div className="flex justify-between items-end mb-3">
            <div>
              <div className="text-xs text-gray-600 line-through">₹{cartTotal.toLocaleString()}</div>
              <div className="text-sm font-medium text-green-700">Total Savings</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-700">₹{prepaidTotal.toLocaleString()}</div>
              <div className="text-xs text-green-600 font-semibold">You save ₹{totalSavings}!</div>
            </div>
          </div>

          {selectedMethod === 'PREPAID' && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mt-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              Pay Securely →
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
