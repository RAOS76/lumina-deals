import os
from supabase import create_client
from dotenv import load_dotenv
from pathlib import Path
import json

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
    # Get the most recently updated product
    response = supabase.table("products").select("*").order("updated_at", desc=True).limit(1).execute()
    
    if response.data:
        product = response.data[0]
        print("Latest Product:")
        print(f"ID: {product.get('id')}")
        print(f"Title: {product.get('title')}")
        print(f"Slug: {product.get('slug')}")
        print(f"Category: {product.get('category')}")
        print(f"Amazon ID: {product.get('amazon_id')}")
        print("-" * 20)
    else:
        print("No products found.")

except Exception as e:
    print(f"Error: {e}")
