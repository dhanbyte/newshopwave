# Wishlist Database Implementation

## ✅ Current Implementation

The wishlist is **already saving to the database** using the `user_data` table in Supabase.

### Database Structure

**Table:** `user_data`
```sql
- id (BIGSERIAL PRIMARY KEY)
- userId (TEXT) - Clerk user ID
- type (TEXT) - 'wishlist', 'cart', 'addresses', etc.
- data (JSONB) - Array of product IDs for wishlist
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- UNIQUE(userId, type)
```

### How It Works

#### 1. **Initialization** (on user login)
```typescript
// src/lib/wishlistStore.tsx
init: (userId: string) => {
  // Loads wishlist from database via API
  fetch(`/api/user-data?userId=${userId}&type=wishlist`)
}
```

#### 2. **Toggle Product** (add/remove from wishlist)
```typescript
toggle: async (userId: string, productId: string) => {
  // Updates local state immediately
  // Saves to database in background
  await fetch('/api/user-data', {
    method: 'POST',
    body: JSON.stringify({ 
      userId, 
      type: 'wishlist', 
      data: newIds // Array of product IDs
    })
  })
}
```

#### 3. **API Endpoints**

**GET** `/api/user-data?userId=xxx&type=wishlist`
- Retrieves wishlist from database
- Returns array of product IDs

**POST** `/api/user-data`
- Saves/updates wishlist to database
- Uses UPSERT (insert or update)

### Data Format

**Stored in database:**
```json
{
  "userId": "user_2xxx",
  "type": "wishlist",
  "data": ["product-123", "product-456", "product-789"]
}
```

## Setup Instructions

### 1. Create Table (if not exists)
Run `create-user-data-table.sql` in Supabase SQL Editor

### 2. Verify Setup
Run `test-wishlist-database.sql` to check:
- ✅ Table exists
- ✅ Correct structure
- ✅ Data is being saved

### 3. Test Wishlist
1. Login as any user (including dropshipper)
2. Click heart icon on any product
3. Check database: `SELECT * FROM user_data WHERE type = 'wishlist'`
4. Should see product IDs in `data` column

## Features

✅ **Persistent Storage** - Wishlist saved across sessions
✅ **Real-time Sync** - Updates immediately on toggle
✅ **User Isolation** - Each user has separate wishlist
✅ **Works for Dropshippers** - No restrictions
✅ **Fallback Support** - Works even if DB temporarily unavailable

## Troubleshooting

### Wishlist not saving?
1. Check Supabase connection in `.env.local`
2. Run `test-wishlist-database.sql` to verify table exists
3. Check browser console for API errors
4. Verify RLS policies allow read/write

### Wishlist empty after login?
1. Check `user_data` table for userId
2. Verify API endpoint returns data
3. Check network tab for `/api/user-data` calls

## Files Involved

- `src/lib/wishlistStore.tsx` - Zustand store
- `src/app/api/user-data/route.ts` - Main API
- `src/app/api/user-wishlist/route.ts` - Dedicated wishlist API
- `src/components/WishlistButton.tsx` - UI component
- `src/components/TopBar.tsx` - Wishlist icon in navbar

## Database Queries

### View all wishlists
```sql
SELECT userId, data, updated_at 
FROM user_data 
WHERE type = 'wishlist';
```

### Check specific user's wishlist
```sql
SELECT data 
FROM user_data 
WHERE userId = 'user_xxx' AND type = 'wishlist';
```

### Count wishlist items per user
```sql
SELECT 
  userId, 
  jsonb_array_length(data) as items_count 
FROM user_data 
WHERE type = 'wishlist';
```