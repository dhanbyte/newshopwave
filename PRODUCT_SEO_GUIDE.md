# Product SEO Implementation Guide

## Issue
Products का SEO metadata नहीं बना है क्योंकि product page client component है।

## Solution
Product pages के लिए dynamic metadata generate करने के लिए एक separate metadata file बनाएं।

## Files to Create

### 1. Create: `src/app/product/[slug]/metadata.ts`

```typescript
import { Metadata } from 'next'

export async function generateProductMetadata(slug: string): Promise<Metadata> {
  try {
    // Fetch product data
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shopwave.in'
    const response = await fetch(`${baseUrl}/api/products`)
    
    if (!response.ok) {
      return {
        title: 'Product Not Found - ShopWave',
        description: 'The product you are looking for is not available.'
      }
    }
    
    const products = await response.json()
    const product = products.find((p: any) => 
      p.slug === slug || p.id === slug || p.id.toString() === slug
    )
    
    if (!product) {
      return {
        title: 'Product Not Found - ShopWave',
        description: 'The product you are looking for is not available.'
      }
    }
    
    const price = product.price?.discounted ?? product.price_discounted ?? product.price?.original ?? product.price_original ?? product.price ?? 0
    
    return {
      title: `${product.name} - ShopWave | Wholesale Price ₹${price} | Dropshipping India`,
      description: `Buy ${product.name} by ${product.brand} at wholesale price ₹${price} on ShopWave! Perfect for dropshipping & reselling. ${product.shortDescription || product.description?.substring(0, 100)}. 50-70% discount, free delivery, best deals India!`,
      keywords: [
        product.name,
        product.brand,
        product.category,
        product.subcategory,
        'dropshipping India',
        'wholesale price',
        'buy online',
        'ShopWave',
        `${product.name} price`,
        `${product.name} online`,
        `buy ${product.name}`,
      ].filter(Boolean).join(', '),
      openGraph: {
        title: `${product.name} - ShopWave`,
        description: `Buy ${product.name} by ${product.brand} at ₹${price}. ${product.shortDescription || product.description?.substring(0, 150)}`,
        images: [
          {
            url: product.image,
            width: 800,
            height: 600,
            alt: product.name,
          }
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} - ShopWave`,
        description: `Buy ${product.name} at ₹${price}. ${product.shortDescription || product.description?.substring(0, 100)}`,
        images: [product.image],
      },
      robots: {
        index: true,
        follow: true,
      },
    }
  } catch (error) {
    console.error('Error generating product metadata:', error)
    return {
      title: 'ShopWave - Online Shopping India',
      description: 'Shop online at ShopWave for best deals and wholesale prices.'
    }
  }
}
```

## Alternative: Convert to Server Component

Since product page is currently a client component, the better approach is to:

1. Keep the interactive parts as client components
2. Make the main page a server component
3. Use `generateMetadata` function

This is already partially implemented in the current `page.tsx` with metadata in `<Head>` tags, but Next.js 13+ prefers `generateMetadata` export.

## Current Status
✅ Sitemap fixed with absolute URLs
✅ Products included in sitemap
⚠️ Product metadata needs server-side generation

## Recommendation
The current implementation with `<Head>` tags in client component works but is not optimal. For best SEO:
- Consider refactoring to use Next.js 13+ metadata API
- Or keep current implementation (it's functional)
