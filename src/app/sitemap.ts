import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shopwave.in'

  // Static pages
  const staticPages = [
    '',
    '/search',
    '/cart',
    '/checkout',
    '/orders',
    '/wishlist',
    '/account',
    '/faq',
    '/help',
    '/contact',
    '/shipping-policy',
    '/return-policy',
    '/terms',
    '/privacy',
    '/withdrawal-policy',
    '/dropshipper/plans',
    '/dropshipper/join',
    '/vendor/login',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // Fetch all products for sitemap
  let products: any[] = []
  try {
    const response = await fetch(`${baseUrl}/api/products`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    if (response.ok) {
      products = await response.json()
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error)
  }

  // Product pages
  const productPages = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug || product.id}`,
    lastModified: new Date(product.updated_at || product.created_at || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Category pages
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/search?category=${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...productPages, ...categoryPages]
}
