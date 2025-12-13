import os
import json
import random
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client, Client
from openai import OpenAI

# Cargar variables de entorno
# Cargar variables de entorno
# Intentar cargar desde la raíz del proyecto
load_dotenv(dotenv_path='.env')
# Si no funciona, intentar ruta relativa (por si se ejecuta desde backend/)
if not os.getenv("NEXT_PUBLIC_SUPABASE_URL"):
    load_dotenv(dotenv_path='../.env')

# Configuración
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") # Usar Service Role key para escritura
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY, OPENAI_API_KEY]):
    print("[ERROR] Faltan variables de entorno. Revisa tu archivo .env. Usando modo simulacion.")

# Inicializar clientes
try:
    if SUPABASE_URL and SUPABASE_KEY:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    else:
        supabase = None
        
    if OPENAI_API_KEY:
        openai_client = OpenAI(api_key=OPENAI_API_KEY)
    else:
        openai_client = None
except Exception as e:
    print(f"[WARN] Error inicializando clientes: {e}")
    supabase = None
    openai_client = None

from scraper import AmazonScraper
from scoring import calculate_lumina_score
import json 

# ... (Previous imports remain, but 'json' and 'random' might be redundant if not used elsewhere, keeping for safety)

# ... (Configuration section remains the same)

# --- 1. REAL SCRAPING ENGINE (Playwright) ---
def get_real_amazon_products():
    """Ejecuta el scraper para buscar ofertas reales."""
    scraper = AmazonScraper(headless=True) # Headless=True para prod
    
    # Palabras clave para buscar "gemas ocultas"
    # Palabras clave estructuradas para categorización precisa
    # Palabras clave estructuradas para categorización precisa
    search_targets = [
        # TECNOLOGÍA
        {"keyword": "best tech deals", "category": "tecnologia", "subcategory": "gadgets"},
        {"keyword": "wireless headphones sale", "category": "tecnologia", "subcategory": "audio"},
        {"keyword": "bluetooth speakers discount", "category": "tecnologia", "subcategory": "audio"},
        {"keyword": "laptop deals under 500", "category": "tecnologia", "subcategory": "computacion"},
        {"keyword": "4k monitor sale", "category": "tecnologia", "subcategory": "computacion"},
        {"keyword": "camera accessories deals", "category": "tecnologia", "subcategory": "fotografia"},
        
        # HOGAR
        {"keyword": "smart home gadgets under 50", "category": "hogar", "subcategory": "domotica"},
        {"keyword": "robot vacuum sale", "category": "hogar", "subcategory": "limpieza"},
        {"keyword": "air fryer deals", "category": "hogar", "subcategory": "cocina"},
        {"keyword": "coffee maker discount", "category": "hogar", "subcategory": "cocina"},
        {"keyword": "led strip lights", "category": "hogar", "subcategory": "decoracion"},
        
        # GAMING
        {"keyword": "gaming accessories discount", "category": "gaming", "subcategory": "accesorios"},
        {"keyword": "mechanical keyboard sale", "category": "gaming", "subcategory": "pc-gaming"},
        {"keyword": "gaming mouse deals", "category": "gaming", "subcategory": "pc-gaming"},
        {"keyword": "ps5 accessories", "category": "gaming", "subcategory": "consolas"},
        {"keyword": "nintendo switch games sale", "category": "gaming", "subcategory": "juegos"},
        
        # MODA
        {"keyword": "mens watches sale", "category": "moda", "subcategory": "accesorios"},
        {"keyword": "womens handbags sale", "category": "moda", "subcategory": "accesorios"},
        {"keyword": "running shoes deals", "category": "moda", "subcategory": "calzado"},
        
        # SALUD & DEPORTE
        {"keyword": "yoga mat sale", "category": "salud", "subcategory": "deporte"},
        {"keyword": "resistance bands set", "category": "salud", "subcategory": "deporte"},
        {"keyword": "electric toothbrush deals", "category": "salud", "subcategory": "cuidado-personal"}
    ]
    
    all_products = []
    
    for target in search_targets:
        kw = target["keyword"]
        try:
            print(f"[MAIN] Buscando: {kw}...")
            products = scraper.search_products(kw, max_products=3)
            
            # Asignar categoría y subcategoría a los productos encontrados
            for p in products:
                p["category"] = target["category"]
                p["subcategory"] = target["subcategory"]
                
            all_products.extend(products)
        except Exception as e:
            print(f"[ERROR] Fallo buscando '{kw}': {e}")
            
    # Eliminar duplicados por ASIN
    unique_products = {p['amazon_id']: p for p in all_products}.values()
    return list(unique_products)

