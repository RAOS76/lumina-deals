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
    print("Checking products table...")
    # Try to select slug column
    response = supabase.table("products").select("id, title, slug").limit(5).execute()
    
    print(f"Found {len(response.data)} products.")
    for p in response.data:
        print(f"- [{p.get('id')}] {p.get('slug')} (Title: {p.get('title')[:20]}...)")
        
    if len(response.data) > 0 and 'slug' not in response.data[0]:
        print("ERROR: 'slug' column missing in response data!")
    else:
        print("SUCCESS: 'slug' column exists and is populated.")

except Exception as e:
    print(f"ERROR: {e}")
