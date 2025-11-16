import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: dropshippers, error } = await supabase
      .from('dropshippers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      dropshippers: dropshippers || [],
      count: dropshippers?.length || 0
    })
  } catch (error) {
    console.error('Error fetching dropshippers:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch dropshippers'
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { dropshipperId, status } = await request.json()

    if (!dropshipperId || !status) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('dropshippers')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('dropshipper_id', dropshipperId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      dropshipper: data,
      message: `Dropshipper ${status} successfully`
    })
  } catch (error) {
    console.error('Error updating dropshipper status:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update dropshipper status'
    }, { status: 500 })
  }
}