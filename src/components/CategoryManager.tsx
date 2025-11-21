'use client'

import { useState, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Edit, Plus, Save, X } from 'lucide-react'

interface Category {
  _id: string
  name: string
  slug: string
  subcategories: string[]
  image: string
  isActive: boolean
  order: number
}

interface SubcategoryInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

function SubcategoryInput({ value, onChange, placeholder }: SubcategoryInputProps) {
  const [inputValue, setInputValue] = useState('')

  const normalizedList = Array.isArray(value) ? value : []

  const addSubcategory = (raw: string) => {
    const normalized = raw.trim()
    if (!normalized) return
    const alreadyExists = normalizedList.some(
      (item) => item.toLowerCase() === normalized.toLowerCase()
    )
    if (alreadyExists) {
      setInputValue('')
      return
    }
    onChange([...normalizedList, normalized])
    setInputValue('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addSubcategory(inputValue)
    }
    if (event.key === 'Backspace' && inputValue === '' && normalizedList.length > 0) {
      onChange(normalizedList.slice(0, -1))
    }
  }

  const handleBlur = () => {
    addSubcategory(inputValue)
  }

  const removeSubcategory = (index: number) => {
    const updated = normalizedList.filter((_, idx) => idx !== index)
    onChange(updated)
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 p-3 focus-within:ring-2 focus-within:ring-blue-500">
        {normalizedList.map((sub, idx) => (
          <span
            key={`${sub}-${idx}`}
            className="group inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
          >
            {sub}
            <button
              type="button"
              onClick={() => removeSubcategory(idx)}
              className="text-blue-500 transition hover:text-blue-800"
              aria-label={`Remove ${sub}`}
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder || 'Add subcategory'}
          className="flex-1 min-w-[200px] border-0 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
        />
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Press Enter or comma to add. Use backspace on empty input to remove the last subcategory.
      </p>
    </div>
  )
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Category>>({})
  const [newCategory, setNewCategory] = useState({ name: '', subcategories: [] as string[], image: '' })
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data.success && data.categories ? data.categories : data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingId(category._id)
    setEditForm({
      name: category.name,
      subcategories: [...(category.subcategories || [])],
      image: category.image,
      isActive: category.isActive
    })
  }

  const handleSave = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      
      if (response.ok) {
        await fetchCategories()
        setEditingId(null)
        setEditForm({})
      }
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`/api/categories/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          await fetchCategories()
        }
      } catch (error) {
        console.error('Failed to delete category:', error)
      }
    }
  }

  const handleAddCategory = async () => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategory.name,
          subcategories: newCategory.subcategories,
          image: newCategory.image
        })
      })
      
      if (response.ok) {
        await fetchCategories()
        setNewCategory({ name: '', subcategories: [], image: '' })
        setShowAddForm(false)
      }
    } catch (error) {
      console.error('Failed to add category:', error)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Category Management</h2>
          <p className="text-gray-600 mt-1">Manage categories and subcategories for your store</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus size={16} />
          Add Category
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white border rounded-xl p-6 mb-8 shadow-sm">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">Add New Category</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <Input
                  placeholder="e.g., Electronics"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={newCategory.image}
                  onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subcategories</label>
              <SubcategoryInput
                value={newCategory.subcategories}
                onChange={(subcategories) => setNewCategory({ ...newCategory, subcategories })}
                placeholder="Type a subcategory and press Enter"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={handleAddCategory} className="bg-blue-600 hover:bg-blue-700">Add Category</Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {categories.map((category) => (
          <div key={category._id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            {editingId === category._id ? (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                    <Input
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Category Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                    <Input
                      value={editForm.image || ''}
                      onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                      placeholder="Image URL"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategories</label>
                  <SubcategoryInput
                    value={editForm.subcategories || []}
                    onChange={(subcategories) => setEditForm({ ...editForm, subcategories })}
                    placeholder="Add or remove subcategories"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={() => handleSave(category._id)} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Save size={16} className="mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setEditingId(null)} size="sm">
                    <X size={16} className="mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    {category.image && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">Order: {category.order}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      category.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(category)} className="hover:bg-blue-50">
                        <Edit size={16} />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(category._id)} className="hover:bg-red-50 text-red-600">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Subcategories ({category.subcategories?.length || 0})</h4>
                  <div className="flex flex-wrap gap-2">
                    {(category.subcategories || []).slice(0, 8).map((sub, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {sub}
                      </span>
                    ))}
                    {(category.subcategories?.length || 0) > 8 && (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                        +{(category.subcategories?.length || 0) - 8} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {categories.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first category</p>
          <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
            Add Your First Category
          </Button>
        </div>
      )}
    </div>
  )
}