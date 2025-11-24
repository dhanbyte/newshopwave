-- Create user_data table for storing wishlist, cart, etc.
CREATE TABLE IF NOT EXISTS user_data (
    id BIGSERIAL PRIMARY KEY,
    userId TEXT NOT NULL,
    type TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(userId, type)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_data_userId ON user_data(userId);
CREATE INDEX IF NOT EXISTS idx_user_data_type ON user_data(type);
CREATE INDEX IF NOT EXISTS idx_user_data_userId_type ON user_data(userId, type);

-- Add RLS policies
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own data" ON user_data
    FOR SELECT USING (auth.uid()::text = userId);

CREATE POLICY "Users can insert own data" ON user_data
    FOR INSERT WITH CHECK (auth.uid()::text = userId);

CREATE POLICY "Users can update own data" ON user_data
    FOR UPDATE USING (auth.uid()::text = userId);

-- Service role can do everything
CREATE POLICY "Service role full access" ON user_data
    FOR ALL USING (true);
