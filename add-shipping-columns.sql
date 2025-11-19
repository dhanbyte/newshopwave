-- Add shipping address and payment columns to admin_orders table

-- Add shipping_address column (stores JSON)
ALTER TABLE admin_orders 
ADD COLUMN IF NOT EXISTS shipping_address TEXT;

-- Add payment_method column
ALTER TABLE admin_orders 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'COD';

-- Add payment_id column (for online payments)
ALTER TABLE admin_orders 
ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255);

-- Add comment for documentation
COMMENT ON COLUMN admin_orders.shipping_address IS 'JSON string containing shipping address details';
COMMENT ON COLUMN admin_orders.payment_method IS 'Payment method used: COD or Online';
COMMENT ON COLUMN admin_orders.payment_id IS 'Payment ID from payment gateway (Razorpay/PhonePe)';

-- Create index on payment_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_orders_payment_id ON admin_orders(payment_id);