'use client';

import Head from 'next/head';
import Image from 'next/image';
import { ArrowRight, CheckCircle, TrendingUp, DollarSign, Package, Users, PlayCircle, ShieldCheck, Zap, BarChart, Rocket } from 'lucide-react';
import { Button } from '../../components/ui/button';
import DropshipperForm from '../../components/DropshipperForm';

export default function DropshippingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Head>
        <title>Start Dropshipping with ShopWave | Best Reselling Platform India</title>
      </Head>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 pt-24 pb-32">
        <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/40 text-green-300 font-bold text-sm backdrop-blur-sm animate-pulse">
               <span className="w-2 h-2 rounded-full bg-green-400"></span> India's Next-Gen Reselling System
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Start Your Own <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                Profitable Business
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed">
              Stop losing money with fake suppliers. Join ShopWave for tested products, fast delivery, and a transparent payout system.
            </p>

            <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-200">
               <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg border border-white/5">
                 <ShieldCheck className="w-4 h-4 text-green-400" /> Tested Products
               </div>
               <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg border border-white/5">
                 <Zap className="w-4 h-4 text-yellow-400" /> Fast Dispatch
               </div>
               <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg border border-white/5">
                 <DollarSign className="w-4 h-4 text-blue-400" /> COD Unlocked
               </div>
            </div>
            
            <div className="pt-4">
              <a href="#plans" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1">
                View Plans <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="relative">
             <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
             <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl relative">
                <iframe 
                  className="w-full aspect-video rounded-lg shadow-lg"
                  src="https://www.youtube.com/embed/_aQzrzeZWFM?rel=0" 
                  title="ShopWave Concept"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
                <p className="text-center text-slate-400 text-sm mt-4">Watch: Complete System Explained</p>
             </div>
          </div>
        </div>
      </section>

      {/* Why Choose ShopWave / Problems vs Solution */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Why Dropshipping Fails Elsewhere?</h2>
            <p className="text-lg text-slate-600">
              People say "Dropshipping is a scam" because of <span className="text-red-500 font-bold">Fake Suppliers, High Returns, and No Support</span>.
              <br/>We fixed the system, not just the business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { icon: <Package className="w-8 h-8 text-blue-600" />, title: "No Stock Needed", desc: "Sell without buying inventory upfront. Zero Risk." },
               { icon: <ShieldCheck className="w-8 h-8 text-green-600" />, title: "Quality Tested", desc: "We only list low-return, verified products." },
               { icon: <Rocket className="w-8 h-8 text-purple-600" />, title: "Fast Delivery", desc: "3-5 Days delivery across India." },
               { icon: <Users className="w-8 h-8 text-orange-600" />, title: "Real Support", desc: "Genuine WhatsApp & Call support for sellers." }
             ].map((feature, i) => (
               <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1">
                 <div className="mb-4 bg-white p-3 rounded-xl w-fit shadow-sm">{feature.icon}</div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                 <p className="text-slate-600 text-sm">{feature.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
       <section className="py-20 px-4 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16"> 
             <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Process</span>
             <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">How ShopWave Works</h2>
          </div>
          
          <div className="grid md:grid-cols-5 gap-4 relative">
             {/* Connector Line (Desktop) */}
             <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>

             {[
               { number: "01", title: "Share", desc: "Share products on WhatsApp/Insta" },
               { number: "02", title: "Order", desc: "Customer places order with you" },
               { number: "03", title: "Submit", desc: "Enter details in ShopWave Panel" },
               { number: "04", title: "We Ship", desc: "We pack & deliver to customer" },
               { number: "05", title: "Profit", desc: "Get Paid in 1-2 Days (COD)" }
             ].map((step, i) => (
               <div key={i} className="relative z-10 bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center">
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4 border-4 border-white shadow-md">
                    {step.number}
                  </div>
                  <h4 className="font-bold text-lg mb-1">{step.title}</h4>
                  <p className="text-xs text-slate-500">{step.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">Choose Your Plan</h2>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm md:text-base">
               <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Only Product + Delivery Cost</span>
               <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold flex items-center gap-2"><CheckCircle className="w-4 h-4"/> No RTO Charges</span>
               <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold flex items-center gap-2"><CheckCircle className="w-4 h-4"/> 10% Meta Ads Fee</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Plan 1: Partner Store */}
            <div className="flex flex-col p-8 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-slate-500"></div>
              <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-wide">Partner Store Plan</h3>
              <p className="text-xs text-slate-500 font-bold mb-4 uppercase tracking-widest">For Existing Store Owners</p>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">₹999</span>
                <span className="text-slate-500 font-medium">/Joining</span>
              </div>
              <p className="text-slate-600 mb-6 text-sm">Perfect if you already have a Shopify store or website.</p>
              
              <div className="space-y-3 mb-8 flex-1">
                <p className="font-bold text-sm text-slate-900 border-b pb-2">What You Get:</p>
                <li className="flex items-start gap-3 text-slate-700 text-sm"><CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Verified Products Supply</li>
                <li className="flex items-start gap-3 text-slate-700 text-sm"><CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Same-day Dispatch & Confirmation</li>
                <li className="flex items-start gap-3 text-slate-700 text-sm"><CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> <b>No RTO Charges</b></li>
                <li className="flex items-start gap-3 text-slate-700 text-sm"><CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Meta Ads Setup (10% Fee)</li>
                <li className="flex items-start gap-3 text-red-500 text-xs"><span className="font-bold">x</span> No Website Creation</li>
              </div>
              <Button 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl font-bold"
                onClick={() => window.open("https://wa.me/919157499884?text=Hello ShopWave, I am interested in the Partner Store Plan (₹999). I already have a store. Please guide me.", "_blank")}
              >
                Join for ₹999
              </Button>
            </div>

            {/* Plan 2: Marketplace Seller */}
            <div className="flex flex-col p-8 rounded-3xl border-2 border-blue-600 bg-slate-50 shadow-xl relative transform md:-translate-y-4">
              <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Popular</div>
              <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-wide">Marketplace Seller</h3>
              <p className="text-xs text-blue-600 font-bold mb-4 uppercase tracking-widest">For Amazon / Flipkart / Meesho</p>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">₹1,999</span>
                <span className="text-slate-500 text-sm">/Lifetime Access</span>
              </div>
              <p className="text-slate-600 mb-6 text-sm">Sell on marketplaces + your own website.</p>
              
              <div className="space-y-3 mb-8 flex-1">
                 <p className="font-bold text-sm text-slate-900 border-b pb-2">What You Get:</p>
                <li className="flex items-start gap-3 text-slate-700 text-sm"><CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> Marketplace Selling Guidance</li>
                <li className="flex items-start gap-3 text-slate-700 text-sm"><CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> Products Supply & Dispatch</li>
                <li className="flex items-start gap-3 text-slate-700 text-sm"><CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> <b>No RTO Charges</b></li>
                <li className="flex items-start gap-3 text-slate-700 text-sm"><CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> Meta Ads Setup (10% Fee)</li>
                <li className="flex items-start gap-3 text-red-500 text-xs"><span className="font-bold">x</span> Self-Service Listing</li>
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl font-bold shadow-lg shadow-blue-500/30"
                onClick={() => window.open("https://wa.me/919157499884?text=Hello ShopWave, I am interested in the Marketplace Seller Plan (₹1,999). I want to sell on Amazon/Flipkart. Please guide me.", "_blank")}
              >
                Select Plan
              </Button>
            </div>

            {/* Plan 3: Full Shopify */}
            <div className="flex flex-col p-8 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-purple-500"></div>
              <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-wide">Full Shopify Store</h3>
              <p className="text-xs text-purple-600 font-bold mb-4 uppercase tracking-widest">For Complete Beginners</p>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">₹2,999</span>
                <span className="text-slate-500 text-sm">/One Time</span>
              </div>
              <p className="text-slate-600 mb-6 text-sm">We build your professional website from scratch.</p>
              
              <div className="space-y-3 mb-8 flex-1">
                <p className="font-bold text-sm text-slate-900 border-b pb-2">What You Get:</p>
                <li className="flex items-start gap-3 text-slate-700 text-sm"><CheckCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" /> <b>Full Shopify Website Creation</b></li>
                <li className="flex items-start gap-3 text-slate-700 text-sm"><CheckCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" /> Payment Gateway Setup</li>
                <li className="flex items-start gap-3 text-slate-700 text-sm"><CheckCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" /> Meta Ads Full Setup</li>
                <li className="flex items-start gap-3 text-slate-700 text-sm"><CheckCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" /> Complete Backend Support</li>
                <li className="flex items-start gap-3 text-slate-700 text-sm"><CheckCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" /> <b>No RTO Charges</b></li>
              </div>
              <Button 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl font-bold"
                onClick={() => window.open("https://wa.me/919157499884?text=Hello ShopWave, I am interested in the Full Shopify Website Plan (₹2,999). I want to start from zero. Please guide me.", "_blank")}
              >
                Get Full Setup
              </Button>
            </div>

          </div>
          
          <div className="mt-12 text-center bg-slate-50 p-6 rounded-2xl border border-slate-200">
             <h4 className="text-lg font-bold text-slate-800 mb-2">📢 Simple Comparison</h4>
             <div className="flex flex-col md:flex-row justify-center gap-4 text-sm text-slate-600">
                <p><b>Plan 1:</b> Store already hai → Products + Ads + Delivery hum sambhalenge</p>
                <span className="hidden md:inline text-slate-300">|</span>
                <p><b>Plan 2:</b> Marketplace pe sell karna hai → System + Support</p>
                <span className="hidden md:inline text-slate-300">|</span>
                <p><b>Plan 3:</b> Kuch bhi nahi hai → Hum Shopify website bana ke sab set kar denge</p>
             </div>
          </div>
        </div>
      </section>

      {/* Ads Booster Feature */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20"></div>
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
               <div className="flex-1 space-y-6">
                  <div className="inline-block p-2 px-4 rounded-lg bg-yellow-500/20 text-yellow-500 font-bold border border-yellow-500/40 text-sm">
                    POWERED BY SHOPWAVE
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black leading-tight">
                    Risk-Free <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Meta Ads System</span>
                  </h2>
                  <p className="text-lg text-slate-300">
                    "Aap sirf products sell karo, backend, delivery, RTO aur ads Shopwave sambhalega."
                  </p>
                  
                  <div className="space-y-4 pt-4">
                     <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                           <Zap className="w-6 h-6 text-white"/>
                        </div>
                        <div>
                           <div className="font-bold text-lg text-white">Winning Products Only</div>
                           <div className="text-sm text-slate-400">We run ads ONLY on tested/viral products to ensure sales.</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shrink-0">
                           <ShieldCheck className="w-6 h-6 text-white"/>
                        </div>
                        <div>
                           <div className="font-bold text-lg text-white">Full RTO Protection</div>
                           <div className="text-sm text-slate-400">Delivery in 3-5 Days. If RTO happens, <b>Product Cost is adjusted</b> in your next order.</div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="flex-1 w-full max-w-md">
                   <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-slate-700 shadow-2xl relative">
                      <div className="absolute -top-4 -right-4 bg-green-500 text-white font-bold p-3 rounded-xl shadow-lg transform rotate-12">
                         100% Transparent
                      </div>
                      <h3 className="text-xl font-bold mb-4">Your Cost Breakdown</h3>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                           <span className="text-slate-400 text-sm">Product Cost</span>
                           <span className="font-mono font-bold text-slate-300">As per catalog</span>
                         </div>
                         <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                           <span className="text-slate-400 text-sm">Delivery Charges</span>
                           <span className="font-mono font-bold text-slate-300">Actuals</span>
                         </div>
                         <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                           <span className="text-slate-400 text-sm">Ads Management</span>
                           <span className="font-mono font-bold text-yellow-400">10% Fee</span>
                         </div>
                         <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                           <span className="text-slate-400 text-sm">RTO Handling</span>
                           <span className="font-mono font-bold text-green-400">Product Cost Refunded</span>
                         </div>
                      </div>
                      <p className="text-xs text-center text-slate-500 mt-6 pt-6 border-t border-white/10">
                        Reliable • Transparent • Profitable
                      </p>
                   </div>
               </div>
            </div>
         </div>
      </section>

      {/* Start Today */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
           <h2 className="text-3xl md:text-5xl font-black text-slate-900">Start Your Business Today</h2>
           <p className="text-xl text-slate-600">
             Limited beta users only. Join India's most transparent dropshipping partner.
           </p>

           {/* PDF Link */}
           <a 
             href="https://drive.google.com/file/d/17d1-t5w5YLNFFR5aOTXEyxqlQMWkg2yJ/view?usp=drive_link" 
             target="_blank" 
             rel="noopener noreferrer"
             className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline mb-8 block"
           >
             <ShieldCheck className="w-5 h-5" /> Detailed Dropshipping Guide (PDF)
           </a>

           <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
              <h3 className="text-2xl font-bold mb-6">Quick Application Form</h3>
              <DropshipperForm />
           </div>
        </div>
      </section>
    </div>
  );
}
