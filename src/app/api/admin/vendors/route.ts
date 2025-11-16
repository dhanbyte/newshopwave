import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const maxDuration = 10

export async function GET() {
  try {
    console.log('🔍 Fetching vendors from Supabase...')
    
    const { data: vendors, error } = await supabase
      .from('vendors')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      throw new Error(`Supabase error: ${error.message}`)
    }
    
    console.log(`✅ Found ${vendors?.length || 0} vendors`)
    
    return NextResponse.json({ 
      success: true, 
      vendors: vendors || [],
      count: vendors?.length || 0
    })

  } catch (error: any) {
    console.error('❌ Error fetching vendors:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch vendors',
      details: error.message
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { vendorId, status } = await request.json()
    console.log(`🔄 Updating vendor ${vendorId} status to ${status}`)

    const { data: vendor, error } = await supabase
      .from('vendors')
      .update({ status })
      .eq('id', parseInt(vendorId))
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update vendor: ${error.message}`)
    }

    console.log(`✅ Vendor ${vendorId} updated to ${status}`)
    return NextResponse.json({ 
      success: true, 
      vendor,
      message: `Vendor ${status} successfully`
    })

  } catch (error: any) {
    console.error('❌ Error updating vendor:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update vendor',
      details: error.message
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { vendorId } = await request.json()
    console.log(`🗑️ Deleting vendor ${vendorId}`)

    const { error } = await supabase
      .from('vendors')
      .delete()
      .eq('id', parseInt(vendorId))

    if (error) {
      throw new Error(`Failed to delete vendor: ${error.message}`)
    }

    console.log(`✅ Vendor ${vendorId} deleted successfully`)
    return NextResponse.json({ 
      success: true, 
      message: 'Vendor deleted successfully'
    })

  } catch (error: any) {
    console.error('❌ Error deleting vendor:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete vendor',
      details: error.message
    }, { status: 500 })
  }
}
