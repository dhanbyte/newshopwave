// src/app/api/dropshipper/plans/route.ts
import { NextResponse } from 'next/server'
import { getDatabase } from '../../../../lib/db'

// Public endpoint that returns the same static plans as admin
const plans = [
  { 
    id: 'plan_weekly', 
    name: 'Starter', 
    interval: 'weekly', 
    price: 49, 
    description: 'Perfect for testing the waters', 
    discount: 50,
    features: ['Wholesale Pricing', 'Basic Support', 'Product Catalog Access']
  },
  { 
    id: 'plan_monthly', 
    name: 'Growth', 
    interval: 'monthly', 
    price: 299, 
    description: 'Videos + 30% Profit Share from Ads', 
    discount: 70,
    features: ['All Starter Features', 'Product Videos', '30% Ad Revenue Share', 'Priority Support']
  },
  { 
    id: 'plan_yearly', 
    name: 'Business', 
    interval: 'yearly', 
    price: 999, 
    description: 'Complete Solution - Products + Videos + Meta Ads + 20% Profit Share', 
    discount: 85,
    features: ['All Growth Features', 'Meta Ads Campaign Support', '20% Profit Share', 'Dedicated Account Manager', 'Custom Branding']
  },
  { 
    id: 'plan_premium', 
    name: 'Enterprise', 
    interval: 'yearly', 
    price: 1999, 
    description: 'Full Business Setup with Maximum Support', 
    discount: 90,
    features: ['All Business Features', 'Shopify Store Setup', 'Free Subdomain', 'Product Listing Service', 'Advanced Analytics']
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
