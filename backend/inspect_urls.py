import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv(dotenv_path='frontend/.env.local')

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not url or not key:
    print("Error: Missing env vars")
    exit(1)

supabase = create_client(url, key) # Obtener productos
response = supabase.table("products").select("id, clean_title, category, subcategory").limit(10).execute()
products = response.data

if not products:
    print("No hay productos en la base de datos.")
else:
    print(f"Revisando {len(products)} productos...")
    for p in products:
        print(f"ID: {p['id']}")
        print(f"  Title: {p['clean_title']}")
        print(f"  Category: {p.get('category')}")
        print(f"  Subcategory: {p.get('subcategory')}")
        print("-" * 20)
