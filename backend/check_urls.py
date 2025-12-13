import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(dotenv_path='../.env')

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Missing env vars")
    exit(1)

supabase: Client = create_client(url, key)

try:
    print("Checking product URLs...")
    response = supabase.table("products").select("id, title, product_url").limit(5).execute()
    
    for p in response.data:
        print(f"ID: {p.get('id')}")
        print(f"Title: {p.get('title')[:30]}...")
        print(f"URL: {p.get('product_url')}")
        print("-" * 20)

except Exception as e:
    print(f"ERROR: {e}")
