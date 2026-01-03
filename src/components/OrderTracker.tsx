'use client';

import { Check, Truck, Package, Clock, MapPin, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import type { TrackingUpdate } from '@/lib/types';

interface OrderTrackerProps {
  status: string;
  trackingNumber?: string | null;
  estimatedDelivery?: string | null;
  updates?: TrackingUpdate[];
}

export default function OrderTracker({ 
  status, 
  trackingNumber, 
  estimatedDelivery, 
  updates = [] 
}: OrderTrackerProps) {
  const { toast } = useToast();
  
  const steps = [
    { id: 'pending', label: 'Order Placed', icon: Clock },
    { id: 'processing', label: 'Processing', icon: Package },
    { id: 'shipped', label: 'Shipped', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: Check },
  ];

  const currentStatusIndex = steps.findIndex(s => s.id === status.toLowerCase());
  const activeIndex = currentStatusIndex === -1 ? 0 : currentStatusIndex;

  const copyTracking = () => {
    if (trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      toast({
        title: "Tracking number copied!",
        description: trackingNumber,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-8">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {trackingNumber && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking Number</p>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-gray-900">{trackingNumber}</span>
              <button 
                onClick={copyTracking}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-600"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
        )}
        
        {estimatedDelivery && (
          <div className="text-right ml-auto">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Delivery</p>
            <p className="font-bold text-blue-600">{estimatedDelivery}</p>
          </div>
        )}
      </div>

      {/* Visual Timeline */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-blue-500 transition-all duration-500 -translate-y-1/2" 
          style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
        />
        
        <div className="relative flex justify-between">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= activeIndex;
            const isActive = idx === activeIndex;

            return (
              <div key={step.id} className="flex flex-col items-center gap-2 relative">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    isCompleted ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-gray-200 text-gray-400",
                    isActive && "ring-4 ring-blue-50"
                  )}
                >
                  <Icon size={18} />
                </div>
                <span 
                  className={cn(
                    "text-[10px] sm:text-xs font-bold whitespace-nowrap",
                    isCompleted ? "text-blue-600" : "text-gray-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Updates */}
      {updates.length > 0 && (
        <div className="pt-4 border-t border-gray-50">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Latest Updates</h4>
          <div className="space-y-4">
            {updates.slice(0, 3).map((update, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="mt-1 flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  {idx !== Math.min(updates.length, 3) - 1 && (
                    <div className="w-0.5 h-full bg-blue-100" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-semibold text-gray-900">{update.status}</p>
                    <span className="text-[10px] text-gray-400">{new Date(update.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} /> {update.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
