import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Cargar variables de entorno
load_dotenv(dotenv_path='.env')
if not os.getenv("NEXT_PUBLIC_SUPABASE_URL"):
    load_dotenv(dotenv_path='../.env')

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Faltan credenciales en .env")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def list_subscribers():
    print(">>> Consultando tabla 'subscribers'...")
    try:
        response = supabase.table("subscribers").select("*").execute()
        subs = response.data
        
        if not subs:
            print("No hay suscriptores aún.")
        else:
            print(f"Se encontraron {len(subs)} suscriptores:")
            for sub in subs:
                print(f" - ID: {sub['id']} | Email: {sub['email']} | Fecha: {sub['created_at']}")
    except Exception as e:
        print(f"Error consultando: {e}")

if __name__ == "__main__":
    list_subscribers()
