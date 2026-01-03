
'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const BANNERS = [
  { 
    id: 1, 
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop&crop=center', 
    title: 'TRAVEL ACCESSORIES',
    subtitle: 'For Every Journey',
    discount: 'UP TO 85% OFF',
    link: '/search?category=Tech' 
  },
  { 
    id: 2, 
    img: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop&crop=center', 
    title: 'CAR ACCESSORIES',
    subtitle: 'FOR EVERY VEHICLE',
    discount: 'From Rs. 10',
    link: '/search?category=Home' 
  },
  { 
    id: 3, 
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=600&fit=crop&crop=center', 
    title: 'HOME DECOR',
    subtitle: 'FOR EVERY ONE',
    discount: 'UP TO 80% OFF',
    link: '/search?category=Home' 
  },
  { 
    id: 4, 
    img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 
    title: 'START DROPSHIPPING',
    subtitle: 'Zero Investment Business',
    discount: 'EARN ₹50k/MONTH',
    link: '/dropshipping' 
  },
  { 
    id: 5, 
    img: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 
    title: 'RESELL & EARN',
    subtitle: 'We Pack & Ship For You',
    discount: 'JOIN FOR FREE',
    link: '/dropshipping' 
  }
]

export default function BannerSlider(){
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)
  
  // Create infinite loop by duplicating banners
  const extendedBanners = [...BANNERS, ...BANNERS]
  
  useEffect(() => { 
    const timer = setInterval(() => {
      setCurrentIndex(prev => prev + 1)
    }, 4000)
    return () => clearInterval(timer) 
  }, [])
  
  // Reset to start when reaching the end (for infinite loop)
  useEffect(() => {
    if (currentIndex === BANNERS.length) {
      setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(0)
        setTimeout(() => setIsTransitioning(true), 50)
      }, 500)
    }
  }, [currentIndex])
  
  const handleDotClick = (index: number) => {
    setIsTransitioning(true)
    setCurrentIndex(index)
  }
  
  return (
    <div className="w-full overflow-hidden">
      <div className="relative">
        <div 
          className={`flex gap-3 md:gap-4 ${isTransitioning ? 'transition-transform duration-500 ease-out' : ''}`}
          style={{ transform: `translateX(-${currentIndex * 50}%)` }}
        >
          {extendedBanners.map((banner, idx) => (
            <Link
              key={`${banner.id}-${idx}`}
              href={banner.link}
              className="flex-shrink-0 w-[48%] md:w-[48%] relative rounded-lg md:rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-600 to-purple-700 h-32 md:h-[240px]"
            >
              <div className="absolute inset-0">
                <Image 
                  src={banner.img} 
                  alt={banner.title} 
                  fill 
                  sizes="(max-width: 768px) 48vw, 48vw" 
                  className="object-cover opacity-80 hover:scale-105 transition-transform duration-700"
                  priority={idx === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
              </div>
              
              <div className="relative z-10 p-3 md:p-8 h-full flex flex-col justify-center text-white">
                <div className="space-y-1 md:space-y-3">
                  <h3 className="text-sm md:text-3xl lg:text-4xl font-black leading-tight tracking-tight drop-shadow-lg">
                    {banner.title}
                  </h3>
                  <p className="text-xs md:text-lg lg:text-xl font-medium opacity-90 tracking-wide drop-shadow-md">
                    {banner.subtitle}
                  </p>
                  
                  <div className="pt-1 md:pt-3">
                    <span className="bg-red-600 text-white text-xs md:text-base lg:text-lg font-bold px-3 py-1 md:px-5 md:py-2 rounded-full shadow-lg inline-block hover:scale-105 transition-transform">
                      {banner.discount}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center mt-3 md:mt-6 gap-2 md:gap-3">
        {BANNERS.map((_, i) => (
          <button 
            key={i} 
            onClick={() => handleDotClick(i)} 
            className={`h-1.5 md:h-2.5 rounded-full transition-all duration-300 shadow-sm ${
              i === (currentIndex % BANNERS.length)
                ? 'bg-blue-600 w-6 md:w-10' 
                : 'bg-gray-300 w-2 md:w-3 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
