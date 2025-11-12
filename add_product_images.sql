-- Add images to existing vendor products
UPDATE vendor_products SET 
  images = CASE 
    WHEN name LIKE '%Headphones%' THEN '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"]'
    WHEN name LIKE '%Water Bottle%' THEN '["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400"]'
    WHEN name LIKE '%Speaker%' THEN '["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400"]'
    WHEN name LIKE '%Storage%' THEN '["https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400"]'
    WHEN name LIKE '%Phone Stand%' THEN '["https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400"]'
    ELSE '["https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=' || REPLACE(name, ' ', '+') || '"]'
  END
WHERE vendor_id = 1;