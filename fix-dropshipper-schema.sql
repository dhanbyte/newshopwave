-- Fix Dropshipper Schema Migration
-- This script ensures the users table has all necessary dropshipper fields
-- and creates proper indexes for performance

-- Add dropshipper fields if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_dropshipper BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_id VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_earnings DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_payment_id VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_status VARCHAR(20) DEFAULT 'inactive';
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_account_number VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_ifsc VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_bank_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_aadhar_number VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_photo TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_aadhar_photo TEXT;

-- Add clerk_user_id if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_users_is_dropshipper ON users(is_dropshipper);
CREATE INDEX IF NOT EXISTS idx_users_dropshipper_id ON users(dropshipper_id);
CREATE INDEX IF NOT EXISTS idx_users_dropshipper_status ON users(dropshipper_status);
CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON users(clerk_user_id);

-- Create composite index for admin queries
CREATE INDEX IF NOT EXISTS idx_users_dropshipper_composite 
ON users(is_dropshipper, dropshipper_status) 
WHERE is_dropshipper = true;

-- Ensure email index exists
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Update any null dropshipper_status to 'inactive' for existing dropshippers
UPDATE users 
SET dropshipper_status = 'inactive' 
WHERE is_dropshipper = true 
AND dropshipper_status IS NULL;

-- Update any null dropshipper_earnings to 0
UPDATE users 
SET dropshipper_earnings = 0.00 
WHERE is_dropshipper = true 
AND dropshipper_earnings IS NULL;

-- Verify the schema
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name LIKE '%dropshipper%'
ORDER BY column_name;