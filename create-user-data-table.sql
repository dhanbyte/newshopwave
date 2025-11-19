-- Migration: Create user_data table for storing wishlist, cart, addresses, etc.
-- This table stores all user-related data in a flexible JSONB format

-- Create user_data table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_data (
  id BIGSERIAL PRIMARY KEY,
  userId TEXT NOT NULL,
  type TEXT NOT NULL,
  data JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(userId, type)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_data_userId ON user_data(userId);
CREATE INDEX IF NOT EXISTS idx_user_data_type ON user_data(type);
CREATE INDEX IF NOT EXISTS idx_user_data_userId_type ON user_data(userId, type);

-- Enable Row Level Security (RLS)
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY IF NOT EXISTS "Users can view their own data"
  ON user_data
  FOR SELECT
  USING (true); -- Allow all reads for now, can be restricted later

-- Create policy to allow users to insert their own data
CREATE POLICY IF NOT EXISTS "Users can insert their own data"
  ON user_data
  FOR INSERT
  WITH CHECK (true); -- Allow all inserts for now

-- Create policy to allow users to update their own data
CREATE POLICY IF NOT EXISTS "Users can update their own data"
  ON user_data
  FOR UPDATE
  USING (true); -- Allow all updates for now

-- Create policy to allow users to delete their own data
CREATE POLICY IF NOT EXISTS "Users can delete their own data"
  ON user_data
  FOR DELETE
  USING (true); -- Allow all deletes for now

-- Add comment to table
COMMENT ON TABLE user_data IS 'Stores user-specific data like wishlist, cart, addresses in JSONB format';
COMMENT ON COLUMN user_data.userId IS 'Clerk user ID or custom user identifier';
COMMENT ON COLUMN user_data.type IS 'Type of data: wishlist, cart, addresses, orders, referrals, coins, scratchCards, usedSpins';
COMMENT ON COLUMN user_data.data IS 'JSONB data - array of product IDs for wishlist, array of cart items, etc.';

-- Verify table creation
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_data' 
ORDER BY ordinal_position;