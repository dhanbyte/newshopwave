import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET() {
  try {
    // Simple test
    const { data, error } = await supabase
      .from('users')
      .select('email, is_dropshipper, dropshipper_id')
      .limit(5)

    return NextResponse.json({ 
      success: true, 
      message: 'API working',
      users: data,
      error: error?.message 
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}