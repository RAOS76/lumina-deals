import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(dotenv_path='../.env')

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(url, key)

print("Checking for products with missing images...")
response = supabase.table('products').select("id, title, image_url").execute()

missing_count = 0
for p in response.data:
    if not p['image_url'] or p['image_url'] == "":
        print(f"❌ Missing Image: {p['title'][:50]}...")
        missing_count += 1
    else:
        print(f"✅ Image OK: {p['image_url'][:60]}... (Title: {p['title'][:20]})")

print(f"\nTotal products: {len(response.data)}")
print(f"Products without images: {missing_count}")