# --- 2. AI ANALYSIS ENGINE (OpenAI) ---
# ... (Rest of the file remains similar, I will target the replacement carefully)

# --- 2. AI ANALYSIS ENGINE (OpenAI) ---
def analyze_product_with_ai(product):
    """Analiza el producto con GPT-4o-mini para generar insights de venta."""
    if not openai_client:
        # Mock response si no hay API key
        return {
            "clean_title": product["raw_title"][:30] + "...",
            "ai_summary": "Este producto es increíble por su precio actual.",
            "sales_phrase": "¡Oferta por tiempo limitado!",
            "ai_badge": "Hot Deal",
            "sentiment_score": 0.9
        }

    print(f"[IA] Analizando con IA: {product['raw_title'][:40]}...")
    
    system_prompt = """
    Eres un experto curador de ofertas ('Deal Curator'). Tu trabajo es analizar productos de Amazon y crear contenido persuasivo y limpio para una web minimalista.
    
    Output JSON format:
    {
        "clean_title": "Título corto y limpio (max 40 chars)",
        "ai_summary": "2-3 frases explicando por qué es una buena compra (foco en valor/calidad).",
        "sales_phrase": "Frase de venta de 1 línea atacando un 'pain point' o deseo.",
        "ai_badge": "Badge corto (ej: '🔥 Viral', '💎 Calidad/Preciazo', '📉 Mínimo Histórico', '🛡️ Indestructible')",
        "sentiment_score": float (0.0 a 1.0, qué tan buena es la oferta realmente)
    }
    """
    
    user_prompt = f"""
    Producto: {product['raw_title']}
    Precio Original: ${product['original_price']}
    Precio Actual: ${product['current_price']}
    Descuento: {product['discount_percentage']}%
    Categoría: {product['category']}
    """
    
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"[WARN] Error OpenAI: {e}")
        return {
            "clean_title": product["raw_title"][:30],
            "ai_summary": "Análisis no disponible temporalmente.",
            "sales_phrase": "Gran oferta disponible.",
            "ai_badge": "Visto en Amazon",
            "sentiment_score": 0.5
        }

# --- 3. DATABASE SYNC (Supabase) ---
def generate_history_mock(current_price):
    """Genera un historial de precios falso pero realista para el gráfico."""
    history = []
    # Generar 10 puntos de datos en los últimos 30 días
    base_date = datetime.now() - timedelta(days=30)
    
    for i in range(10):
        date = base_date + timedelta(days=i*3)
        # Precio fluctúa un poco alrededor del actual + algo más alto
        simulated_price = round(current_price * random.uniform(1.0, 1.4), 2)
        history.append({
            "date": date.strftime("%Y-%m-%d"),
            "price": simulated_price
        })
    
    # Asegurar que el último punto es el precio actual hoy
    history.append({
        "date": datetime.now().strftime("%Y-%m-%d"),
        "price": current_price
    })
    return history

