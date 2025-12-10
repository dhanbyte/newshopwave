import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// List of settings allowed to be fetched publicly
const ALLOWED_KEYS = ['how_it_works_video', 'dropshipper_price']

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const key = searchParams.get('key')
    
    if (!key || !ALLOWED_KEYS.includes(key)) {
      return NextResponse.json({ success: false, error: 'Invalid or restricted key' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error(`Error fetching public setting ${key}:`, error)
      return NextResponse.json({ success: false, error: 'Failed to fetch setting' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      value: data?.value || '' 
    })
  } catch (error) {
    console.error('Error in GET public config:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
