import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Fetch latest wallet balance from users table
    const { data: user, error } = await supabase
      .from('users')
      .select('dropshipper_earnings')
      .eq('clerk_user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching balance:', error);
      return NextResponse.json({ balance: 0 });
    }

    return NextResponse.json({ 
      balance: user?.dropshipper_earnings || 0 
    });
  } catch (error: any) {
    console.error('Error in balance API:', error);
    return NextResponse.json({ balance: 0 });
  }
}
