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

print("WARNING: Deleting ALL products from the database...")
try:
    # Delete all rows where id is not null (effectively all rows)
    data, count = supabase.table("products").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    print(f"Success! Deleted products.")
except Exception as e:
    print(f"Error: {e}")
