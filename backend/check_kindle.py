import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(dotenv_path='.env')

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Faltan credenciales")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

try:
    response = supabase.table("products").select("*").eq("slug", "kindle-paperwhite").execute()
    if response.data:
        print(f"Title: {response.data[0]['clean_title']}")
        print(f"Image URL: {response.data[0]['image_url']}")
    else:
        print("Product not found")
except Exception as e:
    print(f"Error: {e}")
