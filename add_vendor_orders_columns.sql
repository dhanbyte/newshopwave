-- Add missing columns to vendor_orders table for dropshipper functionality

-- Add shipping_address column (JSONB for flexible address storage)
ALTER TABLE vendor_orders 
ADD COLUMN IF NOT EXISTS shipping_address JSONB;

-- Add items column (JSONB to store order items)
ALTER TABLE vendor_orders 
ADD COLUMN IF NOT EXISTS items JSONB;

-- Add customer_total column (what customer pays)
ALTER TABLE vendor_orders 
ADD COLUMN IF NOT EXISTS customer_total DECIMAL(10,2) DEFAULT 0;

-- Add customer_name for easier tracking
ALTER TABLE vendor_orders 
ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);

-- Add customer_phone for delivery coordination
ALTER TABLE vendor_orders 
ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50);

-- Add payment_method
ALTER TABLE vendor_orders 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'COD';

-- Add notes column for special instructions
ALTER TABLE vendor_orders 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update existing records to have empty items array if null
UPDATE vendor_orders 
SET items = '[]'::jsonb 
WHERE items IS NULL;

-- Update existing records to have empty shipping address if null
UPDATE vendor_orders 
SET shipping_address = '{}'::jsonb 
WHERE shipping_address IS NULL;

COMMENT ON COLUMN vendor_orders.shipping_address IS 'Customer delivery address in JSON format';
COMMENT ON COLUMN vendor_orders.items IS 'Order items array in JSON format';
COMMENT ON COLUMN vendor_orders.customer_total IS 'Total amount customer paid (dropshipper profit = customer_total - vendor_total)';
