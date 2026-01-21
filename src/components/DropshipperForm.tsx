'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';
import { CheckCircle2, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function DropshipperForm() {
  const { toast } = useToast();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    plan: 'All-in-One Dropshipping Plan (₹5,000)',
  });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to join the Partner Program.",
        variant: "destructive"
      });
      window.location.href = '/sign-in';
      return;
    }

    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      // 1. Create Order
      const orderResponse = await fetch('/api/payment/create-dropshipper-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: 'plan_all_in_one_5000',
          amount: 5000,
          interval: 'lifetime',
        }),
      });

      const orderData = await orderResponse.json();
      if (!orderData.success) throw new Error(orderData.error || 'Order creation failed');

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: 'ShopWave Partner Program',
        description: 'All-in-One Dropshipping Plan (Non-Refundable)',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // 3. Verify Payment
          const verifyResponse = await fetch('/api/payment/verify-dropshipper-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: 'plan_all_in_one_5000',
              interval: 'lifetime',
              name: formData.name,
              phone: formData.phone,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            toast({
              title: "Payment Successful! 🎉",
              description: "Sent details to Admin and redirecting to onboard form.",
            });

            // 4. Send WhatsApp message to Admin
            const wpMessage = `New application for Partner Program! 🚀%0A%0A*Name:* ${formData.name}%0A*WhatsApp:* ${formData.phone}%0A*Plan:* ${formData.plan}%0A*Payment ID:* ${response.razorpay_payment_id}`;
            window.open(`https://wa.me/919157499884?text=${wpMessage}`, '_blank');

            // 5. Redirect to Google Form after a delay
            setTimeout(() => {
              window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLScLTLttwPd-7LJn0X8LfZpBfpGI-PiEq56l1tnH8-Y4baOcjg/viewform?fbzx=-6764804940153697705";
            }, 3000);
          } else {
            toast({
              title: "Verification Failed",
              description: verifyData.error || "Please contact support.",
              variant: "destructive"
            });
          }
        },
        prefill: {
          name: formData.name || user.fullName || '',
          contact: formData.phone || '',
          email: user.primaryEmailAddress?.emailAddress || '',
        },
        theme: { color: '#2563eb' },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Payment Error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 max-w-xl mx-auto">
      <div className="text-center mb-8">
        <div className="bg-blue-600 text-white w-fit px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mx-auto mb-4 italic">
          Premium Access
        </div>
        <h3 className="text-3xl font-black text-gray-900 mb-2">Join Partner Program</h3>
        <p className="text-gray-500 font-medium">Fill details to unlock all-in-one success ecosystem</p>
      </div>

      <form onSubmit={handlePayment} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">Full Name</label>
          <Input 
            required 
            placeholder="e.g. Rahul Kumar" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="h-14 bg-gray-50 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600 font-medium"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">WhatsApp Number</label>
          <div className="flex">
            <span className="inline-flex items-center px-4 rounded-l-2xl border border-r-0 border-gray-200 bg-gray-100 text-gray-600 font-bold">
              +91
            </span>
            <Input 
              required 
              type="tel" 
              placeholder="98765 43210" 
              maxLength={10}
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
              className="h-14 bg-gray-50 border-gray-200 rounded-l-none rounded-r-2xl focus:ring-2 focus:ring-blue-600 font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">Active Plan</label>
          <div className="h-14 bg-blue-50 border-2 border-blue-200 rounded-2xl flex items-center px-4 gap-3">
             <div className="bg-blue-600 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-white" /></div>
             <span className="font-black text-blue-900">{formData.plan}</span>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-300">
           <div className="flex justify-between items-center mb-2">
              <span className="text-slate-500 font-bold uppercase text-xs">Joining Fee (Non-Refundable)</span>
              <span className="text-slate-900 font-black">₹5,000</span>
           </div>
           <div className="flex gap-2 items-center text-xs text-green-600 font-bold">
              <ShieldCheck className="w-4 h-4" /> 100% Secure Transaction via Razorpay
           </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-16 text-xl bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-500/30 transform transition-all active:scale-95"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              Pay ₹5,000 & Continue <ArrowRight className="w-5 h-5" />
            </span>
          )}
        </Button>
        
        <p className="text-xs text-center text-gray-400 font-medium">
          By clicking pay, you agree to our terms and conditions.
        </p>
      </form>
    </div>
  );
}

