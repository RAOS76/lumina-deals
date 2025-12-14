import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load env vars from frontend/.env.local
import os
from pathlib import Path

# Get absolute path to frontend/.env.local
env_path = Path(__file__).parent.parent / 'frontend' / '.env.local'
load_dotenv(dotenv_path=env_path)

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    exit(1)

supabase: Client = create_client(url, key)

print("🔍 Buscando usuarios registrados...")
try:
    # List users (admin API)
    users = supabase.auth.admin.list_users()
    
    if not users:
        print("❌ No se encontraron usuarios registrados.")
    else:
        print(f"✅ Se encontraron {len(users)} usuarios:")
        print("-" * 40)
        for user in users:
            print(f"📧 Email: {user.email}")
            print(f"🆔 ID:    {user.id}")
            print("-" * 40)
            
except Exception as e:
    print(f"❌ Error al listar usuarios: {e}")
