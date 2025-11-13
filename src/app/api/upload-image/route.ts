import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const filename = `product-${timestamp}-${randomString}.${extension}`

    // Upload to BunnyCDN
    const bunnyUrl = `https://storage.bunnycdn.com/shopwave/${filename}`
    
    const uploadResponse = await fetch(bunnyUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': process.env.BUNNY_STORAGE_PASSWORD || '',
        'Content-Type': file.type,
      },
      body: buffer,
    })

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload to BunnyCDN')
    }

    // Return the public URL
    const publicUrl = `https://shopwave.b-cdn.net/${filename}`
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      filename: filename
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}