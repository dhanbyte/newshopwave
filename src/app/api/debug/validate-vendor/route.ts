import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { count: totalVendors } = await supabase
      .from('vendors')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      success: true,
      message: 'Vendor validation check',
      databaseCheck: {
        totalVendors: totalVendors || 0
      },
      recommendations: [
        'Make sure you are logged in as a vendor',
        'Check that vendorId exists in localStorage',
        'Verify vendor account is approved',
        'Try logging out and logging back in'
      ]
    })

  } catch (error) {
    console.error('Error in vendor validation:', error)
    return NextResponse.json({
      success: false,
      message: 'Validation check failed',
      error: error.message
    }, { status: 500 })
  }
}
