import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')
    
    if (error) {
      console.error('Error fetching all settings:', error)
      // Return empty if table doesn't exist yet to prevent crash in UI
      return NextResponse.json({ success: true, settings: {} })
    }
    
    // Convert array to object
    const settingsMap: Record<string, string> = {}
    data?.forEach(item => {
      settingsMap[item.key] = item.value
    })
    
    return NextResponse.json({ 
      success: true, 
      settings: settingsMap
    })
  } catch (error) {
    console.error('Error in GET settings:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings = await request.json()
    
    // Prepare upsert data
    const upsertData = Object.entries(settings).map(([key, value]) => ({
      key,
      value: String(value),
      updated_at: new Date().toISOString()
    }))
    
    if (upsertData.length === 0) {
      return NextResponse.json({ success: true })
    }

    const { error } = await supabase
      .from('settings')
      .upsert(upsertData, { onConflict: 'key' })
    
    if (error) {
      console.error('Error updating settings:', error)
      return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Settings updated successfully'
    })
  } catch (error) {
    console.error('Error in POST settings:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
