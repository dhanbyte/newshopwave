import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { vendorId, title, message, type, data } = await request.json()

    if (!vendorId || !title || !message) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      })
    }

    const { data: notification, error } = await supabase
      .from('vendor_notifications')
      .insert({
        vendor_id: vendorId,
        title,
        message,
        type: type || 'system',
        data: data || {},
        read: false
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      success: true, 
      notification 
    })

  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create notification' 
    })
  }
}