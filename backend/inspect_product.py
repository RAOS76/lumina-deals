import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(url, key)

def inspect_product():
    # Search for Medify
    response = supabase.table("products").select("*").ilike("clean_title", "%Medify%").execute()
    
    if not response.data:
        print("No Medify product found.")
        return

    for p in response.data:
        print(f"ID: {p['id']}")
        print(f"Title: {p['clean_title']}")
        print(f"Original Price: {p['original_price']}")
        print(f"Current Price: {p['current_price']}")
        print(f"Discount: {p['discount_percentage']}%")
        print(f"Image URL: {p['image_url']}")
        print(f"Updated At: {p['updated_at']}")
        print(f"AI Badge: {p['ai_badge']}")
        print("-" * 20)

if __name__ == "__main__":
    inspect_product()
