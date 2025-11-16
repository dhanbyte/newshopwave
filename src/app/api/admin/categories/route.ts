import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .order('order', { ascending: true })
      .order('name', { ascending: true })
    
    return NextResponse.json({ success: true, categories: categories || [] })
  } catch (error) {
    console.error('Admin categories API error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, image, subcategories, isActive, order } = await request.json()
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    
    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        name,
        slug,
        image,
        subcategories: subcategories || [],
        is_active: isActive !== false,
        order: order || 0
      })
      .select()
      .single()
    
    if (error) throw error
    return NextResponse.json({ success: true, category })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, image, subcategories, isActive, order } = await request.json()
    
    const updateData: any = { updated_at: new Date().toISOString() }
    if (name) {
      updateData.name = name
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }
    if (image) updateData.image = image
    if (subcategories) updateData.subcategories = subcategories
    if (typeof isActive === 'boolean') updateData.is_active = isActive
    if (typeof order === 'number') updateData.order = order
    
    const { data: category, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return NextResponse.json({ success: true, category })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 })
  }
}