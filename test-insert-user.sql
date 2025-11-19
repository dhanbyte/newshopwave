-- Test if we can insert a user without password
-- Run this in Supabase SQL Editor to test

-- First check current schema
SELECT 
  column_name,
  is_nullable,
  data_type
FROM information_schema.columns
WHERE table_name = 'users' 
AND column_name IN ('password', 'clerk_user_id', 'email');

-- Try to insert a test user without password
INSERT INTO users (
  clerk_user_id,
  email,
  name,
  password
) VALUES (
  'test_clerk_123',
  'test@example.com',
  'Test User',
  NULL  -- Testing if NULL is allowed
)
ON CONFLICT (clerk_user_id) DO NOTHING;

-- Check if insert worked
SELECT clerk_user_id, email, name, password 
FROM users 
WHERE clerk_user_id = 'test_clerk_123';

-- Clean up test data
DELETE FROM users WHERE clerk_user_id = 'test_clerk_123';