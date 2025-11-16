import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const maxDuration = 10

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Processing vendor registration...')
    
    const { 
      email, name, businessName, phone, businessType, gstNumber, panNumber, aadharNumber,
      address, bankDetails, profilePhoto, brandName 
    } = await request.json()

    console.log(`🔍 Checking for existing vendor: ${email}`)
    
    // Check if vendor already exists
    const { data: existingVendor, error: checkError } = await supabase
      .from('vendors')
      .select('*')
      .eq('email', email)
      .single()
    
    if (existingVendor && !checkError) {
      console.log(`❌ Vendor already exists: ${email} (${existingVendor.status})`)
      
      let errorMessage = 'Email already registered'
      let suggestion = ''

      switch (existingVendor.status) {
        case 'pending':
          errorMessage = 'An account with this email is already registered and pending approval'
          suggestion = 'Please wait for admin approval or contact support if you need assistance.'
          break
        case 'approved':
          errorMessage = 'An account with this email is already active'
          suggestion = 'Please login to your existing account instead of registering again.'
          break
        case 'rejected':
          errorMessage = 'An account with this email was previously rejected'
          suggestion = 'Please contact support for assistance or use a different email.'
          break
        case 'suspended':
          errorMessage = 'An account with this email has been suspended'
          suggestion = 'Please contact support for assistance.'
          break
      }

      return NextResponse.json({
        success: false,
        error: errorMessage,
        suggestion: suggestion,
        status: existingVendor.status
      })
    }

    // Generate default password and vendorId
    const defaultPassword = 'vendor123'
    const vendorId = 'VND' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase()
    
    console.log(`✨ Creating new vendor: ${businessName} (${email})`)
    
    // Create new vendor with minimal required fields
    const vendorData = {
      email,
      password: defaultPassword,
      vendor_id: vendorId,
      name: name || businessName, // Use name or fallback to businessName
      business_name: businessName,
      brand_name: brandName || businessName,
      phone: phone || '',
      business_type: businessType || 'Individual',
      status: 'pending'
    }
    
    const { data: vendor, error: insertError } = await supabase
      .from('vendors')
      .insert([vendorData])
      .select()
      .single()
    
    if (insertError) {
      throw new Error(`Failed to create vendor: ${insertError.message}`)
    }
    
    console.log(`✅ Vendor created successfully:`)
    console.log(`   - ID: ${vendor.id}`)
    console.log(`   - Vendor ID: ${vendor.vendor_id}`)
    console.log(`   - Email: ${vendor.email}`)
    console.log(`   - Business: ${vendor.business_name}`)
    console.log(`   - Status: ${vendor.status}`)

    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful! Please wait for admin approval before you can login.',
      vendor: {
        id: vendor.id,
        vendorId: vendor.vendor_id,
        email: vendor.email,
        name: vendor.name,
        businessName: vendor.business_name,
        status: vendor.status,
        password: defaultPassword
      }
    })

  } catch (error: any) {
    console.error('❌ Vendor registration error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Registration failed',
      details: error.message
    }, { status: 500 })
  }
}
