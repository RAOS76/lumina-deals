import os
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

# Load env vars
env_path = Path(__file__).parent.parent / 'frontend' / '.env.local'
load_dotenv(dotenv_path=env_path)

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY") # Using ANON key to simulate frontend

if not url or not key:
    print("Error: Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
    exit(1)

supabase: Client = create_client(url, key)

EMAIL = "raos_76@hotmail.com"
PASSWORD = "LuminaPassword123!"

print(f"🕵️ Probando acceso como usuario: {EMAIL}")

try:
    # 1. Login
    print("   Intentando login...")
    session = supabase.auth.sign_in_with_password({"email": EMAIL, "password": PASSWORD})
    user = session.user
    
    if not user:
        print("❌ Login falló.")
        exit(1)
        
    print(f"✅ Login exitoso. ID: {user.id}")
    
    # 2. Query Profile (RLS Check)
    print("   Intentando leer perfil propio...")
    response = supabase.table("profiles").select("*").eq("id", user.id).execute()
    
    if not response.data:
        print("❌ RLS Bloqueó la lectura del perfil (Data vacía).")
        print("   -> El middleware fallará aquí.")
    else:
        profile = response.data[0]
        print(f"✅ Lectura exitosa. Rol: {profile.get('role')}")
        if profile.get('role') == 'admin':
            print("   -> El middleware debería funcionar.")
        else:
            print("   -> El middleware bloqueará por rol incorrecto.")

except Exception as e:
    print(f"❌ Error: {e}")
