'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, DollarSign, Package } from 'lucide-react';

export default function DropshippingBanner() {
  return (
    <section className="mb-12 px-4 max-w-7xl mx-auto">
      <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-900 shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
          
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 backdrop-blur-sm">
              <TrendingUp className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-xs font-bold tracking-wider uppercase">Zero Investment Business</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              India's Next-Gen <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Dropshipping System
              </span>
            </h2>
            
            <p className="text-blue-100 text-sm md:text-lg max-w-xl leading-relaxed">
              Stop losing money. Get 70-80% discounts, verified products, and risk-free ads support. We handle everything!
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 text-white/80 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                <Package className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">We Ship for You</span>
              </div>
              <div className="flex items-center gap-2 text-white/80 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">Weekly Payouts</span>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/dropshipping" className="inline-flex group items-center justify-center gap-3 bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl">
                Earn More Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Visual Content - 3D-like Effect */}
          <div className="flex-1 w-full max-w-md relative">
            <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-bold text-white">₹</div>
                  <div>
                    <p className="text-xs text-blue-200">Total Earnings</p>
                    <p className="text-xl font-bold text-white">₹45,250.00</p>
                  </div>
                </div>
                <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">+12.5%</div>
              </div>
              
              <div className="space-y-3">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 bg-black/20 p-3 rounded-lg">
                    <div className="w-10 h-10 bg-gray-700 rounded-md animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-3 w-24 bg-gray-600 rounded mb-2 animate-pulse"></div>
                      <div className="h-2 w-16 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="text-green-400 font-mono text-sm">+₹450</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Decor Gradients */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500 rounded-full blur-[60px] opacity-40"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500 rounded-full blur-[60px] opacity-40"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
