import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const maxDuration = 10

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')
    const email = searchParams.get('email')

    if (!vendorId && !email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Vendor ID or email required' 
      })
    }

    // Get vendor data
    let vendorQuery = supabase.from('vendors').select('*')
    if (vendorId) {
      vendorQuery = vendorQuery.eq('id', parseInt(vendorId))
    } else {
      vendorQuery = vendorQuery.eq('email', email)
    }
    
    const { data: vendor, error: vendorError } = await vendorQuery.single()
    
    if (vendorError || !vendor) {
      return NextResponse.json({ 
        success: false, 
        error: 'Vendor not found' 
      })
    }

    // Calculate statistics from real data
    try {
      const { data: products } = await supabase
        .from('vendor_products')
        .select('id')
        .eq('vendor_id', vendor.id)
      
      const productCount = products?.length || 0
      
      const vendorWithStats = {
        _id: vendor.id.toString(),
        email: vendor.email,
        businessName: vendor.business_name,
        totalProducts: productCount,
        totalOrders: 0, // No orders table yet
        pendingOrders: 0,
        totalEarnings: 0,
        totalRevenue: 0,
        pendingPayments: 0,
        rating: vendor.rating || 4.2,
        reviewCount: vendor.review_count || 0
      }
      
      return NextResponse.json({ 
        success: true, 
        vendor: vendorWithStats
      })
    } catch (statsError) {
      console.error('Error calculating stats:', statsError)
      return NextResponse.json({ 
        success: true, 
        vendor: {
          _id: vendor.id.toString(),
          email: vendor.email,
          businessName: vendor.business_name,
          totalProducts: 0,
          totalOrders: 0,
          pendingOrders: 0,
          totalEarnings: 0,
          totalRevenue: 0,
          pendingPayments: 0,
          rating: 4.2,
          reviewCount: 0
        }
      })
    }

  } catch (error) {
    console.error('Error fetching vendor profile:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch profile' 
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { vendorId, ...updateData } = await request.json()
    console.log('Updating vendor profile:', vendorId)

    // Convert camelCase to snake_case for Supabase
    const supabaseData: any = {
      updated_at: new Date().toISOString()
    }
    
    if (updateData.businessName) supabaseData.business_name = updateData.businessName
    if (updateData.contactNumber) supabaseData.contact_number = updateData.contactNumber
    if (updateData.address) supabaseData.address = updateData.address
    if (updateData.description) supabaseData.description = updateData.description
    if (updateData.website) supabaseData.website = updateData.website

    const { data: vendor, error } = await supabase
      .from('vendors')
      .update(supabaseData)
      .eq('id', parseInt(vendorId))
      .select()
      .single()

    if (error || !vendor) {
      console.log('Vendor not found or update failed:', vendorId, error)
      return NextResponse.json({ 
        success: false, 
        error: 'Vendor not found' 
      }, { status: 404 })
    }

    console.log('Vendor profile updated successfully')
    return NextResponse.json({ 
      success: true, 
      vendor,
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('Error updating vendor profile:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update profile',
      details: error.message
    }, { status: 500 })
  }
}
