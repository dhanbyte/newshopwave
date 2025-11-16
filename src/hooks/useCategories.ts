'use client'

import { useState, useEffect } from 'react'

interface Category {
  _id: string
  name: string
  slug: string
  subcategories: string[]
  image: string
  isActive: boolean
  order: number
}

// Global cache
let categoriesCache: Category[] | null = null
let fetchPromise: Promise<Category[]> | null = null

const fetchCategoriesOnce = async (): Promise<Category[]> => {
  if (categoriesCache) return categoriesCache
  if (fetchPromise) return fetchPromise
  
  fetchPromise = (async () => {
    try {
      console.log('Fetching categories once...')
      let response = await fetch('/api/admin/categories')
      let data = await response.json()
      
      if (data.success && data.categories) {
        categoriesCache = data.categories
        return data.categories
      } else {
        response = await fetch('/api/categories')
        data = await response.json()
        categoriesCache = Array.isArray(data) ? data : []
        return categoriesCache
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      categoriesCache = []
      return []
    } finally {
      fetchPromise = null
    }
  })()
  
  return fetchPromise
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(categoriesCache || [])
  const [loading, setLoading] = useState(!categoriesCache)

  useEffect(() => {
    if (!categoriesCache) {
      fetchCategoriesOnce().then(data => {
        setCategories(data)
        setLoading(false)
      })
    }
  }, [])

  const fetchCategories = async () => {
    const data = await fetchCategoriesOnce()
    setCategories(data)
    setLoading(false)
  }

  const getCategoryByName = (name: string) => {
    return categories.find(cat => cat.name === name)
  }

  const getSubcategories = (categoryName: string) => {
    const category = getCategoryByName(categoryName)
    console.log(`Getting subcategories for ${categoryName}:`, category?.subcategories)
    return category?.subcategories || []
  }

  return {
    categories,
    loading,
    getCategoryByName,
    getSubcategories,
    refetch: fetchCategories
  }
}