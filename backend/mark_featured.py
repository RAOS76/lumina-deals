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

slugs_to_feature = ["macbook-air-m2", "roborock-s8", "kindle-paperwhite"]

try:
    # Reset all to false first (optional, but good for cleanliness)
    # supabase.table("products").update({"is_featured": False}).neq("id", 0).execute() 
    
    for slug in slugs_to_feature:
        data, count = supabase.table("products").update({"is_featured": True}).eq("slug", slug).execute()
        print(f"Marked as featured: {slug}")
        
except Exception as e:
    print(f"Error: {e}")
