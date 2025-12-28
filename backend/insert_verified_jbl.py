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
user_url = "https://www.amazon.com/-/es/JBL-Tune-520BT-Auriculares-inal%C3%A1mbricos/dp/B0CBL1TQMP?crid=1XCEJM5BR35Q0&dib=eyJ2IjoiMSJ9.Is-KgXM-Ii3EUPmlv2GbvalRDRArc4_uUFWU9yK3ese8hP5mwwktomWSBRo5B9mXTtHFlNilEno4q_wjaj_tSxj4H-7pL-_JiTq_yKMx9feG46aeEe7mrEdychaK1gLoNeqQRxslrXBgM6b7bY5CAaQiuBS5JsJJK7dfMw0YfOwsHkP1xOqh-Uoi11ekB5xW4YtZJ-snETBNp49a3zmbeS3l8V7TDP9iI_ZXUudNKos.YRWZQECt-rz_v-BLWSkovfQd_0znBlgdoaN45RwmKVE&dib_tag=se&keywords=jbl%2Bheadphones%2Bwireless%2Bbluetooth&qid=1766255267&sprefix=%2Caps%2C193&sr=8-3&th=1&linkCode=ll1&tag=raosofert-20&linkId=2862b1fa58f0df9bae0bf833d8162e1d&language=es_US&ref_=as_li_ss_tl"

# Product Data
product = {
    "amazon_id": "B0CBL1TQMP",
    "title": "JBL Tune 520BT - Auriculares Inalámbricos On-Ear",
    "clean_title": "JBL Tune 520BT Wireless",
    "slug": "jbl-tune-520bt-verified", # Unique slug for this test
    "ai_summary": "Sonido JBL Pure Bass, Bluetooth 5.3, hasta 57 horas de batería. Verificado manualmente para prueba de ventas.",
    "current_price": 29.95,
    "original_price": 49.95,
    "discount_percentage": 40,
    "image_url": "/images/jbl-tune-520bt.png", # User uploaded image
    "product_url": user_url, # Using the exact link provided
    "category": "tecnologia",
    "subcategory": "audio",
    "sales_phrase": "Prueba de Venta Verificada",
    "ai_badge": "✅ Verificado",
    "lumina_score": 100,
    "rating": 4.6,
    "review_count": 1500,
    "created_at": datetime.now().isoformat(),
    "updated_at": datetime.now().isoformat()
}

print(f"Upserting verified product: {product['clean_title']}...")

try:
    data, count = supabase.table("products").upsert(product, on_conflict="amazon_id").execute()
    print("Success! Product updated.")
except Exception as e:
    print(f"Error: {e}")
