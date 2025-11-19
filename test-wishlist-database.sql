-- Test Wishlist Database Operations
-- Run these queries in Supabase SQL Editor to verify wishlist is working

-- 1. Check if user_data table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'user_data';

-- 2. View table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_data' 
ORDER BY ordinal_position;

-- 3. Check all wishlist entries
SELECT 
  userId,
  type,
  data,
  created_at,
  updated_at
FROM user_data 
WHERE type = 'wishlist'
ORDER BY updated_at DESC;

-- 4. Count total wishlist entries
SELECT COUNT(*) as total_wishlist_users
FROM user_data 
WHERE type = 'wishlist';

-- 5. Check wishlist for a specific user (replace 'user_xxx' with actual userId)
-- SELECT data 
-- FROM user_data 
-- WHERE userId = 'user_xxx' AND type = 'wishlist';

-- 6. View all data types stored
SELECT 
  type,
  COUNT(*) as count
FROM user_data 
GROUP BY type
ORDER BY count DESC;

-- 7. Check recent wishlist updates (last 10)
SELECT 
  userId,
  jsonb_array_length(data) as items_count,
  data,
  updated_at
FROM user_data 
WHERE type = 'wishlist'
ORDER BY updated_at DESC
LIMIT 10;

-- 8. Find users with most wishlist items
SELECT 
  userId,
  jsonb_array_length(data) as wishlist_items_count,
  updated_at
FROM user_data 
WHERE type = 'wishlist' AND data IS NOT NULL
ORDER BY jsonb_array_length(data) DESC
LIMIT 10;