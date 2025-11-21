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
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [categories, setCategories] = useState<string[]>(['All'])
  const [availableCategories, setAvailableCategories] = useState<any[]>([])
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<AdminProduct[]>([])
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    void fetchProducts()
    void fetchCategories()
  }, [])

  // Filter products based on search term and category
  useEffect(() => {
    let filtered = products
    
    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.subcategory?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }
    
    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setAvailableCategories(data.success && data.categories ? data.categories : (Array.isArray(data) ? data : []))
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
        // Update local state instead of full refresh
        setProducts(prev => prev.map(p => 
          p.id === productId ? { ...p, status } : p
        ))
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
    
    setShowEditModal(true)
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length > 0) {
      await uploadImages(imageFiles)
    }
  }

  const uploadImages = async (files: File[]) => {
    setUploading(true)
    const uploadedUrls: string[] = []
    
    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData
        })
        
        const result = await response.json()
        
        if (result.success) {
          uploadedUrls.push(result.url)
        } else {
          console.error('Upload failed:', result.error)
        }
      }
      
      if (uploadedUrls.length > 0) {
        setEditForm({
          ...editForm,
          images: [...(editForm.images || []), ...uploadedUrls]
        })
        alert(`${uploadedUrls.length} image(s) uploaded successfully!`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length > 0) {
      await uploadImages(imageFiles)
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = editForm.images?.filter((_, i) => i !== index) || []
    setEditForm({ ...editForm, images: updatedImages })
  }

  const cancelEdit = () => {
    setEditingProduct(null)
    setEditForm({})
    setShowEditModal(false)
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
        setShowEditModal(false)
        // Update local state
        setProducts(prev => prev.map(p => 
          p.id === product.id ? { ...p, ...editForm } : p
        ))
      } else {
        alert('Failed to update product')
      }
    } catch (error) {
      alert('Failed to update product')
    }
  }

  const deleteProduct = async (productId: string, isVendorProduct: boolean) => {
    // First confirmation
    if (!confirm('⚠️ Are you sure you want to delete this product?')) {
      return
    }
    
    // Second confirmation
    if (!confirm('🗑️ This action cannot be undone. Are you absolutely sure?')) {
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
        // Remove from local state
        setProducts(prev => prev.filter(p => p.id !== productId))
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

  const approveAllProducts = async () => {
    if (!confirm('This will approve ALL pending vendor products. Continue?')) {
      return
    }

    try {
      const response = await fetch('/api/admin/approve-all-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()
      
      if (data.success) {
        alert(`${data.count} products approved successfully!`)
        await fetchProducts()
      } else {
        alert(`Failed to approve products: ${data.error}`)
      }
    } catch (error) {
      alert('Failed to approve products')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => window.location.reload()}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            🔄 Refresh
          </button>
          <button 
            onClick={populateProducts}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Populate Products
          </button>
          <button 
            onClick={approveAllProducts}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Approve All
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
            <p className="mt-2 text-gray-600">Page is manually refreshed</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No products found</p>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Search Products</h3>
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by name, brand, category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const categoryCount = category === 'All' 
                    ? filteredProducts.length 
                    : filteredProducts.filter(p => p.category === category).length
                  
                  return (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category)
                        setCurrentPage(1)
                      }}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {category} ({categoryCount})
                    </button>
                  )
                })}
              </div>
            </div>
            
            <div className="grid gap-4">
              {filteredProducts
                .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
                .map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-2">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-32 h-32 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => window.open(product.imageUrl, '_blank')}
                      />
                      {product.images && product.images.length > 1 && (
                        <div className="flex gap-1 flex-wrap">
                          {product.images.slice(1, 6).map((img, idx) => (
                            <img 
                              key={idx} 
                              src={img} 
                              alt={`${product.name} ${idx + 2}`} 
                              className="w-8 h-8 object-cover rounded cursor-pointer hover:scale-110 transition-transform" 
                              onClick={() => window.open(img, '_blank')}
                            />
                          ))}
                          {product.images.length > 6 && (
                            <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center text-xs font-medium">+{product.images.length - 6}</div>
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
                            
                            {/* Stock & Brand */}
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
                              <div 
                                className={`border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
                                  dragOver ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-400'
                                } hover:border-blue-400 hover:bg-gray-50`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                              >
                                {/* Drag & Drop Area */}
                                <div className="text-center py-8 mb-6">
                                  <div className="text-6xl mb-4">📸</div>
                                  <p className="text-xl font-semibold text-gray-700 mb-2">
                                    {uploading ? 'Uploading Images...' : 'Drop Images Here'}
                                  </p>
                                  <p className="text-gray-500">Drag and drop your product images</p>
                                  {uploading && (
                                    <div className="mt-4">
                                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Current Images */}
                                {editForm.images && editForm.images.length > 0 && (
                                  <div className="grid grid-cols-5 gap-3 mb-4">
                                    {editForm.images.map((img, idx) => (
                                      <div key={idx} className="relative group">
                                        <img 
                                          src={img} 
                                          alt={`Product ${idx + 1}`} 
                                          className="w-full h-20 object-cover rounded-lg border shadow-sm" 
                                        />
                                        <button
                                          onClick={() => removeImage(idx)}
                                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >×</button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Upload Options */}
                                <div className="flex justify-center mb-6">
                                  <label className="cursor-pointer bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors text-lg font-medium shadow-lg hover:shadow-xl">
                                    📁 Choose Files
                                    <input
                                      type="file"
                                      multiple
                                      accept="image/*"
                                      onChange={handleFileInput}
                                      className="hidden"
                                      disabled={uploading}
                                    />
                                  </label>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                  📁 JPG/PNG, up to 5MB each • {editForm.images?.length || 0}/10 files • Auto-upload to BunnyCDN
                                </p>
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

                    <div className="mt-2 mb-2">
                      <select
                        value={product.status ?? 'pending'}
                        onChange={(event) =>
                          updateProductStatus(product.id, event.target.value, product.isVendorProduct)
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

                    <div className="flex gap-2 mt-4 justify-end">
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
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                <p>Showing {((currentPage - 1) * productsPerPage) + 1} to {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} products</p>
                {searchTerm && <p className="text-blue-600">Search: "{searchTerm}"</p>}
                {selectedCategory !== 'All' && <p className="text-green-600">Category: {selectedCategory}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >Previous</button>
                <span className="px-3 py-1 bg-blue-100 rounded">{currentPage}</span>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage * productsPerPage >= filteredProducts.length}
                  className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >Next</button>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Edit Product</h2>
                <button
                  onClick={cancelEdit}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {/* Edit Form */}
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
                
                {/* Stock & Brand */}
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
                  <div 
                    className={`border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
                      dragOver ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-400'
                    } hover:border-blue-400 hover:bg-gray-50`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {/* Drag & Drop Area */}
                    <div className="text-center py-8 mb-6">
                      <div className="text-6xl mb-4">📸</div>
                      <p className="text-xl font-semibold text-gray-700 mb-2">
                        {uploading ? 'Uploading Images...' : 'Drop Images Here'}
                      </p>
                      <p className="text-gray-500">Drag and drop your product images</p>
                      {uploading && (
                        <div className="mt-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Current Images */}
                    {editForm.images && editForm.images.length > 0 && (
                      <div className="grid grid-cols-5 gap-3 mb-4">
                        {editForm.images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img 
                              src={img} 
                              alt={`Product ${idx + 1}`} 
                              className="w-full h-20 object-cover rounded-lg border shadow-sm" 
                            />
                            <button
                              onClick={() => removeImage(idx)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >×</button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Upload Options */}
                    <div className="flex justify-center mb-6">
                      <label className="cursor-pointer bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors text-lg font-medium shadow-lg hover:shadow-xl">
                        📁 Choose Files
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileInput}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      📁 JPG/PNG, up to 5MB each • {editForm.images?.length || 0}/10 files • Auto-upload to BunnyCDN
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Modal Actions */}
              <div className="flex gap-4 mt-6 justify-end">
                <button
                  onClick={cancelEdit}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const currentProduct = products.find(p => p.id === editingProduct)
                    if (currentProduct) saveEdit(currentProduct)
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
