import os
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

# Load env vars
env_path = Path(__file__).parent.parent / 'frontend' / '.env.local'
load_dotenv(dotenv_path=env_path)

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    exit(1)

supabase: Client = create_client(url, key)

TARGET_EMAIL = "raos_76@hotmail.com"
NEW_PASSWORD = "LuminaPassword123!"

print(f"🔐 Reseteando contraseña para {TARGET_EMAIL}...")

try:
    # 1. Get User ID
    response = supabase.auth.admin.list_users()
    users = response
    
    user_id = None
    for user in users:
        if user.email == TARGET_EMAIL:
            user_id = user.id
            break
            
    if not user_id:
        print(f"❌ Usuario {TARGET_EMAIL} no encontrado.")
        exit(1)
        
    # 2. Update Password
    attributes = {"password": NEW_PASSWORD}
    supabase.auth.admin.update_user_by_id(user_id, attributes)
    
    print(f"✅ Contraseña actualizada exitosamente.")
    print(f"🔑 Nueva contraseña: {NEW_PASSWORD}")

except Exception as e:
    print(f"❌ Error: {e}")
