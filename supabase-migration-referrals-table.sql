-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id VARCHAR(255) NOT NULL,
  referrer_email VARCHAR(255) NOT NULL,
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  referred_user_id VARCHAR(255),
  referred_email VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, rewarded
  reward_amount DECIMAL(10, 2) DEFAULT 0,
  order_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  rewarded_at TIMESTAMP WITH TIME ZONE
);

-- Create referral stats table for quick lookups
CREATE TABLE IF NOT EXISTS referral_stats (
  user_id VARCHAR(255) PRIMARY KEY,
  total_referrals INTEGER DEFAULT 0,
  successful_referrals INTEGER DEFAULT 0,
  total_earned DECIMAL(10, 2) DEFAULT 0,
  pending_rewards DECIMAL(10, 2) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);

-- Function to update referral stats
CREATE OR REPLACE FUNCTION update_referral_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert stats for referrer
  INSERT INTO referral_stats (user_id, total_referrals, successful_referrals, total_earned, pending_rewards)
  SELECT 
    NEW.referrer_id,
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'completed'),
    COALESCE(SUM(reward_amount) FILTER (WHERE status = 'rewarded'), 0),
    COALESCE(SUM(reward_amount) FILTER (WHERE status = 'completed'), 0)
  FROM referrals
  WHERE referrer_id = NEW.referrer_id
  ON CONFLICT (user_id) 
  DO UPDATE SET
    total_referrals = EXCLUDED.total_referrals,
    successful_referrals = EXCLUDED.successful_referrals,
    total_earned = EXCLUDED.total_earned,
    pending_rewards = EXCLUDED.pending_rewards,
    updated_at = NOW();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for stats update
DROP TRIGGER IF EXISTS trigger_update_referral_stats ON referrals;
CREATE TRIGGER trigger_update_referral_stats
AFTER INSERT OR UPDATE ON referrals
FOR EACH ROW
EXECUTE FUNCTION update_referral_stats();

-- Add comments
COMMENT ON TABLE referrals IS 'Tracks referral relationships and rewards';
COMMENT ON TABLE referral_stats IS 'Aggregated referral statistics per user';