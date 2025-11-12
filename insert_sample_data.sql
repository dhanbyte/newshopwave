-- Insert sample notifications for vendor ID 1 (if exists)
INSERT INTO vendor_notifications (vendor_id, title, message, read, created_at) VALUES
(1, 'Welcome to ShopWave!', 'Your vendor account has been successfully created. Start adding products to begin selling.', false, NOW()),
(1, 'Product Approved', 'Your product "Sample Product" has been approved and is now live on the marketplace.', false, NOW() - INTERVAL '1 day'),
(1, 'New Order Received', 'You have received a new order #ORD001. Please process it within 24 hours.', true, NOW() - INTERVAL '2 days');

-- Insert sample orders for vendor ID 1 (if exists)
INSERT INTO vendor_orders (vendor_id, order_id, status, vendor_total, total, customer_email, created_at) VALUES
(1, 'ORD001', 'pending', 299.99, 299.99, 'customer@example.com', NOW()),
(1, 'ORD002', 'processing', 149.50, 149.50, 'buyer@example.com', NOW() - INTERVAL '1 day'),
(1, 'ORD003', 'shipped', 89.99, 89.99, 'user@example.com', NOW() - INTERVAL '3 days'),
(1, 'ORD004', 'delivered', 199.99, 199.99, 'customer2@example.com', NOW() - INTERVAL '1 week');