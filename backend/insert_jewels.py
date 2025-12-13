import os
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime

# Cargar variables de entorno
load_dotenv(dotenv_path='.env')

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Faltan credenciales de Supabase")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

products = [
    {
        "amazon_id": "B0B3C55H5X", # MacBook Air M2
        "title": "Apple 2022 MacBook Air Laptop with M2 chip: 13.6-inch Liquid Retina Display, 8GB RAM, 256GB SSD Storage, Backlit Magic Keyboard, Touch ID. Works with iPhone and iPad; Midnight",
        "clean_title": "MacBook Air M2",
        "slug": "macbook-air-m2",
        "original_price": 1099.00,
        "current_price": 899.00,
        "discount_percentage": 18,
        "rating": 4.8,
        "review_count": 15400,
        "lumina_score": 98,
        "ai_summary": "Apple rompió el mercado con el chip M1, y el M2 refina esa revolución. No es solo velocidad; es la libertad de salir de casa sin cargador gracias a una batería que dura literalmente todo el día. Su diseño ultradelgado sin ventilador significa silencio absoluto, incluso bajo carga pesada.",
        "ai_badge": "Mínimo Histórico",
        "sales_phrase": "El portátil perfecto para el 99% de los usuarios.",
        "sentiment_score": 0.98,
        "image_url": "https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SL1000_.jpg",
        "product_url": "https://www.amazon.com/dp/B0B3C55H5X",
        "category": "tecnologia",
        "subcategory": "laptops",
        "updated_at": datetime.now().isoformat(),
        "last_analyzed": datetime.now().isoformat()
    },
    {
        "amazon_id": "B0BGRY47IE", # Roborock S8
        "title": "Roborock S8 Robot Vacuum and Mop Cleaner, DuoRoller Brush, 6000Pa Suction, 3D Reactive Obstacle Avoidance, Sonic Mopping, App Control, Compatible with Alexa, Black",
        "clean_title": "Roborock S8",
        "slug": "roborock-s8",
        "original_price": 749.99,
        "current_price": 599.99,
        "discount_percentage": 20,
        "rating": 4.6,
        "review_count": 3200,
        "lumina_score": 96,
        "ai_summary": "Los robots aspiradores solían ser torpes y ruidosos. El S8 es un cartógrafo láser preciso. Su sistema de evasión de obstáculos reactivo 3D identifica zapatos, cables e incluso 'regalos' de mascotas para evitarlos en tiempo real. La gran innovación es su doble cepillo de goma que evita los enredos de pelo.",
        "ai_badge": "Lumina Score: 96",
        "sales_phrase": "Olvídate de barrer (de verdad).",
        "sentiment_score": 0.95,
        "image_url": "https://m.media-amazon.com/images/I/61Zl5N5yZ7L._AC_SL1500_.jpg",
        "product_url": "https://www.amazon.com/dp/B0BGRY47IE",
        "category": "hogar",
        "subcategory": "robots",
        "updated_at": datetime.now().isoformat(),
        "last_analyzed": datetime.now().isoformat()
    },
    {
        "amazon_id": "B08KTZ8249", # Kindle Paperwhite
        "title": "Kindle Paperwhite (16 GB) – Now with a 6.8\" display and adjustable warm light – Black",
        "clean_title": "Kindle Paperwhite",
        "slug": "kindle-paperwhite",
        "original_price": 149.99,
        "current_price": 139.99,
        "discount_percentage": 7,
        "rating": 4.7,
        "review_count": 45000,
        "lumina_score": 94,
        "ai_summary": "En la era de las notificaciones constantes, el Kindle ofrece un refugio de concentración. La nueva pantalla de 6.8\" tiene la misma temperatura de color ajustable que el modelo Oasis premium, permitiendo leer de noche sin afectar tu ciclo de sueño. Es resistente al agua (IPX8) y su batería dura semanas.",
        "ai_badge": "Top Seller 2024",
        "sales_phrase": "Una biblioteca infinita en 200 gramos.",
        "sentiment_score": 0.92,
        "image_url": "https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SL1000_.jpg",
        "product_url": "https://www.amazon.com/dp/B08KTZ8249",
        "category": "tecnologia",
        "subcategory": "tablets", # Mapping to closest
        "updated_at": datetime.now().isoformat(),
        "last_analyzed": datetime.now().isoformat()
    }
]

for p in products:
    try:
        data, count = supabase.table("products").upsert(p, on_conflict="amazon_id").execute()
        print(f"[OK] Insertado/Actualizado: {p['clean_title']} (Slug: {p['slug']})")
    except Exception as e:
        print(f"[ERROR] Falló {p['clean_title']}: {e}")
