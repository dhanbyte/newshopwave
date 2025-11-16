'use client';

import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';

export default function AddProductForm() {
  const { categories, loading, getSubcategories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [brand, setBrand] = useState('');
  const [markupPercentage, setMarkupPercentage] = useState('50');
  const [showToCustomers, setShowToCustomers] = useState(true);
  const [showToDropshippers, setShowToDropshippers] = useState(true);
  const [availableSizes, setAvailableSizes] = useState([]);
  
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42'];
  
  const isFashionCategory = selectedCategory === 'Fashion' || selectedCategory === 'Clothing' || selectedCategory === 'Apparel';

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(''); // Reset subcategory when category changes
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !selectedCategory || !selectedSubcategory || !originalPrice) {
      alert('कृपया सभी fields भरें');
      return;
    }

    const newProduct = {
      name: productName,
      category: selectedCategory,
      subcategory: selectedSubcategory,
      originalPrice: parseFloat(originalPrice),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      markupPercentage: parseFloat(markupPercentage),
      customerPrice: Math.round(parseFloat(originalPrice) * (1 + parseFloat(markupPercentage) / 100)),
      showToCustomers,
      showToDropshippers,
      stock: parseInt(stock),
      weight: weight ? parseFloat(weight) : null,
      brand: brand || null,
      description: description || null,
      availableSizes: isFashionCategory ? availableSizes : []
    };

    console.log('New Product:', newProduct);
    alert('Product successfully added!');
    
    // Reset form
    setProductName('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setOriginalPrice('');
    setDiscountPrice('');
    setMarkupPercentage('50');
    setShowToCustomers(true);
    setShowToDropshippers(true);
    setStock('');
    setWeight('');
    setBrand('');
    setDescription('');
    setAvailableSizes([]);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Product Name *
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Category *
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value as CategoryType | '')}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory - Only show when category is selected */}
        {selectedCategory && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Subcategory *
            </label>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Subcategory</option>
              {getSubcategories(selectedCategory).map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter product description"
            rows={3}
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Brand
          </label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter brand name"
          />
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Original Price *
            </label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="₹0"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Discount Price
            </label>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="₹0"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Stock Quantity *
          </label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter stock quantity"
            min="0"
            required
          />
        </div>

        {/* Dimensions */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Dimensions (cm)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Length"
              min="0"
              step="0.1"
            />
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Width"
              min="0"
              step="0.1"
            />
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Height"
              min="0"
              step="0.1"
            />
          </div>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Weight (grams)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter weight in grams"
            min="0"
            step="0.1"
          />
        </div>

        {/* Markup Percentage */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Customer Markup % *
          </label>
          <input
            type="number"
            value={markupPercentage}
            onChange={(e) => setMarkupPercentage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="50"
            min="0"
            max="200"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Customer will see: ₹{originalPrice ? Math.round(parseFloat(originalPrice) * (1 + parseFloat(markupPercentage) / 100)) : 0}
          </p>
        </div>

        {/* Visibility Controls */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Product Visibility</h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showToCustomers"
              checked={showToCustomers}
              onChange={(e) => setShowToCustomers(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="showToCustomers" className="text-sm">
              Show to Regular Customers
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showToDropshippers"
              checked={showToDropshippers}
              onChange={(e) => setShowToDropshippers(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="showToDropshippers" className="text-sm">
              Show to Dropshippers
            </label>
          </div>
        </div>

        {/* Size Options for Fashion */}
        {isFashionCategory && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Available Sizes
            </label>
            <div className="grid grid-cols-4 gap-2">
              {sizeOptions.map((size) => (
                <label key={size} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={availableSizes.includes(size)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAvailableSizes([...availableSizes, size])
                      } else {
                        setAvailableSizes(availableSizes.filter(s => s !== size))
                      }
                    }}
                    className="mr-1"
                  />
                  <span className="text-sm">{size}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Select available sizes for this fashion item
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Add Product
        </button>
      </form>

      {/* Selected Values Display */}
      {selectedCategory && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium mb-2">Selected:</h3>
          <p><strong>Category:</strong> {selectedCategory}</p>
          {selectedSubcategory && (
            <p><strong>Subcategory:</strong> {selectedSubcategory}</p>
          )}
        </div>
      )}
    </div>
  );
}