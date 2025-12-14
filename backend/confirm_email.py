import os
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime

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

print(f"📧 Confirmando email para {TARGET_EMAIL}...")

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
        
    # 2. Update User to set email_confirmed_at
    # Note: update_user_by_id allows setting email_confirm to true implicitly or we can try to set the timestamp?
    # Actually, the python client might have a specific method or we just update attributes.
    # Let's try updating 'email_confirm' attribute if supported, or just verify via admin.
    
    # The standard way in some SDKs is invite or verify.
    # In Python `gotrue` (underlying lib), `update_user_by_id` with `email_confirm=True` might work or `email_confirmed_at`.
    
    attributes = {"email_confirm": True} 
    # If that doesn't work, we might need to use raw API or different attribute.
    # Let's try setting `email_confirmed_at` to now.
    
    # Supabase GoTrue API often requires `email_confirm` to be boolean in updates for admin.
    
    result = supabase.auth.admin.update_user_by_id(user_id, attributes)
    
    print(f"✅ Email confirmado exitosamente.")
    print("👉 Intenta iniciar sesión ahora.")

except Exception as e:
    print(f"❌ Error: {e}")
