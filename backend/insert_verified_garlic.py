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
user_url = "https://www.amazon.com/-/es/Mecedora-picadora-inoxidable-trituradora-herramienta/dp/B0D8SL82T9?__mk_es_US=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1QE1KG4EZEESM&dib=eyJ2IjoiMSJ9.bWUn6h3AyYEq5RoKK39yog.9mS27s77NGogHJsAeRm22cUZsZSwC32J3KuQyniidOY&dib_tag=se&keywords=pomyter&qid=1766255811&s=home-garden&sprefix=pomyter%2Cgarden%2C159&sr=1-4&linkCode=ll1&tag=raosofert-20&linkId=60a7e7f297117e7c7d6a3c8289af0a84&language=es_US&ref_=as_li_ss_tl"

# Product Data
product = {
    "amazon_id": "B0D8SL82T9",
    "title": "Pomyter - Prensa de Ajos de Acero Inoxidable (Diseño Mecedora)",
    "clean_title": "Pomyter Stainless Steel Garlic Press Rocker",
    "slug": "pomyter-garlic-press-verified",
    "ai_summary": "Trituradora de ajos ergonómica de acero inoxidable. Diseño de mecedora para facilitar el uso y limpieza. Incluye pelador y cepillo de limpieza. Ideal para cocina moderna.",
    "current_price": 6.99, # Corrected Price
    "original_price": 12.99,
    "discount_percentage": 46,
    "image_url": "/images/pomyter-garlic-press.png", # User uploaded image
    "product_url": user_url,
    "category": "hogar",
    "subcategory": "cocina",
    "sales_phrase": "Cocina más rápido y limpio.",
    "ai_badge": "👨‍🍳 Chef Choice",
    "lumina_score": 88,
    "rating": 4.7,
    "review_count": 320,
    "created_at": datetime.now().isoformat(),
    "updated_at": datetime.now().isoformat()
}

print(f"Upserting verified product: {product['clean_title']}...")

try:
    data, count = supabase.table("products").upsert(product, on_conflict="amazon_id").execute()
    print("Success! Product updated.")
except Exception as e:
    print(f"Error: {e}")
