-- Add tracking_id column to admin_orders table
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS tracking_id TEXT;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_admin_orders_tracking_id ON admin_orders(tracking_id);

-- Also add to vendor_orders if needed
ALTER TABLE vendor_orders ADD COLUMN IF NOT EXISTS tracking_id TEXT;
CREATE INDEX IF NOT EXISTS idx_vendor_orders_tracking_id ON vendor_orders(tracking_id);
