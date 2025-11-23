// src/app/api/payment/create-dropshipper-order-phonepe/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import crypto from 'crypto'

// Placeholder: PhonePe integration would normally use their SDK or API.
// For demonstration, we simulate order creation and return a mock order ID.

export async function POST(request: Request) {
  try {
    const authObj = await auth()
    const userId = authObj.userId
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const { planId, amount, interval } = await request.json()
    if (!planId || !amount || !interval) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 })
    }
    // Simulate PhonePe order creation
    const mockOrderId = `phonepe_${planId}_${Date.now()}`
    // In real implementation, you would call PhonePe's /v2/transactions/initiate endpoint
    // and sign the request using your merchant credentials.
    return NextResponse.json({ success: true, orderId: mockOrderId, amount })
  } catch (error: any) {
    console.error('PhonePe order creation error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Failed' }, { status: 500 })
  }
}
