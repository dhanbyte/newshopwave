const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
    'https://nczdoszfndzqyhawpahz.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jemRvc3pmbmR6cXloYXdwYWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg0MjExMiwiZXhwIjoyMDc4NDE4MTEyfQ.81BC60TKJtd2abKR1eilZbfHjXktsqSGWw0VLYqXH5E'
);

async function checkOrders() {
    try {
        // Check vendor_orders
        const { data: vendorOrders, error: vendorError } = await supabase
            .from('vendor_orders')
            .select('*')
            .limit(2);

        // Check admin_orders
        const { data: adminOrders, error: adminError } = await supabase
            .from('admin_orders')
            .select('*')
            .limit(2);

        const result = {
            vendor_orders: {
                count: vendorOrders?.length || 0,
                sample: vendorOrders?.[0] || null,
                error: vendorError?.message || null
            },
            admin_orders: {
                count: adminOrders?.length || 0,
                sample: adminOrders?.[0] || null,
                error: adminError?.message || null
            }
        };

        fs.writeFileSync('order_data_check.json', JSON.stringify(result, null, 2));
        console.log('Order data written to order_data_check.json');
    } catch (e) {
        fs.writeFileSync('order_data_check.json', JSON.stringify({ error: e.message }));
    }
}

checkOrders();
