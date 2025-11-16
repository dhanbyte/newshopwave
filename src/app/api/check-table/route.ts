import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL || '', SERVICE_ROLE_KEY || '')

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('vendor_products')
      .select('*')
      .limit(1)

    return NextResponse.json({
      success: !error,
      error: error?.message,
      sampleData: data?.[0] || null,
      columns: data?.[0] ? Object.keys(data[0]) : []
    })
  } catch (error) {
    return NextResponse.json({ error: error.message })
  }
}