-- Check if products have images
SELECT 
  id,
  name,
  images,
  CASE 
    WHEN images IS NULL THEN 'NULL'
    WHEN images = '[]'::jsonb THEN 'Empty Array'
    WHEN jsonb_array_length(images) = 0 THEN 'Zero Length'
    ELSE 'Has Images (' || jsonb_array_length(images) || ')'
  END as image_status
FROM vendor_products 
ORDER BY id;