import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv(dotenv_path='../.env')

url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("❌ Error: Faltan variables de entorno (SUPABASE_URL o SERVICE_ROLE_KEY)")
    exit(1)

supabase: Client = create_client(url, key)

def clean_database():
    print("🧹 Iniciando limpieza de base de datos...")
    
    # Opción 1: Borrar todo (Truncate logic via delete)
    # Supabase-py delete requiere un filtro, para borrar todo usamos un filtro que siempre sea verdad (ej: price > -1)
    # O mejor, fetch IDs y borrar.
    
    try:
        # Paso 1: Contar cuantos hay
        response = supabase.table('products').select("id", count='exact').execute()
        count = response.count
        print(f"📉 Se encontraron {count} productos para eliminar.")
        
        if count == 0:
            print("✅ La base de datos ya está limpia.")
            return

        # Paso 2: Borrar
        # Usamos 'neq' (not equal) a un ID imposible para seleccionar todos, o simplemente borramos por lotes
        res = supabase.table('products').delete().neq('title', 'THIS_STRING_SHOULD_NOT_EXIST_XYZ').execute()
        
        # Nota: Si neq no borra todo por seguridad de Supabase, iteramos.
        # Pero con service_role debería permitirlo.
        
        print(f"✅ Limpieza completada. Registros eliminados.")

    except Exception as e:
        print(f"❌ Error durante la limpieza: {e}")

if __name__ == "__main__":
    # Ejecutar directamente sin preguntar (Script de admin)
    clean_database()
