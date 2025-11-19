# Dropshipper Registration Fix

## Problem
After successful payment, dropshipper registration was failing with error:
```
Failed to create/update user record: there is no unique or 
exclusion constraint matching the ON CONFLICT specification
```

## Root Cause
The `clerk_user_id` column in the `users` table did not have a UNIQUE constraint, causing the upsert operation to fail.

## Solution

### Step 1: Run Database Migration

**IMPORTANT:** Run this SQL in your Supabase Dashboard → SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor**
4. Create a new query
5. Copy and paste the contents of `fix-clerk-user-id-unique-constraint.sql`
6. Click **Run**

The migration will:
- ✅ Handle any duplicate `clerk_user_id` values
- ✅ Add UNIQUE constraint to `clerk_user_id`
- ✅ Create index for faster lookups
- ✅ Verify the constraint was added successfully

### Step 2: Verify the Fix

After running the migration, verify it worked:

```sql
-- Check if constraint exists
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'users' 
AND constraint_name = 'users_clerk_user_id_unique';
```

Expected output:
```
constraint_name              | constraint_type
----------------------------|----------------
users_clerk_user_id_unique  | UNIQUE
```

### Step 3: Test Registration Flow

1. Go to your dropshipper registration page
2. Complete the payment process
3. Registration should now succeed without errors

## What Changed

### Database Schema
- Added UNIQUE constraint to `clerk_user_id` column
- This allows proper upsert operations

### API Code (`src/app/api/dropshipper/register/route.ts`)
- Improved error handling for duplicate key violations
- Falls back to upsert if insert fails due to duplicates
- Better logging for debugging

## Verification Checklist

- [ ] SQL migration executed successfully
- [ ] UNIQUE constraint verified in database
- [ ] Test payment → registration flow works
- [ ] No duplicate user records created
- [ ] Error messages are clear and helpful

## Rollback (if needed)

If you need to rollback the constraint:

```sql
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_clerk_user_id_unique;
```

## Support

If you encounter any issues:
1. Check Supabase logs for detailed error messages
2. Verify the constraint exists using the verification query
3. Check for any duplicate `clerk_user_id` values:
   ```sql
   SELECT clerk_user_id, COUNT(*) 
   FROM users 
   WHERE clerk_user_id IS NOT NULL 
   GROUP BY clerk_user_id 
   HAVING COUNT(*) > 1;
   ```