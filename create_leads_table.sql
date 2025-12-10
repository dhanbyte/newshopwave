-- Create a table for dropshipper leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  selling_platforms TEXT NOT NULL,
  market TEXT NOT NULL,
  experience TEXT NOT NULL,
  status TEXT DEFAULT 'New',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policies
-- Allow anyone to insert (public form)
CREATE POLICY "Enable insert for everyone" ON leads FOR INSERT WITH CHECK (true);

-- Allow authenticated users (admins) to select/read
CREATE POLICY "Enable read access for authenticated users only" ON leads FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update (e.g. status)
CREATE POLICY "Enable update for authenticated users only" ON leads FOR UPDATE USING (auth.role() = 'authenticated');
