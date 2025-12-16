import { NextResponse } from 'next/server'
import { getDatabase } from '../../../../../lib/db'

// ... keep imports
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

    let user = null;
    let errors = [];

    // Strategy 1: Search by clerk_user_id
    if (!user) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_user_id', userId)
        .single();
      
      if (data) user = data;
      else if (error) errors.push(`clerk_user_id: ${error.message}`);
    }

    // Strategy 2: Search by email
    if (!user) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', userId)
        .single();
      
      if (data) user = data;
      else if (error) errors.push(`email: ${error.message}`);
    }

    // Strategy 3: Search by user_id
    if (!user) {
      // Only try if it looks like a UUID or just try and catch error
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (data) user = data;
      else if (error) errors.push(`user_id: ${error.message}`);
    }

    if (!user) {
      console.error('❌ User lookup failed. Errors:', errors);
      return NextResponse.json({ 
        success: false, 
        error: `User not found with input: ${userId}. searched in clerk_user_id, email, user_id.` 
      }, { status: 404 })
    }

    console.log('✅ Found user:', user.email, user.id);

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

    // Update the found user by primary ID
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Update failed:', updateError);
      return NextResponse.json({ 
        success: false, 
        error: `Update failed: ${updateError.message}` 
      }, { status: 500 })
    }

    console.log('✅ Successfully updated user:', updatedUser);
    
    // Initialize wallet with 0 balance if not exists
    try {
      if (!updatedUser.dropshipper_earnings) {
        await supabase
          .from('users')
          .update({ dropshipper_earnings: 0 })
          .eq('id', updatedUser.id);
      }
    } catch (walletError) {
      console.warn('⚠️ Wallet initialization warning:', walletError);
    }
    
    return NextResponse.json({ 
      success: true, 
      dropshipperId, 
      user: updatedUser,
      message: 'User successfully activated as dropshipper! They may need to refresh their page or re-login to see changes.'
    })
  } catch (error: any) {
    console.error('❌ Error in make-dropshipper:', error)
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
