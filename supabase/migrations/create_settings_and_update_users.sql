-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on settings (optional, but good practice)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to settings
CREATE POLICY "Allow public read access" ON settings
  FOR SELECT USING (true);

-- Allow admin (service role or authenticated admin) to update settings
-- For simplicity in this script we'll allow all authenticated for now, or you can restrict.
-- Ideally: auth.uid() IN (SELECT id FROM users WHERE is_admin = true)
CREATE POLICY "Allow authenticated update" ON settings
  FOR ALL USING (auth.role() = 'authenticated');


-- Add columns to users table for Regional Admin features
ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_state TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_district TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Notify user to run this in Supabase SQL Editor
