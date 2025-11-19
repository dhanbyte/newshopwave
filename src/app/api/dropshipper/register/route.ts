import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      paymentId, 
      name,
      phone, 
      address,
      accountNumber,
      ifsc,
      bankName,
      aadharNumber,
      photo,
      aadharPhoto,
      email
    } = await request.json()

    console.log('=== DROPSHIPPER REGISTRATION START ===')
    console.log('Received data:', { 
      userId, 
      email, 
      phone, 
      paymentId,
      hasPhoto: !!photo,
      hasAadharPhoto: !!aadharPhoto 
    })

    // Validate required fields
    if (!userId || !email || !phone || !paymentId) {
      console.error('Missing required fields:', { userId, email, phone, paymentId })
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: userId, email, phone, and paymentId are required' 
      }, { status: 400 })
    }

    // Generate dropshipper ID from phone number
    const dropshipperId = `DS${phone.slice(-6)}${Date.now().toString().slice(-3)}`
    console.log('Generated Dropshipper ID:', dropshipperId)

    // Prepare dropshipper data
    const dropshipperData = {
      is_dropshipper: true,
      dropshipper_id: dropshipperId,
      dropshipper_payment_id: paymentId,
      dropshipper_status: 'active',
      dropshipper_earnings: 0,
      dropshipper_photo: photo,
      dropshipper_phone: phone,
      dropshipper_address: address,
      dropshipper_account_number: accountNumber,
      dropshipper_ifsc: ifsc,
      dropshipper_bank_name: bankName,
      dropshipper_aadhar_number: aadharNumber,
      dropshipper_aadhar_photo: aadharPhoto,
      name: name,
      clerk_user_id: userId,
      email: email
    }

    console.log('Attempting to update/create user with dropshipper data...')

    // Strategy 1: Try to update by clerk_user_id
    console.log('Step 1: Trying UPDATE by clerk_user_id:', userId)
    const { data: updateByClerkId, error: updateByClerkIdError } = await supabase
      .from('users')
      .update(dropshipperData)
      .eq('clerk_user_id', userId)
      .select()
    
    if (updateByClerkId && updateByClerkId.length > 0) {
      console.log('✅ SUCCESS: Updated user by clerk_user_id')
      console.log('Updated user:', updateByClerkId[0])
      return NextResponse.json({ 
        success: true, 
        dropshipperId,
        message: 'Dropshipper registration successful!',
        user: updateByClerkId[0]
      })
    }

    console.log('Step 1 result: No rows updated by clerk_user_id')
    if (updateByClerkIdError) {
      console.error('Error in clerk_user_id update:', updateByClerkIdError)
    }

    // Strategy 2: Try to update by email
    console.log('Step 2: Trying UPDATE by email:', email)
    const { data: updateByEmail, error: updateByEmailError } = await supabase
      .from('users')
      .update(dropshipperData)
      .eq('email', email)
      .select()
    
    if (updateByEmail && updateByEmail.length > 0) {
      console.log('✅ SUCCESS: Updated user by email')
      console.log('Updated user:', updateByEmail[0])
      return NextResponse.json({ 
        success: true, 
        dropshipperId,
        message: 'Dropshipper registration successful!',
        user: updateByEmail[0]
      })
    }

    console.log('Step 2 result: No rows updated by email')
    if (updateByEmailError) {
      console.error('Error in email update:', updateByEmailError)
    }

    // Strategy 3: User doesn't exist, create new record using UPSERT
    console.log('Step 3: User not found, attempting INSERT (UPSERT)')
    
    const { data: insertedUser, error: insertError } = await supabase
      .from('users')
      .upsert(dropshipperData, {
        onConflict: 'clerk_user_id',
        ignoreDuplicates: false
      })
      .select()

    if (insertError) {
      console.error('❌ INSERT/UPSERT failed:', insertError)
      return NextResponse.json({ 
        success: false, 
        error: `Failed to create/update user record: ${insertError.message}`,
        details: insertError
      }, { status: 500 })
    }

    if (insertedUser && insertedUser.length > 0) {
      console.log('✅ SUCCESS: Created new user via UPSERT')
      console.log('Inserted user:', insertedUser[0])
      return NextResponse.json({ 
        success: true, 
        dropshipperId,
        message: 'Dropshipper registration successful!',
        user: insertedUser[0]
      })
    }

    // Strategy 4: Final verification - check if user exists now
    console.log('Step 4: Verifying user creation...')
    const { data: verifyUser, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .or(`clerk_user_id.eq.${userId},email.eq.${email}`)
      .single()

    if (verifyUser) {
      console.log('✅ User exists in database:', verifyUser)
      // User exists but wasn't updated - this is unusual
      return NextResponse.json({ 
        success: true, 
        dropshipperId,
        message: 'User already exists. Please contact support if you need assistance.',
        user: verifyUser,
        warning: 'User record found but update may have failed'
      })
    }

    // If we reach here, something went very wrong
    console.error('❌ CRITICAL: All strategies failed')
    console.error('Verify error:', verifyError)
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to register dropshipper. All database operations failed. Please contact support.',
      debug: {
        userId,
        email,
        updateByClerkIdError: updateByClerkIdError?.message,
        updateByEmailError: updateByEmailError?.message,
        insertError: insertError?.message,
        verifyError: verifyError?.message
      }
    }, { status: 500 })

  } catch (error: any) {
    console.error('❌ EXCEPTION in dropshipper registration:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Registration failed due to server error',
      details: error.message 
    }, { status: 500 })
  }
}