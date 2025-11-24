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
      return NextResponse.json({ is_dropshipper: false });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('is_dropshipper')
      .eq('clerk_user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user status:', error);
      return NextResponse.json({ is_dropshipper: false });
    }

    return NextResponse.json({ 
      is_dropshipper: user?.is_dropshipper || false 
    });
  } catch (error: any) {
    console.error('Error in status API:', error);
    return NextResponse.json({ is_dropshipper: false });
  }
}
