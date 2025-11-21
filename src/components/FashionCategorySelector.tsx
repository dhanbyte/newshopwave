'use client'

import { useState } from 'react'

interface FashionCategorySelectorProps {
  onSelect: (category: string, subcategory: string) => void
  selectedCategory?: string
  selectedSubcategory?: string
}

const fashionCategories = {
  "Men": [
    "Men's T-Shirts", "Men's Shirts", "Men's Jeans", "Men's Trousers", "Men's Shorts",
    "Men's Jackets", "Men's Hoodies", "Men's Ethnic Wear", "Men's Innerwear", "Men's Sleepwear", "Men's Shoes"
  ],
  "Women": [
    "Women's Tops", "Women's Dresses", "Women's Jeans", "Women's Trousers", "Women's Skirts",
    "Women's Jackets", "Women's Ethnic Wear", "Women's Innerwear", "Women's Sleepwear", "Women's Sarees",
    "Women's Kurtis", "Women's Leggings", "Women's Palazzo", "Women's Blouses", "Women's Shoes"
  ],
  "Kids": [
    "Kids Boys Clothing", "Kids Girls Clothing", "Baby Clothing", "Kids Footwear", "Kids Accessories"
  ],
  "Accessories": [
    "Bags", "Wallets", "Belts", "Watches", "Sunglasses", "Jewelry", "Hair Accessories",
    "Caps & Hats", "Scarves", "Gloves", "Ties", "Socks", "Sports Shoes", "Casual Shoes", "Formal Shoes", "Sandals", "Slippers"
  ]
}

export default function FashionCategorySelector({ onSelect, selectedCategory, selectedSubcategory }: FashionCategorySelectorProps) {
  const [mainCategory, setMainCategory] = useState(selectedCategory || '')
  const [subCategory, setSubCategory] = useState(selectedSubcategory || '')

  const handleMainCategoryChange = (category: string) => {
    setMainCategory(category)
    setSubCategory('')
    onSelect('Fashion', category)
  }

  const handleSubCategoryChange = (subcategory: string) => {
    setSubCategory(subcategory)
    onSelect('Fashion', subcategory)
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="fashion-main-category" className="block text-sm font-medium mb-2">Fashion Category</label>
        <select 
          id="fashion-main-category"
          value={mainCategory}
          onChange={(e) => handleMainCategoryChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          aria-label="Select fashion category"
        >
          <option value="">Select Category</option>
          {Object.keys(fashionCategories).map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {mainCategory && (
        <div>
          <label htmlFor="fashion-subcategory" className="block text-sm font-medium mb-2">Subcategory</label>
          <select 
            id="fashion-subcategory"
            value={subCategory}
            onChange={(e) => handleSubCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            aria-label="Select fashion subcategory"
          >
            <option value="">Select Subcategory</option>
            {fashionCategories[mainCategory as keyof typeof fashionCategories]?.map(subcategory => (
              <option key={subcategory} value={subcategory}>{subcategory}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}