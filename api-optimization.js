// API Route Optimization for Fast Product Loading

// Optimized Products API Route
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 100;
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'desc';
    const category = searchParams.get('category');
    
    // Calculate offset
    const offset = (page - 1) * limit;
    
    // Build optimized query
    let query = supabase
      .from('vendor_products')
      .select(`
        id,
        name,
        price,
        original_price,
        images,
        category,
        subcategory,
        status,
        created_at
      `, { count: 'exact' })
      .eq('status', 'approved')
      .order(sort, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1);
    
    // Add category filter if provided
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data: products, error, count } = await query;
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
    
    // Calculate pagination info
    const totalCount = count || 0;
    const hasMore = offset + limit < totalCount;
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      products: products || [],
      totalCount,
      hasMore,
      currentPage: page,
      totalPages,
      pageSize: limit
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Database Index Optimization
const DATABASE_INDEXES = `
-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_vendor_products_status ON vendor_products(status);
CREATE INDEX IF NOT EXISTS idx_vendor_products_category ON vendor_products(category);
CREATE INDEX IF NOT EXISTS idx_vendor_products_created_at ON vendor_products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vendor_products_status_category ON vendor_products(status, category);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_vendor_products_fast_query 
ON vendor_products(status, category, created_at DESC) 
WHERE status = 'approved';
`;

// Cache Configuration
const CACHE_CONFIG = {
  // Cache products for 5 minutes
  products: {
    ttl: 300, // 5 minutes
    key: (page, limit, category) => `products:${page}:${limit}:${category || 'all'}`
  },
  
  // Cache categories for 1 hour
  categories: {
    ttl: 3600, // 1 hour
    key: 'categories:all'
  }
};

// Memory Cache Implementation
class SimpleCache {
  constructor() {
    this.cache = new Map();
  }
  
  set(key, value, ttl = 300) {
    const expiry = Date.now() + (ttl * 1000);
    this.cache.set(key, { value, expiry });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  clear() {
    this.cache.clear();
  }
}

const cache = new SimpleCache();

// Cached Product Fetcher
async function getCachedProducts(page, limit, category) {
  const cacheKey = CACHE_CONFIG.products.key(page, limit, category);
  
  // Try cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  // Fetch from database
  const result = await fetchProductsFromDB(page, limit, category);
  
  // Cache the result
  cache.set(cacheKey, result, CACHE_CONFIG.products.ttl);
  
  return result;
}

// Performance Monitoring
const PERFORMANCE_METRICS = {
  apiCalls: 0,
  cacheHits: 0,
  avgResponseTime: 0,
  
  recordCall(responseTime) {
    this.apiCalls++;
    this.avgResponseTime = ((this.avgResponseTime * (this.apiCalls - 1)) + responseTime) / this.apiCalls;
  },
  
  recordCacheHit() {
    this.cacheHits++;
  },
  
  getStats() {
    return {
      totalCalls: this.apiCalls,
      cacheHitRate: this.cacheHits / this.apiCalls * 100,
      avgResponseTime: this.avgResponseTime
    };
  }
};

module.exports = {
  DATABASE_INDEXES,
  CACHE_CONFIG,
  SimpleCache,
  getCachedProducts,
  PERFORMANCE_METRICS
};