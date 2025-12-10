import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const key = searchParams.get('key')
    
    if (!key) {
      return NextResponse.json({ success: false, error: 'Key is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error(`Error fetching setting ${key}:`, error)
      return NextResponse.json({ success: false, error: 'Failed to fetch setting' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      value: data?.value || '' 
    })
  } catch (error) {
    console.error('Error in GET config:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { key, value } = await request.json()
    
    if (!key) {
      return NextResponse.json({ success: false, error: 'Key is required' }, { status: 400 })
    }
    
    // Upsert the setting
    const { error } = await supabase
      .from('settings')
      .upsert({ 
        key, 
        value: value?.toString() || '',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      })
    
    if (error) {
      console.error(`Error updating setting ${key}:`, error)
      return NextResponse.json({ success: false, error: 'Failed to update setting' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Setting updated successfully'
    })
  } catch (error) {
    console.error('Error in POST config:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
