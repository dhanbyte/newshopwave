-- Simple fix: Make password column nullable
-- This is the critical fix needed right now

-- Make password nullable for Clerk authentication
ALTER TABLE users 
ALTER COLUMN password DROP NOT NULL;

-- Verify it worked
SELECT 
  column_name,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'users' 
AND column_name = 'password';