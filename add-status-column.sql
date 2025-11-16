-- Add status column to products table if it doesn't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';

-- Update existing products to have 'active' status by default
UPDATE products 
SET status = 'active' 
WHERE status IS NULL OR status = '';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);