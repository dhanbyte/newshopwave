import { Metadata } from 'next'
import Link from 'next/link'
import { Package, TrendingUp, DollarSign, Users, Shield, Zap, CheckCircle, Video, Target, Percent, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'What is Dropshipping? Complete Guide | ShopWave Dropshipping India',
  description: 'Learn what dropshipping is and how to start your dropshipping business in India with ShopWave. Get 50-70% wholesale discounts, free product videos, Meta ads support, and profit sharing. Complete dropshipping guide for beginners.',
  keywords: 'what is dropshipping, dropshipping meaning, dropshipping India, how to start dropshipping, dropshipping business model, dropshipping guide India, dropshipping for beginners, dropshipping suppliers India, wholesale dropshipping, online business India, reselling business, work from home India, dropshipping tutorial, ShopWave dropshipping',
  openGraph: {
    title: 'What is Dropshipping? Complete Guide | ShopWave India',
    description: 'Complete guide to dropshipping in India. Learn how to start your dropshipping business with ShopWave - 50-70% discounts, free videos, Meta ads support.',
    type: 'article',
  },
}

export default function DropshippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What is <span className="text-blue-600">Dropshipping</span>?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start your online business with ZERO inventory investment. Sell products without storing them!
          </p>
        </div>

        {/* Video Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-6">
            <a 
              href="https://www.youtube.com/watch?v=I-U1NwHyGGI" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-full hover:bg-red-700 transition-colors"
            >
              <Video className="w-6 h-6" />
              <span className="font-semibold">Watch Complete Tutorial (2 min)</span>
            </a>
          </div>
        </div>
      </section>

      {/* What is Dropshipping */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            🎯 Dropshipping Kya Hai? (What is Dropshipping?)
          </h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              <strong>Dropshipping</strong> ek business model hai jisme aap products bechte ho <strong>bina inventory rakhe</strong>. 
              Jab customer aapse order karta hai, tab aap supplier (ShopWave) se product mangwate ho aur wo directly customer ko deliver kar deta hai.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Simple Example:</h3>
              <ol className="space-y-3 text-gray-800">
                <li>✅ Customer aapse ₹1000 me product order karta hai</li>
                <li>✅ Aap ShopWave se ₹600 me (wholesale price) order karte ho</li>
                <li>✅ ShopWave directly customer ko deliver karta hai</li>
                <li>✅ Aapka profit: ₹400 (40%)</li>
              </ol>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              🚀 How Dropshipping Works - Step by Step
            </h3>
            
            <div className="grid md:grid-cols-4 gap-6 my-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
                <h4 className="font-bold text-gray-900 mb-2">Customer Orders</h4>
                <p className="text-sm text-gray-700">Customer aapse product order karta hai</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
                <h4 className="font-bold text-gray-900 mb-2">You Order</h4>
                <p className="text-sm text-gray-700">Aap ShopWave se wholesale price pe order karte ho</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
                <h4 className="font-bold text-gray-900 mb-2">We Ship</h4>
                <p className="text-sm text-gray-700">ShopWave directly customer ko deliver karta hai</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">4</div>
                <h4 className="font-bold text-gray-900 mb-2">You Earn</h4>
                <p className="text-sm text-gray-700">Aap profit kamao bina kuch kiye!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ShopWave Services */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🎁 ShopWave Dropshipping Services
          </h2>
          <p className="text-xl text-gray-600">
            India's #1 Dropshipping Platform - Complete Business Solution
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Service 1 */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Percent className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">50-70% Wholesale Discount</h3>
            <p className="text-gray-700 mb-4">
              Sabhi products pe massive discount. Customer price ₹1000, aapka price ₹300-500!
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Weekly Plan: 50% discount
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Monthly Plan: 70% discount
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Yearly Plan: 85-90% discount
              </li>
            </ul>
          </div>

          {/* Service 2 */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Video className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Free Product Videos</h3>
            <p className="text-gray-700 mb-4">
              Har product ke liye professional promotional videos - social media pe share karo!
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                HD quality videos
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                Instagram/Facebook ready
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                Download & share unlimited
              </li>
            </ul>
          </div>

          {/* Service 3 */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Meta Ads Support</h3>
            <p className="text-gray-700 mb-4">
              Facebook & Instagram ads se aane wale orders pe extra profit share!
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                20-30% profit share from ads
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                Ad creatives provided
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                Campaign guidance
              </li>
            </ul>
          </div>

          {/* Service 4 */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No Inventory Needed</h3>
            <p className="text-gray-700 mb-4">
              Koi product stock nahi rakhna. Hum handle karte hain storage & shipping!
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-orange-600" />
                Zero investment in stock
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-orange-600" />
                No warehouse needed
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-orange-600" />
                Direct delivery to customer
              </li>
            </ul>
          </div>

          {/* Service 5 */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
            <p className="text-gray-700 mb-4">
              Dedicated support team har waqt available - WhatsApp, call, email!
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-red-600" />
                WhatsApp support
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-red-600" />
                Order tracking help
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-red-600" />
                Business guidance
              </li>
            </ul>
          </div>

          {/* Service 6 */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Processing</h3>
            <p className="text-gray-700 mb-4">
              Quick order processing & delivery. Customer satisfaction guaranteed!
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-600" />
                Same day processing
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-600" />
                3-7 days delivery
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-600" />
                Real-time tracking
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            💰 Why Choose ShopWave Dropshipping?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">High Profit Margins</h3>
                <p className="text-blue-100">Earn ₹500-₹2000 per sale with our wholesale pricing</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Scalable Business</h3>
                <p className="text-blue-100">Start small, grow big - no limits on earnings</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Quality Guaranteed</h3>
                <p className="text-blue-100">All products quality checked before shipping</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Work From Home</h3>
                <p className="text-blue-100">Run your business from anywhere, anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            📊 Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600">
            Flexible plans for every business size
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Weekly</h3>
            <div className="text-3xl font-bold text-blue-600 mb-4">₹49</div>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>✅ 50% discount</li>
              <li>✅ Basic support</li>
              <li>✅ All products access</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-500">
            <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">POPULAR</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Monthly</h3>
            <div className="text-3xl font-bold text-blue-600 mb-4">₹299</div>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>✅ 70% discount</li>
              <li>✅ Product videos</li>
              <li>✅ 30% ad profit share</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-500">
            <div className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">BEST VALUE</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quarterly</h3>
            <div className="text-3xl font-bold text-blue-600 mb-4">₹599</div>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>✅ 85% discount</li>
              <li>✅ Product videos</li>
              <li>✅ 25% ad profit share</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg p-6 border-2 border-orange-500">
            <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">PREMIUM</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Yearly</h3>
            <div className="text-3xl font-bold text-orange-600 mb-4">₹999</div>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>✅ 90% discount</li>
              <li>✅ Product videos</li>
              <li>✅ 20% ad profit share</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/dropshipper/plans"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            View All Plans & Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          ❓ Frequently Asked Questions
        </h2>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Q: Dropshipping shuru karne ke liye kitna investment chahiye?
            </h3>
            <p className="text-gray-700">
              A: Sirf ₹49 se shuru kar sakte ho (Weekly plan). Koi inventory investment nahi chahiye!
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Q: Kitna profit kama sakte hain?
            </h3>
            <p className="text-gray-700">
              A: Average ₹15,000-₹50,000 per month. Depends on aapki sales aur marketing efforts.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Q: Products ki delivery kaun karega?
            </h3>
            <p className="text-gray-700">
              A: ShopWave directly customer ko deliver karega. Aapko kuch nahi karna!
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Q: Kya refund milega agar plan cancel karna ho?
            </h3>
            <p className="text-gray-700">
              A: No, all plans are non-refundable. Please choose wisely!
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Dropshipping Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join 10,000+ successful dropshippers earning daily with ShopWave
          </p>
          <Link 
            href="/dropshipper/plans"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get Started Now - View Plans
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "What is Dropshipping? Complete Guide to Dropshipping in India",
            "description": "Complete guide to dropshipping business model in India. Learn how to start dropshipping with ShopWave - wholesale prices, product videos, Meta ads support.",
            "author": {
              "@type": "Organization",
              "name": "ShopWave"
            },
            "publisher": {
              "@type": "Organization",
              "name": "ShopWave Dropshipping",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.shopwave.social/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://www.shopwave.social/dropshipping"
            }
          })
        }}
      />
    </div>
  )
}
