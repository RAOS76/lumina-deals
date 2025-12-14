import random
import time
import json
import re
from playwright.sync_api import sync_playwright
from fake_useragent import UserAgent
from fp.fp import FreeProxy

class AmazonScraper:
    def __init__(self, headless=True):
        self.headless = headless
        self.ua = UserAgent()

    def _get_proxy(self):
        """Fetches a free proxy."""
        try:
            print("[SCRAPER] Buscando proxy gratuito...")
            # Prefer US/CA/GB for Amazon.com
            proxy = FreeProxy(country_id=['US', 'CA', 'GB'], rand=True, timeout=1).get()
            print(f"[SCRAPER] Proxy encontrado: {proxy}")
            return proxy
        except Exception as e:
            print(f"[WARN] No se pudo obtener proxy: {e}. Usando conexión directa.")
            return None

    def _extract_price(self, item):
        """Helper to extract price with multiple fallbacks."""
        # 1. Standard price block
        price_whole = item.query_selector(".a-price-whole")
        price_fraction = item.query_selector(".a-price-fraction")
        
        if price_whole:
            whole = price_whole.inner_text().replace('\n', '').replace('.', '').replace(',', '').strip()
            fraction = "00"
            if price_fraction:
                fraction = price_fraction.inner_text().replace('\n', '').strip()
            return float(f"{whole}.{fraction}")

        # 2. Offscreen price (often present even if hidden)
        offscreen = item.query_selector(".a-price .a-offscreen")
        if offscreen:
            txt = offscreen.get_attribute("innerText") or offscreen.inner_text()
            return self._parse_price_text(txt)

        # 3. Text fallback (risky but useful)
        # Look for $XX.XX pattern in the whole item text
        import re
        text = item.inner_text()
        match = re.search(r'\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)', text)
        if match:
            return self._parse_price_text(match.group(0))
            
        return 0.0

    def _parse_price_text(self, text):
        try:
            clean = text.replace("$", "").replace(",", "").strip()
            return float(clean)
        except:
            return 0.0

    def search_products(self, keyword, max_products=5):
        """Busca productos en Amazon y devuelve una lista de diccionarios con datos básicos."""
        products = []
        user_agent = self.ua.random
        
        # Intentar con proxy primero, luego directo
        attempts = [True, False] # True = usar proxy, False = directo
        
        for use_proxy in attempts:
            proxy_url = None
            if use_proxy:
                proxy_url = self._get_proxy()
                if not proxy_url:
                    continue # Si no hay proxy, saltar a directo
            
            print(f"[SCRAPER] Iniciando intento {'CON PROXY' if use_proxy else 'DIRECTO'} para '{keyword}'...")

            with sync_playwright() as p:
                browser = p.chromium.launch(
                    headless=self.headless,
                    args=["--disable-blink-features=AutomationControlled"]
                )
                
                context_args = {
                    "user_agent": user_agent,
                    "viewport": {"width": 1920, "height": 1080},
                    "locale": "en-US",
                    "ignore_https_errors": True
                }
                
                if proxy_url:
                    context_args["proxy"] = {"server": proxy_url}
                    
                try:
                    context = browser.new_context(**context_args)
                    page = context.new_page()
                    page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

                    try:
                        search_url = f"https://www.amazon.com/s?k={keyword.replace(' ', '+')}"
                        print(f"[SCRAPER] Navegando a {search_url}")
                        page.goto(search_url, timeout=60000)
                        
                        try:
                            page.wait_for_selector('div[data-component-type="s-search-result"]', timeout=15000)
                        except:
                            print("[WARN] Timeout esperando resultados.")
                            if "captcha" in page.content().lower():
                                print("[ALERT] CAPTCHA DETECTADO")
                                raise Exception("Captcha detected") # Forzar reintento si es proxy

                        # Scroll down
                        page.evaluate("window.scrollTo(0, document.body.scrollHeight / 2)")
                        time.sleep(1)
                        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                        time.sleep(2)

                        items = page.query_selector_all('div[data-component-type="s-search-result"]')
                        print(f"[SCRAPER] Encontrados {len(items)} items.")

                        if len(items) == 0:
                            raise Exception("No items found") # Forzar reintento

                        count = 0
                        for item in items:
                            if count >= max_products:
                                break

                            try:
                                asin = item.get_attribute("data-asin")
                                if not asin: continue

                                # Title
                                title_el = item.query_selector("h2 a span")
                                if not title_el:
                                    title_el = item.query_selector("h2 a")
                                if not title_el:
                                    title_el = item.query_selector(".a-color-base.a-text-normal")
                                if not title_el:
                                    title_el = item.query_selector("span.a-text-normal")
                                    
                                title = title_el.inner_text().strip() if title_el else "Unknown Title"

                                # Rating
                                try:
                                    rating = 0.0
                                    # Try multiple selectors
                                    rating_el = item.query_selector("i[class*='a-icon-star'] span.a-icon-alt")
                                    if not rating_el:
                                        rating_el = item.query_selector("span[aria-label*='stars']")
                                    
                                    if rating_el:
                                        rating_text = rating_el.inner_text() or rating_el.get_attribute("aria-label")
                                        # "4.5 out of 5 stars" -> 4.5
                                        # "4.5 de 5 estrellas" -> 4.5
                                        if rating_text:
                                            first_part = rating_text.split(" ")[0].replace(",", ".")
                                            rating = float(first_part)
                                except:
                                    rating = 0.0

                                # Review Count
                                try:
                                    review_count = 0
                                    review_el = item.query_selector("span.a-size-base.s-underline-text")
                                    if not review_el:
                                        # Fallback: Look for the link next to stars
                                        review_el = item.query_selector("div.a-row.a-size-small span.a-size-base")
                                    
                                    if review_el:
                                        review_text = review_el.inner_text().strip()
                                        # "1,234" -> 1234
                                        # "(1.234)" -> 1234
                                        clean_text = review_text.replace(",", "").replace(".", "").replace("(", "").replace(")", "")
                                        if clean_text.isdigit():
                                            review_count = int(clean_text)
                                except:
                                    review_count = 0

                                # Price
                                current_price = self._extract_price(item)
                                
                                # Original Price
                                original_price_el = item.query_selector(".a-text-price .a-offscreen")
                                original_price = 0.0
                                if original_price_el:
                                    txt = original_price_el.get_attribute("innerText") or original_price_el.inner_text()
                                    original_price = self._parse_price_text(txt)
                                
                                if original_price == 0 or original_price < current_price:
                                    original_price = current_price

                                # Discount
                                discount = 0
                                if original_price > current_price:
                                    discount = int(((original_price - current_price) / original_price) * 100)

                                # Image
                                img_el = item.query_selector(".s-image")
                                image_url = ""
                                if img_el:
                                    # 1. Dynamic
                                    dynamic_data = img_el.get_attribute("data-a-dynamic-image")
                                    if dynamic_data:
                                        try:
                                            data = json.loads(dynamic_data)
                                            if data:
                                                best_url = max(data, key=lambda k: data[k][0] if data[k] else 0)
                                                image_url = best_url
                                        except:
                                            pass
                                    # 2. Srcset
                                    if not image_url:
                                        srcset = img_el.get_attribute("srcset")
                                        if srcset:
                                            image_url = srcset.split(",")[-1].strip().split(" ")[0]
                                    # 3. Data-src
                                    if not image_url:
                                        image_url = img_el.get_attribute("data-src")
                                    # 4. Src
                                    if not image_url:
                                        image_url = img_el.get_attribute("src")

                                # Link
                                link_el = item.query_selector("h2 a")
                                if link_el:
                                    href = link_el.get_attribute("href")
                                    if href.startswith("http"):
                                        product_url = href
                                    else:
                                        product_url = "https://www.amazon.com" + href
                                else:
                                    # Fallback using ASIN
                                    product_url = f"https://www.amazon.com/dp/{asin}"

                                # Coupon
                                coupon_text = None
                                try:
                                    # Look for coupon badge in search results
                                    coupon_el = item.query_selector(".s-coupon-unclipped, .s-coupon-clipped, span.s-coupon-highlight-color")
                                    if coupon_el:
                                        # Usually text is inside a span or the element itself
                                        coupon_text = coupon_el.inner_text().strip()
                                        # Sometimes it says "Save $10 with coupon", sometimes just "Save 10%"
                                        # Let's clean it up if needed, or keep raw
                                        if "coupon" not in coupon_text.lower() and "cupón" not in coupon_text.lower():
                                            coupon_text = f"Cupón: {coupon_text}"
                                except:
                                    pass

                                # Validation
                                if current_price > 0 and title != "Unknown Title":
                                    products.append({
                                        "amazon_id": asin,
                                        "raw_title": title,
                                        "original_price": original_price,
                                        "current_price": current_price,
                                        "discount_percentage": discount,
                                        "image_url": image_url,
                                        "product_url": product_url,
                                        "category": keyword,
                                        "rating": rating,
                                        "review_count": review_count,
                                        "coupon_text": coupon_text
                                    })
                                    count += 1
                                    print(f"   -> [{asin}] ${current_price} - {title[:30]}...")
                            
                            except Exception as e:
                                continue

                        # Si llegamos aquí con productos, éxito
                        if len(products) > 0:
                            return products

                    except Exception as e:
                        print(f"[WARN] Fallo intento {'CON PROXY' if use_proxy else 'DIRECTO'}: {e}")
                        if not use_proxy:
                            print("[ERROR] Todos los intentos fallaron.")
                    
                    finally:
                        context.close()

                except Exception as e:
                    print(f"[ERROR] Error lanzando navegador: {e}")
                
                finally:
                    browser.close()
        
    def verify_product(self, product_url):
        """Verifica si un producto sigue disponible y devuelve su precio actual."""
        print(f"[SCRAPER] Verificando disponibilidad: {product_url}")
        
        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=self.headless,
                args=["--disable-blink-features=AutomationControlled"]
            )
            
            context = browser.new_context(user_agent=self.ua.random)
            page = context.new_page()
            
            try:
                page.goto(product_url, timeout=60000)
                
                # 1. Check for 404 / Dog page
                if "Page Not Found" in page.title() or page.query_selector("img[alt='Dogs of Amazon']"):
                    print("[SCRAPER] Producto NO encontrado (404/Perro).")
                    return {"available": False, "price": 0.0}

                # 2. Check availability text
                availability_el = page.query_selector("#availability")
                if availability_el:
                    text = availability_el.inner_text().lower()
                    if "currently unavailable" in text or "no disponible" in text:
                        print("[SCRAPER] Producto NO disponible (Out of Stock).")
                        return {"available": False, "price": 0.0}

                # 3. Get Price
                # Try multiple selectors for detail page
                price = 0.0
                price_el = page.query_selector(".a-price .a-offscreen")
                if not price_el:
                    price_el = page.query_selector("#price_inside_buybox")
                if not price_el:
                    price_el = page.query_selector("#priceblock_ourprice")
                if not price_el:
                    price_el = page.query_selector("#priceblock_dealprice")
                    
                if price_el:
                    txt = price_el.inner_text()
                    price = self._parse_price_text(txt)

                # 4. Get Best Sellers Rank (BSR)
                bsr = None
                try:
                    # Try multiple selectors for BSR
                    bsr_el = page.query_selector("#SalesRank") or \
                             page.query_selector("th:has-text('Best Sellers Rank') + td") or \
                             page.query_selector("span:has-text('Best Sellers Rank')")
                    
                    if bsr_el:
                        bsr_text = bsr_el.inner_text()
                        # Extract just the first number/category e.g. "#45 in Tools"
                        # Clean up text
                        bsr = bsr_text.split("(")[0].strip()
                        # Limit length
                        if len(bsr) > 100:
                            bsr = bsr[:100]
                except:
                    pass
                
                print(f"[SCRAPER] Producto disponible. Precio: ${price}. BSR: {bsr}")
                return {"available": True, "price": price, "sales_rank": bsr}

            except Exception as e:
                print(f"[WARN] Error verificando producto: {e}")
                # Si falla la carga, asumimos que está disponible para no borrarlo por error de red
                return {"available": True, "price": 0.0} 
            finally:
                browser.close()
        return products


if __name__ == "__main__":
    # Test rápido
    scraper = AmazonScraper(headless=False)
    results = scraper.search_products("gaming laptop", max_products=3)
    print(json.dumps(results, indent=2))
