import random
import time
import json
import re
from playwright.sync_api import sync_playwright
from fake_useragent import UserAgent

class AmazonScraper:
    def __init__(self, headless=True):
        self.headless = headless
        self.ua = UserAgent()

    def search_products(self, keyword, max_products=5):
        """Busca productos en Amazon y devuelve una lista de diccionarios con datos básicos."""
        products = []
        user_agent = self.ua.random
        
        print(f"[SCRAPER] Iniciando búsqueda de '{keyword}'...")

        with sync_playwright() as p:
            # Lanzar navegador con argumentos para evitar detección básica
            browser = p.chromium.launch(
                headless=self.headless,
                args=["--disable-blink-features=AutomationControlled"]
            )
            context = browser.new_context(
                user_agent=user_agent,
                viewport={"width": 1920, "height": 1080},
                locale="en-US"
            )
            page = context.new_page()

            # Añadir scripts para ocultar webdriver
            page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

            try:
                # Navegar a Amazon Search
                search_url = f"https://www.amazon.com/s?k={keyword.replace(' ', '+')}"
                print(f"[SCRAPER] Navegando a {search_url}")
                page.goto(search_url, timeout=60000)
                
                # Esperar a que carguen los resultados
                page.wait_for_selector('div[data-component-type="s-search-result"]', timeout=30000)
                time.sleep(2) # Espera humana

                # Extraer items
                items = page.query_selector_all('div[data-component-type="s-search-result"]')
                
                if len(items) == 0:
                    print(f"[DEBUG] No se encontraron items. Título de la página: '{page.title()}'")
                    # Check for common blocking text
                    content = page.content()
                    if "captcha" in content.lower() or "robot check" in content.lower():
                         print("[ALERT] DETECTADO BLOQUEO DE ANTIBOT (CAPTCHA)")
                
                print(f"[SCRAPER] Encontrados {len(items)} items. Procesando los primeros {max_products}...")

                count = 0
                for item in items:
                    if count >= max_products:
                        break

                    try:
                        # Extraer ASIN
                        asin = item.get_attribute("data-asin")
                        if not asin: continue

                        # Extraer Título (Intentar varios selectores)
                        title_el = item.query_selector("h2 a span")
                        if not title_el:
                            title_el = item.query_selector("h2 a") # Fallback
                        title = title_el.inner_text().strip() if title_el else "Unknown Title"

                        # Extraer Precio Actual (Whole + Fraction)
                        price_whole = item.query_selector(".a-price-whole")
                        price_fraction = item.query_selector(".a-price-fraction")
                        
                        current_price = 0.0
                        try:
                            if price_whole:
                                # Amazon a veces pone texto oculto o saltos de linea. Limpieza:
                                raw_whole = price_whole.inner_text()
                                whole_text = raw_whole.replace('\n', '').replace('.', '').replace(',', '').strip()
                                
                                fraction_text = "00"
                                if price_fraction:
                                    fraction_text = price_fraction.inner_text().replace('\n', '').strip()
                                
                                current_price = float(f"{whole_text}.{fraction_text}")
                            else:
                                # Intentar selector alternativo (precio unico)
                                alt_price = item.query_selector(".a-price .a-offscreen")
                                if alt_price:
                                    alt_text = alt_price.get_attribute("inner_text") or alt_price.inner_text()
                                    clean_alt = alt_text.replace("$", "").replace(",", "").strip()
                                    current_price = float(clean_alt)
                            
                            # Fallback 3: Regex en todo el texto del item
                            if current_price == 0.0:
                                item_text = item.inner_text()
                                # Buscar patrón $XX.XX o $XX
                                price_match = re.search(r'\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)', item_text)
                                if price_match:
                                    price_str = price_match.group(1).replace(',', '')
                                    current_price = float(price_str)
                                    print(f"   [INFO] Precio encontrado por Regex: ${current_price}")

                        except Exception as ve:
                             print(f"   [WARN] Error parseando precio: {ve}")
                             continue

                        # Extraer Precio Original (si existe, tachado)
                        original_price_el = item.query_selector(".a-text-price .a-offscreen")
                        original_price = 0.0
                        if original_price_el:
                            try:
                                original_price_text = original_price_el.get_attribute("inner_text") or original_price_el.inner_text()
                                # Limpieza agresiva de símbolo de moneda y comas
                                clean_orig = original_price_text.replace("$", "").replace(",", "").replace('\n', '').strip()
                                original_price = float(clean_orig)
                            except:
                                pass # Si falla, se queda en 0 y se usará fallback

                        
                        # Calcular descuento si no es evidente
                        discount = 0
                        if original_price > current_price:
                            discount = int(((original_price - current_price) / original_price) * 100)
                        
                        # Extraer Imagen
                        img_el = item.query_selector(".s-image")
                        image_url = img_el.get_attribute("src") if img_el else ""

                        # URL del producto
                        link_el = item.query_selector("h2 a")
                        product_url = "https://amazon.com" + link_el.get_attribute("href") if link_el else ""

                        # Filtrar solo productos con precio y nombre válido
                        if current_price > 0 and title and title != "Unknown Title":
                            products.append({
                                "amazon_id": asin,
                                "raw_title": title,
                                "original_price": original_price if original_price > 0 else current_price, # Fallback
                                "current_price": current_price,
                                "discount_percentage": discount,
                                "image_url": image_url,
                                "product_url": product_url,
                                "category": keyword # Usamos la keyword como categoría simple
                            })
                            count += 1
                            print(f"   -> [{asin}] ${current_price} - {title[:30]}...")

                    except Exception as e:
                        print(f"   [WARN] Error procesando item: {e}")
                        continue
            
            except Exception as e:
                print(f"[ERROR] Fallo en scraping de página: {e}")
                # Captura de pantalla en caso de error (útil para debuggeo, pero comentado para prod)
                # page.screenshot(path="error_screenshot.png")
            
            finally:
                browser.close()
        
        return products

if __name__ == "__main__":
    # Test rápido
    scraper = AmazonScraper(headless=False)
    results = scraper.search_products("gaming laptop", max_products=3)
    print(json.dumps(results, indent=2))
