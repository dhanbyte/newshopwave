'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Package, Weight, IndianRupee } from 'lucide-react'
import { getShippingDetails } from '../lib/utils/shipping'

type ShippingDetailsProps = {
  items: Array<{
    id: string
    qty: number
    weight?: number
    name: string
    category?: string
  }>
}

export default function ShippingDetails({ items }: ShippingDetailsProps) {
  const [showDetails, setShowDetails] = useState(false)
  const shippingDetails = getShippingDetails(items)

  return (
    <div className="border rounded-2xl p-4 bg-white shadow-sm border-slate-100 mt-4">
      <div 
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 transition-colors">
            <Weight className="h-5 w-5" />
          </div>
          <div>
            <span className="text-sm font-black text-slate-900 block tracking-tight">
              Shipping Weight & Payment
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-bold text-slate-400 capitalize">
                Total: {shippingDetails.totalWeightKg}kg / {shippingDetails.totalWeight}g
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-200"></span>
              <span className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-0.5">
                <IndianRupee className="h-2 w-2" /> {shippingDetails.shippingCost > 0 ? shippingDetails.shippingCost : 'Free'} Delivery
              </span>
            </div>
          </div>
        </div>
        {showDetails ? (
          <ChevronUp className="h-5 w-5 text-slate-300" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-300" />
        )}
      </div>
      
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-slate-50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Items Weight</div>
              <div className="text-sm font-black text-slate-900">{shippingDetails.totalWeight - shippingDetails.packagingWeight}g</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Packaging</div>
              <div className="text-sm font-black text-slate-900">+{shippingDetails.packagingWeight}g</div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
               <IndianRupee className="h-4 w-4 text-blue-600" />
               <span className="text-xs font-bold text-blue-800 uppercase">Estimated Shipping Fee</span>
            </div>
            <span className="text-sm font-black text-blue-900">₹{shippingDetails.shippingCost}</span>
          </div>
          
          <div className="space-y-2">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Weight Breakdown</div>
            {shippingDetails.breakdown.map((item, index) => (
              <div key={item.id} className="flex justify-between items-center p-2.5 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                <div className="flex-1 mr-4 overflow-hidden">
                  <span className="text-xs font-medium text-slate-700 truncate block">
                    {item.name}
                  </span>
                  <p className="text-[10px] font-bold text-slate-400">UNIT: {item.weight}g × {item.qty}</p>
                </div>
                <span className="text-xs font-black text-slate-900 whitespace-nowrap bg-white px-2 py-1 rounded-lg border border-slate-50 shadow-sm">{item.totalWeight}g</span>
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-slate-900 rounded-xl flex items-start gap-3">
            <Package className="h-4 w-4 text-green-400 mt-0.5" />
            <p className="text-[9px] font-medium text-white/70 leading-relaxed uppercase tracking-wider">
              Secure packaging adds ~30g to ensure your items arrive damage-free. Shipping cost is calculated based on slab rates.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}