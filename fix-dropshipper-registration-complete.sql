-- Complete fix for dropshipper registration issues
-- Run this in Supabase Dashboard > SQL Editor

-- Step 1: Make password column nullable (for Clerk authentication)
-- This allows users authenticated via Clerk to not have a password
ALTER TABLE users 
ALTER COLUMN password DROP NOT NULL;

-- Step 2: Handle any duplicate clerk_user_id values before adding constraint
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

-- Step 3: Add UNIQUE constraint to clerk_user_id (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'users_clerk_user_id_unique' 
    AND table_name = 'users'
  ) THEN
    ALTER TABLE users 
    ADD CONSTRAINT users_clerk_user_id_unique 
    UNIQUE (clerk_user_id);
  END IF;
END $$;

-- Step 4: Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_dropshipper ON users(is_dropshipper) WHERE is_dropshipper = true;

-- Step 5: Verify all constraints
SELECT 
  constraint_name, 
  constraint_type,
  column_name
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.constraint_column_usage ccu 
  ON tc.constraint_name = ccu.constraint_name
WHERE tc.table_name = 'users' 
AND tc.constraint_type IN ('UNIQUE', 'PRIMARY KEY')
ORDER BY constraint_type, constraint_name;

-- Step 6: Verify password column is now nullable
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'users' 
AND column_name IN ('password', 'clerk_user_id', 'email')
ORDER BY column_name;