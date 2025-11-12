import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(request: NextRequest) {
  try {
    const { vendorId, newPassword } = await request.json()
    
    if (!vendorId || !newPassword) {
      return NextResponse.json({ 
        success: false, 
        message: 'Vendor ID and new password are required' 
      }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)

    const { data: vendor, error } = await supabase
      .from('vendors')
      .update({ password: hashedPassword })
      .eq('id', vendorId)
      .select()
      .single()

    if (error || !vendor) {
      return NextResponse.json({ 
        success: false, 
        message: 'Vendor not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Password reset successfully' 
    })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to reset password' 
    }, { status: 500 })
  }
}