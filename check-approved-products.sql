-- Check all vendor products and their status
SELECT 
  id,
  name,
  status,
  price,
  stock,
  created_at,
  updated_at
FROM vendor_products 
ORDER BY updated_at DESC;

-- Count products by status
SELECT 
  status,
  COUNT(*) as count
FROM vendor_products 
GROUP BY status;

-- Check if there are any active products
SELECT COUNT(*) as active_products_count 
FROM vendor_products 
WHERE status = 'active';