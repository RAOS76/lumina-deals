import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv(dotenv_path='frontend/.env.local')

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") # Need write access

if not url or not key:
    print("Error: Missing env vars")
    exit(1)

supabase = create_client(url, key)

# Get products with empty URL
response = supabase.table("products").select("id, amazon_id, product_url").execute()

count = 0
for p in response.data:
    if not p.get("product_url") or p["product_url"] == "":
        new_url = f"https://www.amazon.com/dp/{p['amazon_id']}"
        print(f"Fixing {p['amazon_id']} -> {new_url}")
        
        supabase.table("products").update({"product_url": new_url}).eq("id", p["id"]).execute()
        count += 1

print(f"Fixed {count} products.")
