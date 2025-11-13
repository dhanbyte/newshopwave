'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface RawProduct {
  _id?: string
  id?: string
  name?: string
  category?: string
  mainCategory?: string
  images?: string[]
  image?: string
  price?: unknown
  brand?: string
  vendorId?: string
  quantity?: number
  stock?: number
  status?: string
}

interface ProductsResponse {
  products?: RawProduct[]
}

interface AdminProduct {
  id: string
  name: string
  category?: string
  subcategory?: string
  imageUrl: string
  images?: string[]
  price: number
  originalPrice?: number
  brand?: string
  vendorId?: string
  stock: number
  weight?: number
  length?: number
  width?: number
  height?: number
  description?: string
  status?: string
  isVendorProduct: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<AdminProduct>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(100)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [categories, setCategories] = useState<string[]>(['All'])
  const [availableCategories, setAvailableCategories] = useState<any[]>([])
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([])

  useEffect(() => {
    void fetchProducts()
    void fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setAvailableCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      console.log('Fetching products from admin APIs...')
      
      const [regularRes, vendorRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/vendor-products')
      ])

      console.log('Regular products response status:', regularRes.status)
      console.log('Vendor products response status:', vendorRes.status)

      const regularData: ProductsResponse = await regularRes.json()
      const vendorData: ProductsResponse = await vendorRes.json()

      console.log('Regular products data:', regularData)
      console.log('Vendor products data:', vendorData)
      console.log('Regular products count:', regularData.products?.length || 0)
      console.log('Vendor products count:', vendorData.products?.length || 0)

      const regularProducts = (regularData.products ?? []).map((product) =>
        normalizeProduct(product, false)
      )
      const vendorProducts = (vendorData.products ?? []).map((product) =>
        normalizeProduct(product, true)
      )

      const allProducts = [...regularProducts, ...vendorProducts]
      console.log('Total products after normalization:', allProducts.length)
      setProducts(allProducts)
      
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(
        allProducts
          .map(p => p.category)
          .filter(Boolean)
          .sort()
      )]
      setCategories(uniqueCategories)
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching products:', error.message)
      } else {
        console.error('Error fetching products:', error)
      }
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const updateProductStatus = async (productId: string, status: string, isVendorProduct: boolean) => {
    try {
      const endpoint = isVendorProduct ? '/api/admin/vendor-products' : '/api/admin/products'
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, status })
      })

      if (response.ok) {
        alert(`Product status updated to ${status}`)
        await fetchProducts()
      } else {
        alert('Failed to update product status')
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(`Failed to update product status: ${error.message}`)
      } else {
        alert('Failed to update product status')
      }
    }
  }

  const startEdit = (product: AdminProduct) => {
    setEditingProduct(product.id)
    setEditForm({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      originalPrice: product.originalPrice,
      brand: product.brand,
      stock: product.stock,
      weight: product.weight,
      length: product.length,
      width: product.width,
      height: product.height,
      description: product.description,
      images: product.images || [product.imageUrl]
    })
    
    // Update subcategories when category is selected
    if (product.category) {
      const selectedCategory = availableCategories.find(cat => cat.name === product.category)
      if (selectedCategory) {
        setAvailableSubcategories(selectedCategory.subcategories || [])
      }
    }
  }

  const addImage = () => {
    if (newImageUrl.trim()) {
      setEditForm({
        ...editForm,
        images: [...(editForm.images || []), newImageUrl.trim()]
      })
      setNewImageUrl('')
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = editForm.images?.filter((_, i) => i !== index) || []
    setEditForm({ ...editForm, images: updatedImages })
  }

  const cancelEdit = () => {
    setEditingProduct(null)
    setEditForm({})
  }

  const saveEdit = async (product: AdminProduct) => {
    try {
      const endpoint = product.isVendorProduct ? '/api/admin/vendor-products' : '/api/admin/products'
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          name: editForm.name,
          category: editForm.category,
          subcategory: editForm.subcategory,
          price: editForm.price,
          originalPrice: editForm.originalPrice,
          brand: editForm.brand,
          stock: editForm.stock,
          weight: editForm.weight,
          length: editForm.length,
          width: editForm.width,
          height: editForm.height,
          description: editForm.description
        })
      })

      if (response.ok) {
        alert('Product updated successfully')
        setEditingProduct(null)
        setEditForm({})
        await fetchProducts()
      } else {
        alert('Failed to update product')
      }
    } catch (error) {
      alert('Failed to update product')
    }
  }

  const deleteProduct = async (productId: string, isVendorProduct: boolean) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const endpoint = isVendorProduct ? '/api/admin/vendor-products' : '/api/admin/products'
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      if (response.ok) {
        alert('Product deleted successfully')
        await fetchProducts()
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(`Failed to delete product: ${error.message}`)
      } else {
        alert('Failed to delete product')
      }
    }
  }

  const deleteAllVendorProducts = async () => {
    if (!confirm('⚠️ WARNING: This will delete ALL VENDOR products only. This action cannot be undone. Are you sure?')) {
      return
    }
    
    const confirmation = prompt('Type "DELETE VENDOR" to confirm:')
    if (confirmation !== 'DELETE VENDOR') {
      alert('Deletion cancelled - confirmation text did not match')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/vendor-products/delete-all', { method: 'DELETE' })
      const result = await response.json()

      if (result.success) {
        alert(`All vendor products deleted successfully! Deleted: ${result.deleted} products`)
        await fetchProducts()
      } else {
        alert('Failed to delete vendor products')
      }
    } catch (error) {
      alert('Failed to delete vendor products')
      console.error('Delete vendor products error:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteAllProducts = async () => {
    if (!confirm('⚠️ WARNING: This will delete ALL products (both regular and vendor products). This action cannot be undone. Are you absolutely sure?')) {
      return
    }
    
    if (!confirm('This is your final confirmation. Type YES in the next prompt to proceed.')) {
      return
    }
    
    const confirmation = prompt('Type "DELETE ALL" to confirm:')
    if (confirmation !== 'DELETE ALL') {
      alert('Deletion cancelled - confirmation text did not match')
      return
    }

    setLoading(true)
    try {
      const [vendorRes, regularRes] = await Promise.all([
        fetch('/api/admin/vendor-products/delete-all', { method: 'DELETE' }),
        fetch('/api/admin/products/delete-all', { method: 'DELETE' })
      ])

      const vendorResult = await vendorRes.json()
      const regularResult = await regularRes.json()

      if (vendorResult.success && regularResult.success) {
        alert(`All products deleted successfully!\nVendor products: ${vendorResult.deleted}\nRegular products: ${regularResult.deleted}`)
        await fetchProducts()
      } else {
        alert('Some products could not be deleted. Check console for details.')
      }
    } catch (error) {
      alert('Failed to delete all products')
      console.error('Delete all error:', error)
    } finally {
      setLoading(false)
    }
  }

  const populateProducts = async () => {
    if (!confirm('This will populate the database with products from JSON files (excluding fashion). Continue?')) {
      return
    }

    try {
      const response = await fetch('/api/admin/populate-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()
      
      if (data.success) {
        alert(`Products populated successfully! Inserted: ${data.stats.inserted}, Updated: ${data.stats.updated}, Errors: ${data.stats.errors}`)
        await fetchProducts()
      } else {
        alert(`Failed to populate products: ${data.error}`)
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(`Failed to populate products: ${error.message}`)
      } else {
        alert('Failed to populate products')
      }
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex gap-2">
          <button 
            onClick={populateProducts}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Populate Products
          </button>
          <button 
            onClick={deleteAllVendorProducts}
            disabled={loading}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            Delete Vendor Products
          </button>
          <button 
            onClick={deleteAllProducts}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Delete All Products
          </button>
          <Link href="/admin/add-product">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              + Add Product
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Product List</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No products found</p>
          </div>
        ) : (
          <>
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const categoryCount = selectedCategory === 'All' 
                    ? products.length 
                    : products.filter(p => p.category === category).length
                  
                  return (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category)
                        setCurrentPage(1) // Reset to first page
                      }}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {category} ({category === 'All' ? products.length : products.filter(p => p.category === category).length})
                    </button>
                  )
                })}
              </div>
            </div>
            
            <div className="grid gap-4">
              {products
                .filter(product => selectedCategory === 'All' || product.category === selectedCategory)
                .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
                .map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      {product.images && product.images.length > 1 && (
                        <div className="flex gap-1">
                          {product.images.slice(1, 4).map((img, idx) => (
                            <img key={idx} src={img} alt={`${product.name} ${idx + 2}`} className="w-4 h-4 object-cover rounded" />
                          ))}
                          {product.images.length > 4 && (
                            <div className="w-4 h-4 bg-gray-300 rounded flex items-center justify-center text-xs">+{product.images.length - 4}</div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      {editingProduct === product.id ? (
                        <div className="w-full max-w-4xl bg-white p-6 rounded-lg border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Product Name */}
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-1">Product Name *</label>
                              <input
                                type="text"
                                value={editForm.name || ''}
                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="Enter product name"
                              />
                            </div>
                            
                            {/* Category & Subcategory */}
                            <div>
                              <label className="block text-sm font-medium mb-1">Category *</label>
                              <select
                                value={editForm.category || ''}
                                onChange={(e) => {
                                  const selectedCategory = availableCategories.find(cat => cat.name === e.target.value)
                                  setEditForm({...editForm, category: e.target.value, subcategory: ''})
                                  setAvailableSubcategories(selectedCategory?.subcategories || [])
                                }}
                                className="w-full px-3 py-2 border rounded-lg"
                              >
                                <option value="">Select Category</option>
                                {availableCategories.map(cat => (
                                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Subcategory *</label>
                              <select
                                value={editForm.subcategory || ''}
                                onChange={(e) => setEditForm({...editForm, subcategory: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg"
                                disabled={!editForm.category}
                              >
                                <option value="">Select Subcategory</option>
                                {availableSubcategories.filter(sub => !sub.startsWith('---')).map(sub => (
                                  <option key={sub} value={sub}>{sub}</option>
                                ))}
                              </select>
                            </div>
                            
                            {/* Pricing */}
                            <div>
                              <label className="block text-sm font-medium mb-1">Original Price *</label>
                              <input
                                type="number"
                                value={editForm.originalPrice || ''}
                                onChange={(e) => setEditForm({...editForm, originalPrice: parseFloat(e.target.value) || 0})}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="₹ 0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Discount Price *</label>
                              <input
                                type="number"
                                value={editForm.price || ''}
                                onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value) || 0})}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="₹ 0"
                              />
                            </div>
                            
                            {/* Stock & Weight */}
                            <div>
                              <label className="block text-sm font-medium mb-1">Stock *</label>
                              <input
                                type="number"
                                value={editForm.stock || ''}
                                onChange={(e) => setEditForm({...editForm, stock: parseInt(e.target.value) || 0})}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Weight (grams) *</label>
                              <input
                                type="number"
                                value={editForm.weight || ''}
                                onChange={(e) => setEditForm({...editForm, weight: parseFloat(e.target.value) || 0})}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="0"
                              />
                            </div>
                            
                            {/* Dimensions */}
                            <div>
                              <label className="block text-sm font-medium mb-1">Length (cm) *</label>
                              <input
                                type="number"
                                value={editForm.length || ''}
                                onChange={(e) => setEditForm({...editForm, length: parseFloat(e.target.value) || 0})}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Width (cm) *</label>
                              <input
                                type="number"
                                value={editForm.width || ''}
                                onChange={(e) => setEditForm({...editForm, width: parseFloat(e.target.value) || 0})}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Height (cm) *</label>
                              <input
                                type="number"
                                value={editForm.height || ''}
                                onChange={(e) => setEditForm({...editForm, height: parseFloat(e.target.value) || 0})}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Brand</label>
                              <input
                                type="text"
                                value={editForm.brand || ''}
                                onChange={(e) => setEditForm({...editForm, brand: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="Brand name"
                              />
                            </div>
                            
                            {/* Description */}
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-1">Description *</label>
                              <textarea
                                value={editForm.description || ''}
                                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="Product description"
                                rows={4}
                              />
                            </div>
                            
                            {/* Product Images */}
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-1">Product Images *</label>
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                {/* Current Images */}
                                {editForm.images && editForm.images.length > 0 && (
                                  <div className="grid grid-cols-4 gap-2 mb-4">
                                    {editForm.images.map((img, idx) => (
                                      <div key={idx} className="relative">
                                        <img src={img} alt={`Product ${idx + 1}`} className="w-full h-20 object-cover rounded" />
                                        <button
                                          onClick={() => removeImage(idx)}
                                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                                        >×</button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Add New Image */}
                                <div className="flex gap-2">
                                  <input
                                    type="url"
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    className="flex-1 px-3 py-2 border rounded-lg"
                                    placeholder="Enter image URL"
                                  />
                                  <button
                                    onClick={addImage}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                  >
                                    Add Image
                                  </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">JPG/PNG, up to 5MB each. {editForm.images?.length || 0}/10 files</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{product.name}</h3>
                            {product.isVendorProduct && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                Vendor Product
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600">
                            {product.category ?? 'Uncategorized'}
                            {product.subcategory && ` > ${product.subcategory}`}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-green-600 font-medium">
                              {formatCurrency(product.price)}
                            </p>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <p className="text-gray-500 line-through text-sm">
                                {formatCurrency(product.originalPrice)}
                              </p>
                            )}
                          </div>
                          {product.weight && (
                            <p className="text-xs text-gray-500">Weight: {product.weight}g</p>
                          )}
                          {product.brand && <p className="text-sm text-gray-500">{product.brand}</p>}
                          {product.vendorId && (
                            <p className="text-xs text-gray-400">Vendor ID: {product.vendorId}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        product.stock > 10 ? 'text-green-600' : 'text-orange-600'
                      }`}
                    >
                      Stock: {product.stock}
                    </p>

                    {product.isVendorProduct && (
                      <div className="mt-2 mb-2">
                        <select
                          value={product.status ?? 'pending'}
                          onChange={(event) =>
                            updateProductStatus(product.id, event.target.value, true)
                          }
                          className={`px-2 py-1 rounded text-xs border ${
                            product.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : product.status === 'blocked'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          <option value="pending">pending</option>
                          <option value="active">approved</option>
                          <option value="blocked">blocked</option>
                        </select>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4 justify-end">
                      {editingProduct === product.id ? (
                        <>
                          <button
                            onClick={() => saveEdit(product)}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(product)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id, product.isVendorProduct)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              {(() => {
                const filteredProducts = selectedCategory === 'All' 
                  ? products 
                  : products.filter(p => p.category === selectedCategory)
                const totalFiltered = filteredProducts.length
                const startIndex = ((currentPage - 1) * productsPerPage) + 1
                const endIndex = Math.min(currentPage * productsPerPage, totalFiltered)
                
                return (
                  <p className="text-sm text-gray-600">
                    Showing {startIndex} to {endIndex} of {totalFiltered} products
                    {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                  </p>
                )
              })()}
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >Previous</button>
                <span className="px-3 py-1 bg-blue-100 rounded">{currentPage}</span>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage * productsPerPage >= (selectedCategory === 'All' ? products.length : products.filter(p => p.category === selectedCategory).length)}
                  className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >Next</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function normalizeProduct(product: RawProduct, isVendorProduct: boolean): AdminProduct {
  const id = String(
    product._id ||
    product.id ||
    crypto.randomUUID()
  )

  const images = Array.isArray(product.images) ? product.images : []
  const imageUrl = images[0] ?? product.image ?? '/images/placeholder.jpg'

  const price = resolvePrice(product.price)
  const stock = resolveStock(product.stock, product.quantity)

  return {
    id,
    name: product.name ?? 'Untitled product',
    category: product.category ?? product.mainCategory,
    subcategory: (product as any).subcategory,
    imageUrl,
    images: images.length > 0 ? images : [imageUrl],
    price,
    originalPrice: (product as any).original_price || (product as any).originalPrice,
    brand: product.brand,
    vendorId: product.vendorId,
    stock,
    weight: (product as any).weight,
    length: (product as any).length,
    width: (product as any).width,
    height: (product as any).height,
    description: (product as any).description,
    status: product.status,
    isVendorProduct
  }
}

function resolvePrice(value: unknown): number {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'object' && value !== null) {
    const priceObject = value as { discounted?: number; original?: number }
    if (typeof priceObject.discounted === 'number') {
      return priceObject.discounted
    }
    if (typeof priceObject.original === 'number') {
      return priceObject.original
    }
  }

  return 0
}

function resolveStock(stock?: number, quantity?: number): number {
  if (typeof stock === 'number') {
    return stock
  }
  if (typeof quantity === 'number') {
    return quantity
  }
  return 0
}

function formatCurrency(value: number) {
  return `INR ${value.toLocaleString()}`
}
