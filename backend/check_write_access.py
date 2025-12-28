import os
from supabase import create_client
from dotenv import load_dotenv
from pathlib import Path

# Load env
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / 'frontend' / '.env.local'
load_dotenv(dotenv_path=env_path)

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Missing Supabase credentials")
    exit(1)

supabase = create_client(url, key)

try:
    print("Checking active policies on 'posts' table...")
    # We can query pg_policies via a direct SQL call if we had one, but we don't.
    # However, we can try to infer it or use the 'rpc' hack if available.
    # Actually, the service role CAN query pg_policies if we wrap it in a function, but we can't create functions.
    
    # Wait, I can just try to insert a post using the SERVICE ROLE.
    # If that works, then the table structure is fine.
    
    # But I really want to see the policies.
    # Let's try to list policies using the REST API on pg_policies view?
    # Supabase exposes system catalogs? Usually no.
    
    # Alternative: I will try to insert a post with a specific ID and see if it works.
    # But that doesn't tell me about the user's RLS.
    
    # Let's assume I can't see policies directly.
    # I will assume the user didn't run the script or it failed.
    
    # Let's try to verify the user's JWT contents? I can't.
    
    # Let's try to insert a dummy post using the service role to confirm the table is writable at all.
    print("Attempting service role insert...")
    test_post = {
        "title": "Test Post Service Role",
        "slug": "test-post-service-role-123",
        "content": "Test content",
        "published": False
    }
    data = supabase.table("posts").insert(test_post).execute()
    print("Service role insert successful:", data)
    
    # Clean up
    if data.data:
        post_id = data.data[0]['id']
        supabase.table("posts").delete().eq("id", post_id).execute()
        print("Test post cleaned up.")

except Exception as e:
    print(f"Error: {e}")
