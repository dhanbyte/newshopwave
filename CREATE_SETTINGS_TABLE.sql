-- Create Settings Table for storing global configurations
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default values if they don't exist
INSERT INTO settings (key, value) VALUES 
('dropshipper_price', '113'),
('how_it_works_video', 'https://www.youtube.com/watch?v=I-U1NwHyGGI')
ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to settings (we filter sensitive keys in API, but simpler RLS is good too)
CREATE POLICY "Allow public read access" ON settings FOR SELECT USING (true);

-- Allow authenticated admins to update (adjust accordingly if you have specific roles)
-- For now, enabling full access for authenticated users to simplify admin usage
CREATE POLICY "Allow authenticated update" ON settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert" ON settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
