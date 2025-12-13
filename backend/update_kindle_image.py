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

new_image_url = "https://press.amazon.com.au/files/Kindle_Paperwhite_front.jpg"

try:
    data, count = supabase.table("products").update({"image_url": new_image_url}).eq("slug", "kindle-paperwhite").execute()
    print(f"Updated Kindle image to: {new_image_url}")
except Exception as e:
    print(f"Error: {e}")
