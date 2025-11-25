'use client'

import { useMemo, useState, Suspense, useEffect } from 'react'
import type { ElementType } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Head from 'next/head'
import Link from 'next/link'
import Gallery from '@/components/Gallery'
import PriceTag from '@/components/PriceTag'
import RatingStars from '@/components/RatingStars'
import QtyCounter from '@/components/QtyCounter'
import { useCart } from '@/lib/cartStore'
import WishlistButton from '@/components/WishlistButton'
import { ChevronLeft, Share2, ShieldCheck, RotateCw, BellRing, Check, Truck } from 'lucide-react'

import ProductReviews from '@/components/ProductReviews'
import RelatedProducts from '@/components/RelatedProducts'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { useRequireAuth } from '@/hooks/use-require-auth'
import { useProductStore } from '@/lib/productStore'
import type { Product } from '@/lib/types'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useNotificationStore } from '@/lib/notificationStore'
import CustomNameInput from '@/components/CustomNameInput'

type ProductWithLegacyFields = Product & {
  _id?: string
}

function ProductDetailContent() {
  const router = useRouter()
  const { requireAuth, user } = useRequireAuth()
  const params = useParams<{ slug?: string; id?: string }>()
  const slugParam = params?.slug ?? params?.id
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { products } = useProductStore()
  const { addNotification, hasNotification } = useNotificationStore()
  const productList = products as ProductWithLegacyFields[]
  
  const [p, setP] = useState<Product | null | undefined>(undefined);
  const [qty, setQty] = useState(1)
  const [customName, setCustomName] = useState('')
  const [loading, setLoading] = useState(true)
  const { add } = useCart()

  // Track influencer referral
  useEffect(() => {
    const influencerRef = searchParams.get('ref')
    if (influencerRef && p) {
      // Track click for influencer
      fetch('/api/referrals/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          influencerId: influencerRef,
          productId: p.id,
          action: 'click'
        })
      }).catch(console.error)
      
      // Store in session for checkout tracking
      sessionStorage.setItem('influencerRef', influencerRef)
    }
  }, [searchParams, p])

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) {
        setLoading(false)
        return
      }

      setLoading(true)
      setP(undefined)

      // First try to find in existing products
      if (productList.length > 0) {
        let foundProduct = productList.find((prod) => prod.slug === slug)

        if (!foundProduct) {
          foundProduct = productList.find((prod) => prod.id === slug)
        }

        if (!foundProduct) {
          foundProduct = productList.find((prod) => prod._id === slug)
        }

        if (!foundProduct) {
          foundProduct = productList.find(
            (prod) => prod.slug && prod.slug.includes(slug)
          )
        }

        if (!foundProduct) {
          foundProduct = productList.find((prod) => {
            const generatedSlug = prod.name
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')
            return generatedSlug === slug
          })
        }

        if (foundProduct) {
          setP(foundProduct)
          setLoading(false)
          return
        }
      }

      // If not found in store, try to find by ID in products
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const allProducts = await response.json()
          const foundProduct = allProducts.find(p => p.id.toString() === slug || p.slug === slug)
          if (foundProduct) {
            setP(foundProduct)
          } else {
            setP(null)
          }
        } else {
          setP(null)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setP(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug, productList])

  if (loading || p === undefined) {
    return (
      <div className="flex justify-center py-10">
          <LoadingSpinner />
      </div>
    )
  }

  if (p === null) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-4">The product you're looking for is not available.</p>
        <Link href="/" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Go Home
        </Link>
      </div>
    )
  }

  const price = p.price?.discounted ?? p.price_discounted ?? p.price?.original ?? p.price_original ?? p.price ?? 0
  const images = [p.image, ...(p.extraImages||[])]
  const related = products.filter(x => {
    if (x.id === p.id) return false;
    // Prefer subcategory match if available
    if (p.subcategory && x.subcategory) {
        return x.subcategory === p.subcategory;
    }
    return x.category === p.category;
  }).slice(0, 8);

  const handleAddToCart = () => {
    if (!requireAuth('add items to cart')) {
      return;
    }
    if (!user?.id) {
      return;
    }
    
    // Check if custom name is required but not provided
    if (p.isCustomizable && !customName.trim()) {
      toast({ 
        title: "Custom Name Required", 
        description: "Please enter a custom name for this product.",
        variant: "destructive"
      });
      return;
    }
    
    const cartItem = { 
      id: p.id, 
      qty, 
      price, 
      name: p.name, 
      image: p.image,
      weight: p.weight || 100,
      category: p.category,
      ...(p.isCustomizable && customName.trim() && { customName: customName.trim() })
    };
    
    add(user.id, cartItem);
    const displayName = p.isCustomizable && customName.trim() 
      ? `${p.name} (Custom: "${customName.trim()}")`
      : p.name;
    toast({ title: "Added to Cart", description: `${displayName} has been added to your cart.` });
  }

  const handleBuyNow = () => {
    if (!requireAuth('proceed to checkout')) {
      return;
    }
    if (!user?.id) {
      return;
    }
    
    // Check if custom name is required but not provided
    if (p.isCustomizable && !customName.trim()) {
      toast({ 
        title: "Custom Name Required", 
        description: "Please enter a custom name for this product.",
        variant: "destructive"
      });
      return;
    }
    
    const cartItem = { 
      id: p.id, 
      qty, 
      price, 
      name: p.name, 
      image: p.image,
      weight: p.weight || 100,
      category: p.category,
      ...(p.isCustomizable && customName.trim() && { customName: customName.trim() })
    };
    
    add(user.id, cartItem);
    router.push('/checkout');
  }

  const handleNotifyMe = () => {
    if (!requireAuth('get notifications for this product')) {
      return;
    }
    if (!user?.id) {
      return;
    }
    if (!hasNotification(p.id)) {
      addNotification(user.id, p.id);
      toast({ title: "You're on the list!", description: `We'll notify you when ${p.name} is back in stock.` });
    }
  };

  const handleShare = async () => {
    const influencerRef = searchParams.get('ref')
    const shareUrl = influencerRef 
      ? `${window.location.origin}/product/${slug}?ref=${influencerRef}`
      : window.location.href
      
    const shareData = {
      title: p.name,
      text: p.shortDescription,
      url: shareUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({ title: "Link Copied!", description: "Product link copied to clipboard." });
      }
    } catch (error) {
      console.error('Share failed:', error);
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: "Link Copied!", description: "Product link copied to clipboard." });
    }
  };
  
  const ProductInfo = ({ icon: Icon, title, subtitle }: { icon: ElementType; title: string; subtitle?: string }) => (
    <div className="flex items-center gap-3">
        <Icon className="h-8 w-8 text-gray-500" />
        <div>
            <div className="font-semibold text-sm">{title}</div>
            {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        </div>
    </div>
  )

  const ActionButtons = () => {
    if (p.quantity > 0) {
      return (
        <>
          <div className="mt-4">
            <div className="text-sm font-medium mb-1">Quantity</div>
            <QtyCounter value={qty} onChange={n => setQty(Math.max(1, Math.min(10, n)))} />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleAddToCart} className="flex-1 rounded-xl bg-brand/90 py-3 text-white font-semibold transition-colors hover:bg-brand">Add to Cart</button>
            <button onClick={handleBuyNow} className="flex-1 rounded-xl bg-brand py-3 text-white font-semibold transition-colors hover:bg-brand/90">Buy Now</button>
          </div>
        </>
      )
    }

    return (
      <div className="mt-6">
        {hasNotification(p.id) ? (
          <Button variant="outline" className="w-full" disabled>
            <Check className="h-4 w-4 mr-2" /> We'll Notify You
          </Button>
        ) : (
          <Button onClick={handleNotifyMe} variant="outline" className="w-full">
            <BellRing className="h-4 w-4 mr-2" /> Notify Me When Available
          </Button>
        )}
      </div>
    );
  };
  
  const StickyActionButtons = () => {
    if (p.quantity > 0) {
      return (
         <div className="sticky-cta p-3 md:hidden">
            <div className="flex gap-3">
              <button onClick={handleAddToCart} className="flex-1 rounded-xl bg-brand/90 py-3 text-white font-semibold transition-colors hover:bg-brand">Add to Cart</button>
              <button onClick={handleBuyNow} className="flex-1 rounded-xl bg-brand py-3 text-white font-semibold transition-colors hover:bg-brand/90">Buy Now</button>
            </div>
          </div>
      )
    }

    return (
       <div className="sticky-cta p-3 md:hidden">
          {hasNotification(p.id) ? (
            <Button variant="outline" className="w-full" disabled>
              <Check className="h-4 w-4 mr-2" /> Notifying
            </Button>
          ) : (
            <Button onClick={handleNotifyMe} variant="outline" className="w-full">
               <BellRing className="h-4 w-4 mr-2" /> Notify Me
            </Button>
          )}
        </div>
    )
  }

  // Generate comprehensive keywords
  const generateKeywords = (product: Product) => {
    const baseKeywords = [
      product.name,
      product.brand,
      product.category,
      product.subcategory,
      // Dropshipping keywords
      'dropshipping India',
      'wholesale price',
      'dropship product',
      'resell online',
      'online business',
      // Shopping keywords
      'buy online',
      'best price',
      'ShopWave',
      'online shopping',
      'India',
      'cheapest price',
      'free delivery',
      'best deals',
      'discount',
      'offer',
      ...(product.features || []),
      ...(product.name.split(' ')),
      `${product.brand} ${product.category}`,
      `buy ${product.name}`,
      `${product.name} price`,
      `${product.name} online`,
      `${product.name} India`,
      `best ${product.category}`,
      `${product.category} accessories`,
      `${product.name} wholesale`,
      `${product.name} dropship`,
      `${product.category} for reselling`,
      `${product.category} dropshipping`,
    ].filter(Boolean).join(', ');
    return baseKeywords;
  };

  const TrustBadges = () => (
    <div className="grid grid-cols-3 gap-2 md:gap-4 mt-6 py-4 border-t border-b border-gray-100">
      <div className="flex flex-col items-center text-center">
        <div className="p-2 bg-green-50 rounded-full mb-2">
          <ShieldCheck className="w-5 h-5 text-green-600" />
        </div>
        <span className="text-xs font-medium text-gray-600">Secure Payment</span>
      </div>
      <div className="flex flex-col items-center text-center">
        <div className="p-2 bg-blue-50 rounded-full mb-2">
          <RotateCw className="w-5 h-5 text-blue-600" />
        </div>
        <span className="text-xs font-medium text-gray-600">Easy Returns</span>
      </div>
      <div className="flex flex-col items-center text-center">
        <div className="p-2 bg-purple-50 rounded-full mb-2">
          <Truck className="w-5 h-5 text-purple-600" />
        </div>
        <span className="text-xs font-medium text-gray-600">Free Delivery</span>
      </div>
    </div>
  )

  return (
    <>
      <Head>
        <title>{p.name} - ShopWave | Wholesale Price | Dropshipping India | Best Deals</title>
        <meta name="description" content={`${p.name} by ${p.brand} at wholesale price ₹${price} on ShopWave! Perfect for dropshipping & reselling. ${p.shortDescription || p.description.substring(0, 100)}. 50-70% discount, free delivery, best deals India!`} />
        <meta name="keywords" content={generateKeywords(p)} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${p.name} - ShopWave`} />
        <meta property="og:description" content={`Buy ${p.name} by ${p.brand} at ₹${price}. ${p.shortDescription || p.description.substring(0, 150)}`} />
        <meta property="og:image" content={p.image} />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="600" />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`/product/${p.slug}`} />
        <meta property="og:site_name" content="ShopWave" />
        
        {/* Product specific */}
        <meta property="product:price:amount" content={String(price)} />
        <meta property="product:price:currency" content="INR" />
        <meta property="product:availability" content={p.quantity > 0 ? 'in stock' : 'out of stock'} />
        <meta property="product:brand" content={p.brand} />
        <meta property="product:category" content={p.category} />
        <meta property="product:condition" content="new" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${p.name} - ShopWave`} />
        <meta name="twitter:description" content={`Buy ${p.name} at ₹${price}. ${p.shortDescription || p.description.substring(0, 100)}`} />
        <meta name="twitter:image" content={p.image} />
        
        {/* Additional SEO */}
        <meta name="author" content="ShopWave" />
        <meta name="publisher" content="ShopWave" />
        <meta name="copyright" content="ShopWave" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        
        <link rel="canonical" href={`/product/${p.slug}`} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": p.name,
              "description": p.description,
              "image": images,
              "brand": {
                "@type": "Brand",
                "name": p.brand
              },
              "category": p.category,
              "sku": p.sku,
              "gtin": p.sku,
              "mpn": p.sku,
              "offers": {
                "@type": "Offer",
                "price": price,
                "priceCurrency": "INR",
                "availability": p.quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "itemCondition": "https://schema.org/NewCondition",
                "seller": {
                  "@type": "Organization",
                  "name": "ShopWave",
                  "url": "",
                  "description": "India's #1 Dropshipping Platform - Wholesale Supplier",
                  "brand": "ShopWave Dropshipping",
                  "sameAs": [
                    "https://shopwave.in"
                  ]
                },
                "url": `/product/${p.slug}`,
                "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                "eligibleRegion": {
                  "@type": "Place",
                  "name": "India"
                },
                "businessFunction": "http://purl.org/goodrelations/v1#Sell",
                "availableDeliveryMethod": "http://purl.org/goodrelations/v1#DeliveryModeDirectDownload"
              },
              "manufacturer": {
                "@type": "Organization",
                "name": p.brand
              },
              "supplier": {
                "@type": "Organization",
                "name": "ShopWave Dropshipping",
                "description": "Leading dropshipping supplier in India with wholesale prices",
                "url": "",
                "areaServed": "IN",
                "priceRange": "₹"
              },
              "additionalProperty": [
                {
                  "@type": "PropertyValue",
                  "name": "Dropshipping Available",
                  "value": "Yes"
                },
                {
                  "@type": "PropertyValue",
                  "name": "Wholesale Price",
                  "value": "50-70% discount"
                },
                {
                  "@type": "PropertyValue",
                  "name": "Supplier Type",
                  "value": "Dropshipping Supplier India"
                }
              ],
              "aggregateRating": p.ratings ? {
                "@type": "AggregateRating",
                "ratingValue": p.ratings.average,
                "reviewCount": p.ratings.count,
                "bestRating": 5,
                "worstRating": 1
              } : undefined,
              "review": p.ratings ? [{
                "@type": "Review",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": p.ratings.average,
                  "bestRating": 5
                },
                "author": {
                  "@type": "Person",
                  "name": "Verified Buyer"
                }
              }] : undefined
            })
          }}
        />
        
        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": ""
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": p.category,
                  "item": `/search?category=${p.category}`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": p.name,
                  "item": `/product/${p.slug}`
                }
              ]
            })
          }}
        />
      </Head>
      <div className="pb-20 md:pb-0">
      <button onClick={() => router.back()} className="md:hidden flex items-center gap-1 text-sm text-gray-600 mb-2">
        <ChevronLeft size={16} /> Back
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-12">
        <div className="lg:col-span-2">
          <Gallery images={images} isOutOfStock={p.quantity === 0} />
        </div>
        <div className="lg:col-span-3 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl font-semibold md:text-2xl">{p.name}</h1>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleShare}
                  className="rounded-full p-2 bg-gray-100/80 text-gray-600 hover:bg-gray-200 transition-colors"
                  aria-label="Share"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                <WishlistButton id={p.id} />
              </div>
            </div>
            {p.brand && <div className="mt-1 text-sm text-gray-500">by {p.brand}</div>}
            {p.ratings && <div className="mt-2"><RatingStars value={p.ratings?.average ?? 0} /></div>}
            
            {/* Stock info for dropshippers */}
            {user?.is_dropshipper && (
              <div className="mt-3 mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">Available Stock:</span>
                  <span className={`text-lg font-bold ${
                    (p.quantity || p.stock || 0) > 10 
                      ? 'text-green-600' 
                      : (p.quantity || p.stock || 0) > 0 
                        ? 'text-orange-600' 
                        : 'text-red-600'
                  }`}>
                    {p.quantity || p.stock || 0} units
                  </span>
                </div>
                {(p.quantity || p.stock || 0) <= 10 && (p.quantity || p.stock || 0) > 0 && (
                  <p className="text-xs text-orange-600 mt-1">⚠️ Low stock - Order soon!</p>
                )}
              </div>
            )}

            {/* Stock info for regular users if low */}
            {!user?.is_dropshipper && (p.quantity || p.stock || 0) <= 5 && (p.quantity || p.stock || 0) > 0 && (
               <div className="mt-3 mb-2 flex items-center gap-2 text-red-600 animate-pulse">
                  <div className="h-2 w-2 rounded-full bg-red-600"></div>
                  <span className="text-xs font-bold">Hurry! Only {p.quantity || p.stock || 0} left in stock</span>
               </div>
            )}
            
            <div className="mt-3"><PriceTag original={p.price?.original ?? p.price_original ?? p.originalPrice} discounted={p.price?.discounted ?? p.price_discounted ?? p.price} /></div>
            
            {p.shortDescription && <div className="mt-4 text-sm text-gray-700">
              <p>{p.shortDescription}</p>
            </div>}
            
            {/* Custom Name Input for Customizable Products */}
            {p.isCustomizable && (
              <div className="mt-6">
                <CustomNameInput 
                  onCustomNameChange={setCustomName}
                  placeholder="Enter your name or custom text"
                  maxLength={20}
                />
              </div>
            )}
            
            <ActionButtons />
            
            <TrustBadges />

          <div className="mt-8 space-y-6">
            {p.description && 
              <div>
                <h3 className="text-sm font-semibold mb-1">Description</h3>
                <p className="text-sm text-gray-700">{p.description}</p>
              </div>
            }

            {p.features && p.features.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-1">Highlights</h3>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  {p.features.map((f,i)=> <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}
            

            {p.specifications && Object.keys(p.specifications).length > 0 && (
              <div>
                <h3 className="text-sm font-semibold">Specifications</h3>
                <table className="mt-2 w-full text-sm">
                    <tbody>
                    {Object.entries(p.specifications||{}).map(([k,v]) => (
                        <tr key={k} className="border-b last:border-0">
                        <td className="w-1/3 py-2 text-gray-500">{k}</td>
                        <td className="py-2 text-gray-800">{v}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <RelatedProducts products={related} />

      <div className="mt-12">
        <Suspense fallback={<div className="text-center py-8">Loading reviews...</div>}>
          <ProductReviews productId={p.id} />
        </Suspense>
      </div>

      <StickyActionButtons />
    </div>
    </>
  )
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-10"><LoadingSpinner /></div>}>
      <ProductDetailContent />
    </Suspense>
  )
}
