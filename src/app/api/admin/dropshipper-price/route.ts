import { NextRequest, NextResponse } from 'next/server'

let dropshipperPrice = 113

export async function GET() {
  console.log('API: Getting dropshipper price:', dropshipperPrice)
  return NextResponse.json({ 
    success: true, 
    price: dropshipperPrice 
  })
}

export async function POST(request: NextRequest) {
  try {
    const { price } = await request.json()
    
    if (!price || price < 1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Valid price required' 
      }, { status: 400 })
    }
    
    dropshipperPrice = parseInt(price)
    console.log('API: Updated dropshipper price to:', dropshipperPrice)
    
    return NextResponse.json({ 
      success: true, 
      price: dropshipperPrice,
      message: 'Price updated successfully'
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update price' 
    }, { status: 500 })
  }
}