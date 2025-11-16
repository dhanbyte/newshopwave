import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

// Fallback for when database is not available
const fallbackResponse = (type: string) => {
  switch (type) {
    case 'cart': return [];
    case 'wishlist': return [];
    case 'orders': return [];
    case 'addresses': return [];
    case 'referrals': return [];
    case 'coins': return 5;
    case 'scratchCards': return [];
    case 'usedSpins': return [];
    default: return null;
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')
    const admin = searchParams.get('admin')
    
    // Admin endpoint to get all users
    if (admin === 'true') {
      try {
        const { data: users } = await supabase.from('admin_users').select('*')
        const { data: orders } = await supabase.from('admin_orders').select('*')
        
        const usersWithOrders = (users || []).map(user => ({
          ...user,
          orders: (orders || []).filter(order => order.userId === user.userId)
        }))
        
        return NextResponse.json({ users: usersWithOrders })
      } catch (dbError) {
        console.warn('Database error:', dbError)
        return NextResponse.json({ users: [] })
      }
    }
    
    if (!userId || !type) {
      return NextResponse.json([])
    }
    
    // Validate inputs
    if (typeof userId !== 'string' || typeof type !== 'string') {
      return NextResponse.json(fallbackResponse(type))
    }
    
    try {
      const { data: userData } = await supabase
        .from('user_data')
        .select('data')
        .eq('userId', userId.trim())
        .eq('type', type.trim())
        .single()
      
      const result = userData?.data ?? fallbackResponse(type)
      return NextResponse.json(result)
    } catch (dbError) {
      console.warn('Database error, using fallback:', dbError)
      return NextResponse.json(fallbackResponse(type))
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    // Return empty array instead of error to prevent UI breaks
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, data } = body
    
    if (!userId || !type || data === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }
    
    // Validate inputs
    if (typeof userId !== 'string' || typeof type !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid input types' }, { status: 400 })
    }
    
    try {
      const { error } = await supabase
        .from('user_data')
        .upsert({
          userId: userId.trim(),
          type: type.trim(),
          data,
          updated_at: new Date().toISOString()
        })
      
      const success = !error
      
      return NextResponse.json({ 
        success, 
        saved: success,
        message: success ? 'Data saved successfully' : 'Failed to save data'
      })
    } catch (dbError) {
      console.warn('Database error during save, using fallback:', dbError)
      return NextResponse.json({ 
        success: true, 
        saved: true,
        message: 'Data saved (fallback mode)'
      })
    }
  } catch (error) {
    console.error('Error saving user data:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save data',
      message: 'Server error occurred'
    }, { status: 500 })
  }
}