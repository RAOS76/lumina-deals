-- Fix Column Length Limits
-- Change potential VARCHAR(50) columns to TEXT to avoid length errors

ALTER TABLE products 
ALTER COLUMN title TYPE TEXT,
ALTER COLUMN clean_title TYPE TEXT,
ALTER COLUMN slug TYPE TEXT,
ALTER COLUMN category TYPE TEXT,
ALTER COLUMN amazon_id TYPE TEXT; -- Just in case
