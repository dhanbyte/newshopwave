
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOrders() {
  const { data: vendorData, error: vendorError } = await supabase
    .from('vendor_orders')
    .select('*')
    .limit(1);

  if (vendorError) {
    console.error('Error fetching vendor_orders:', vendorError);
  } else {
    console.log('Vendor Order Sample:', JSON.stringify(vendorData, null, 2));
  }

  const { data: ordersData, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .limit(1);

  if (ordersError) {
    console.error('Error fetching orders:', ordersError);
  } else {
    console.log('Regular Order Sample:', JSON.stringify(ordersData, null, 2));
  }
}

checkOrders();
