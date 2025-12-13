import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load from .env in current directory or parent
load_dotenv()

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

print(f"Checking credentials...")
print(f"URL found: {'YES' if url else 'NO'}")
print(f"KEY found: {'YES' if key else 'NO'}")

if not url or not key:
    print("❌ Missing credentials. Please check .env file.")
    exit(1)

try:
    print(f"Connecting to Supabase at {url[:20]}...")
    supabase: Client = create_client(url, key)
    
    # Try a simple query
    print("Executing query on 'products' table...")
    response = supabase.table('products').select("id", count='exact').limit(1).execute()
    
    print("✅ Connection Successful!")
    print(f"Found {response.count} products in the database.")
    
except Exception as e:
    print(f"❌ Connection Failed: {e}")
