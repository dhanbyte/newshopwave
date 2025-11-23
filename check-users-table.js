const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://nczdoszfndzqyhawpahz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jemRvc3pmbmR6cXloYXdwYWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg0MjExMiwiZXhwIjoyMDc4NDE4MTEyfQ.81BC60TKJtd2abKR1eilZbfHjXktsqSGWw0VLYqXH5E'
);

async function check() {
  try {
    const { data: orders, error } = await supabase
      .from('vendor_orders')
      .select('*')
      .limit(1);

    if (error) {
      fs.writeFileSync('orders_check.json', JSON.stringify({ error: error.message }));
    } else if (orders && orders.length > 0) {
      fs.writeFileSync('orders_check.json', JSON.stringify({
        columns: Object.keys(orders[0]),
        sample_address: orders[0].shipping_address,
        sample_address_type: typeof orders[0].shipping_address
      }, null, 2));
    } else {
      fs.writeFileSync('orders_check.json', JSON.stringify({ message: "No vendor orders found" }));
    }
  } catch (e) {
    fs.writeFileSync('orders_check.json', JSON.stringify({ error: e.message }));
  }
}

check();