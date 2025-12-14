import sys
import json
from scraper import AmazonScraper
from main import analyze_product_with_ai, upsert_product

def live_search(query):
    # Configuración rápida
    MAX_PRODUCTS = 4
    MIN_RATING = 4.0
    # Relajamos un poco el descuento para búsquedas específicas (para asegurar resultados)
    MIN_DISCOUNT = 5 
    
    scraper = AmazonScraper(headless=True)
    
    try:
        # 1. Buscar
        raw_products = scraper.search_products(query, max_products=8) # Buscamos más para filtrar
        
        valid_products = []
        
        for p in raw_products:
            if len(valid_products) >= MAX_PRODUCTS:
                break
                
            # Filtros
            if p.get("rating", 0) < MIN_RATING:
                continue
            if p.get("discount_percentage", 0) < MIN_DISCOUNT:
                continue
                
            # 2. Analizar y Guardar (Rápido)
            # Asignamos categoría genérica basada en la búsqueda
            p["category"] = "Búsqueda" 
            
            ai_result = analyze_product_with_ai(p)
            upsert_product(p, ai_result)
            
            # Recuperar el producto guardado (con ID y todo) para devolverlo
            # Combinamos manualmente para retorno rápido
            p.update(ai_result)
            valid_products.append(p)
            
        return valid_products

    except Exception as e:
        print(f"Error in live search: {e}", file=sys.stderr)
        return []

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scraper_live.py 'query'")
        sys.exit(1)
        
    query = sys.argv[1]
    results = live_search(query)
    print(json.dumps(results))
