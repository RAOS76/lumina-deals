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
    # List users to check metadata
    # Note: list_users returns a UserList object, need to iterate
    response = supabase.auth.admin.list_users()
    
    print("Checking auth.users metadata...")
    for user in response:
        print(f"Email: {user.email}")
        print(f"ID: {user.id}")
        print(f"App Metadata: {user.app_metadata}")
        print(f"User Metadata: {user.user_metadata}")
        print("-" * 20)

except Exception as e:
    print(f"Error: {e}")
