'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function PushNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      // Show prompt if not yet decided and not dismissed in this session
      const dismissed = sessionStorage.getItem('push_prompt_dismissed');
      if (Notification.permission === 'default' && !dismissed) {
        const timer = setTimeout(() => setShowPrompt(true), 15000); // Show after 15 seconds
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      setShowPrompt(false);
      
      if (result === 'granted') {
        new Notification('Welcome to ShopWave!', {
          body: 'You will now receive updates on price drops and new arrivals.',
          icon: '/logo.png'
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    sessionStorage.setItem('push_prompt_dismissed', 'true');
  };

  if (permission === 'denied' || (permission === 'granted' && !showPrompt)) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 left-5 z-[60] w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
          <button 
            onClick={dismissPrompt}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-full">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Get Updates</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Allow notifications to get alerts for <strong>Price Drops</strong> and exclusive <strong>Flash Sales</strong>!
          </p>
          
          <div className="flex gap-2">
            <Button 
              onClick={requestPermission}
              className="flex-grow bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100"
            >
              Allow
            </Button>
            <Button 
              variant="outline"
              onClick={dismissPrompt}
              className="px-4"
            >
              Later
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
