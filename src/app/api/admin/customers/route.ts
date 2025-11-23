import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (usersError) {
      console.error('Error fetching users:', usersError)
      return NextResponse.json({ success: false, error: 'Failed to fetch users', customers: [] })
    }
    
    // Get order statistics for each user
    const customersWithStats = await Promise.all(
      (users || []).map(async (user) => {
        // Get orders for this user
        const { data: orders } = await supabase
          .from('orders')
          .select('*')
          .or(`user_id.eq.${user.user_id},user_email.eq.${user.email}`)
        
        const totalOrders = orders?.length || 0
        const totalSpent = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0
        const lastOrder = orders && orders.length > 0 ? orders[0].created_at : null
        
        // Calculate status
        const status = totalOrders > 0 ? 'Active' : 'New'
        
        return {
          _id: user.id,
          userId: user.user_id,
          name: user.full_name,
          email: user.email,
          phone: user.phone,
          referralCode: user.referral_code,
          coins: user.coins || 0,
          referredBy: user.referred_by,
          isAdmin: user.is_admin || false,
          totalOrders,
          totalSpent,
          lastOrder,
          status,
          joinedDate: user.created_at,
          lastActivity: lastOrder || user.updated_at,
          addresses: user.addresses || [],
          is_dropshipper: user.is_dropshipper || false
        }
      })
    )
    
    return NextResponse.json({ 
      success: true, 
      customers: customersWithStats 
    })

  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch customers',
      customers: []
    })
  }
}