import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🔧 Starting migration: Adding shipping columns to admin_orders...')
    
    // Add shipping_address column
    const { error: error1 } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS shipping_address TEXT;`
    })
    
    if (error1) {
      console.log('Note: shipping_address column may already exist or RPC not available')
    }
    
    // Add payment_method column
    const { error: error2 } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'COD';`
    })
    
    if (error2) {
      console.log('Note: payment_method column may already exist or RPC not available')
    }
    
    // Add payment_id column
    const { error: error3 } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255);`
    })
    
    if (error3) {
      console.log('Note: payment_id column may already exist or RPC not available')
    }
    
    console.log('✅ Migration completed!')
    
    return NextResponse.json({
      success: true,
      message: 'Migration completed. Please run the SQL manually in Supabase if columns were not added.',
      sql: `
-- Run this SQL in your Supabase SQL Editor:

ALTER TABLE admin_orders 
ADD COLUMN IF NOT EXISTS shipping_address TEXT;

ALTER TABLE admin_orders 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'COD';

ALTER TABLE admin_orders 
ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_admin_orders_payment_id ON admin_orders(payment_id);
      `
    })
    
  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      instruction: 'Please run the SQL manually in Supabase SQL Editor. Check the response for the SQL code.'
    })
  }
}