import { NextResponse } from 'next/server'
import { getDatabase } from '../../../../lib/db'

const supabase = getDatabase

export async function GET() {
  try {
    // Query users table where is_dropshipper = true
    const { data: dropshippers, error } = await supabase
      .from('users')
      .select(`
        id,
        clerk_user_id,
        email,
        name,
        is_dropshipper,
        dropshipper_id,
        dropshipper_status,
        dropshipper_earnings,
        dropshipper_phone,
        dropshipper_address,
        dropshipper_payment_id,
        dropshipper_account_number,
        dropshipper_ifsc,
        dropshipper_bank_name,
        dropshipper_aadhar_number,
        dropshipper_photo,
        dropshipper_aadhar_photo,
        created_at,
        updated_at
      `)
      .eq('is_dropshipper', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching dropshippers from users table:', error)
      throw error
    }

    console.log(`✅ Fetched ${dropshippers?.length || 0} dropshippers from users table`)

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

    // Update status in users table
    const { data, error } = await supabase
      .from('users')
      .update({ 
        dropshipper_status: status, 
        updated_at: new Date().toISOString() 
      })
      .eq('dropshipper_id', dropshipperId)
      .select()
      .single()

    if (error) {
      console.error('Error updating dropshipper status:', error)
      throw error
    }

    console.log(`✅ Updated dropshipper ${dropshipperId} status to ${status}`)

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