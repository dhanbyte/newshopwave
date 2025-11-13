'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import { Package, Save, Upload, Info } from 'lucide-react'

interface ProductFormState {
  name: string
  category: string
  subcategory: string
  originalPrice: string
  discountPrice: string
  description: string
  stock: string
  length: string
  width: string
  height: string
  weight: string
  brand: string
  images: string[]
  newImageUrl: string
}

interface Category {
  _id: string
  name: string
  subcategories: string[]
}

const initialState: ProductFormState = {
  name: '',
  category: '',
  subcategory: '',
  originalPrice: '',
  discountPrice: '',
  description: '',
  stock: '',
  length: '',
  width: '',
  height: '',
  weight: '',
  brand: '',
  images: [],
  newImageUrl: ''
}

export default function AddProductPage() {
  const [formData, setFormData] = useState<ProductFormState>({ ...initialState })
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleCategoryChange = (categoryName: string) => {
    const selectedCategory = categories.find(cat => cat.name === categoryName)
    setFormData(prev => ({ ...prev, category: categoryName, subcategory: '' }))
    setAvailableSubcategories(selectedCategory?.subcategories || [])
  }

  const addImage = () => {
    if (formData.newImageUrl.trim() && formData.images.length < 10) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, prev.newImageUrl.trim()],
        newImageUrl: ''
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          subcategory: formData.subcategory,
          price: parseFloat(formData.discountPrice),
          original_price: parseFloat(formData.originalPrice),
          description: formData.description,
          image: formData.images[0] || '',
          extra_images: formData.images,
          quantity: parseInt(formData.stock),
          brand: formData.brand,
          length: parseFloat(formData.length) || 0,
          width: parseFloat(formData.width) || 0,
          height: parseFloat(formData.height) || 0,
          weight: parseFloat(formData.weight) || 0
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('Product added successfully!')
        setFormData({ ...initialState })
      } else {
        alert('Error: ' + (data.error || 'Unknown error occurred'))
      }
    } catch (error) {
      alert('Network error: ' + (error instanceof Error ? error.message : 'unknown'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex items-center gap-3">
          <Link href="/admin/products">
            <button className="text-gray-600 hover:text-gray-800">← Back</button>
          </Link>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <Package className="h-8 w-8" />
            Add New Product
          </h1>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <section className="rounded-lg bg-white p-6 shadow">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium">
                  Product Name *
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="rounded-lg border px-3 py-2"
                    placeholder="Enter product name"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium">
                  Category *
                  <select
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="rounded-lg border px-3 py-2"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium">
                  Subcategory *
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                    className="rounded-lg border px-3 py-2"
                    disabled={!formData.category}
                    required
                  >
                    <option value="">Select Subcategory</option>
                    {availableSubcategories.filter(sub => !sub.startsWith('---')).map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium">
                  Original Price *
                  <input
                    type="number"
                    min="0"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    className="rounded-lg border px-3 py-2"
                    placeholder="₹ 0"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium">
                  Discount Price *
                  <input
                    type="number"
                    min="0"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountPrice: e.target.value }))}
                    className="rounded-lg border px-3 py-2"
                    placeholder="₹ 0"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium">
                  Stock *
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    className="rounded-lg border px-3 py-2"
                    placeholder="0"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium">
                  Weight (grams) *
                  <input
                    type="number"
                    min="0"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    className="rounded-lg border px-3 py-2"
                    placeholder="0"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium">
                  Length (cm) *
                  <input
                    type="number"
                    min="0"
                    value={formData.length}
                    onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
                    className="rounded-lg border px-3 py-2"
                    placeholder="0"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium">
                  Width (cm) *
                  <input
                    type="number"
                    min="0"
                    value={formData.width}
                    onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
                    className="rounded-lg border px-3 py-2"
                    placeholder="0"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium">
                  Height (cm) *
                  <input
                    type="number"
                    min="0"
                    value={formData.height}
                    onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                    className="rounded-lg border px-3 py-2"
                    placeholder="0"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium">
                  Brand
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    className="rounded-lg border px-3 py-2"
                    placeholder="Brand name"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-sm font-medium">
                Description *
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[120px] rounded-lg border px-3 py-2"
                  placeholder="Product description"
                  required
                />
              </label>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-3">
                  Product Images *
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    {formData.images.length}/10 files
                  </span>
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img src={img} alt={`Product ${idx + 1}`} className="w-full h-20 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                          >×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.newImageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, newImageUrl: e.target.value }))}
                      className="flex-1 px-3 py-2 border rounded-lg"
                      placeholder="Enter image URL"
                    />
                    <button
                      type="button"
                      onClick={addImage}
                      disabled={formData.images.length >= 10}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      Add Image
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">JPG/PNG, up to 5MB each</p>
                </div>
                
                {formData.images.length === 0 && (
                  <p className="mt-2 text-xs text-red-500">⚠️ At least one image is required</p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading || formData.images.length === 0}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {loading ? 'Adding...' : 'Add Product'}
                </button>
                <Link href="/admin/products">
                  <button
                    type="button"
                    className="rounded-lg bg-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </Link>
              </div>
            </form>
          </section>

          <aside className="space-y-4">
            <div className="rounded-lg bg-white p-5 shadow">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <Info className="h-5 w-5 text-blue-500" />
                Product Guidelines
              </h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Use high-quality product images (minimum 800×800)</li>
                <li>• Provide accurate dimensions, weight, and descriptions</li>
                <li>• Set competitive pricing with proper discounts</li>
                <li>• Choose appropriate category and subcategory</li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-5 shadow">
              <h2 className="mb-3 text-lg font-semibold">Current Product Summary</h2>
              <dl className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <dt>Name</dt>
                  <dd className="font-medium">{formData.name || 'Not set'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Category</dt>
                  <dd className="font-medium">{formData.category || 'Not set'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Price</dt>
                  <dd className="font-medium">
                    {formData.discountPrice ? `₹${formData.discountPrice}` : 'Not set'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Stock</dt>
                  <dd className="font-medium">{formData.stock || 'Not set'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Images</dt>
                  <dd className="font-medium">{formData.images.length}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}