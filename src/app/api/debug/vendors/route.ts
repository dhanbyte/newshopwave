import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: allVendors } = await supabase
      .from('vendors')
      .select('id, email, vendor_id, status, brand_name')
      .order('created_at', { ascending: false })

    return NextResponse.json({
      success: true,
      message: 'Debug vendors check completed',
      totalVendors: allVendors?.length || 0,
      recentVendors: (allVendors || []).slice(0, 5)
    })

  } catch (error) {
    console.error('Error in debug script:', error)
    return NextResponse.json({
      success: false,
      message: 'Debug script failed',
      error: error.message
    }, { status: 500 })
  }
}
