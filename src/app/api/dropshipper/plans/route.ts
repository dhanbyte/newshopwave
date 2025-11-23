// src/app/api/dropshipper/plans/route.ts
import { NextResponse } from 'next/server'
import { getDatabase } from '../../../../lib/db'

// Public endpoint that returns the same static plans as admin
const plans = [
  { id: 'plan_weekly', name: 'Basic', interval: 'weekly', price: 49, description: 'Perfect for beginners', discount: 70 },
  { id: 'plan_monthly', name: 'Standard', interval: 'monthly', price: 99, description: 'Most popular choice', discount: 80 },
  { id: 'plan_yearly', name: 'Pro', interval: 'yearly', price: 799, description: 'Best value for money', discount: 85 },
  { id: 'plan_premium', name: 'Premium', interval: 'yearly', price: 1999, description: 'Complete business solution', discount: 90 },
]

export async function GET() {
  try {
    return NextResponse.json({ success: true, plans })
  } catch (error) {
    console.error('Error fetching dropshipper plans:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch plans' }, { status: 500 })
  }
}
