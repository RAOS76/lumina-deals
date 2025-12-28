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

user_id = "ad752aee-785c-4d51-a15f-df86ab132296" # From previous step

try:
    print(f"Updating metadata for user {user_id}...")
    # Update app_metadata to include role: admin
    # This is secure because it can only be changed by service_role
    supabase.auth.admin.update_user_by_id(
        user_id,
        {"app_metadata": {"role": "admin"}}
    )
    print("Success! User is now an admin in metadata.")

except Exception as e:
    print(f"Error: {e}")
