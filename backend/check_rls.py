import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(dotenv_path='../.env')

# Use ANON key to simulate frontend
url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not url or not key:
    print("Error: Missing env vars")
    exit(1)

print(f"Testing access with ANON key...")
supabase: Client = create_client(url, key)

try:
    # Try to select slug column
    response = supabase.table("products").select("id, slug").limit(1).execute()
    
    if len(response.data) > 0:
        print("SUCCESS: Public access works.")
        print(response.data[0])
    else:
        print("WARNING: No data returned (might be empty table or RLS filtering).")

except Exception as e:
    print(f"ERROR: Access denied or failed. {e}")
