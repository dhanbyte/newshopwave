'use client'

import { Truck, Clock } from 'lucide-react'
import { formatDeliveryMessage } from '@/lib/deliveryEstimate'

interface DeliveryEstimateProps {
  variant?: 'default' | 'compact'
}

export default function DeliveryEstimate({ variant = 'default' }: DeliveryEstimateProps) {
  const deliveryMessage = formatDeliveryMessage()
  
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
        <Truck className="w-4 h-4" />
        <span>Delivery in 6 days</span>
      </div>
    )
  }
  
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 my-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-green-100 rounded-full">
          <Truck className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">Fast Delivery</h4>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {deliveryMessage}
          </p>
          <p className="text-xs text-green-600 font-medium mt-2">
            ✓ Free delivery on all orders
          </p>
        </div>
      </div>
    </div>
  )
}
