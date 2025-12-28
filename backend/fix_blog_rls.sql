-- Fix RLS Policies for Blog Tables using Metadata (Simpler & More Robust)

-- 1. Authors
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authors are editable by admins only" ON authors;
CREATE POLICY "Authors are editable by admins only" 
ON authors FOR ALL 
USING (
    (auth.jwt() ->> 'app_metadata')::jsonb ->> 'role' = 'admin'
);

-- 2. Posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can see all posts" ON posts;
CREATE POLICY "Admins can see all posts" 
ON posts FOR SELECT 
USING (
    (auth.jwt() ->> 'app_metadata')::jsonb ->> 'role' = 'admin'
);

DROP POLICY IF EXISTS "Posts are editable by admins only" ON posts;
CREATE POLICY "Posts are editable by admins only" 
ON posts FOR ALL 
USING (
    (auth.jwt() ->> 'app_metadata')::jsonb ->> 'role' = 'admin'
);

-- 3. Post Tags
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Post tags are editable by admins only" ON post_tags;
CREATE POLICY "Post tags are editable by admins only" 
ON post_tags FOR ALL 
USING (
    (auth.jwt() ->> 'app_metadata')::jsonb ->> 'role' = 'admin'
);
