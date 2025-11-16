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

    console.log('Dropshipper registration request:', { userId, email, phone })

    // Generate dropshipper ID from phone number
    const dropshipperId = `DS${phone.slice(-6)}${Date.now().toString().slice(-3)}`

    // Try to update by clerk_user_id first, then by email
    let data = null;
    let error = null;
    
    // First try by clerk_user_id
    const result1 = await supabase
      .from('users')
      .update({
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
        clerk_user_id: userId
      })
      .eq('clerk_user_id', userId)
      .select()
    
    data = result1.data;
    error = result1.error;
    
    // If no rows updated and we have email, try by email
    if ((!data || data.length === 0) && email) {
      console.log('Trying update by email:', email)
      const result2 = await supabase
        .from('users')
        .update({
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
          clerk_user_id: userId
        })
        .eq('email', email)
        .select()
      
      data = result2.data;
      error = result2.error;
    }
    
    console.log('Update result:', { data, error })

    if (error) {
      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({ 
      success: true, 
      dropshipperId,
      message: 'Dropshipper registration successful!' 
    })

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Registration failed' })
  }
}