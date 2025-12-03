import { NextResponse } from 'next/server'
import { getDatabase } from '../../../../../../lib/db'

const supabase = getDatabase

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { action, amount, note } = await request.json()
    const dropshipperId = params.id

    if (!action || !amount || amount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request'
      }, { status: 400 })
    }

    // Fetch current dropshipper
    const { data: dropshipper, error: fetchError } = await supabase
      .from('users')
      .select('dropshipper_earnings')
      .eq('dropshipper_id', dropshipperId)
      .eq('is_dropshipper', true)
      .single()

    if (fetchError || !dropshipper) {
      return NextResponse.json({
        success: false,
        error: 'Dropshipper not found'
      }, { status: 404 })
    }

    const currentBalance = dropshipper.dropshipper_earnings || 0
    let newBalance = currentBalance

    if (action === 'add') {
      newBalance = currentBalance + amount
    } else if (action === 'remove') {
      if (currentBalance < amount) {
        return NextResponse.json({
          success: false,
          error: 'Insufficient balance'
        }, { status: 400 })
      }
      newBalance = currentBalance - amount
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid action'
      }, { status: 400 })
    }

    // Update wallet balance
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        dropshipper_earnings: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('dropshipper_id', dropshipperId)

    if (updateError) {
      throw updateError
    }

    // Create transaction record (if table exists)
    try {
      await supabase
        .from('dropshipper_transactions')
        .insert({
          dropshipper_id: dropshipperId,
          type: action === 'add' ? 'add_money' : 'remove_money',
          amount: action === 'add' ? amount : -amount,
          balance_after: newBalance,
          note: note || `${action === 'add' ? 'Added' : 'Removed'} by admin`,
          created_at: new Date().toISOString()
        })
    } catch (e) {
      // Table might not exist, continue anyway
      console.log('Could not create transaction record:', e)
    }

    return NextResponse.json({
      success: true,
      new_balance: newBalance,
      message: `Successfully ${action === 'add' ? 'added' : 'removed'} ₹${amount}`
    })
  } catch (error) {
    console.error('Error updating wallet:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update wallet'
    }, { status: 500 })
  }
}
