import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE() {
  try {
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    const { error } = await supabase
      .from('products')
      .delete()
      .neq('id', 0)

    if (error) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to delete products' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      deleted: count || 0
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete all products' 
    }, { status: 500 })
  }
}