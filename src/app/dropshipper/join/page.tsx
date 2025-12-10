// src/app/dropshipper/join/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Play, TrendingUp, Package, DollarSign, Users, Shield, Zap, CheckCircle, MessageCircle, Phone } from 'lucide-react'
import DropshipperLeadForm from './DropshipperLeadForm'
import styles from './page.module.css'

interface Product {
  id: string
  name: string
  image: string
  customerPrice: number
  dropshipperPrice: number
  savings: number
}

export default function JoinDropshipperPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=I-U1NwHyGGI')

  useEffect(() => {
    fetchSampleProducts()
    fetchVideoUrl()
  }, [])

  const fetchVideoUrl = async () => {
    try {
      const res = await fetch('/api/public/settings?key=how_it_works_video')
      const data = await res.json()
      if (data.success && data.value) {
        setVideoUrl(data.value)
      }
    } catch (err) {
      console.error('Error fetching video url:', err)
    }
  }

  const fetchSampleProducts = async () => {
    try {
      // Fetch real products from API
      const response = await fetch('/api/products?limit=3')
      const data = await response.json()
      
      if (data.products && data.products.length > 0) {
        const formattedProducts = data.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          image: p.images?.[0] || '/placeholder-product.jpg',
          customerPrice: p.price,
          dropshipperPrice: Math.round(p.price * 0.6), // 40% discount for dropshippers
          savings: Math.round(p.price * 0.4)
        }))
        setProducts(formattedProducts)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Up to 40% Discount',
      description: 'Get exclusive dropshipper pricing on all products'
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: 'No Inventory Risk',
      description: 'We handle storage and shipping for you'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'High Profit Margins',
      description: 'Earn ₹500-₹2000 per sale easily'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Dedicated Support',
      description: '24/7 support for all your queries'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Quality Guaranteed',
      description: 'All products are quality checked'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Fast Processing',
      description: 'Quick order processing and delivery'
    }
  ]

  return (
    <main className={styles.joinPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            🚀 Become a <span className={styles.highlight}>Dropshipper</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Start your own business with LOW investment. Earn up to ₹50,000/month!
          </p>
          
          {/* Video Button */}
          <button
            onClick={() => window.open(videoUrl, '_blank')}
            className={styles.videoButton}
          >
            <Play className="w-6 h-6" fill="white" />
            <span>🎥 Watch How It Works</span>
          </button>

          {/* CTA Button */}
          <button
            onClick={() => router.push('/dropshipper/plans')}
            className={styles.ctaButton}
          >
            Get Started Now - View Plans →
          </button>
        </div>
      </section>

      {/* Lead Form Section */}
      <section className="py-12 bg-gray-50 flex justify-center px-4">
        <div className="w-full max-w-3xl">
          <DropshipperLeadForm />
        </div>
      </section>

      {/* Product Showcase */}
      <section className={styles.productShowcase}>
        <h2 className={styles.sectionTitle}>
          💰 See Your Profit Potential
        </h2>
        <p className={styles.sectionSubtitle}>
          We give you wholesale prices (up to 40% OFF). You sell at market price and keep the profit!
        </p>

        {/* Products Grid Redesigned */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-4">
          
          {/* Example Product 1 */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="relative h-64 bg-gray-50 p-4 flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60" alt="Premium Sneakers" className="object-contain h-full drop-shadow-lg" />
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full animate-bounce">
                HOT SELLER
              </span>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Sport Sneakers</h3>
              <div className="flex gap-2 mb-4 text-xs font-semibold text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">Shoe</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Fashion</span>
              </div>

              <div className="flex justify-between items-center mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-gray-500">Dropship Price</p>
                  <p className="text-2xl font-black text-blue-600">₹799</p>
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-gray-500">Market Price</p>
                  <p className="text-2xl font-black text-gray-400 line-through decoration-red-500 decoration-2">₹1,999</p>
                </div>
              </div>

              <div className="bg-green-600 rounded-xl p-4 text-white text-center mb-4 shadow-lg shadow-green-200">
                 <p className="text-xs font-bold opacity-90 mb-1 tracking-wider uppercase">Your Net Profit</p>
                 <p className="text-3xl font-black">₹1,200</p>
                 <p className="text-[10px] mt-1 opacity-80">Per Sale • Keep 100%</p>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500 font-bold mb-2 uppercase text-center">Sell easily on:</p>
                <div className="flex justify-center gap-4 text-gray-400">
                  <span className="text-xl" title="Instagram">📸</span>
                  <span className="text-xl" title="WhatsApp">💬</span>
                  <span className="text-xl" title="Facebook">📘</span>
                  <span className="text-xl" title="Amazon">📦</span>
                </div>
              </div>
            </div>
          </div>

          {/* Example Product 2 */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="relative h-64 bg-gray-50 p-4 flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60" alt="Wireless Headphones" className="object-contain h-full drop-shadow-lg" />
              <span className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-black px-3 py-1 rounded-full">
                BEST TECH
              </span>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Noise Cancelling Headphones</h3>
              <div className="flex gap-2 mb-4 text-xs font-semibold text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">Electronics</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Audio</span>
              </div>

              <div className="flex justify-between items-center mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-gray-500">Dropship Price</p>
                  <p className="text-2xl font-black text-blue-600">₹1,200</p>
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-gray-500">Market Price</p>
                  <p className="text-2xl font-black text-gray-400 line-through decoration-red-500 decoration-2">₹3,499</p>
                </div>
              </div>

              <div className="bg-green-600 rounded-xl p-4 text-white text-center mb-4 shadow-lg shadow-green-200">
                 <p className="text-xs font-bold opacity-90 mb-1 tracking-wider uppercase">Your Net Profit</p>
                 <p className="text-3xl font-black">₹2,299</p>
                 <p className="text-[10px] mt-1 opacity-80">Per Sale • Keep 100%</p>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500 font-bold mb-2 uppercase text-center">Sell easily on:</p>
                <div className="flex justify-center gap-4 text-gray-400">
                  <span className="text-xl" title="Instagram">📸</span>
                  <span className="text-xl" title="WhatsApp">💬</span>
                  <span className="text-xl" title="Flipkart">🛒</span>
                </div>
              </div>
            </div>
          </div>

          {/* Example Product 3 */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="relative h-64 bg-gray-50 p-4 flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60" alt="Smart Watch" className="object-contain h-full drop-shadow-lg" />
              <span className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse">
                TRENDING
              </span>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fitness Smart Watch Series 5</h3>
              <div className="flex gap-2 mb-4 text-xs font-semibold text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">Gadget</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Fitness</span>
              </div>

              <div className="flex justify-between items-center mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-gray-500">Dropship Price</p>
                  <p className="text-2xl font-black text-blue-600">₹450</p>
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-gray-500">Market Price</p>
                  <p className="text-2xl font-black text-gray-400 line-through decoration-red-500 decoration-2">₹1,499</p>
                </div>
              </div>

              <div className="bg-green-600 rounded-xl p-4 text-white text-center mb-4 shadow-lg shadow-green-200">
                 <p className="text-xs font-bold opacity-90 mb-1 tracking-wider uppercase">Your Net Profit</p>
                 <p className="text-3xl font-black">₹1,049</p>
                 <p className="text-[10px] mt-1 opacity-80">Per Sale • Keep 100%</p>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500 font-bold mb-2 uppercase text-center">Sell easily on:</p>
                <div className="flex justify-center gap-4 text-gray-400">
                  <span className="text-xl" title="Instagram">📸</span>
                  <span className="text-xl" title="WhatsApp">💬</span>
                  <span className="text-xl" title="Telegram">✈️</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Profit Calculator */}
        <div className={styles.profitCalculator}>
          <h3 className={styles.calculatorTitle}>📊 Monthly Earning Potential</h3>
          <div className={styles.calculatorGrid}>
            <div className={styles.calculatorCard}>
              <div className={styles.calculatorNumber}>5</div>
              <div className={styles.calculatorLabel}>Sales/Day</div>
              <div className={styles.calculatorProfit}>= ₹15,000/month</div>
            </div>
            <div className={styles.calculatorCard}>
              <div className={styles.calculatorNumber}>10</div>
              <div className={styles.calculatorLabel}>Sales/Day</div>
              <div className={styles.calculatorProfit}>= ₹30,000/month</div>
            </div>
            <div className={`${styles.calculatorCard} ${styles.highlighted}`}>
              <div className={styles.calculatorNumber}>15</div>
              <div className={styles.calculatorLabel}>Sales/Day</div>
              <div className={styles.calculatorProfit}>= ₹45,000/month</div>
              <div className={styles.popularBadge}>🔥 Most Popular</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <h2 className={styles.sectionTitle}>
          ✨ Why Join Our Dropshipping Program?
        </h2>
        
        <div className={styles.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <div key={index} className={styles.benefitCard}>
              <div className={styles.benefitIcon}>{benefit.icon}</div>
              <h3 className={styles.benefitTitle}>{benefit.title}</h3>
              <p className={styles.benefitDescription}>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>
          🎯 How It Works - Simple 4 Steps
        </h2>
        
        <div className={styles.stepsGrid}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Choose Your Plan</h3>
            <p className={styles.stepDescription}>
              Select a subscription plan that fits your business goals
            </p>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Get Access</h3>
            <p className={styles.stepDescription}>
              Instant access to dropshipper prices and products
            </p>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Start Selling</h3>
            <p className={styles.stepDescription}>
              Share products with customers and take orders
            </p>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <h3 className={styles.stepTitle}>Earn Profit</h3>
            <p className={styles.stepDescription}>
              We ship, you earn! Keep 100% of your profit margin
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials}>
        <h2 className={styles.sectionTitle}>
          💬 What Our Dropshippers Say
        </h2>
        
        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
            <p className={styles.testimonialText}>
              "I'm earning ₹35,000/month with just 2-3 hours of work daily. Best decision ever!"
            </p>
            <div className={styles.testimonialAuthor}>- Rahul S., Mumbai</div>
          </div>
          
          <div className={styles.testimonialCard}>
            <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
            <p className={styles.testimonialText}>
              "Low investment, high returns. The support team is amazing and always helpful."
            </p>
            <div className={styles.testimonialAuthor}>- Priya K., Delhi</div>
          </div>
          
          <div className={styles.testimonialCard}>
            <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
            <p className={styles.testimonialText}>
              "Started 3 months ago, now making ₹50,000/month. Highly recommended!"
            </p>
            <div className={styles.testimonialAuthor}>- Amit P., Bangalore</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCTA}>
        <h2 className={styles.finalCTATitle}>
          Ready to Start Your Dropshipping Journey?
        </h2>
        <p className={styles.finalCTASubtitle}>
          Join 1000+ successful dropshippers earning daily
        </p>
        <button
          onClick={() => router.push('/dropshipper/plans')}
          className={styles.finalCTAButton}
        >
          View Plans & Get Started →
        </button>
        
        {/* Customer Care Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <Phone className="w-6 h-6 text-green-600" />
            Need Help? Contact Customer Care
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://wa.me/919157499884"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp: +91 9157499884</span>
            </a>
            <a
              href="https://wa.me/916392348674"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp: +91 6392 348 674</span>
            </a>
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Our team is available 24/7 to assist you with any queries
          </p>
        </div>
      </section>
    </main>
  )
}
