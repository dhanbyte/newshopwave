import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const data = await request.json()
    
    // Update category in database
    // This is a mock - replace with actual database update
    
    return NextResponse.json({ 
      _id: id,
      ...data,
      slug: data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    // Delete category from database
    // This is a mock - replace with actual database delete
    
    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}