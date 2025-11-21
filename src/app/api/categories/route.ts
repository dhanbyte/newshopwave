import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

export async function GET() {
  try {
    const db = getDatabase
    const { data, error } = await db
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('order', { ascending: true })
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }
    
    // Transform database format to match frontend expectations
    const categories = (data || []).map(cat => ({
      _id: cat.id,
      name: cat.name,
      slug: cat.slug,
      subcategories: cat.subcategories || [],
      image: cat.image || '',
      isActive: cat.is_active,
      order: cat.order
    }))
    
    return NextResponse.json({ success: true, categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const db = getDatabase
    
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    const { data: newCategory, error } = await db
      .from('categories')
      .insert({
        name: data.name,
        slug: slug,
        subcategories: data.subcategories || [],
        image: data.image || '',
        is_active: data.isActive ?? true,
        order: data.order || 999
      })
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create category: ' + error.message }, { status: 500 })
    }
    
    // Transform to match frontend format
    const response = {
      _id: newCategory.id,
      name: newCategory.name,
      slug: newCategory.slug,
      subcategories: newCategory.subcategories || [],
      image: newCategory.image || '',
      isActive: newCategory.is_active,
      order: newCategory.order
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}