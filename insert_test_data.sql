-- Insert sample vendor with existing table schema
INSERT INTO vendors (email, password, business_name, status) VALUES 
('vendor@test.com', 'password123', 'Test Vendor Store', 'approved')
ON CONFLICT (email) DO NOTHING;

-- Insert sample products for vendor ID 1
INSERT INTO vendor_products (vendor_id, name, price, original_price, description, category, subcategory, status, stock, created_at) VALUES 
(1, 'Sample Product 1', 299.99, 399.99, 'This is a sample product for testing', 'Tech', 'Mobile Accessories', 'active', 50, NOW()),
(1, 'Sample Product 2', 149.50, 199.99, 'Another sample product', 'Home', 'Kitchen Tools', 'active', 25, NOW()),
(1, 'Sample Product 3', 89.99, 129.99, 'Third sample product', 'Tech', 'Headphones', 'active', 30, NOW())
ON CONFLICT DO NOTHING;

-- Insert sample user
INSERT INTO users (email, password, name, referral_code) VALUES 
('user@test.com', 'password123', 'Test User', 'TEST01')
ON CONFLICT (email) DO NOTHING;

-- Insert sample orders
INSERT INTO orders (user_id, items, total_amount, status, created_at) VALUES 
(1, '[{"id":1,"name":"Sample Product 1","price":299.99,"quantity":1}]', 299.99, 'pending', NOW()),
(1, '[{"id":2,"name":"Sample Product 2","price":149.50,"quantity":2}]', 299.00, 'processing', NOW() - INTERVAL '1 day'),
(1, '[{"id":3,"name":"Sample Product 3","price":89.99,"quantity":1}]', 89.99, 'delivered', NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;