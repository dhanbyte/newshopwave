import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Return empty array since MongoDB is not configured
    const topProducts: any[] = []

    return NextResponse.json({
      success: true,
      topProducts
    })
    
  } catch (error) {
    console.error('Error fetching top products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch top products' },
      { status: 500 }
    )
  }
}