import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type Context = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, context: Context) {
  const { id } = await context.params

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !user) {
      const { data: users } = await supabase
        .from('users')
        .select('id, email')
        .limit(5)
      
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
      
      return NextResponse.json(
        {
          error: 'User not found',
          availableUsers: (users || []).map(u => ({
            id: u.id,
            email: u.email || 'No email'
          })),
          totalUsers: totalUsers || 0
        },
        { status: 404 }
      )
    }

    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.user_id || user.id)

    const totalSpent = (orders || []).reduce((sum, order) => sum + (order.total || 0), 0)
    const ordersByStatus = (orders || []).reduce((acc, order) => {
      const status = order.status || 'Unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        phone: user.phone,
        createdAt: user.created_at
      },
      data: {
        orders: {
          count: orders?.length || 0,
          list: orders || [],
          totalSpent,
          byStatus: ordersByStatus
        }
      },
      analytics: {
        totalSpent,
        averageOrderValue: orders?.length ? totalSpent / orders.length : 0,
        orderFrequency: orders?.length || 0
      }
    })
  } catch (error) {
    console.error('Error fetching user details:', error)
    return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 })
  }
}
