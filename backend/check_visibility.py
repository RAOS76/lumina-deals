import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(dotenv_path='../.env')

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
# IMPORTANT: Use the ANON key, not the service role key, to simulate frontend access
key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not key:
    print("Error: NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env")
    exit(1)

print(f"Testing access with ANON key...")
try:
    supabase: Client = create_client(url, key)
    response = supabase.table('products').select("id, title, clean_title").execute()
    
    print(f"Successfully fetched {len(response.data)} products with ANON key.")
    if len(response.data) == 0:
        print("WARNING: 0 products found. RLS policies might be blocking access.")
    else:
        print("-" * 40)
        for p in response.data:
            title = p.get('title', 'N/A')
            clean_title = p.get('clean_title', 'N/A')
            print(f"ID: {p['id']}")
            print(f"Title: {title}")
            print(f"Clean Title: {clean_title}")
            
            if "Unknown Title" in clean_title or "Unknown Title" in title:
                print("⚠️  FLAGGED: Contains 'Unknown Title'")
            print("-" * 40)

except Exception as e:
    print(f"Error fetching with ANON key: {e}")
