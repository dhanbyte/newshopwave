'use client'

import { MessageCircle } from 'lucide-react'

export default function WhatsAppSupport() {
  const phoneNumber = '919638883833'
  const message = encodeURIComponent('Hi! I need help with my order.')
  
  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center gap-2 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="hidden group-hover:inline-block text-sm font-medium pr-2 animate-fade-in">
        Chat with us
      </span>
    </a>
  )
}
