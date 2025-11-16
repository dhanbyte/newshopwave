import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const maxDuration = 10

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!vendorId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Vendor ID required' 
      })
    }

    // Return empty notifications for now since table doesn't exist
    return NextResponse.json({ 
      success: true, 
      notifications: []
    })

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ 
      success: true,
      notifications: []
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { notificationId, read } = await request.json()

    const { error } = await supabase
      .from('vendor_notifications')
      .update({ read, updated_at: new Date().toISOString() })
      .eq('id', parseInt(notificationId))

    if (error) {
      console.error('Error updating notification:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update notification' 
      })
    }

    return NextResponse.json({ 
      success: true 
    })

  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update notification' 
    })
  }
}