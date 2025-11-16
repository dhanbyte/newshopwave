import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables not configured')
}

const supabase = supabaseUrl && supabaseKey ? createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
) : null

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase not configured' 
      }, { status: 500 })
    }
    
    console.log('Bulk approving all pending products...')

    // Update all pending products to active status
    const { data, error } = await supabase
      .from('vendor_products')
      .update({ 
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('status', 'pending')
      .select()

    if (error) {
      console.error('Error bulk approving products:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    const count = data?.length || 0
    console.log(`Bulk approved ${count} products successfully`)
    
    return NextResponse.json({ 
      success: true, 
      count,
      message: `${count} products approved successfully`
    })
  } catch (error) {
    console.error('Error in bulk approve:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to approve products' 
    }, { status: 500 })
  }
}