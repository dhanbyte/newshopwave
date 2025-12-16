import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email param required' });
    }

    const supabase = getDatabase;

    console.log(`🔍 Debug searching for email: ${email}`);

    // Check 1: ILIKE match
    const { data: dataIlike, error: errorIlike } = await supabase
      .from('users')
      .select('*')
      .ilike('email', `%${email}%`);

    // Check 2: Check all users if no match found (limit 50) to see if email column exists properly
    let recentUsers = null;
    if (!dataIlike || dataIlike.length === 0) {
       const { data: recent } = await supabase
        .from('users')
        .select('email, id, clerk_user_id')
        .order('created_at', { ascending: false })
        .limit(10);
       recentUsers = recent;
    }

    return NextResponse.json({ 
      query: email,
      found_via_ilike: dataIlike, 
      error_ilike: errorIlike,
      recent_users_sample: recentUsers
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
