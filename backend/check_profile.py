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

print(f"🔍 Verificando perfil para {TARGET_EMAIL}...")

try:
    # 1. Get User ID from Auth
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
        
    print(f"✅ Auth ID: {user_id}")
    
    # 2. Check Profile
    profile_response = supabase.table("profiles").select("*").eq("id", user_id).execute()
    
    if not profile_response.data:
        print("❌ NO existe entrada en la tabla 'profiles'.")
        print("   -> El middleware bloqueará el acceso.")
    else:
        profile = profile_response.data[0]
        print(f"✅ Perfil encontrado:")
        print(f"   - Role: {profile.get('role')}")
        
        if profile.get('role') != 'admin':
            print("❌ El rol NO es admin. Acceso denegado.")
        else:
            print("✅ El rol ES admin. Debería tener acceso.")

except Exception as e:
    print(f"❌ Error: {e}")
