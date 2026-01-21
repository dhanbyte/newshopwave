'use client';

import React from 'react';
import Head from 'next/head';
import { CheckCircle, ArrowRight, Zap, ShieldCheck, Check, LayoutDashboard, BarChart, PhoneCall, Truck } from 'lucide-react';
import { Button } from '../../components/ui/button';
import Link from 'next/link';

export default function DropshippingPlansPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 underline decoration-blue-500 underline-offset-8 italic">Dropshipping Plan</h1>
          <p className="mt-8 text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Join India's most powerful, all-in-one dropshipping ecosystem. We handle everything while you build your brand.
          </p>
        </div>

        {/* The Single ₹5,000 Plan */}
        <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border-t-8 border-blue-600 relative">
           <div className="absolute top-0 right-0 p-12 opacity-5">
              <Zap className="w-64 h-64 text-white" />
           </div>
           
           <div className="p-8 md:p-16 text-white">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                 <div className="space-y-8">
                    <div className="bg-blue-600 w-fit px-6 py-2 rounded-xl font-black text-sm uppercase tracking-widest">All-In-One Ecosystem</div>
                    <h2 className="text-4xl font-black italic">Success Plan</h2>
                    <div className="space-y-4">
                       <p className="text-5xl font-black">₹5,000 <span className="text-xl text-slate-400 font-normal">/Month</span></p>
                       <p className="text-blue-400 font-bold uppercase tracking-widest text-sm">All Features Included</p>
                    </div>
                    
                    <ul className="space-y-4 text-slate-300">
                       <li className="flex gap-3"><CheckCircle className="text-blue-500 shrink-0" /> No Advance Product Payment</li>
                       <li className="flex gap-3"><CheckCircle className="text-blue-500 shrink-0" /> Expert Meta Ads Management (7% Fee)</li>
                       <li className="flex gap-3"><CheckCircle className="text-blue-500 shrink-0" /> Automated IVR Customer Confirmation</li>
                       <li className="flex gap-3"><CheckCircle className="text-blue-500 shrink-0" /> Weekly Payouts into Your Bank</li>
                       <li className="flex gap-3"><CheckCircle className="text-blue-500 shrink-0" /> Professionally Handled Delivery & RTO</li>
                       <li className="flex gap-3"><CheckCircle className="text-blue-500 shrink-0" /> Scale Without Capital Pressure</li>
                    </ul>
                 </div>

                 <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 space-y-6">
                    <h3 className="text-xl font-black border-b border-white/10 pb-4">Key Benefits</h3>
                    <div className="space-y-6">
                       <div className="flex gap-4">
                          <div className="bg-blue-600 p-3 rounded-xl"><LayoutDashboard className="w-5 h-5" /></div>
                          <div>
                             <p className="font-bold">Store Management</p>
                             <p className="text-xs text-slate-400">Ready-to-sell store support</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <div className="bg-green-600 p-3 rounded-xl"><Truck className="w-5 h-5" /></div>
                          <div>
                             <p className="font-bold">Logistics Done-for-you</p>
                             <p className="text-xs text-slate-400">Fast delivery across India</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <div className="bg-purple-600 p-3 rounded-xl"><PhoneCall className="w-5 h-5" /></div>
                          <div>
                             <p className="font-bold">IVR Confirmation</p>
                             <p className="text-xs text-slate-400">Reduces fake orders automatically</p>
                          </div>
                       </div>
                    </div>
                    
                    <Button 
                       className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black text-xl rounded-2xl shadow-xl shadow-blue-500/20"
                       onClick={() => window.open("https://wa.me/919157499884?text=I'm interested in the ₹5,000 Dropshipping Plan", "_blank")}
                    >
                       Get Started Now
                    </Button>
                 </div>
              </div>
           </div>
        </div>

        <div className="mt-16 text-center space-y-8">
           <p className="text-slate-500 font-bold uppercase tracking-widest text-sm italic">Compared to Other Platforms</p>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["No Advance Payment", "Weekly Payouts", "Full Support", "Your Brand"].map((text, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 font-bold text-slate-700 text-sm shadow-sm flex items-center justify-center gap-2">
                   <Check className="w-4 h-4 text-green-500" /> {text}
                </div>
              ))}
           </div>
           
           <div className="pt-12">
              <Link href="/dropshipping" className="inline-flex items-center gap-2 text-blue-600 font-black hover:underline text-lg">
                View Full Market Comparison & Details <ArrowRight className="w-5 h-5" />
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
