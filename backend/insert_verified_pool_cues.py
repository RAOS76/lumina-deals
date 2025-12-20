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
    "title": "IIQ Pool Cues Stick, Pool Cue Stick Sets of 4/3/1 Cue Sticks 58 inch Pool Cues Adult Canadian Maple Wood Billiard Stick",
    "clean_title": "IIQ Pool Cues Stick Set (58 inch Maple Wood)",
    "slug": "iiq-pool-cues-stick-verified",
    "ai_summary": "Juego de tacos de billar de madera de arce canadiense de 58 pulgadas. Diseño elegante y duradero, ideal para adultos. Perfecto para salas de juego y bares.",
    "current_price": 65.99,
    "original_price": 89.99,
    "discount_percentage": 27,
    "image_url": "/images/iiq-pool-cues.jpg", # User uploaded image
    "product_url": user_url,
    "category": "deportes",
    "subcategory": "billar",
    "sales_phrase": "Precisión y estilo.",
    "ai_badge": "🎱 Pro Choice",
    "lumina_score": 90,
    "rating": 4.8,
    "review_count": 120,
    "created_at": datetime.now().isoformat(),
    "updated_at": datetime.now().isoformat()
}

print(f"Upserting verified product: {product['clean_title']}...")

try:
    data, count = supabase.table("products").upsert(product, on_conflict="amazon_id").execute()
    print("Success! Product updated/inserted.")
except Exception as e:
    print(f"Error: {e}")
