-- Copy ONLY the code below (do not include any backticks or other text)

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

-- Enable security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit the form
CREATE POLICY "Enable insert for everyone" ON leads FOR INSERT WITH CHECK (true);

-- Allow admins to see the leads
CREATE POLICY "Enable read access for authenticated users only" ON leads FOR SELECT USING (auth.role() = 'authenticated');

-- Allow admins to update status
CREATE POLICY "Enable update for authenticated users only" ON leads FOR UPDATE USING (auth.role() = 'authenticated');
