import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log('Environment check:')
    console.log('URL:', url ? 'Present' : 'Missing')
    console.log('Anon Key:', anonKey ? 'Present' : 'Missing')
    console.log('Service Key:', serviceKey ? 'Present' : 'Missing')

    if (!url || !anonKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing Supabase credentials',
        details: { url: !!url, anonKey: !!anonKey, serviceKey: !!serviceKey }
      })
    }

    const supabase = createClient(url, anonKey)
    
    // Test connection
    const { data, error } = await supabase.from('vendor_products').select('count').limit(1)
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      data
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    })
  }
}