import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// BunnyCDN Configuration
const BUNNY_STORAGE_ZONE = 'shopwave'
const BUNNY_STORAGE_PASSWORD = 'd72be0a4-1773-4f35-9442bada86d1-3b7a-418f'
const BUNNY_HOSTNAME = 'storage.bunnycdn.com'
const BUNNY_CDN_URL = `https://${BUNNY_STORAGE_ZONE}.b-cdn.net` // Your CDN pull zone URL

async function uploadToBunnyCDN(file: File, fileName: string): Promise<string> {
  try {
    const fileBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(fileBuffer)

    // Upload to BunnyCDN using Storage API
    const uploadUrl = `https://${BUNNY_HOSTNAME}/${BUNNY_STORAGE_ZONE}/order-photos/${fileName}`
    
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': BUNNY_STORAGE_PASSWORD,
        'Content-Type': file.type,
      },
      body: buffer
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('BunnyCDN upload failed:', errorText)
      throw new Error(`BunnyCDN upload failed: ${response.status}`)
    }

    // Return the CDN URL
    const cdnUrl = `${BUNNY_CDN_URL}/order-photos/${fileName}`
    return cdnUrl

  } catch (error) {
    console.error('BunnyCDN upload error:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const orderId = formData.get('orderId') as string
    const userId = formData.get('userId') as string
    const photo = formData.get('photo') as File

    if (!orderId || !userId || !photo) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 1. Verify order exists and belongs to user
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: 'Order not found or does not belong to user' },
        { status: 404 }
      )
    }

    // 2. Check if order total is >= ₹499
    if (order.total < 499) {
      return NextResponse.json(
        { success: false, error: 'Order total must be ₹499 or more for cashback' },
        { status: 400 }
      )
    }

    // 3. Check if photo already uploaded for this order
    const { data: existingPhoto } = await supabase
      .from('order_photos')
      .select('*')
      .eq('order_id', orderId)
      .eq('user_id', userId)
      .single()

    if (existingPhoto) {
      return NextResponse.json(
        { success: false, error: 'Photo already uploaded for this order' },
        { status: 400 }
      )
    }

    // 4. Upload photo to BunnyCDN
    const fileExt = photo.name.split('.').pop()
    const fileName = `${userId}_${orderId}_${Date.now()}.${fileExt}`
    
    let photoUrl: string
    try {
      photoUrl = await uploadToBunnyCDN(photo, fileName)
    } catch (uploadError) {
      console.error('BunnyCDN upload failed:', uploadError)
      return NextResponse.json(
        { success: false, error: 'Failed to upload photo to CDN' },
        { status: 500 }
      )
    }

    // 5. Save photo record to database
    const { data: photoRecord, error: photoError } = await supabase
      .from('order_photos')
      .insert({
        order_id: orderId,
        user_id: userId,
        photo_url: photoUrl,
        cashback_amount: 50,
        cashback_credited: false
      })
      .select()
      .single()

    if (photoError) {
      console.error('Photo record error:', photoError)
      return NextResponse.json(
        { success: false, error: 'Failed to save photo record' },
        { status: 500 }
      )
    }

    // 6. Credit cashback to user wallet
    const { error: cashbackError } = await supabase.rpc('credit_photo_cashback', {
      p_user_id: userId,
      p_order_id: orderId,
      p_photo_id: photoRecord.id,
      p_amount: 50
    })

    if (cashbackError) {
      console.error('Cashback error:', cashbackError)
      // Photo is uploaded but cashback failed - log for manual processing
      return NextResponse.json(
        {
          success: true,
          photoUrl,
          cashbackAmount: 50,
          cashbackCredited: false,
          message: 'Photo uploaded but cashback pending. Contact support.'
        },
        { status: 200 }
      )
    }

    // 7. Get updated wallet balance
    const { data: userData } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', userId)
      .single()

    return NextResponse.json({
      success: true,
      photoUrl,
      cashbackAmount: 50,
      cashbackCredited: true,
      walletBalance: userData?.wallet_balance || 0,
      message: '₹50 cashback credited to your wallet!'
    })

  } catch (error) {
    console.error('Photo upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to check if photo already uploaded
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const userId = searchParams.get('userId')

    if (!orderId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing parameters' },
        { status: 400 }
      )
    }

    const { data: photo } = await supabase
      .from('order_photos')
      .select('*')
      .eq('order_id', orderId)
      .eq('user_id', userId)
      .single()

    return NextResponse.json({
      success: true,
      hasPhoto: !!photo,
      photo: photo || null
    })

  } catch (error) {
    console.error('Check photo error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

