'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DropshipperForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    plan: 'Partner Store Plan (₹999)',
    experience: '',
    marketing_channels: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Construct WhatsApp Message
    const message = `Hello ShopWave, I want to join your Partner Program! 🚀%0A%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Selected Plan:* ${formData.plan}%0A*Experience:* ${formData.experience}%0A*Marketing Channels:* ${formData.marketing_channels.join(', ')}`;

    // Open WhatsApp
    window.open(`https://wa.me/919157499884?text=${message}`, '_blank');
    
    setLoading(false);
    toast({
      title: "Redirecting to WhatsApp...",
      description: "Please send the message to complete your registration.",
    });
  };

  if (step === 1) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-lg mx-auto transform transition-all hover:scale-[1.01]">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Join Partner Program</h3>
          <p className="text-gray-500 text-sm">Fill details to unlock Premium Dropshipping features</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <Input 
              required 
              placeholder="e.g. Rahul Kumar" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="h-12 bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">WhatsApp Number</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                +91
              </span>
              <Input 
                required 
                type="tel" 
                placeholder="98765 43210" 
                maxLength={10}
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                className="h-12 bg-gray-50 rounded-l-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Plan</label>
            <select 
              className="w-full h-12 bg-gray-50 border border-gray-200 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.plan}
              onChange={e => setFormData({...formData, plan: e.target.value})}
            >
              <option value="Partner Store Plan (₹999)">Partner Store Plan (₹999)</option>
              <option value="Marketplace Seller Plan (₹1,999)">Marketplace Seller Plan (₹1,999)</option>
              <option value="Full Shopify Website Plan (₹2,999)">Full Shopify Website Plan (₹2,999)</option>
            </select>
          </div>

          <Button type="submit" className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 mt-4">
            Next Step <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-lg mx-auto">
       <button onClick={() => setStep(1)} className="text-sm text-gray-400 mb-6 hover:text-gray-600 flex items-center">
         ← Back
       </button>
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">One Last Thing! 🚀</h3>
        <p className="text-gray-500 text-sm">Tell us about your experience</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Experience Level</label>
            <select 
              className="w-full h-12 bg-gray-50 border border-gray-200 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.experience}
              onChange={e => setFormData({...formData, experience: e.target.value})}
            >
              <option value="" disabled>Select your experience</option>
              <option value="Complete Beginner">I am a Complete Beginner</option>
              <option value="1-2 Years">I have 1-2 Years Experience</option>
              <option value="Expert Level">I am an Expert Reseller</option>
            </select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 block">I plan to sell on:</label>
          <div className="grid grid-cols-2 gap-3">
            {['WhatsApp Groups', 'Instagram / FB', 'Facebook Marketplace', 'Offline / Shop'].map((channel) => (
              <div 
                key={channel}
                className={`cursor-pointer border rounded-lg p-3 text-sm text-center transition-all ${formData.marketing_channels.includes(channel) ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => {
                  const channels = formData.marketing_channels.includes(channel)
                    ? formData.marketing_channels.filter(c => c !== channel)
                    : [...formData.marketing_channels, channel];
                  setFormData({...formData, marketing_channels: channels});
                }}
              >
                {channel}
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Application on WhatsApp'}
        </Button>
        
        <p className="text-xs text-center text-gray-400">
          We will review your details instantly.
        </p>
      </form>
    </div>
  );
}
