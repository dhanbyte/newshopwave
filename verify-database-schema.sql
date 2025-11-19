-- Run this to check current database schema status
-- Copy and paste in Supabase SQL Editor

-- Check if password column is nullable
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'users' 
AND column_name = 'password';

-- Check if clerk_user_id has unique constraint
SELECT 
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'users' 
AND constraint_name = 'users_clerk_user_id_unique';