'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/ClerkAuthContext';
import { useCart } from '../lib/cartStore';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { Phone, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';

export default function PhoneCollectionModal() {
  const { user, updateUserProfile } = useAuth();
  const { items } = useCart();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show modal if:
    // 1. User is logged in
    // 2. User has items in cart
    // 3. User does NOT have a phone number
    const dismissed = localStorage.getItem('phoneCollectionDismissed');
    
    // Show modal if:
    // 1. User is logged in
    // 2. User has items in cart
    // 3. User does NOT have a phone number
    // 4. Modal not recently dismissed
    if (user && items.length > 0 && !user.phone && !dismissed) {
      // Small delay to not be annoying immediately
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [user, items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit mobile number.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      if (user) {
        await updateUserProfile({ phone: cleanPhone });
        toast({
          title: "Number Saved!",
          description: "We'll send you order updates on WhatsApp.",
        });
        localStorage.setItem('phoneCollectionDismissed', 'true');
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Failed to update phone:', error);
      toast({
        title: "Error",
        description: "Failed to save phone number. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Phone className="w-5 h-5 text-brand" />
            Add Your Mobile Number
          </DialogTitle>
          <DialogDescription>
            We need your WhatsApp number to simulate the automated order updates and for delivery coordination.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <div className="flex rounded-md border border-gray-300 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-brand focus-within:border-brand">
              <span className="inline-flex items-center px-3 bg-gray-50 text-gray-500 text-sm border-r border-gray-300">
                🇮🇳 +91
              </span>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 10) setPhoneNumber(val);
                }}
                className="flex-1 block w-full px-3 py-2 outline-none"
                placeholder="9876543210"
                autoFocus
                required
              />
            </div>
            <p className="text-xs text-gray-500">
              This will be used for your automated WhatsApp messages.
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-brand hover:bg-brand/90 text-white font-semibold py-6 text-lg" 
            disabled={loading || phoneNumber.length < 10}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="flex items-center justify-center gap-2">
                Save & Continue <ArrowRight size={18} />
              </div>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
