# Wishlist Fix - Database Setup Required

## Problem
Wishlist products are not saving because the `user_data` table doesn't exist in Supabase.

## Solution
Run the SQL migration to create the required table.

## Setup Instructions

### Run SQL Migration

Go to your **Supabase Dashboard** → **SQL Editor** and run:

```sql
-- Create user_data table for storing wishlist, cart, etc.
CREATE TABLE IF NOT EXISTS user_data (
    id BIGSERIAL PRIMARY KEY,
    userId TEXT NOT NULL,
    type TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(userId, type)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_data_userId ON user_data(userId);
CREATE INDEX IF NOT EXISTS idx_user_data_type ON user_data(type);
CREATE INDEX IF NOT EXISTS idx_user_data_userId_type ON user_data(userId, type);

-- Enable RLS
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can view own data" ON user_data
    FOR SELECT USING (auth.uid()::text = userId);

CREATE POLICY "Users can insert own data" ON user_data
    FOR INSERT WITH CHECK (auth.uid()::text = userId);

CREATE POLICY "Users can update own data" ON user_data
    FOR UPDATE USING (auth.uid()::text = userId);

CREATE POLICY "Service role full access" ON user_data
    FOR ALL USING (true);
```

**File:** `create_user_data_table.sql`

## What This Table Stores

The `user_data` table stores various user-specific data:

- **Wishlist** - Saved products
- **Cart** - Shopping cart items (backup)
- **Addresses** - User addresses
- **Referrals** - Referral data
- **Other user preferences**

## How It Works

### Data Structure:
```json
{
  "userId": "user_123",
  "type": "wishlist",
  "data": ["product_1", "product_2", "product_3"]
}
```

### Types:
- `wishlist` - Array of product IDs
- `cart` - Array of cart items
- `addresses` - Array of address objects
- `orders` - Array of order IDs
- `referrals` - Referral information

## Testing

After running the migration:

1. **Test Wishlist:**
   - Go to any product page
   - Click the heart icon
   - Check if it turns red (saved)
   - Go to `/wishlist` page
   - Product should appear there

2. **Verify Database:**
   - Go to Supabase → Table Editor
   - Open `user_data` table
   - You should see a row with:
     - `userId`: Your user ID
     - `type`: "wishlist"
     - `data`: Array of product IDs

## Benefits

✅ **Persistent Storage**: Wishlist saved across sessions
✅ **Multi-Device Sync**: Same wishlist on all devices
✅ **Fast Performance**: Indexed queries
✅ **Secure**: Row Level Security enabled
✅ **Scalable**: Can store any user data type

## Troubleshooting

### Wishlist Still Not Working?

1. **Check Console**: Open browser DevTools → Console
2. **Look for errors** like:
   - "relation user_data does not exist" → Run migration
   - "permission denied" → Check RLS policies
   - "userId is null" → User not logged in

3. **Verify Migration**:
   ```sql
   SELECT * FROM user_data LIMIT 5;
   ```

4. **Test API Directly**:
   - Open: `/api/user-data?userId=YOUR_USER_ID&type=wishlist`
   - Should return: `[]` or array of product IDs

### Common Issues:

**Issue**: Heart icon doesn't change color
**Fix**: User needs to be logged in

**Issue**: Products disappear after refresh
**Fix**: Run the SQL migration

**Issue**: "Failed to save" error
**Fix**: Check Supabase service role key in `.env.local`

## All Required Migrations

Make sure you've run ALL these migrations:

1. ✅ `create_wallet_transactions_table.sql` - Wallet history
2. ✅ `add_tracking_id_column.sql` - Tracking IDs
3. ✅ `create_user_data_table.sql` - **Wishlist (THIS ONE)**

## Next Steps

After fixing wishlist:
1. Test cart functionality
2. Test addresses
3. Verify all user data is persisting
