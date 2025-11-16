'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import SimpleImageUpload from '@/components/SimpleImageUpload'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Tech',
    subcategory: '',
    description: '',
    originalPrice: '',
    discountedPrice: '',
    quantity: '',
    image: '',
    extraImages: [] as string[],
    features: '',
    sku: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  const categories = {
    'Tech': ['Mobile Accessories', 'Audio & Headphones', 'Lighting & LED', 'Computer Accessories', 'Power & Cables', 'Fans & Cooling'],
    'Home': ['Kitchenware', 'Puja-Essentials', 'Bathroom-Accessories'],
    'New Arrivals': ['Best Selling', 'Diwali Special', 'Gifts', 'Navratri', 'Pooja Essentials', 'Fragrance']
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`)
      if (response.ok) {
        const result = await response.json()
        const product = result.data || result
        
        // Handle different image formats
        let images: string[] = []
        if (product.images && Array.isArray(product.images)) {
          images = product.images
        } else if (product.extra_images && Array.isArray(product.extra_images)) {
          images = [product.image, ...product.extra_images].filter(Boolean)
        } else if (product.image) {
          images = [product.image]
        }
        
        setFormData({
          name: product.name || '',
          brand: product.brand || '',
          category: product.category || 'Tech',
          subcategory: product.subcategory || '',
          description: product.description || '',
          originalPrice: (product.original_price || product.price?.original || product.price || '').toString(),
          discountedPrice: (product.price?.discounted || product.price || '').toString(),
          quantity: (product.stock || product.quantity || '').toString(),
          image: product.image || '',
          extraImages: images,
          features: product.features?.join(', ') || '',
          sku: product.sku || ''
        })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load product" })
    } finally {
      setIsLoadingProduct(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const productData = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        subcategory: formData.subcategory,
        description: formData.description,
        price: parseInt(formData.discountedPrice) || parseInt(formData.originalPrice),
        original_price: parseInt(formData.originalPrice),
        stock: parseInt(formData.quantity),
        image: formData.extraImages[0] || formData.image,
        images: formData.extraImages,
        extra_images: formData.extraImages.slice(1),
        features: formData.features ? formData.features.split(',').map(f => f.trim()) : [],
        sku: formData.sku
      }

      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (response.ok) {
        toast({ title: "Success", description: "Product updated successfully!" })
        router.push('/admin/products')
      } else {
        toast({ title: "Error", description: 'Failed to update product' })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update product" })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingProduct) {
    return <div className="p-6">Loading product...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <Input
              value={formData.brand}
              onChange={(e) => setFormData({...formData, brand: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              {Object.keys(categories).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subcategory</label>
            <select
              value={formData.subcategory}
              onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select Subcategory</option>
              {categories[formData.category as keyof typeof categories]?.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <SimpleImageUpload
            images={formData.extraImages}
            onImagesChange={(images) => setFormData({...formData, extraImages: images})}
            maxImages={10}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description *</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Original Price *</label>
            <Input
              type="number"
              value={formData.originalPrice}
              onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Discounted Price</label>
            <Input
              type="number"
              value={formData.discountedPrice}
              onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Quantity *</label>
            <Input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              required
            />
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-gray-50 p-4 rounded text-xs">
          <p><strong>Images:</strong> {formData.extraImages.length} files</p>
          <p><strong>First Image:</strong> {formData.extraImages[0]?.substring(0, 50)}...</p>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? 'Updating...' : 'Update Product'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}