-- MINIMAL MIGRATION - Only add missing columns
-- This won't give errors if some things already exist

-- Part 1: CRITICAL - Add payment_id column (MUST for orders to work)
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS payment_id TEXT;
CREATE INDEX IF NOT EXISTS idx_admin_orders_payment_id ON admin_orders(payment_id);

-- Part 2: Add tracking_id columns
ALTER TABLE admin_orders ADD COLUMN IF NOT EXISTS tracking_id TEXT;
CREATE INDEX IF NOT EXISTS idx_admin_orders_tracking_id ON admin_orders(tracking_id);

ALTER TABLE vendor_orders ADD COLUMN IF NOT EXISTS tracking_id TEXT;
CREATE INDEX IF NOT EXISTS idx_vendor_orders_tracking_id ON vendor_orders(tracking_id);

-- Part 3: User data table (skip if exists, skip policies if they exist)
CREATE TABLE IF NOT EXISTS user_data (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, type)
);

-- Indexes (safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id);
CREATE INDEX IF NOT EXISTS idx_user_data_type ON user_data(type);

-- Enable RLS (safe if already enabled)
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Part 4: Wallet transactions table (skip if exists)
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
    description TEXT NOT NULL,
    reference_id TEXT,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes (safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions(created_at DESC);

-- Enable RLS (safe if already enabled)
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- NOTE: Policies are skipped because they already exist
-- If you need to recreate them, first DROP them manually:
-- DROP POLICY IF EXISTS "Users can view own data" ON user_data;
-- Then create again
