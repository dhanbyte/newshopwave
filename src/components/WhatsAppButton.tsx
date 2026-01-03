'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = '+919157499884';
  const message = 'Hi ShopWave! I need some help with my order.';
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <div className="fixed bottom-20 right-6 z-50 md:bottom-8">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 animate-bounce hover:animate-none"
        aria-label="Chat on WhatsApp"
        title="Need Help? Chat with us!"
      >
        <MessageCircle size={32} fill="currentColor" className="text-white" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
        </span>
      </a>
      
      {/* Tooltip for desktop */}
      <div className="hidden md:block absolute right-16 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-100 whitespace-nowrap overflow-hidden group-hover:block transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
         <p className="text-xs font-bold text-gray-800">Support Online</p>
      </div>
    </div>
  );
}
