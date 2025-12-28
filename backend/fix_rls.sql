-- Fix RLS Policies for Products and Profiles

-- 1. Ensure Profiles are readable so we can check roles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

-- 2. Fix Products Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone" 
ON products FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Products are insertable by admins" ON products;
CREATE POLICY "Products are insertable by admins" 
ON products FOR INSERT 
WITH CHECK (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

DROP POLICY IF EXISTS "Products are updatable by admins" ON products;
CREATE POLICY "Products are updatable by admins" 
ON products FOR UPDATE 
USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

DROP POLICY IF EXISTS "Products are deletable by admins" ON products;
CREATE POLICY "Products are deletable by admins" 
ON products FOR DELETE 
USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
