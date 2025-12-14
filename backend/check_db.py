import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(url, key)

def check_stats():
    # Count products
    response = supabase.table("products").select("*", count="exact").execute()
    count = response.count
    print(f"Total Products: {count}")
    
    # Check categories
    response = supabase.table("products").select("category").execute()
    categories = {}
    for item in response.data:
        cat = item.get("category") or "Uncategorized"
        categories[cat] = categories.get(cat, 0) + 1
        
    print("Categories Breakdown:")
    for cat, num in categories.items():
        print(f"  - {cat}: {num}")

if __name__ == "__main__":
    check_stats()
