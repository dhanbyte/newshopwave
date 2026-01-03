'use client'

export default function FreeDeliveryBanner() {
  return (
    <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white text-center py-3 px-4 shadow-md">
      <div className="container mx-auto flex items-center justify-center gap-2 flex-wrap">
        <span className="text-lg md:text-xl font-bold">🎉</span>
        <span className="text-sm md:text-base font-semibold">
          FREE Delivery on ALL Orders
        </span>
        <span className="hidden md:inline text-sm">•</span>
        <span className="text-xs md:text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
          No Minimum Order Value
        </span>
        <span className="hidden md:inline text-sm">•</span>
        <span className="text-xs md:text-sm">
          💳 Extra 5% OFF on Prepaid Orders
        </span>
      </div>
    </div>
  )
}
