-- Backup Script for Lumina Ofertas Blog Posts
-- Created: 2025-12-21
-- Purpose: Restore point before adding new product analyses

-- To restore this backup, run:
-- psql -h [your-supabase-host] -U postgres -d postgres < restore_posts_backup.sql

-- Note: This is a safety backup. To actually export/import from Supabase,
-- use the Supabase dashboard or API.

-- Instructions to create manual backup:
-- 1. Go to Supabase Dashboard
-- 2. Navigate to Table Editor > posts
-- 3. Click "..." menu > Export as CSV
-- 4. Save as backups/posts_backup_2025-12-21.csv

-- Instructions to restore:
-- 1. Go to Supabase Dashboard
-- 2. Navigate to Table Editor > posts
-- 3. Delete new posts if needed
-- 4. Click "..." menu > Import from CSV
-- 5. Select the backup file

-- Current timestamp: 2025-12-21 12:28:00
