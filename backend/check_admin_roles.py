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
    # Get all profiles
    data, count = supabase.table("profiles").select("*").execute()
    print("Profiles found:")
    for profile in data[1]:
        print(f"ID: {profile['id']}, Role: {profile.get('role', 'N/A')}")
        
    if not data[1]:
        print("No profiles found.")

except Exception as e:
    print(f"Error: {e}")
