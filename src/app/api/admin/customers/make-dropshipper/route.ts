import { NextResponse } from 'next/server'
import { getDatabase } from '../../../../../lib/db'

export async function POST(request: Request) {
  try {
    const { 
      userId, 
      name,
      phone,
      address,
      bankName,
      accountNumber,
      ifsc,
      aadharNumber,
      photo
    } = await request.json()
    const supabase = getDatabase

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 })
    }

    console.log('🔍 Making dropshipper for userId:', userId);

    // Calculate 1 year subscription dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); // Add 1 year

    // Generate dropshipper ID
    const dropshipperId = `DS${Date.now()}`;

    // Prepare update data
    const updateData: any = {
      is_dropshipper: true,
      dropshipper_status: 'active',
      dropshipper_plan_id: 'plan_admin_gift',
      dropshipper_plan_interval: 'yearly',
      dropshipper_subscription_start: startDate.toISOString(),
      dropshipper_subscription_end: endDate.toISOString(),
      dropshipper_id: dropshipperId,
      updated_at: new Date().toISOString()
    };

    // Add optional fields if provided
    if (name) updateData.name = name;
    if (phone) updateData.dropshipper_phone = phone;
    if (address) updateData.dropshipper_address = address;
    if (bankName) updateData.dropshipper_bank_name = bankName;
    if (accountNumber) updateData.dropshipper_account_number = accountNumber;
    if (ifsc) updateData.dropshipper_ifsc = ifsc;
    if (aadharNumber) updateData.dropshipper_aadhar_number = aadharNumber;
    if (photo) updateData.dropshipper_photo = photo;

    console.log('📝 Update data:', JSON.stringify(updateData, null, 2));

    // Try 1: Update by clerk_user_id
    let result = await supabase
      .from('users')
      .update(updateData)
      .eq('clerk_user_id', userId)
      .select()
      .single()

    if (result.error) {
      console.warn('⚠️ clerk_user_id failed, trying user_id...');
      // Try 2: Update by user_id
      result = await supabase
        .from('users')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single()
    }

    if (result.error) {
      console.warn('⚠️ user_id failed, trying email...');
      // Try 3: Update by email
      result = await supabase
        .from('users')
        .update(updateData)
        .eq('email', userId)
        .select()
        .single()
    }

    if (result.error) {
      console.error('❌ All update attempts failed:', result.error);
      return NextResponse.json({ 
        success: false, 
        error: `User not found with ID/Email: ${userId}. Error: ${result.error.message}` 
      }, { status: 404 })
    }

    console.log('✅ Successfully updated user:', result.data);
    
    // Initialize wallet with 0 balance if not exists
    try {
      const walletCheck = await supabase
        .from('users')
        .select('dropshipper_earnings')
        .eq('clerk_user_id', result.data.clerk_user_id || userId)
        .single();
      
      if (!walletCheck.data?.dropshipper_earnings) {
        await supabase
          .from('users')
          .update({ dropshipper_earnings: 0 })
          .eq('clerk_user_id', result.data.clerk_user_id || userId);
      }
    } catch (walletError) {
      console.warn('⚠️ Wallet initialization warning:', walletError);
    }
    
    return NextResponse.json({ 
      success: true, 
      dropshipperId, 
      user: result.data,
      message: 'User successfully activated as dropshipper! They may need to refresh their page or re-login to see changes.'
    })
  } catch (error: any) {
    console.error('❌ Error in make-dropshipper:', error)
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