def upsert_product(product_data, ai_data):
    """Guarda o actualiza el producto en la BD."""
    if not supabase:
        print(f"[DB Simulacro] Guardando: {ai_data['clean_title']}")
        return

    # Calculate Lumina Score
    lumina_score = calculate_lumina_score(
        rating=product_data.get("rating", 0),
        review_count=product_data.get("review_count", 0),
        discount_percentage=product_data.get("discount_percentage", 0),
        sentiment_score=ai_data.get("sentiment_score", 0.5)
    )

    # Combinar datos
    final_data = {
        "amazon_id": product_data["amazon_id"],
        "title": product_data["raw_title"], # Título original para referencia
        "clean_title": ai_data["clean_title"],
        "original_price": product_data["original_price"],
        "current_price": product_data["current_price"],
        "discount_percentage": product_data["discount_percentage"],
        "rating": product_data.get("rating", 0),
        "review_count": product_data.get("review_count", 0),
        "lumina_score": lumina_score,
        "ai_summary": ai_data["ai_summary"],
        "ai_badge": ai_data["ai_badge"],
        "sales_phrase": ai_data["sales_phrase"],
        "sentiment_score": ai_data["sentiment_score"],
        "image_url": product_data["image_url"],
        "product_url": product_data["product_url"],
        "category": product_data.get("category"),
        "subcategory": product_data.get("subcategory"),
        "updated_at": datetime.now().isoformat(),
        "last_analyzed": datetime.now().isoformat(),
        # En un sistema real, haríamos append al historial, aquí lo regeneramos o mockeamos
        "price_history": generate_history_mock(product_data["current_price"])
    }
    
    try:
        # Upsert basado en amazon_id (que es unique)
        data, count = supabase.table("products").upsert(final_data, on_conflict="amazon_id").execute()
        print(f"[OK] Guardado: {ai_data['clean_title']}")
    except Exception as e:
        print(f"[ERROR] Error Supabase: {e}")

# --- MAIN LOOP ---
def main():
    print(">>> Iniciando AI Deal Curator Engine (Real Scraping Mode)...")
    
    # 1. Obtener productos REALES de Amazon
    raw_products = get_real_amazon_products()
    
    if not raw_products:
        print("[WARN] No se encontraron productos. Revisa tu conexión o selectores.")
        return
    
    # 2. Procesar cada uno
    for p in raw_products:
        # Analizar
        ai_result = analyze_product_with_ai(p)
        
        # Guardar
        upsert_product(p, ai_result)
        
    print(">>> Proceso finalizado.")

# --- 4. VERIFICATION ENGINE ---
def verify_inventory():
    """Revisa todos los productos en la BD y elimina los que ya no existen en Amazon."""
    print(">>> Iniciando Verificación de Inventario...")
    
    if not supabase:
        return

    # 1. Obtener todos los productos
    response = supabase.table("products").select("id, amazon_id, product_url, current_price, clean_title").execute()
    products = response.data
    
    if not products:
        print("[VERIFY] No hay productos para verificar.")
        return

    scraper = AmazonScraper(headless=True)
    
    for p in products:
        # Skip products without URL
        if not p.get("product_url"):
            continue
            
        print(f"[VERIFY] Revisando: {p['clean_title']}...")
        
        # Verificar estado en Amazon
        status = scraper.verify_product(p["product_url"])
        
        if not status["available"]:
            print(f"[DELETE] Eliminando producto no disponible: {p['clean_title']}")
            supabase.table("products").delete().eq("id", p["id"]).execute()
        else:
            # Actualizar precio si cambió
            new_price = status["price"]
            if new_price > 0 and new_price != p["current_price"]:
                print(f"[UPDATE] Precio cambió de ${p['current_price']} a ${new_price}")
                supabase.table("products").update({"current_price": new_price, "updated_at": datetime.now().isoformat()}).eq("id", p["id"]).execute()
            else:
                print("[OK] Precio sin cambios.")
                
    print(">>> Verificación de Inventario Completada.")

if __name__ == "__main__":
    # Ejecutar scraping primero
    main()
    # Luego verificar inventario existente
    verify_inventory()
