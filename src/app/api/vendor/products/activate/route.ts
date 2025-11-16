import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Update all vendor products to active status
    const { data, error } = await supabase
      .from('vendor_products')
      .update({ status: 'active' })
      .neq('status', 'active')
      .select()

    if (error) {
      throw error
    }

    return NextResponse.json({ 
      success: true, 
      message: `Updated ${data?.length || 0} products to active status`
    })

  } catch (error) {
    console.error('Error activating products:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to activate products' 
    })
  }
}