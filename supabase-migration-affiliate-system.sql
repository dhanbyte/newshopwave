-- Create affiliate commissions table
CREATE TABLE IF NOT EXISTS affiliate_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_user_id VARCHAR(255) NOT NULL,
  affiliate_email VARCHAR(255) NOT NULL,
  referred_user_id VARCHAR(255) NOT NULL,
  referred_email VARCHAR(255),
  order_id VARCHAR(255) NOT NULL,
  order_amount DECIMAL(10, 2) NOT NULL,
  commission_rate DECIMAL(5, 2) DEFAULT 10.00,
  commission_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, paid, cancelled
  product_details JSONB,
  approved_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create affiliate earnings summary table
CREATE TABLE IF NOT EXISTS affiliate_earnings (
  user_id VARCHAR(255) PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  total_referrals INTEGER DEFAULT 0,
  active_referrals INTEGER DEFAULT 0,
  total_orders_from_referrals INTEGER DEFAULT 0,
  total_commission_earned DECIMAL(10, 2) DEFAULT 0,
  pending_commission DECIMAL(10, 2) DEFAULT 0,
  approved_commission DECIMAL(10, 2) DEFAULT 0,
  paid_commission DECIMAL(10, 2) DEFAULT 0,
  current_tier VARCHAR(50) DEFAULT 'Bronze',
  commission_rate DECIMAL(5, 2) DEFAULT 10.00,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create affiliate withdrawals table
CREATE TABLE IF NOT EXISTS affiliate_withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL, -- upi, bank, wallet
  payment_details JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_commissions_affiliate ON affiliate_commissions(affiliate_user_id);
CREATE INDEX IF NOT EXISTS idx_commissions_referred ON affiliate_commissions(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_commissions_order ON affiliate_commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON affiliate_commissions(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user ON affiliate_withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON affiliate_withdrawals(status);

-- Function to update affiliate earnings
CREATE OR REPLACE FUNCTION update_affiliate_earnings()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert earnings summary
  INSERT INTO affiliate_earnings (
    user_id,
    user_email,
    total_referrals,
    active_referrals,
    total_orders_from_referrals,
    total_commission_earned,
    pending_commission,
    approved_commission,
    paid_commission
  )
  SELECT 
    NEW.affiliate_user_id,
    NEW.affiliate_email,
    COUNT(DISTINCT referred_user_id),
    COUNT(DISTINCT referred_user_id) FILTER (WHERE status != 'cancelled'),
    COUNT(*),
    COALESCE(SUM(commission_amount), 0),
    COALESCE(SUM(commission_amount) FILTER (WHERE status = 'pending'), 0),
    COALESCE(SUM(commission_amount) FILTER (WHERE status = 'approved'), 0),
    COALESCE(SUM(commission_amount) FILTER (WHERE status = 'paid'), 0)
  FROM affiliate_commissions
  WHERE affiliate_user_id = NEW.affiliate_user_id
  ON CONFLICT (user_id) 
  DO UPDATE SET
    total_referrals = EXCLUDED.total_referrals,
    active_referrals = EXCLUDED.active_referrals,
    total_orders_from_referrals = EXCLUDED.total_orders_from_referrals,
    total_commission_earned = EXCLUDED.total_commission_earned,
    pending_commission = EXCLUDED.pending_commission,
    approved_commission = EXCLUDED.approved_commission,
    paid_commission = EXCLUDED.paid_commission,
    updated_at = NOW();
    
  -- Update tier based on total referrals
  UPDATE affiliate_earnings
  SET 
    current_tier = CASE
      WHEN total_referrals >= 51 THEN 'Platinum'
      WHEN total_referrals >= 26 THEN 'Gold'
      WHEN total_referrals >= 11 THEN 'Silver'
      ELSE 'Bronze'
    END,
    commission_rate = CASE
      WHEN total_referrals >= 51 THEN 20.00
      WHEN total_referrals >= 26 THEN 15.00
      WHEN total_referrals >= 11 THEN 12.00
      ELSE 10.00
    END
  WHERE user_id = NEW.affiliate_user_id;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for earnings update
DROP TRIGGER IF EXISTS trigger_update_affiliate_earnings ON affiliate_commissions;
CREATE TRIGGER trigger_update_affiliate_earnings
AFTER INSERT OR UPDATE ON affiliate_commissions
FOR EACH ROW
EXECUTE FUNCTION update_affiliate_earnings();

-- Add comments
COMMENT ON TABLE affiliate_commissions IS 'Tracks commission earned on each referred purchase';
COMMENT ON TABLE affiliate_earnings IS 'Aggregated earnings and stats per affiliate user';
COMMENT ON TABLE affiliate_withdrawals IS 'Withdrawal requests and payment history';
COMMENT ON COLUMN affiliate_earnings.current_tier IS 'Bronze/Silver/Gold/Platinum based on referral count';
COMMENT ON COLUMN affiliate_earnings.commission_rate IS 'Current commission rate: 10%/12%/15%/20%';