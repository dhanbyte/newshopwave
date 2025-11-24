-- Add missing payment_id column to admin_orders table
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS payment_id TEXT;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_admin_orders_payment_id ON admin_orders(payment_id);
