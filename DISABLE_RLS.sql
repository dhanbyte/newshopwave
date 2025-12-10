-- FORCE DISABLE RLS TO FIX "row-level security" ERRORS PERMANENTLY
-- This is strictly for the USER who is getting blocked by permissions.

DROP POLICY IF EXISTS "Enable insert for anon" ON leads;
DROP POLICY IF EXISTS "Enable insert for authenticated" ON leads;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON leads;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON leads;

-- DISABLE Row Level Security completely
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
