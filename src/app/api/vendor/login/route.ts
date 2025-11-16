import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const maxDuration = 10

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    console.log(`🔑 Vendor login attempt: ${email}`)

    const { data: vendor, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error || !vendor) {
      console.log(`❌ Vendor not found: ${email}`)
      return NextResponse.json({ 
        success: false, 
        error: 'Vendor not found. Please register first.' 
      })
    }

    console.log(`✅ Vendor found: ${vendor.business_name} (${vendor.status})`)

    return NextResponse.json({ 
      success: true, 
      vendor: {
        id: vendor.id,
        vendorId: vendor.vendor_id,
        email: vendor.email,
        name: vendor.name,
        businessName: vendor.business_name,
        status: vendor.status,
        password: vendor.password
      }
    })

  } catch (error: any) {
    console.error('❌ Vendor login error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Login failed',
      details: error.message
    }, { status: 500 })
  }
}
