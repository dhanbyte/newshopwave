-- Add dropshipper fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_dropshipper BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_id VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_earnings DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_payment_id VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_status VARCHAR(20) DEFAULT 'inactive';

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_users_dropshipper ON users(is_dropshipper);
CREATE INDEX IF NOT EXISTS idx_users_dropshipper_id ON users(dropshipper_id);