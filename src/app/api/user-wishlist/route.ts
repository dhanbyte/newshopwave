import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    const { data: wishlist } = await supabase
      .from('user_data')
      .select('data')
      .eq('userId', userId)
      .eq('type', 'wishlist')
      .single();
      
    return NextResponse.json({ success: true, items: wishlist?.data || [] });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, items } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    await supabase
      .from('user_data')
      .upsert({
        userId,
        type: 'wishlist',
        data: items,
        updated_at: new Date().toISOString()
      });

    return NextResponse.json({ success: true, message: 'Wishlist updated' });
  } catch (error) {
    console.error('Error updating wishlist:', error);
    return NextResponse.json({ success: false, error: 'Failed to update wishlist' }, { status: 500 });
  }
}