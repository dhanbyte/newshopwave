import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET() {
  try {
    // Test database connection
    const { data, error } = await supabase
      .from('users')
      .select('id, email, is_dropshipper')
      .limit(1)

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      sampleData: data 
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Database connection failed' 
    })
  }
}