'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import Image from 'next/image';

const samplePurchases = [
  { name: 'Rahul from Mumbai', product: 'Wireless Earbuds', time: '2 mins ago', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100' },
  { name: 'Amit from Delhi', product: 'Smart Watch', time: '5 mins ago', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100' },
  { name: 'Priya from Bangalore', product: 'Pooja Kit', time: '8 mins ago', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/Pooja%20Essential%20Pooja%20Essentials/1/1.webp?w=100' },
  { name: 'Suresh from Pune', product: 'LED Desk Lamp', time: '12 mins ago', image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=100' },
  { name: 'Deepa from Chennai', product: 'Kitchen Tool Set', time: '15 mins ago', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/tach/electronics%20aaitams/05_af19803f-0274-4f7b-829b-3974c9c6365d.avif?w=100' },
];

export default function SocialProof() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasClosed, setHasClosed] = useState(false);

  useEffect(() => {
    if (hasClosed) return;

    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 5000); // Show after 5 seconds

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 12000); // Hide after 12 seconds

    const nextTimer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % samplePurchases.length);
      setIsVisible(true);
      
      // Auto-hide after 7 seconds of showing
      setTimeout(() => setIsVisible(false), 7000);
    }, 25000); // Repeat every 25 seconds

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearInterval(nextTimer);
    };
  }, [hasClosed]);

  const purchase = samplePurchases[currentIdx];

  return (
    <AnimatePresence>
      {isVisible && !hasClosed && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed bottom-24 left-4 z-50 md:bottom-8 md:left-8 max-w-[280px]"
        >
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-3 flex items-center gap-3 relative overflow-hidden group">
            <div className="relative w-12 h-12 flex-shrink-0">
               <Image 
                src={purchase.image} 
                alt={purchase.product} 
                fill 
                className="rounded-lg object-cover"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                <ShoppingBag size={8} className="text-white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Recent Purchase</p>
              <p className="text-xs font-bold text-gray-800 truncate">{purchase.name}</p>
              <p className="text-[11px] text-gray-600 line-clamp-1">Bought {purchase.product}</p>
              <p className="text-[9px] text-green-600 font-medium mt-0.5">{purchase.time}</p>
            </div>

            <button 
              onClick={() => setHasClosed(true)}
              className="absolute top-1 right-1 p-1 text-gray-300 hover:text-gray-500 transition-colors"
            >
              <X size={12} />
            </button>
            
            {/* Progress bar */}
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: 0 }}
              transition={{ duration: 7, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-0.5 bg-brand/30"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
