-- Photo Upload & Cashback System Database Schema
-- Run this in Supabase SQL Editor

-- 1. Create order_photos table
CREATE TABLE IF NOT EXISTS order_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  cashback_amount DECIMAL DEFAULT 50,
  cashback_credited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Add wallet_balance column to users table (if not exists)
ALTER TABLE users ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL DEFAULT 0;

-- 3. Create wallet_transactions table for tracking
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  type TEXT NOT NULL, -- 'credit' or 'debit'
  description TEXT,
  order_id TEXT,
  photo_id UUID REFERENCES order_photos(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create user_notifications table
CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- 'order', 'cashback', 'promo'
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_order_photos_user_id ON order_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_order_photos_order_id ON order_photos(order_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions(user_id);

-- 5. Add invoice_url column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_url TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_uploaded_at TIMESTAMP;

-- 6. Add tracking columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery DATE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_updates JSONB DEFAULT '[]';

-- 7. Enable Row Level Security (RLS)
ALTER TABLE order_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies for order_photos
CREATE POLICY "Users can view their own photos"
  ON order_photos FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own photos"
  ON order_photos FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- 9. Create RLS policies for wallet_transactions
CREATE POLICY "Users can view their own transactions"
  ON wallet_transactions FOR SELECT
  USING (auth.uid()::text = user_id);

-- 10. Create function to credit cashback
CREATE OR REPLACE FUNCTION credit_photo_cashback(
  p_user_id TEXT,
  p_order_id TEXT,
  p_photo_id UUID,
  p_amount DECIMAL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Update user wallet balance
  UPDATE users 
  SET wallet_balance = COALESCE(wallet_balance, 0) + p_amount
  WHERE id = p_user_id;
  
  -- Mark photo cashback as credited
  UPDATE order_photos
  SET cashback_credited = TRUE
  WHERE id = p_photo_id;
  
  -- Create transaction record
  INSERT INTO wallet_transactions (user_id, amount, type, description, order_id, photo_id)
  VALUES (p_user_id, p_amount, 'credit', 'Photo upload cashback', p_order_id, p_photo_id);
  
  -- Create notification for user
  INSERT INTO user_notifications (user_id, title, message, type, metadata)
  VALUES (
    p_user_id, 
    '💰 Cashback Credited!', 
    '₹' || p_amount || ' has been added to your wallet for your photo upload of order #' || p_order_id,
    'cashback',
    jsonb_build_object('order_id', p_order_id, 'amount', p_amount)
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE order_photos IS 'Stores photos uploaded by users for their orders';
COMMENT ON TABLE wallet_transactions IS 'Tracks all wallet credit/debit transactions';
COMMENT ON FUNCTION credit_photo_cashback IS 'Credits cashback to user wallet when photo is uploaded';
