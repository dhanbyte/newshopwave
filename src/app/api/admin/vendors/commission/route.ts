import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(request: NextRequest) {
  try {
    const { vendorId, commission } = await request.json()

    const { data: vendor, error } = await supabase
      .from('vendors')
      .update({ 
        commission: Number(commission),
        updated_at: new Date().toISOString()
      })
      .eq('id', vendorId)
      .select()
      .single()

    if (error || !vendor) {
      return NextResponse.json({ 
        success: false, 
        error: 'Vendor not found' 
      })
    }

    return NextResponse.json({ 
      success: true, 
      vendor 
    })

  } catch (error) {
    console.error('Error updating commission:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update commission' 
    })
  }
}