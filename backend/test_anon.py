import os
from dotenv import load_dotenv
from supabase import create_client

# Try loading from frontend/.env.local (assuming running from root)
load_dotenv(dotenv_path='frontend/.env.local')

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY") # Using ANON KEY

if not url or not key:
    print("Error: Missing env vars")
    exit(1)

print(f"Testing connection to {url} with ANON KEY...")
supabase = create_client(url, key)

try:
    response = supabase.table("products").select("*").limit(5).execute()
    data = response.data
    
    if not data:
        print("❌ Success connection, but returned NO DATA (Empty list). RLS likely blocking.")
    else:
        print(f"✅ Success! Retrieved {len(data)} products.")
        print(f"Sample: {data[0]['clean_title']}")
except Exception as e:
    print(f"❌ Error: {e}")
