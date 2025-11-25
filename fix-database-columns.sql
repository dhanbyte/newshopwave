-- SQL Script to check and fix missing columns in users table
-- Run this in your Supabase SQL Editor

-- 1. Check if all required columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN (
  'is_dropshipper',
  'dropshipper_status',
  'dropshipper_plan_id',
  'dropshipper_plan_interval',
  'dropshipper_subscription_start',
  'dropshipper_subscription_end',
  'dropshipper_payment_id',
  'updated_at'
)
ORDER BY column_name;

-- 2. If any columns are missing, add them:

-- Add is_dropshipper column (if missing)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_dropshipper BOOLEAN DEFAULT FALSE;

-- Add dropshipper_status column (if missing)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS dropshipper_status TEXT DEFAULT 'inactive';

-- Add dropshipper_plan_id column (if missing)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS dropshipper_plan_id TEXT;

-- Add dropshipper_plan_interval column (if missing)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS dropshipper_plan_interval TEXT;

-- Add dropshipper_subscription_start column (if missing)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS dropshipper_subscription_start TIMESTAMP WITH TIME ZONE;

-- Add dropshipper_subscription_end column (if missing)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS dropshipper_subscription_end TIMESTAMP WITH TIME ZONE;

-- Add dropshipper_payment_id column (if missing)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS dropshipper_payment_id TEXT;

-- Add updated_at column (if missing)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
