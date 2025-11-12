import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
// Simple JWT generation
function generateToken(userId: string) {
  return Buffer.from(JSON.stringify({ userId, exp: Date.now() + 86400000 })).toString('base64');
}

export async function POST(request: Request) {
  try {
    const { email, password, name, refCode } = await request.json();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
      
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create user object
    const userData: any = {
      email,
      password,
      name,
      referred_by: null,
      referral_balance: 0,
      total_earned: 0,
      total_withdrawn: 0,
      has_made_purchase: false,
      referral_count: 0,
      referral_code: Math.random().toString(36).substring(2, 8).toUpperCase()
    };

    // Handle referral if refCode exists
    if (refCode) {
      const { data: referrer } = await supabase
        .from('users')
        .select('id')
        .eq('referral_code', refCode)
        .single();
        
      if (referrer) {
        userData.referred_by = referrer.id;
      }
    }

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update referrer's count if applicable
    if (refCode && userData.referred_by) {
      await supabase
        .from('users')
        .update({ referral_count: supabase.sql`referral_count + 1` })
        .eq('id', userData.referred_by);
    }

    // Generate token
    const token = generateToken(newUser.id);

    // Return success response
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        referralCode: newUser.referral_code,
        referralBalance: newUser.referral_balance
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
