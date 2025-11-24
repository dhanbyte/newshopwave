import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://shopwave.com' // Replace with actual domain

  // Static routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/shipping-policy',
    '/return-policy',
    '/withdrawal-policy',
    '/faq',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }))

  // Fetch products
  let products: any[] = []
  try {
      const { data } = await supabase
        .from('vendor_products')
        .select('id, updated_at')
        .eq('status', 'approved')
        .limit(1000);
      products = data || [];
  } catch (e) {
      console.error('Sitemap generation error:', e);
  }

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(product.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...routes, ...productRoutes]
}
