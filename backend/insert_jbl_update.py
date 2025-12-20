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

# Product Data
product = {
    "amazon_id": "B0CBL1TQMP",
    "title": "JBL Tune 520BT - Auriculares Inalámbricos On-Ear",
    "clean_title": "JBL Tune 520BT Wireless",
    "slug": "jbl-tune-520bt",
    "ai_summary": "Sonido JBL Pure Bass, Bluetooth 5.3, hasta 57 horas de batería con carga rápida (5 min = 3 horas), llamadas manos libres y conexión multipunto. Ligeros, cómodos y plegables.",
    "current_price": 29.95,
    "original_price": 49.95,
    "discount_percentage": 40,
    "image_url": "https://m.media-amazon.com/images/I/61F8yN9VjTL._AC_SL1500_.jpg",
    "product_url": "https://www.amazon.com/JBL-Tune-520BT-Ear-Lightweight/dp/B0CBL1TQMP/?tag=raosofert-20",
    "category": "tecnologia",
    "subcategory": "audio",
    "sales_phrase": "Bajos puros, batería infinita.",
    "ai_badge": "🎵 Top Calidad/Precio",
    "lumina_score": 92,
    "rating": 4.6,
    "review_count": 1500,
    "created_at": datetime.now().isoformat(), # Bump to top
    "updated_at": datetime.now().isoformat()
}

print(f"Upserting product: {product['clean_title']}...")

try:
    data, count = supabase.table("products").upsert(product, on_conflict="amazon_id").execute()
    print("Success! Product updated/inserted.")
except Exception as e:
    print(f"Error: {e}")
