// Fix Product Pagination - Load 100 products initially, then paginate

const PAGINATION_CONFIG = {
  initialLoad: 100,
  pageSize: 50,
  preloadNext: true
};

// Enhanced Product API with Pagination
async function fetchProductsWithPagination(page = 1, limit = PAGINATION_CONFIG.initialLoad) {
  try {
    const response = await fetch(`/api/products?page=${page}&limit=${limit}&sort=created_at&order=desc`);
    const data = await response.json();
    
    return {
      products: data.products || [],
      totalCount: data.totalCount || 0,
      hasMore: data.hasMore || false,
      currentPage: page,
      totalPages: Math.ceil((data.totalCount || 0) / limit)
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], totalCount: 0, hasMore: false };
  }
}

// Optimized Product Loading Component
function useOptimizedProductLoading() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Initial load - 100 products
  const loadInitialProducts = async () => {
    setLoading(true);
    const result = await fetchProductsWithPagination(1, PAGINATION_CONFIG.initialLoad);
    
    setProducts(result.products);
    setTotalCount(result.totalCount);
    setHasMore(result.hasMore);
    setCurrentPage(1);
    setLoading(false);
  };

  // Load next page - 50 products
  const loadNextPage = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    const nextPage = Math.floor(products.length / PAGINATION_CONFIG.pageSize) + 1;
    const result = await fetchProductsWithPagination(nextPage, PAGINATION_CONFIG.pageSize);
    
    setProducts(prev => [...prev, ...result.products]);
    setHasMore(result.hasMore);
    setCurrentPage(nextPage);
    setLoading(false);
  };

  return {
    products,
    loading,
    hasMore,
    totalCount,
    loadInitialProducts,
    loadNextPage,
    currentPage
  };
}

// Fast Product List Component
const FastProductList = () => {
  const {
    products,
    loading,
    hasMore,
    totalCount,
    loadInitialProducts,
    loadNextPage
  } = useOptimizedProductLoading();

  useEffect(() => {
    loadInitialProducts();
  }, []);

  return (
    <div className="product-list">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Products ({totalCount})</h2>
        <div className="text-sm text-gray-500">
          Showing {products.length} of {totalCount}
        </div>
      </div>

      {products.length === 0 && !loading ? (
        <div className="text-center py-8 text-gray-500">
          No products found
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <ProductCard key={`${product.id}-${index}`} product={product} />
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-6">
              <button
                onClick={loadNextPage}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
              >
                {loading ? 'Loading...' : 'Load More Products'}
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Optimized Product Card with Lazy Loading
const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gray-200 rounded-lg mb-3 overflow-hidden">
        {!imageLoaded && (
          <div className="w-full h-full bg-gray-200 animate-pulse"></div>
        )}
        <img
          src={product.images?.[0] || '/placeholder.jpg'}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
      </div>
      
      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-green-600">₹{product.price}</span>
          {product.original_price && (
            <span className="text-xs text-gray-500 line-through">₹{product.original_price}</span>
          )}
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {product.category}
        </span>
      </div>
    </div>
  );
};

module.exports = {
  PAGINATION_CONFIG,
  fetchProductsWithPagination,
  useOptimizedProductLoading,
  FastProductList,
  ProductCard
};