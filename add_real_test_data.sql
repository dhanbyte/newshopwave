-- Add real vendor products for vendor ID 1 (using existing table schema)
INSERT INTO vendor_products (vendor_id, name, price, description, category, subcategory, status) VALUES 
(1, 'Premium Wireless Headphones', 2999.99, 'High-quality wireless headphones with noise cancellation', 'Tech', 'Headphones', 'active'),
(1, 'Smart Water Bottle', 899.99, 'Temperature tracking smart water bottle', 'Home', 'Water Bottles', 'active'),
(1, 'Bluetooth Speaker', 1599.99, 'Portable bluetooth speaker with bass boost', 'Tech', 'Speakers', 'active'),
(1, 'Kitchen Storage Set', 1299.99, '5-piece airtight kitchen storage containers', 'Home', 'Kitchen Storage & Container', 'active'),
(1, 'Mobile Phone Stand', 499.99, 'Adjustable aluminum mobile phone stand', 'Tech', 'Mobile Accessories', 'active')
ON CONFLICT DO NOTHING;

-- Add real products to main products table
INSERT INTO products (name, price, original_price, description, category, subcategory, image, quantity, slug) VALUES 
('Gaming Mechanical Keyboard', 4999.99, 6999.99, 'RGB backlit mechanical gaming keyboard', 'Tech', 'Keyboard & Mouse', 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', 20, 'gaming-mechanical-keyboard'),
('Stainless Steel Water Jug', 799.99, 1099.99, '2L stainless steel water jug with handle', 'Home', 'Water Jugs', 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400', 35, 'stainless-steel-water-jug'),
('Wireless Mouse', 1299.99, 1799.99, 'Ergonomic wireless mouse with precision tracking', 'Tech', 'Keyboard & Mouse', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', 45, 'wireless-mouse')
ON CONFLICT DO NOTHING;

-- Add some real orders for testing
INSERT INTO orders (user_id, items, total_amount, status, created_at) VALUES 
(1, '[{"id":1,"name":"Premium Wireless Headphones","price":2999.99,"quantity":1}]', 2999.99, 'pending', NOW()),
(1, '[{"id":2,"name":"Smart Water Bottle","price":899.99,"quantity":2}]', 1799.98, 'processing', NOW() - INTERVAL '1 day'),
(1, '[{"id":3,"name":"Bluetooth Speaker","price":1599.99,"quantity":1}]', 1599.99, 'shipped', NOW() - INTERVAL '2 days'),
(1, '[{"id":4,"name":"Kitchen Storage Set","price":1299.99,"quantity":1}]', 1299.99, 'delivered', NOW() - INTERVAL '5 days')
ON CONFLICT DO NOTHING;

-- Add vendor orders for dashboard
INSERT INTO vendor_orders (vendor_id, order_id, status, vendor_total, customer_email, created_at) VALUES 
(1, 'ORD2025001', 'pending', 2999.99, 'customer1@example.com', NOW()),
(1, 'ORD2025002', 'processing', 1799.98, 'customer2@example.com', NOW() - INTERVAL '1 day'),
(1, 'ORD2025003', 'shipped', 1599.99, 'customer3@example.com', NOW() - INTERVAL '2 days'),
(1, 'ORD2025004', 'delivered', 1299.99, 'customer4@example.com', NOW() - INTERVAL '5 days')
ON CONFLICT DO NOTHING;

-- Add vendor notifications
INSERT INTO vendor_notifications (vendor_id, title, message, read, created_at) VALUES 
(1, 'New Order Received!', 'You have received a new order #ORD2025001 worth ₹2,999.99', false, NOW()),
(1, 'Product Stock Low', 'Your product "Premium Wireless Headphones" is running low on stock (25 remaining)', false, NOW() - INTERVAL '2 hours'),
(1, 'Order Shipped', 'Order #ORD2025003 has been marked as shipped', true, NOW() - INTERVAL '2 days'),
(1, 'Welcome to ShopWave!', 'Your vendor account is now active. Start selling your products!', true, NOW() - INTERVAL '1 week')
ON CONFLICT DO NOTHING;

-- Add user cart data
INSERT INTO user_data (user_id, type, data) VALUES 
('test-user', 'cart', '[{"id":1,"name":"Gaming Mechanical Keyboard","price":4999.99,"quantity":1,"image":"https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400"}]'),
('test-user', 'wishlist', '[{"id":2,"name":"Stainless Steel Water Jug","price":799.99,"image":"https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400"}]')
ON CONFLICT (user_id, type) DO UPDATE SET data = EXCLUDED.data;