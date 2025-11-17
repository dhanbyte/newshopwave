import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

const supabase = getDatabase

// Default price if not in database
const DEFAULT_PRICE = 113

export async function GET() {
  try {
    // Try to get price from database
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'dropshipper_price')
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching price from DB:', error)
    }
    
    const price = data?.value ? parseInt(data.value) : DEFAULT_PRICE
    console.log('API: Getting dropshipper price:', price)
    
    return NextResponse.json({ 
      success: true, 
      price: price 
    })
  } catch (error) {
    console.error('Error in GET:', error)
    // Return default price on error
    return NextResponse.json({ 
      success: true, 
      price: DEFAULT_PRICE 
    })
  }
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
    
    const newPrice = parseInt(price)
    
    // Update or insert price in database
    const { error } = await supabase
      .from('settings')
      .upsert({ 
        key: 'dropshipper_price', 
        value: newPrice.toString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      })
    
    if (error) {
      console.error('Error updating price in DB:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update price in database' 
      }, { status: 500 })
    }
    
    console.log('API: Updated dropshipper price to:', newPrice)
    
    return NextResponse.json({ 
      success: true, 
      price: newPrice,
      message: 'Price updated successfully'
    })
  } catch (error) {
    console.error('Error in POST:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update price' 
    }, { status: 500 })
  }
}