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

print(f"👑 Promoviendo a {TARGET_EMAIL} a ADMIN...")

try:
    # 1. Get User ID
    # Note: We can't query auth.users directly easily with py client, but we can query profiles
    # Wait, profiles might not exist if trigger failed or user is old.
    # Let's try to update profiles directly using the email if we added it to profiles.
    # But profiles table uses ID as PK.
    
    # Alternative: List users to find ID
    response = supabase.auth.admin.list_users()
    users = response
    
    user_id = None
    for user in users:
        if user.email == TARGET_EMAIL:
            user_id = user.id
            break
            
    if not user_id:
        print(f"❌ Usuario {TARGET_EMAIL} no encontrado en Auth.")
        exit(1)
        
    print(f"✅ ID encontrado: {user_id}")
    
    # 2. Upsert Profile (Ensure it exists and is admin)
    data = {
        "id": user_id,
        "email": TARGET_EMAIL,
        "role": "admin"
    }
    
    result = supabase.table("profiles").upsert(data).execute()
    print("✅ Perfil actualizado a ADMIN exitosamente.")
    print("👉 Intenta iniciar sesión ahora.")

except Exception as e:
    print(f"❌ Error: {e}")
