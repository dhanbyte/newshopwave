-- FINAL FIX - Make password nullable
-- Copy paste this EXACTLY in Supabase SQL Editor

-- Step 1: Check current state
DO $$
DECLARE
  is_null TEXT;
BEGIN
  SELECT is_nullable INTO is_null
  FROM information_schema.columns
  WHERE table_name = 'users' AND column_name = 'password';
  
  RAISE NOTICE 'Password column is_nullable: %', is_null;
END $$;

-- Step 2: Make password nullable
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- Step 3: Verify it worked
DO $$
DECLARE
  is_null TEXT;
BEGIN
  SELECT is_nullable INTO is_null
  FROM information_schema.columns
  WHERE table_name = 'users' AND column_name = 'password';
  
  IF is_null = 'YES' THEN
    RAISE NOTICE '✅ SUCCESS: Password column is now nullable';
  ELSE
    RAISE NOTICE '❌ FAILED: Password column is still NOT NULL';
  END IF;
END $$;