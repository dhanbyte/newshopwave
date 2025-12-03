import { NextResponse } from 'next/server'
import { getDatabase } from '../../../../../lib/db'

const supabase = getDatabase

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const invoice = formData.get('invoice') as File
    const orderId = formData.get('orderId') as string

    if (!invoice || !orderId) {
      return NextResponse.json({
        success: false,
        error: 'Invoice file and order ID are required'
      }, { status: 400 })
    }

    // Convert file to base64 for simple storage
    // In production, you should upload to Supabase Storage or S3
    const bytes = await invoice.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const invoiceUrl = `data:${invoice.type};base64,${base64}`

    // Update order with invoice URL
    const { error: updateError } = await supabase
      .from('admin_orders')
      .update({ 
        invoice_url: invoiceUrl,
        updated_at: new Date().toISOString()
      })
      .eq('orderId', orderId)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      success: true,
      invoice_url: invoiceUrl,
      message: 'Invoice uploaded successfully'
    })
  } catch (error) {
    console.error('Error uploading invoice:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to upload invoice'
    }, { status: 500 })
  }
}
