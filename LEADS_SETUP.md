# Dropshipper Leads Setup

To enable the new Dropshipper Leads form and admin panel, you need to create the `leads` table in your database.

### Step 1: Run SQL in Supabase Dashboard

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open the **SQL Editor**.
3. Create a new query.
4. Copy and paste the following SQL code:

```sql
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
```

5. Click **Run**.

### Step 2: Test the Form

1. Go to your local website: `http://localhost:3000/dropshipper/join`.
2. You should see the new **Join as a Seller** form.
3. Submit a test lead.

### Step 3: Check Admin Panel

1. Go to `http://localhost:3000/admin/leads`.
2. You should see the submitted lead in the table.
