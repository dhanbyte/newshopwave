import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .neq('category', 'Ayurvedic')

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const { count: newProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .neq('category', 'Ayurvedic')
      .gte('created_at', sevenDaysAgo)

    const { count: lowStock } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .neq('category', 'Ayurvedic')
      .lte('quantity', 5)

    const { data: orders } = await supabase
      .from('orders')
      .select('total')

    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    const totalOrders = orders?.length || 0
    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0

    const stats = {
      totalProducts: totalProducts || 0,
      newProducts: newProducts || 0,
      lowStock: lowStock || 0,
      totalOrders,
      totalUsers: totalUsers || 0,
      totalRevenue: Math.round(totalRevenue),
      avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
    };

    return NextResponse.json(stats);
    
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
