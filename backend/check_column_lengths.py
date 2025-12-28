import os
from supabase import create_client
from dotenv import load_dotenv
from pathlib import Path

# Load env
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / 'frontend' / '.env.local'
load_dotenv(dotenv_path=env_path)

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Missing Supabase credentials")
    exit(1)

supabase = create_client(url, key)

try:
    # We can't query information_schema directly via the JS/Python client easily without rpc.
    # But we can try to infer it or just use the previous schema check script which might have missed the length.
    # Let's try to use the `rpc` if we can, or just try to insert a long value to each column to see which one fails? No, that's slow.
    
    # Actually, I'll just check the `check_products_schema.py` output if I can run it again, 
    # but I'll modify it to try to get more info if possible.
    # Since I can't get types easily, I will guess it is 'clean_title' or 'slug' or 'category'.
    
    # Let's try to run a query that returns the error to pinpoint it?
    # No, the user already gave the error.
    
    # I will assume it is `clean_title` or `category` because `title` is usually text.
    # Let's check the previous `migration.sql` or similar artifacts to see how the table was created.
    pass
except Exception as e:
    print(f"Error: {e}")
