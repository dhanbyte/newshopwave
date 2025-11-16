-- URGENT: Run this SQL in Supabase Dashboard > SQL Editor
-- Copy paste exactly as is:

-- Add missing clerk_user_id column for Clerk integration
ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(100);

-- Add dropshipper columns (already exist but keeping for safety)
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_dropshipper BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_id VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_earnings DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_payment_id VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_status VARCHAR(20) DEFAULT 'inactive';

-- Add complete dropshipper profile fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_photo TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_account_number VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_ifsc VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_bank_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_aadhar_photo TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_aadhar_number VARCHAR(20);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_users_dropshipper ON users(is_dropshipper);
CREATE INDEX IF NOT EXISTS idx_users_dropshipper_id ON users(dropshipper_id);

-- Test query to verify columns exist
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users' AND (column_name LIKE '%dropshipper%' OR column_name = 'clerk_user_id');