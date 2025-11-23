// src/app/api/admin/dropshipper-plans/route.ts
import { NextResponse } from 'next/server'

/**
 * Simple static plan definitions for dropshippers.
 * Weekly: $29
 * Monthly: $99
 * Yearly: $999
 */
interface DropshipperPlan {
  id: string
  name: string
  interval: 'weekly' | 'monthly' | 'yearly'
  price: number // price in USD (or your currency)
  description: string
}

const plans: DropshipperPlan[] = [
  {
    id: 'plan_weekly',
    name: 'Weekly Plan',
    interval: 'weekly',
    price: 29,
    description: 'Access for one week',
  },
  {
    id: 'plan_monthly',
    name: 'Monthly Plan',
    interval: 'monthly',
    price: 99,
    description: 'Access for one month',
  },
  {
    id: 'plan_yearly',
    name: 'Yearly Plan',
    interval: 'yearly',
    price: 999,
    description: 'Access for one year',
  },
]

export async function GET() {
  try {
    return NextResponse.json({ success: true, plans })
  } catch (error) {
    console.error('Error fetching dropshipper plans:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch plans' },
      { status: 500 }
    )
  }
}

// Future: you can add POST/PUT handlers to let admin create/modify plans dynamically.
