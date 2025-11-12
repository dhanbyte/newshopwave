import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export { supabase as getDatabase };

export const collections = {
  users: 'users',
  referrals: 'referrals',
  withdrawals: 'withdrawals',
  referralEarnings: 'referral_earnings'
};
