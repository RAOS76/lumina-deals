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
    # We can't directly query pg_policies via the JS client easily without a stored procedure or direct SQL access if enabled.
    # However, we can try to insert as the specific user if we had their token, but we don't.
    # Instead, let's just check the user role again to be 100% sure.
    
    print("Checking user roles...")
    data, count = supabase.table("profiles").select("*").execute()
    for profile in data[1]:
        print(f"ID: {profile['id']}, Role: {profile.get('role', 'N/A')}")

    # Also, let's try to see if we can find any info about policies by trying to insert with a service role (which should work) 
    # vs checking if there is a way to debug.
    # Since I can't see the policies directly, I will have to infer or ask the user to run a SQL command if this script doesn't reveal much.
    # But wait, I can use the `rpc` if there is a function, or just assume the standard policy structure.
    
    # Let's just confirm the user IS admin.
    
except Exception as e:
    print(f"Error: {e}")
