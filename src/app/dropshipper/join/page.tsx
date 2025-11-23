// src/app/dropshipper/join/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Play, TrendingUp, Package, DollarSign, Users, Shield, Zap, CheckCircle } from 'lucide-react'
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

  useEffect(() => {
    fetchSampleProducts()
  }, [])

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
            Start your own business with ZERO investment. Earn up to ₹50,000/month!
          </p>
          
          {/* Video Button */}
          <button
            onClick={() => window.open('https://www.youtube.com/watch?v=I-U1NwHyGGI', '_blank')}
            className={styles.videoButton}
          >
            <Play className="w-6 h-6" fill="white" />
            <span>🎥 Watch How It Works (2 min)</span>
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

      {/* Product Showcase */}
      <section className={styles.productShowcase}>
        <h2 className={styles.sectionTitle}>
          💰 See Your Profit Potential
        </h2>
        <p className={styles.sectionSubtitle}>
          Here's how much you can save and earn on every product
        </p>

        <div className={styles.productsGrid}>
          {loading ? (
            <div className={styles.loading}>Loading products...</div>
          ) : products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src={product.image} alt={product.name} />
                  <div className={styles.savingsBadge}>
                    Save ₹{product.savings}
                  </div>
                </div>
                
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  
                  <div className={styles.priceComparison}>
                    <div className={styles.priceBox}>
                      <div className={styles.priceLabel}>Customer Price</div>
                      <div className={styles.customerPrice}>₹{product.customerPrice}</div>
                      <div className={styles.priceNote}>Normal Users</div>
                    </div>
                    
                    <div className={styles.vs}>VS</div>
                    
                    <div className={`${styles.priceBox} ${styles.dropshipperBox}`}>
                      <div className={styles.winBadge}>WIN</div>
                      <div className={styles.priceLabel}>Your Price</div>
                      <div className={styles.dropshipperPrice}>₹{product.dropshipperPrice}</div>
                      <div className={styles.priceNote}>💰 Your Profit: ₹{product.savings}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noProducts}>
              <p>Sample products will be displayed here</p>
            </div>
          )}
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
              "Zero investment, high returns. The support team is amazing and always helpful."
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
        <p className={styles.noRefundNote}>
          ⚠️ Note: All subscription plans are non-refundable. Choose wisely!
        </p>
      </section>
    </main>
  )
}
