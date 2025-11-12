import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()
    
    if (!email || !password || !fullName) {
      return NextResponse.json({ 
        error: 'Email, password and full name required' 
      }, { status: 400 })
    }
    
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (existingUser) {
      return NextResponse.json({ 
        error: 'User already exists' 
      }, { status: 409 })
    }
    
    const hashedPassword = await bcrypt.hash(password, 12)
    const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase()
    
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email,
        password: hashedPassword,
        full_name: fullName,
        referral_code: referralCode,
        coins: 0
      })
      .select()
      .single()
    
    if (error) throw error
    
    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )
    
    return NextResponse.json({ 
      success: true,
      token,
      data: { 
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.full_name,
          referralCode: newUser.referral_code,
          createdAt: newUser.created_at
        }
      }
    })
    
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ 
      error: 'Registration failed' 
    }, { status: 500 })
  }
}