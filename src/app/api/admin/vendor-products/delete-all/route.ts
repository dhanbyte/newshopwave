import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function DELETE() {
  try {
    const { count } = await supabase
      .from('vendor_products')
      .select('*', { count: 'exact', head: true })

    const { error } = await supabase
      .from('vendor_products')
      .delete()
      .neq('id', 0)

    if (error) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to delete vendor products' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      deleted: count || 0
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete all vendor products' 
    }, { status: 500 })
  }
}