-- Fix for dropshipper registration error
-- This adds UNIQUE constraint to clerk_user_id column

-- Step 1: Check for any duplicate clerk_user_id values before adding constraint
DO $$
BEGIN
  -- If duplicates exist, keep the first one and nullify others
  UPDATE users u1
  SET clerk_user_id = NULL
  WHERE clerk_user_id IN (
    SELECT clerk_user_id
    FROM users
    WHERE clerk_user_id IS NOT NULL
    GROUP BY clerk_user_id
    HAVING COUNT(*) > 1
  )
  AND id NOT IN (
    SELECT MIN(id)
    FROM users
    WHERE clerk_user_id IS NOT NULL
    GROUP BY clerk_user_id
  );
END $$;

-- Step 2: Add UNIQUE constraint to clerk_user_id
ALTER TABLE users 
ADD CONSTRAINT users_clerk_user_id_unique 
UNIQUE (clerk_user_id);

-- Step 3: Create index for faster lookups (if not exists)
CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON users(clerk_user_id);

-- Step 4: Verify the constraint was added
SELECT 
  constraint_name, 
  constraint_type,
  table_name
FROM information_schema.table_constraints 
WHERE table_name = 'users' 
AND constraint_name = 'users_clerk_user_id_unique';

-- Step 5: Show all unique constraints on users table
SELECT 
  constraint_name, 
  column_name
FROM information_schema.constraint_column_usage 
WHERE table_name = 'users' 
AND constraint_name IN (
  SELECT constraint_name 
  FROM information_schema.table_constraints 
  WHERE table_name = 'users' 
  AND constraint_type = 'UNIQUE'
)
ORDER BY constraint_name;