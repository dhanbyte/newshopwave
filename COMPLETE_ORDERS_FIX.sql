-- COMPLETE FIX - Add ALL missing columns to admin_orders at once

-- Core columns
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS tracking_id TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_orders_payment_id ON admin_orders(payment_id);
CREATE INDEX IF NOT EXISTS idx_admin_orders_payment_method ON admin_orders(payment_method);
CREATE INDEX IF NOT EXISTS idx_admin_orders_tracking_id ON admin_orders(tracking_id);

-- Also add to vendor_orders for consistency
ALTER TABLE vendor_orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE vendor_orders ADD COLUMN IF NOT EXISTS tracking_id TEXT;

CREATE INDEX IF NOT EXISTS idx_vendor_orders_payment_method ON vendor_orders(payment_method);
CREATE INDEX IF NOT EXISTS idx_vendor_orders_tracking_id ON vendor_orders(tracking_id);
