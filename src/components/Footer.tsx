'use client'
import Link from 'next/link';
import Image from 'next/image';
import { Youtube, Instagram, MessageCircle, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useAuth } from '../context/ClerkAuthContext';
import DropshipperRegistrationModal from './DropshipperRegistrationModal';

export default function Footer() {
  const { user, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dropshipperPrice, setDropshipperPrice] = useState(113);

  // Check if we need to open modal after login
  useEffect(() => {
    if (user && sessionStorage.getItem('openDropshipperModal') === 'true') {
      sessionStorage.removeItem('openDropshipperModal')
      // Small delay to ensure page is fully loaded
      setTimeout(() => {
        setShowModal(true)
      }, 500)
    }
  }, [user])

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

  const handleDropshipperRegistration = async (formData: any) => {
    if (!user) {
      alert('Please login first');
      return;
    }
    
    setLoading(true);
    try {
      // Upload photos first
      let photoUrl = null;
      let aadharPhotoUrl = null;
      
      if (formData.photo) {
        const photoFormData = new FormData();
        photoFormData.append('file', formData.photo);
        photoFormData.append('fileName', `dropshipper-${user.id}-profile`);
        photoFormData.append('folder', '/dropshipper-profiles');
        
        const photoResponse = await fetch('/api/imagekit/upload', {
          method: 'POST',
          body: photoFormData
        });
        const photoData = await photoResponse.json();
        if (photoData.success) photoUrl = photoData.url;
      }
      
      if (formData.aadharPhoto) {
        const aadharFormData = new FormData();
        aadharFormData.append('file', formData.aadharPhoto);
        aadharFormData.append('fileName', `dropshipper-${user.id}-aadhar`);
        aadharFormData.append('folder', '/dropshipper-aadhar');
        
        const aadharResponse = await fetch('/api/imagekit/upload', {
          method: 'POST',
          body: aadharFormData
        });
        const aadharData = await aadharResponse.json();
        if (aadharData.success) aadharPhotoUrl = aadharData.url;
      }
      
      // Process payment
      const totalAmount = dropshipperPrice;
      const platformFee = Math.round(totalAmount * 0.14);
      const finalAmount = totalAmount + platformFee;
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: finalAmount * 100, // Convert to paise
        currency: 'INR',
        name: 'ShopWave Dropshipper',
        description: `Dropshipper Registration - ₹${finalAmount}`,
        handler: async (response: any) => {
          console.log('💳 Payment successful, processing registration...');
          console.log('Payment ID:', response.razorpay_payment_id);
          
          try {
            const registrationPayload = {
              userId: user.id,
              email: user.email,
              paymentId: response.razorpay_payment_id,
              ...formData,
              photo: photoUrl,
              aadharPhoto: aadharPhotoUrl
            };
            
            console.log('Sending registration request:', {
              userId: user.id,
              email: user.email,
              paymentId: response.razorpay_payment_id,
              hasPhoto: !!photoUrl,
              hasAadharPhoto: !!aadharPhotoUrl
            });
            
            const res = await fetch('/api/dropshipper/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(registrationPayload)
            });
            
            const data = await res.json();
            console.log('Registration response:', data);
            
            if (data.success) {
              alert(`🎉 Success! Your Dropshipper ID: ${data.dropshipperId}\n\nYou now get wholesale prices on all products!`);
              setShowModal(false);
              
              // Force refresh user data with retry mechanism using context method
              let retryCount = 0;
              const maxRetries = 3;
              
              const attemptRefresh = async () => {
                try {
                  console.log(`Refreshing user data (attempt ${retryCount + 1}/${maxRetries})...`);
                  const updatedUser = await refreshUserData();
                  
                  if (updatedUser?.is_dropshipper) {
                    console.log('✅ User data refreshed successfully, reloading page...');
                    setTimeout(() => window.location.reload(), 500);
                  } else if (retryCount < maxRetries - 1) {
                    retryCount++;
                    setTimeout(attemptRefresh, 2000); // Retry after 2 seconds
                  } else {
                    console.log('⚠️ Max retries reached, forcing reload...');
                    setTimeout(() => window.location.reload(), 500);
                  }
                } catch (err) {
                  console.error('Refresh error:', err);
                  if (retryCount < maxRetries - 1) {
                    retryCount++;
                    setTimeout(attemptRefresh, 2000);
                  } else {
                    console.log('⚠️ Refresh failed, forcing reload...');
                    setTimeout(() => window.location.reload(), 500);
                  }
                }
              };
              
              setTimeout(attemptRefresh, 1000);
            } else {
              console.error('❌ Registration failed:', data);
              const errorMessage = data.error || 'Unknown error occurred';
              const debugInfo = data.debug ? `\n\nDebug Info:\n${JSON.stringify(data.debug, null, 2)}` : '';
              alert(`❌ Registration failed!\n\nError: ${errorMessage}${debugInfo}\n\nYour payment was successful. Please contact support with Payment ID: ${response.razorpay_payment_id}`);
            }
          } catch (err: any) {
            console.error('❌ Exception during registration:', err);
            alert(`❌ Registration failed!\n\nError: ${err.message}\n\nYour payment was successful. Please contact support with Payment ID: ${response.razorpay_payment_id}`);
          }
        },
        prefill: {
          name: formData.name,
          email: user.email,
          contact: formData.phone
        },
        theme: {
          color: '#2563eb'
        }
      };
      
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        alert('Payment system not loaded. Please refresh and try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Dropshipper Banner - Show for all users */}
      {(!user || (user && !user.is_dropshipper)) && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  🚀 Become a Dropshipper
                </h3>
                <p className="text-blue-100 mt-1">Start earning with wholesale prices - Just ₹{dropshipperPrice}!</p>
              </div>
              <Button 
                onClick={() => {
                  if (!user) {
                    // Store intent to open dropshipper modal after login
                    sessionStorage.setItem('openDropshipperModal', 'true')
                    // Redirect to sign-in
                    window.location.href = '/sign-in?redirect=/'
                    return
                  }
                  setShowModal(true)
                }}
                disabled={loading}
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-6 py-3"
              >
                {!user ? `Login to Join - ₹${dropshipperPrice}` : `Join Now - ₹${dropshipperPrice}`}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Vendor Banner */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                🏪 Become a Vendor
              </h3>
              <p className="text-green-100 mt-1">Sell your products and reach thousands of customers!</p>
            </div>
            <Button 
              onClick={() => {
                window.location.href = '/vendor/login'
              }}
              className="bg-white text-green-600 hover:bg-gray-100 font-bold px-6 py-3"
            >
              Vendor Login
            </Button>
          </div>
        </div>
      </div>
      
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
              <li><Link href="/vendor/login" className="text-gray-400 hover:text-white">Vendor Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Help</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li><Link href="/help" className="text-gray-400 hover:text-white">Help</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link href="/shipping-policy" className="text-gray-400 hover:text-white">Shipping Policy</Link></li>
              <li><Link href="/return-policy" className="text-gray-400 hover:text-white">Return Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms and Conditions</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Follow Us</h3>
            <div className="flex items-center gap-4 mt-2">
              <Link href="https://www.youtube.com/channel/UCz1ekjeE4g9f5Ad_vXdoN1A" target="_blank" className="text-gray-400 hover:text-white">
                <Youtube size={20} />
              </Link>
              <Link href="https://www.instagram.com/dhananjay.2004" target="_blank" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </Link>
              <Link href="https://wa.me/919157499884" target="_blank" className="text-gray-400 hover:text-white">
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
      
      {/* Dropshipper Registration Modal */}
      <DropshipperRegistrationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleDropshipperRegistration}
        loading={loading}
        price={dropshipperPrice}
      />
    </>
  );
}