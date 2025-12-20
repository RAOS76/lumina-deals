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
user_url = "https://www.amazon.com/-/es/gp/product/B0C4DM14ZN?smid=A3P56LYOG94570&psc=1&linkCode=ll1&tag=raosofert-20&linkId=5b20cf726c7439e9402cee53e73451dc&language=es_US&ref_=as_li_ss_tl"

# Product Data
product = {
    "amazon_id": "B0C4DM14ZN",
    "title": "Mossy Oak Cuchillo de bolsillo plegable, cuchillo EDC de hoja de acero inoxidable lavado a la piedra de 4 pulgadas, mango G10 con bloqueo de eje y clip de bolsillo",
    "clean_title": "Mossy Oak Folding Pocket Knife",
    "slug": "mossy-oak-folding-knife-verified",
    "ai_summary": "Cuchillo táctico plegable de 4 pulgadas. Hoja de acero inoxidable lavado a la piedra, mango G10 resistente y bloqueo de eje seguro. Ideal para EDC, camping y supervivencia.",
    "current_price": 12.99, # User provided previously
    "original_price": 19.99,
    "discount_percentage": 35,
    "image_url": "/images/mossy-oak-knife.png", # User uploaded image
    "product_url": user_url,
    "category": "deportes",
    "subcategory": "camping",
    "sales_phrase": "Resistente y confiable.",
    "ai_badge": "🌲 Outdoor Essential",
    "lumina_score": 89,
    "rating": 4.6,
    "review_count": 500,
    "created_at": datetime.now().isoformat(),
    "updated_at": datetime.now().isoformat()
}

print(f"Upserting verified product: {product['clean_title']}...")

try:
    data, count = supabase.table("products").upsert(product, on_conflict="amazon_id").execute()
    print("Success! Product updated.")
except Exception as e:
    print(f"Error: {e}")
