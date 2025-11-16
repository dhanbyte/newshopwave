-- Add minimal vendor products (only required fields)
INSERT INTO vendor_products (vendor_id, name, price) VALUES 
(1, 'Premium Wireless Headphones', 2999.99),
(1, 'Smart Water Bottle', 899.99),
(1, 'Bluetooth Speaker', 1599.99),
(1, 'Kitchen Storage Set', 1299.99),
(1, 'Mobile Phone Stand', 499.99)
ON CONFLICT DO NOTHING;

-- Add vendor orders
INSERT INTO vendor_orders (vendor_id, order_id, status, vendor_total, customer_email) VALUES 
(1, 'ORD2025001', 'pending', 2999.99, 'customer1@example.com'),
(1, 'ORD2025002', 'processing', 1799.98, 'customer2@example.com'),
(1, 'ORD2025003', 'shipped', 1599.99, 'customer3@example.com'),
(1, 'ORD2025004', 'delivered', 1299.99, 'customer4@example.com')
ON CONFLICT DO NOTHING;

-- Add vendor notifications
INSERT INTO vendor_notifications (vendor_id, title, message) VALUES 
(1, 'New Order Received!', 'You have received a new order worth ₹2,999.99'),
(1, 'Product Stock Low', 'Your product stock is running low'),
(1, 'Order Shipped', 'Order has been marked as shipped')
ON CONFLICT DO NOTHING;