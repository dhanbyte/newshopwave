import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const data = await request.json()
    const db = getDatabase
    
    const updateData: any = {}
    
    if (data.name) {
      updateData.name = data.name
      updateData.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }
    if (data.subcategories !== undefined) {
      updateData.subcategories = data.subcategories
    }
    if (data.image !== undefined) {
      updateData.image = data.image
    }
    if (data.isActive !== undefined) {
      updateData.is_active = data.isActive
    }
    if (data.order !== undefined) {
      updateData.order = data.order
    }
    
    const { data: updatedCategory, error } = await db
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to update category: ' + error.message }, { status: 500 })
    }
    
    // Transform to match frontend format
    const response = {
      _id: updatedCategory.id,
      name: updatedCategory.name,
      slug: updatedCategory.slug,
      subcategories: updatedCategory.subcategories || [],
      image: updatedCategory.image || '',
      isActive: updatedCategory.is_active,
      order: updatedCategory.order
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const db = getDatabase
    
    const { error } = await db
      .from('categories')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to delete category: ' + error.message }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}