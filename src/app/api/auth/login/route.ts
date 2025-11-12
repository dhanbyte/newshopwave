import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Simple JWT generation
function generateToken(userId: string) {
  return Buffer.from(JSON.stringify({ userId, exp: Date.now() + 86400000 })).toString('base64');
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    // Check if user exists
    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Simple password check (in production, use proper hashing)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user.id.toString());

    return NextResponse.json({
      success: true,
      token,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.name,
          referralCode: user.referral_code,
          referralBalance: user.referral_balance,
          createdAt: user.created_at
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}