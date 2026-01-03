require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
    try {
        const { data, error } = await supabase.from('products').select('name, price, original_price').limit(20);
        if (error) throw error;
        console.log('Sample Products:', JSON.stringify(data, null, 2));

        const { data: vendorData, error: vError } = await supabase.from('vendor_products').select('name, price, original_price').limit(20);
        if (vError) throw vError;
        console.log('Sample Vendor Products:', JSON.stringify(vendorData, null, 2));
    } catch (e) {
        console.error(e);
    }
}

check();
