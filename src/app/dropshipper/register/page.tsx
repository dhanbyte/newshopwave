// src/app/dropshipper/register/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Upload, User, Phone, MapPin, CreditCard, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import styles from './page.module.css'

interface Product {
  id: string
  name: string
  image: string
  customerPrice: number
  dropshipperPrice: number
  savings: number
}

export default function DropshipperRegisterPage() {
  const router = useRouter()
  const { user } = useUser()
  const [step, setStep] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [formData, setFormData] = useState({
    photo: null as File | null,
    photoPreview: '',
    name: '',
    phone: '',
    address: '',
    accountNumber: '',
    ifsc: '',
    bankName: ''
  })

  useEffect(() => {
    fetchSampleProducts()
  }, [])

  const fetchSampleProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=6')
      const data = await response.json()
      
      if (data.products && data.products.length > 0) {
        const formattedProducts = data.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          image: p.images?.[0] || '/placeholder-product.jpg',
          customerPrice: p.price,
          dropshipperPrice: Math.round(p.price * 0.6),
          savings: Math.round(p.price * 0.4)
        }))
        setProducts(formattedProducts)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (file: File | null) => {
    if (file) {
      const preview = URL.createObjectURL(file)
      setFormData(prev => ({ ...prev, photo: file, photoPreview: preview }))
    }
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!user) {
      alert('Please sign in first')
      router.push('/sign-in?redirect=/dropshipper/register')
      return
    }

    // Validate required fields
    if (!formData.name || !formData.phone || !formData.address || !formData.bankName || !formData.accountNumber || !formData.ifsc) {
      alert('⚠️ Please fill all required fields')
      return
    }

    if (!formData.photo) {
      alert('⚠️ Please upload your profile photo')
      return
    }

    // Check Terms & Conditions acceptance
    if (!acceptedTerms) {
      alert('⚠️ Please accept the Terms & Conditions to continue')
      return
    }

    setLoading(true)
    
    try {
      // Save form data to sessionStorage for later use after payment
      const registrationData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        accountNumber: formData.accountNumber,
        ifsc: formData.ifsc,
        bankName: formData.bankName,
        photoFile: formData.photoPreview // We'll handle file upload after payment
      }
      
      sessionStorage.setItem('dropshipperRegistrationData', JSON.stringify(registrationData))
      
      // Store the actual photo file (we'll upload it after payment)
      // For now, just show success and redirect to plans
      alert('✅ Registration details saved! Now select your subscription plan.')
      
      // Redirect to plans page
      router.push('/dropshipper/plans')
      
    } catch (error) {
      console.error('Error saving registration data:', error)
      alert('❌ Failed to save registration data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.registerPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            🚀 Become a <span className={styles.highlight}>Dropshipper</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Start earning ₹30,000 - ₹50,000/month with ZERO investment!
          </p>
        </div>
      </section>

      {/* Video Section */}
      <section className={styles.videoSection}>
        <h2 className={styles.sectionTitle}>🎥 Watch How It Works</h2>
        <p className={styles.sectionSubtitle}>Learn everything in just 2 minutes</p>
        
        <div className={styles.videoContainer}>
          <iframe
            className={styles.videoIframe}
            src="https://www.youtube.com/embed/I-U1NwHyGGI"
            title="Dropshipper Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      {/* Product Showcase */}
      <section className={styles.productShowcase}>
        <h2 className={styles.sectionTitle}>💰 Why Join? See the Difference!</h2>
        <p className={styles.sectionSubtitle}>Check out your profit on every product</p>

        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productImage}>
                <img src={product.image} alt={product.name} />
                <div className={styles.savingsBadge}>Save ₹{product.savings} 🤑</div>
              </div>
              
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                
                <div className={styles.priceComparison}>
                  <div className={styles.priceBox}>
                    <div className={styles.priceLabel}>Customer Price</div>
                    <div className={styles.customerPrice}>₹{product.customerPrice}</div>
                    <div className={styles.priceNote}>For Normal Users</div>
                  </div>
                  
                  <div className={styles.vs}>VS</div>
                  
                  <div className={`${styles.priceBox} ${styles.dropshipperBox}`}>
                    <div className={styles.winBadge}>WIN</div>
                    <div className={styles.priceLabel}>Your Price</div>
                    <div className={styles.dropshipperPrice}>₹{product.dropshipperPrice}</div>
                    <div className={styles.profitNote}>💰 Profit: ₹{product.savings}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Registration Form */}
      <section className={styles.registrationSection}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>📝 Complete Your Registration</h2>
          
          {/* Progress Indicator */}
          <div className={styles.progressBar}>
            <div className={styles.progressSteps}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={`${styles.progressStep} ${i <= step ? styles.active : ''}`}>
                  <div className={styles.stepCircle}>{i}</div>
                  <div className={styles.stepLabel}>
                    {i === 1 ? 'Personal' : i === 2 ? 'Address' : 'Bank'}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.progressText}>Step {step} of 3</div>
          </div>

          {/* Form Content */}
          <div className={styles.formContent}>
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className={styles.formStep}>
                <h3 className={styles.stepTitle}>
                  <User className="w-5 h-5" />
                  Personal Information
                </h3>

                {/* Photo Upload */}
                <div className={styles.photoUpload}>
                  <div className={styles.photoPreview}>
                    {formData.photoPreview ? (
                      <img src={formData.photoPreview} alt="Profile" />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <label className={styles.uploadButton}>
                    <Upload className="w-4 h-4" />
                    Upload Profile Photo *
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                      className={styles.fileInput}
                      required
                    />
                  </label>
                </div>

                {/* Name */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className={styles.input}
                    required
                  />
                </div>

                {/* Phone */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    className={styles.input}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Address */}
            {step === 2 && (
              <div className={styles.formStep}>
                <h3 className={styles.stepTitle}>
                  <MapPin className="w-5 h-5" />
                  Address Information
                </h3>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Complete Address *</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your complete address with pincode"
                    className={styles.textarea}
                    rows={4}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 3: Bank Details */}
            {step === 3 && (
              <div className={styles.formStep}>
                <h3 className={styles.stepTitle}>
                  <CreditCard className="w-5 h-5" />
                  Bank Account Details
                </h3>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Bank Name *</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    placeholder="Enter bank name"
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Account Number *</label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    placeholder="Enter account number"
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>IFSC Code *</label>
                  <input
                    type="text"
                    value={formData.ifsc}
                    onChange={(e) => handleInputChange('ifsc', e.target.value)}
                    placeholder="Enter IFSC code"
                    className={styles.input}
                    required
                  />
                </div>

                {/* Terms & Conditions Checkbox */}
                <div className={styles.termsBox}>
                  <label className={styles.termsLabel}>
                    <input 
                      type="checkbox" 
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className={styles.termsCheckbox}
                    />
                    <span>
                      I agree to the{' '}
                      <a href="/terms" target="_blank" className={styles.termsLink}>
                        Terms & Conditions
                      </a>
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className={styles.formActions}>
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {step < 3 ? (
              <button
                onClick={handleNext}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.photo}
                className={`${styles.button} ${styles.buttonSuccess}`}
              >
                {loading ? 'Processing...' : 'Complete Registration'}
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
