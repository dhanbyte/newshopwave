'use client'
import Link from 'next/link';
import Image from 'next/image';
import { Youtube, Instagram, MessageCircle, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useAuth } from '../context/ClerkAuthContext';

export default function Footer() {
  const { user, refreshUserData } = useAuth();
  const [dropshipperPrice, setDropshipperPrice] = useState(113);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('/api/admin/dropshipper-price?t=' + Date.now())
        const data = await response.json()
        console.log('Fetched dropshipper price:', data)
        if (data.success) {
          setDropshipperPrice(data.price)
        }
      } catch (error) {
        console.error('Error fetching dropshipper price:', error)
      }
    }
    
    fetchPrice()
    
    // Listen for price updates
    const handlePriceUpdate = () => {
      console.log('Price update event received')
      fetchPrice()
    }
    
    window.addEventListener('dropshipperPriceUpdated', handlePriceUpdate)
    
    // Refresh price every 30 seconds
    const interval = setInterval(fetchPrice, 30000)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('dropshipperPriceUpdated', handlePriceUpdate)
    }
  }, [])



  return (
    <footer className="bg-gray-800 text-white border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-white">ShopWave</h3>
            <p className="text-sm text-gray-400 mt-2">Your one-stop shop for tech and home products.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Quick Links</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link href="/search" className="text-gray-400 hover:text-white">Search</Link></li>
              <li><Link href="/orders" className="text-gray-400 hover:text-white">My Orders</Link></li>
              <li><Link href="/account" className="text-gray-400 hover:text-white">Account</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Help</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link href="/shipping-policy" className="text-gray-400 hover:text-white">Shipping Policy</Link></li>
              <li><Link href="/return-policy" className="text-gray-400 hover:text-white">Return Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms and Conditions</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/withdrawal-policy" className="text-gray-400 hover:text-white">Withdrawal Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Dropshipping</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li><Link href="/dropshipping-plans" className="text-blue-400 hover:text-blue-300 font-semibold">Dropshipping Plans</Link></li>
              <li><Link href="/dropshipping" className="text-gray-400 hover:text-white">How it Works</Link></li>
              <li><Link href="/affiliate-program" className="text-gray-400 hover:text-white">Affiliate Program</Link></li>
              <li><Link href="/referral" className="text-gray-400 hover:text-white">Referral Program</Link></li>
            </ul>
            <h3 className="font-semibold text-white mt-6">Follow Us</h3>
            <div className="flex items-center gap-4 mt-2">
              <Link href="https://www.youtube.com/@shopwave" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white" aria-label="YouTube">
                <Youtube size={20} />
              </Link>
              <Link href="https://www.instagram.com/shopwave.in" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white" aria-label="Instagram">
                <Instagram size={20} />
              </Link>
              <Link href="https://wa.me/919157499884" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white" aria-label="WhatsApp">
                <MessageCircle size={20} />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} ShopWave. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}