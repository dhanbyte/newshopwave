import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, email, fullName, phone } = body;

    if (!userId || !email || !fullName) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .or(`user_id.eq.${userId},email.eq.${email}`)
      .single();

    if (existingUser) {
      return NextResponse.json({ 
        success: true, 
        user: existingUser,
        message: 'User already exists' 
      });
    }

    // Create new user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        user_id: userId,
        email,
        full_name: fullName,
        phone: phone || null,
        referral_code: Math.random().toString(36).substring(2, 10).toUpperCase()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      user,
      message: 'User registered successfully' 
    });

  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to register user' 
    }, { status: 500 });
  }
}