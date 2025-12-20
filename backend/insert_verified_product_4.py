import os
from supabase import create_client
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime

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

# User provided URL
user_url = "https://www.amazon.com/-/es/gp/product/B0DSZTXB3G?smid=A396ETS0HAHH53&th=1&linkCode=ll1&tag=raosofert-20&linkId=e7fe15f082470396f347be0f31661133&language=es_US&ref_=as_li_ss_tl"

# Product Data
product = {
    "amazon_id": "B0DSZTXB3G",
    "title": "Producto Verificado (B0DSZTXB3G)", # Placeholder
    "clean_title": "Producto Verificado (B0DSZTXB3G)",
    "slug": "verified-product-b0dsztxb3g",
    "ai_summary": "Producto añadido manualmente para verificación de ventas. Pendiente de detalles.",
    "current_price": 99.99, # Placeholder
    "original_price": 129.99,
    "discount_percentage": 20,
    "image_url": "https://placehold.co/600x600?text=Producto+4", # Placeholder
    "product_url": user_url,
    "category": "varios",
    "subcategory": "general",
    "sales_phrase": "Verificación de Venta",
    "ai_badge": "✅ Test",
    "lumina_score": 85,
    "rating": 0,
    "review_count": 0,
    "created_at": datetime.now().isoformat(),
    "updated_at": datetime.now().isoformat()
}

print(f"Upserting verified product: {product['clean_title']}...")

try:
    data, count = supabase.table("products").upsert(product, on_conflict="amazon_id").execute()
    print("Success! Product updated/inserted.")
except Exception as e:
    print(f"Error: {e}")
