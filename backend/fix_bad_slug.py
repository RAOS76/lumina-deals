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

# ID from previous step: 5764aa15-0cc1-4be4-ba71-21269618d336
product_id = "5764aa15-0cc1-4be4-ba71-21269618d336"
new_slug = "timbre-ring-camara-inalambrico-2024"

try:
    print(f"Fixing slug for product {product_id}...")
    data = supabase.table("products").update({"slug": new_slug}).eq("id", product_id).execute()
    print("Success! New slug:", new_slug)
except Exception as e:
    print(f"Error: {e}")
