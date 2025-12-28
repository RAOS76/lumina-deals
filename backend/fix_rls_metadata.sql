-- Fix RLS Policies using Metadata (Simpler & More Robust)

-- 1. Enable RLS (just in case)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Allow everyone to READ
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone" 
ON products FOR SELECT 
USING (true);

-- 3. Allow Admins to INSERT/UPDATE/DELETE using Metadata Check
-- This avoids joining the 'profiles' table, preventing recursion and permission errors.

DROP POLICY IF EXISTS "Products are insertable by admins" ON products;
CREATE POLICY "Products are insertable by admins" 
ON products FOR INSERT 
WITH CHECK (
  (auth.jwt() ->> 'app_metadata')::jsonb ->> 'role' = 'admin'
);

DROP POLICY IF EXISTS "Products are updatable by admins" ON products;
CREATE POLICY "Products are updatable by admins" 
ON products FOR UPDATE 
USING (
  (auth.jwt() ->> 'app_metadata')::jsonb ->> 'role' = 'admin'
);

DROP POLICY IF EXISTS "Products are deletable by admins" ON products;
CREATE POLICY "Products are deletable by admins" 
ON products FOR DELETE 
USING (
  (auth.jwt() ->> 'app_metadata')::jsonb ->> 'role' = 'admin'
);
