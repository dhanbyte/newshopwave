// src/app/api/dropshipper/plans/route.ts
import { NextResponse } from 'next/server'
import { getDatabase } from '../../../../lib/db'

// Public endpoint that returns the same static plans as admin
const plans = [
  { 
    id: 'plan_starter', 
    name: 'Starter', 
    interval: 'yearly', 
    price: 999, 
    description: 'Perfect for beginners. Pay ads cost after profit!', 
    discount: 50,
    features: ['High Profit Margins', 'Pay Ads Charge After Earning', '25% Ads Commission on Profit', 'No Upfront Ads Cost']
  },
  { 
    id: 'plan_scaling', 
    name: 'Scaling', 
    interval: 'yearly', 
    price: 1999, 
    description: 'Safe scaling with lower commissions.', 
    discount: 60,
    features: ['All Starter Features', 'Lower Ads Commission (18%)', 'Safe Scaling Strategy', 'Priority Support']
  },
  { 
    id: 'plan_dominance', 
    name: 'Dominance', 
    interval: 'yearly', 
    price: 2999, 
    description: 'Maximum profit with premium support.', 
    discount: 70,
    features: ['All Scaling Features', 'Dedicated Account Manager', 'Advanced Analytics', 'Lowest Commission Rate']
  },
]

export async function GET() {
  try {
    return NextResponse.json({ success: true, plans })
  } catch (error) {
    console.error('Error fetching dropshipper plans:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch plans' }, { status: 500 })
  }
}
