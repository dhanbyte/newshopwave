'use client'

import { useState } from 'react'
import { useCategories } from '@/hooks/useCategories'

interface DynamicCategorySelectorProps {
  selectedCategory: string
  selectedSubcategory: string
  onCategoryChange: (category: string) => void
  onSubcategoryChange: (subcategory: string) => void
  required?: boolean
}

export default function DynamicCategorySelector({
  selectedCategory,
  selectedSubcategory,
  onCategoryChange,
  onSubcategoryChange,
  required = false
}: DynamicCategorySelectorProps) {
  const { categories, loading, getSubcategories } = useCategories()

  const handleCategoryChange = (category: string) => {
    onCategoryChange(category)
    onSubcategoryChange('') // Reset subcategory when category changes
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Category {required && '*'}
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required={required}
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
            Subcategory {required && '*'}
          </label>
          <select
            value={selectedSubcategory}
            onChange={(e) => onSubcategoryChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={required}
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

      {/* Selected Values Display */}
      {selectedCategory && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <h4 className="font-medium mb-2 text-sm">Selected:</h4>
          <p className="text-sm"><strong>Category:</strong> {selectedCategory}</p>
          {selectedSubcategory && (
            <p className="text-sm"><strong>Subcategory:</strong> {selectedSubcategory}</p>
          )}
        </div>
      )}
    </div>
  )
}