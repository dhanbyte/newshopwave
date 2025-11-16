import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const { data: wishlistData } = await supabase
      .from('user_data')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'wishlist')
      .single()

    const { data: cartData } = await supabase
      .from('user_data')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'cart')
      .single()

    return NextResponse.json({
      success: true,
      dbConnected: true,
      userId,
      wishlist: wishlistData?.data || [],
      cart: cartData?.data || [],
      wishlistExists: !!wishlistData,
      cartExists: !!cartData
    });

  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({ 
      error: error.message,
      dbConnected: false 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type) {
      return NextResponse.json({ error: 'userId and type required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('user_data')
      .upsert({
        user_id: userId,
        type,
        data,
        updated_at: new Date().toISOString()
      })

    if (error) throw error

    return NextResponse.json({
      success: true,
      saved: true
    });

  } catch (error) {
    console.error('Test save error:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
