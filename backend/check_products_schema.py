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
    # Get one product to see keys
    data, count = supabase.table("products").select("*").limit(1).execute()
    if data[1]:
        print("Columns in 'products' table:")
        print(data[1][0].keys())
    else:
        print("No products found to infer schema.")

except Exception as e:
    print(f"Error: {e}")
