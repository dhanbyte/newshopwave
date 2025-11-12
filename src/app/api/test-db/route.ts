import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    console.log('Testing Supabase connection...');
    
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL
    });
  } catch (error) {
    console.error('Supabase test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL
    }, { status: 500 });
  }
}