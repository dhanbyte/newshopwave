'use client'

import { AlertCircle, Package } from 'lucide-react'

interface StockUrgencyProps {
  stock: number
  threshold?: number
}

export default function StockUrgency({ stock, threshold = 10 }: StockUrgencyProps) {
  if (stock > threshold) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
        <Package className="w-4 h-4" />
        <span>In Stock</span>
      </div>
    )
  }
  
  if (stock > 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 my-3">
        <div className="flex items-center gap-2 text-red-600 font-semibold">
          <AlertCircle className="w-5 h-5" />
          <span>Only {stock} left in stock!</span>
        </div>
        <p className="text-xs text-red-500 mt-1">Order now before it's gone</p>
      </div>
    )
  }
  
  return (
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 my-3">
      <div className="flex items-center gap-2 text-gray-600 font-semibold">
        <AlertCircle className="w-5 h-5" />
        <span>Out of Stock</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">Notify me when available</p>
    </div>
  )
}
