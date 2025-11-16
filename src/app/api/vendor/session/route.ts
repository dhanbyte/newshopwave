import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { supabase } from '@/lib/supabase'

const JWT_SECRET = process.env.JWT_SECRET || 'vendor-secret-key-2024'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    const { data: vendor, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('email', email)
      .eq('status', 'approved')
      .single()
    
    if (error || !vendor) {
      return NextResponse.json({ success: false, error: 'Invalid credentials or not approved' })
    }
    
    const token = jwt.sign(
      { vendorId: vendor.id, email: vendor.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    )
    
    const response = NextResponse.json({
      success: true,
      vendor: {
        _id: vendor.id.toString(),
        email: vendor.email,
        businessName: vendor.business_name,
        brandName: vendor.brand_name,
        companyName: vendor.company_name,
        status: vendor.status
      }
    })
    
    response.cookies.set('vendor-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/'
    })
    
    return response
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Login failed' })
  }
}

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('vendor-token')?.value
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'No session' })
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    const { data: vendor, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', decoded.vendorId)
      .single()
    
    if (error || !vendor) {
      return NextResponse.json({ success: false, error: 'Vendor not found' })
    }
    
    return NextResponse.json({
      success: true,
      vendor: {
        _id: vendor.id.toString(),
        email: vendor.email,
        businessName: vendor.business_name,
        brandName: vendor.brand_name,
        companyName: vendor.company_name,
        status: vendor.status
      }
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid session' })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('vendor-token')
  return response
}
