'use client';

import Head from 'next/head';
import Image from 'next/image';
import { 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Zap, 
  ZapOff,
  DollarSign, 
  Package, 
  Users, 
  PlayCircle, 
  BarChart, 
  Rocket,
  Check,
  X,
  PhoneCall,
  LayoutDashboard,
  Truck,
  Building2,
  Mail,
  Instagram,
  Globe
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import DropshipperForm from '../../components/DropshipperForm';

export default function DropshippingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Head>
        <title>Shopwave | All-in-One Dropshipping success Ecosystem</title>
        <meta name="description" content="Start your e-commerce business without risk or heavy investment with Shopwave's ₹5,000 monthly plan." />
      </Head>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-slate-900 to-black pt-24 pb-32">
        <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold text-sm backdrop-blur-sm">
               <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span> All-in-One Dropshipping Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
              Start Your Own <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                E-commerce Empire
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-medium">
              Start your business without risk or heavy investment. We handle products, delivery, and even your marketing.
            </p>

            <div className="flex flex-wrap justify-center gap-6 pt-4">
               {[
                 { icon: <ShieldCheck className="w-5 h-5" />, text: "Zero Risk" },
                 { icon: <ZapOff className="w-5 h-5" />, text: "No Advance Payment" },
                 { icon: <Users className="w-5 h-5" />, text: "Full Support" },
                 { icon: <Building2 className="w-5 h-5" />, text: "Your Brand" }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/5 text-white font-semibold">
                   {item.icon} {item.text}
                 </div>
               ))}
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#plan" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-blue-500/30 transform hover:-translate-y-1">
                Start Today for ₹5,000 <ArrowRight className="w-6 h-6" />
              </a>
              <a href="#how-it-works" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-bold border border-white/10">
                How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Roposo vs Shopwave Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter italic">Market Comparison</h2>
            <p className="text-lg text-slate-600">Platform Control vs. Business Ownership</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Roposo Box */}
            <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 relative group overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                  <X className="w-24 h-24 text-red-600" />
               </div>
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center overflow-hidden p-2">
                     <span className="font-bold text-red-500 italic">roposo</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Roposo Clout</h3>
                    <p className="text-red-600 font-bold text-sm">Limited Control</p>
                  </div>
               </div>
               <ul className="space-y-4">
                 {[
                   "Limited seller control over data",
                   "Strict platform-dependent rules",
                   "No independent brand identity",
                   "Short-term selling model",
                   "Advance product payments often required"
                 ].map((text, i) => (
                   <li key={i} className="flex gap-3 text-slate-600 font-medium">
                     <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" /> {text}
                   </li>
                 ))}
               </ul>
            </div>

            {/* Shopwave Box */}
            <div className="p-10 rounded-[2.5rem] bg-blue-600 text-white relative group overflow-hidden shadow-2xl shadow-blue-200">
               <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform">
                  <Check className="w-24 h-24 text-white" />
               </div>
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center p-2 text-blue-600">
                     <span className="font-bold italic">Shopwave</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Shopwave Advantage</h3>
                    <p className="text-blue-200 font-bold text-sm">Full Control & Own Brand</p>
                  </div>
               </div>
               <ul className="space-y-4">
                 {[
                   "Complete business control (Independent)",
                   "Independent operations - Your Rules",
                   "Build your own REAL brand",
                   "Long-term growth focus",
                   "No Advance product payments required"
                 ].map((text, i) => (
                   <li key={i} className="flex gap-3 text-white font-medium">
                     <CheckCircle className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" /> {text}
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Main Comparison Table */}
      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900">Why Shopwave is Better?</h2>
            <p className="text-slate-600 mt-4">Comparison with Meesho, Glowroad, Shop101 & others</p>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="py-6 px-8 font-black uppercase tracking-wider">Features</th>
                  <th className="py-6 px-8 font-black uppercase tracking-wider text-center text-slate-400">Other Platforms</th>
                  <th className="py-6 px-8 font-black uppercase tracking-wider text-center bg-blue-600">Shopwave</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { feature: "Platform-Based Selling", others: "Dependent", shopwave: "Independent Platform", check: true },
                  { feature: "Seller Control", others: "Very Limited", shopwave: "Full Business Control", check: true },
                  { feature: "Brand Building", others: "No Brand Allowed", shopwave: "Own Brand Allowed", check: true },
                  { feature: "Advance Product Payment", others: "Mandatory", shopwave: "No Advance Payment", check: true },
                  { feature: "Payout Speed", others: "Delays Possible", shopwave: "Weekly Payouts", check: true },
                  { feature: "Meta Ads Support", others: "No Support", shopwave: "Dedicated Ad Managers", check: true },
                  { feature: "RTO Protection", others: "No Support", shopwave: "Professional RTO Managers", check: true },
                  { feature: "Support System", others: "Basic Email/Chat", shopwave: "Dedicated Call Support", check: true },
                  { feature: "Model Strategy", others: "Short-term", shopwave: "Long-term Scalable", check: true },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-6 px-8 font-bold text-slate-700">{row.feature}</td>
                    <td className="py-6 px-8 text-center text-slate-400 font-medium">{row.others}</td>
                    <td className={`py-6 px-8 text-center font-black ${i % 2 === 0 ? 'bg-blue-50/50' : ''} text-blue-700`}>
                      <div className="flex items-center justify-center gap-2">
                        {row.shopwave} <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* The 5000 Plan Section */}
      <section id="plan" className="py-32 px-4 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-8">
              <div className="bg-blue-600 text-white w-fit px-6 py-2 rounded-xl font-black text-sm uppercase tracking-widest">Single All-Inclusive Plan</div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight italic">
                Simplify Dropshipping with Shopwave's ₹5,000 Plan!
              </h2>
              <p className="text-xl text-slate-600 font-medium">
                Ready to remove headaches, reduce risk, and grow your dropshipping business confidently?
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: <LayoutDashboard className="text-blue-600" />, title: "Website & Store", desc: "Fully ready store management support" },
                  { icon: <BarChart className="text-blue-600" />, title: "Meta Ads (Expert)", desc: "Shopwave runs ads (7% performance fee)" },
                  { icon: <PhoneCall className="text-blue-600" />, title: "IVR Calling", desc: "Automated confirmation for high delivery" },
                   { icon: <Truck className="text-blue-600" />, title: "RTO Management", desc: "₹60 charge only if RTO occurs" }
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-3">
                    <div className="bg-white p-3 rounded-xl w-fit shadow-sm">{item.icon}</div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex items-start gap-4">
                <CheckCircle className="w-8 h-8 text-green-600 mt-1 shrink-0" />
                <div>
                  <h4 className="font-black text-green-900">No Advance Payment</h4>
                  <p className="text-green-700 font-medium">Invest zero upfront, we handle all orders and delivery end-to-end!</p>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-lg">
               <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] relative border-t-8 border-blue-600">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-8 py-2 rounded-full font-black uppercase text-sm">Best Value</div>
                  <div className="text-center space-y-6">
                    <h3 className="text-3xl font-black">Success Ecosystem</h3>
                    <div className="py-8">
                       <span className="text-7xl font-black">₹5,000</span>
                       <span className="text-slate-400 block mt-2">Per Month / All-Inclusive</span>
                    </div>
                    <ul className="text-left space-y-4 pb-8">
                        <li className="flex gap-3"><Check className="text-blue-400 shrink-0" /> No Inventory Investment</li>
                        <li className="flex gap-3"><Check className="text-blue-400 shrink-0" /> Expert Meta Ads Setup</li>
                        <li className="flex gap-3"><Check className="text-blue-400 shrink-0" /> Automated IVR calls</li>
                        <li className="flex gap-3"><Check className="text-blue-400 shrink-0" /> Weekly Payouts System</li>
                        <li className="flex gap-3"><Check className="text-blue-400 shrink-0" /> Full RTO & Delivery Handling</li>
                    </ul>
                    <Button 
                      className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-lg shadow-blue-500/30"
                      onClick={() => window.open("https://wa.me/919157499884?text=I am interested in the ₹5,000 All-in-One Dropshipping Plan", "_blank")}
                    >
                      Get Started Now
                    </Button>
                    <p className="text-slate-500 text-xs mt-4 italic">Perfect for serious beginners & scaling sellers</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / Process (Image 3) */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-slate-50 to-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 underline decoration-blue-500 decoration-8 underline-offset-8 italic">How It Works</h2>
            <p className="mt-8 text-xl font-bold text-blue-600">Simple & Transparent Process</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 relative">
            <div className="hidden md:block absolute top-[2.5rem] left-[10%] right-[10%] h-1 bg-slate-200 z-0"></div>
            {[
              { icon: <CheckCircle className="w-8 h-8" />, step: "01", title: "Order Confirmed", desc: "Customer places order on your store" },
              { icon: <Zap className="w-8 h-8" />, step: "02", title: "Processing", desc: "Product prepared by verified suppliers" },
              { icon: <Package className="w-8 h-8" />, step: "03", title: "Shipping", desc: "Fast delivery to customer doorstep" },
              { icon: <Truck className="w-8 h-8" />, step: "04", title: "Delivered", desc: "Payment collected & credited to you" }
            ].map((item, i) => (
              <div key={i} className="relative z-10 text-center space-y-6">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl border-4 border-slate-50 text-blue-600">
                  {item.icon}
                </div>
                <div className="space-y-2">
                  <div className="text-blue-600 font-black text-sm">{item.step}</div>
                  <h4 className="font-black text-slate-900 text-lg">{item.title}</h4>
                  <p className="text-slate-500 text-sm max-w-[200px] mx-auto leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center max-w-2xl mx-auto bg-slate-900 text-white p-8 rounded-3xl">
            <p className="text-xl font-bold">"No supplier or logistics worries — we handle everything end-to-end"</p>
          </div>
        </div>
      </section>

      {/* Trusted Partner Stats */}
      <section className="py-24 px-4 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-10">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Trusted Partner</h2>
              <div className="space-y-8">
                 {[
                   { title: "GST-Registered Company", desc: "Fully compliant and legally established e-commerce business" },
                   { title: "Verified Suppliers", desc: "Trusted partnerships ensuring quality products and reliability" },
                   { title: "Established Logistics", desc: "Professional delivery partners for seamless fulfillment" },
                   { title: "Scalable Infrastructure", desc: "Built for growth from startup to established business" }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-4">
                      <div className="w-2 h-full bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-black text-slate-900 text-xl">{item.title}</h4>
                        <p className="text-slate-500 font-medium">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-6">
              {[
                { val: "1000+", label: "Active Sellers", sub: "Growing community" },
                { val: "Daily", label: "Consistent Sales", sub: "Revenue network" },
                { val: "100%", label: "Success Focus", sub: "Complete ecosystem" },
                { val: "Weekly", label: "Reliable Payouts", sub: "Cashflow secured" }
              ].map((stat, i) => (
                <div key={i} className="p-8 rounded-[2rem] bg-blue-50 border border-blue-100 text-center">
                  <div className="text-4xl font-black text-blue-600 mb-2">{stat.val}</div>
                  <div className="font-black text-slate-900">{stat.label}</div>
                  <div className="text-slate-500 text-xs mt-1 uppercase tracking-widest">{stat.sub}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Vision Quote */}
      <section className="py-20 bg-slate-900 text-white text-center px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-2xl md:text-3xl font-black italic text-blue-400">
            "Our vision: empower every individual to succeed in e-commerce — not just a platform, but a complete success ecosystem"
          </p>
        </div>
      </section>

      {/* Final CTA / Contact */}
      <section className="py-32 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 italic">Ready to Start Your Journey?</h2>
              
              <div className="space-y-6">
                 <div className="flex items-center gap-6 p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100">
                   <div className="bg-white p-4 rounded-xl shadow-sm text-blue-600"><Mail className="w-6 h-6" /></div>
                   <div>
                     <p className="text-slate-500 font-bold text-sm uppercase">Email Us</p>
                     <p className="font-black text-slate-900">shopwave.social@gmail.com</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-6 p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100">
                   <div className="bg-white p-4 rounded-xl shadow-sm text-pink-600"><Instagram className="w-6 h-6" /></div>
                   <div>
                     <p className="text-slate-500 font-bold text-sm uppercase">Follow on Instagram</p>
                     <p className="font-black text-slate-900">@shopwave.in</p>
                   </div>
                 </div>

                 <div className="flex items-center gap-6 p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100">
                   <div className="bg-white p-4 rounded-xl shadow-sm text-green-600"><Globe className="w-6 h-6" /></div>
                   <div>
                     <p className="text-slate-500 font-bold text-sm uppercase">Visit Our Website</p>
                     <p className="font-black text-slate-900">www.shopwave.social</p>
                   </div>
                 </div>
              </div>
            </div>

            <div className="p-12 rounded-[3.5rem] bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-2xl space-y-10">
               <h3 className="text-4xl font-black leading-tight italic decoration-blue-300 decoration-4">Start Today</h3>
               <p className="text-xl font-medium text-blue-100">Turn Your E-Commerce Dream Into Reality</p>
               
               <ul className="space-y-4">
                 <li className="flex gap-4 items-center">
                   <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center"><Check className="w-3 h-3" /></div>
                   <span className="font-bold">Zero Risk - No advance payment required</span>
                 </li>
                 <li className="flex gap-4 items-center">
                   <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center"><Check className="w-3 h-3" /></div>
                   <span className="font-bold">Full Support - Expert team backing your success</span>
                 </li>
                 <li className="flex gap-4 items-center">
                   <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center"><Check className="w-3 h-3" /></div>
                   <span className="font-bold">Your Brand - Build a business you own</span>
                 </li>
               </ul>

               <Button 
                className="w-full h-20 bg-white text-blue-600 hover:bg-blue-50 font-black text-2xl rounded-3xl shadow-xl shadow-black/20"
                onClick={() => window.open("https://wa.me/919157499884", "_blank")}
               >
                 Join Shopwave Now
               </Button>
               
               <p className="text-center text-blue-200 font-bold text-sm">Thank you for your time and trust in Shopwave</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Form / PDF Section (Original parts retained but styled) */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-12">
           <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl">
              <h3 className="text-3xl font-black mb-8 text-center italic underline decoration-blue-500 decoration-4">Quick Application Form</h3>
              <DropshipperForm />
           </div>

           <div className="text-center">
              <a 
                href="https://drive.google.com/file/d/15odNS3kEQfDgdRlFgSonwgwgJe-UIZbc/view?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-black transition-all"
              >
                <ShieldCheck className="w-6 h-6 text-blue-400" /> Download Detailed Guide (PDF)
              </a>
           </div>
        </div>
      </section>
    </div>
  );
}
