-- Fix permissions and policies for the leads table

-- 1. Grant usage of the schema (usually public)
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 2. Grant INSERT permission on the table specific roles
GRANT INSERT ON TABLE leads TO anon;
GRANT INSERT ON TABLE leads TO authenticated;
GRANT INSERT ON TABLE leads TO service_role;

-- 3. Drop existing insertion policies to avoid conflicts
DROP POLICY IF EXISTS "Enable insert for everyone" ON leads;
DROP POLICY IF EXISTS "Enable insert for anon" ON leads;
DROP POLICY IF EXISTS "Enable insert for authenticated" ON leads;

-- 4. Re-create policies
-- Public/Anonymous users can insert
CREATE POLICY "Enable insert for anon" 
ON leads 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Authenticated users (logged in) can insert
CREATE POLICY "Enable insert for authenticated" 
ON leads 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 5. Ensure RLS is on
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
