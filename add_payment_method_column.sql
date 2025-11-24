-- Add missing payment_method column to admin_orders
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
CREATE INDEX IF NOT EXISTS idx_admin_orders_payment_method ON admin_orders(payment_method);

-- Also add to vendor_orders for consistency
ALTER TABLE vendor_orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
CREATE INDEX IF NOT EXISTS idx_vendor_orders_payment_method ON vendor_orders(payment_method);
