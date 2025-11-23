// src/app/api/dropshipper/activate-trial/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      email,
      name,
      phone, 
      address,
      accountNumber,
      ifsc,
      bankName,
      planId
    } = await request.json()

    console.log('=== FREE TRIAL ACTIVATION START ===')
    console.log('User ID:', userId)
    console.log('Email:', email)

    // Validate required fields
    if (!userId || !email || !phone) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Generate dropshipper ID
    const dropshipperId = `DS${phone.slice(-6)}${Date.now().toString().slice(-3)}`
    
    // Calculate trial end date (7 days from now)
    const trialEndDate = new Date()
    trialEndDate.setDate(trialEndDate.getDate() + 7)

    // Prepare dropshipper data for FREE TRIAL
    const dropshipperData = {
      is_dropshipper: true,
      dropshipper_id: dropshipperId,
      dropshipper_payment_id: 'TRIAL_NO_PAYMENT',
      dropshipper_status: 'trial', // Special status for trial users
      dropshipper_trial_end: trialEndDate.toISOString(),
      dropshipper_earnings: 0,
      dropshipper_phone: phone,
      dropshipper_address: address,
      dropshipper_account_number: accountNumber,
      dropshipper_ifsc: ifsc,
      dropshipper_bank_name: bankName,
      name: name,
      clerk_user_id: userId,
      email: email,
      password: null
    }

    console.log('Activating free trial for user...')

    // Try to update existing user
    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update(dropshipperData)
      .eq('clerk_user_id', userId)
      .select()
    
    if (updateData && updateData.length > 0) {
      console.log('✅ Trial activated successfully')
      return NextResponse.json({ 
        success: true, 
        dropshipperId,
        trialEndDate: trialEndDate.toISOString(),
        message: 'Free trial activated! You have 7 days to try dropshipping.'
      })
    }

    // If update didn't work, try insert
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert(dropshipperData)
      .select()

    if (insertError) {
      console.error('❌ Failed to activate trial:', insertError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to activate trial: ' + insertError.message
      }, { status: 500 })
    }

    console.log('✅ Trial activated successfully (new user)')
    return NextResponse.json({ 
      success: true, 
      dropshipperId,
      trialEndDate: trialEndDate.toISOString(),
      message: 'Free trial activated! You have 7 days to try dropshipping.'
    })

  } catch (error: any) {
    console.error('❌ Exception in trial activation:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to activate trial: ' + error.message
    }, { status: 500 })
  }
}
