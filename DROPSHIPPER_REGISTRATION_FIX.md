# Dropshipper Registration Fix

## Problems Fixed

### Issue 1: ON CONFLICT Error
```
Failed to create/update user record: there is no unique or 
exclusion constraint matching the ON CONFLICT specification
```
**Cause:** `clerk_user_id` column lacked UNIQUE constraint

### Issue 2: Password NOT NULL Error  
```
null value in column "password" of relation "users" violates not-null constraint
```
**Cause:** Old schema required password, but Clerk authentication doesn't use passwords

## Solution

### Step 1: Run Complete Database Migration

**IMPORTANT:** Run this SQL in your Supabase Dashboard → SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor**
4. Create a new query
5. Copy and paste the contents of `fix-dropshipper-registration-complete.sql`
6. Click **Run**

The migration will:
- ✅ Make `password` column nullable (for Clerk users)
- ✅ Handle any duplicate `clerk_user_id` values
- ✅ Add UNIQUE constraint to `clerk_user_id`
- ✅ Create indexes for faster lookups
- ✅ Verify all constraints were added successfully

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
- Made `password` column nullable (Clerk handles authentication)
- Added UNIQUE constraint to `clerk_user_id` column
- Created performance indexes
- This allows proper upsert operations for Clerk users

### API Code (`src/app/api/dropshipper/register/route.ts`)
- Added `password: null` to dropshipper data
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

If you need to rollback the changes:

```sql
-- Remove unique constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_clerk_user_id_unique;

-- Make password required again (NOT recommended if using Clerk)
ALTER TABLE users ALTER COLUMN password SET NOT NULL;
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