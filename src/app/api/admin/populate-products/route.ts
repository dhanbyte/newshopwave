import { NextResponse } from 'next/server'

export async function POST() {
  try {
    return NextResponse.json({ 
      success: false, 
      error: 'MongoDB not configured - using Supabase instead' 
    }, { status: 500 })


  } catch (error) {
    console.error('Error populating products:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to populate products' 
    }, { status: 500 })
  }
}