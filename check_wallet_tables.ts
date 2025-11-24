
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('Checking for wallet related tables...');
  
  // Check for wallet_transactions table
  const { data: transactions, error: txError } = await supabase
    .from('wallet_transactions')
    .select('*')
    .limit(1);

  if (txError) {
    console.error('Error checking wallet_transactions:', txError.message);
  } else {
    console.error('wallet_transactions table exists. Sample:', transactions);
  }

  // Check withdrawals table
  const { data: withdrawals, error: wError } = await supabase
    .from('withdrawals')
    .select('*')
    .limit(1);

  if (wError) {
    console.error('Error checking withdrawals:', wError.message);
  } else {
    console.error('withdrawals table exists. Sample:', withdrawals);
  }
}

checkTables();
