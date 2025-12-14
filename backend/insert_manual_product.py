import sys
import json
import os
from playwright.sync_api import sync_playwright
from fake_useragent import UserAgent
from supabase import create_client
from dotenv import load_dotenv

from pathlib import Path

# Load env from frontend/.env.local
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / 'frontend' / '.env.local'
load_dotenv(dotenv_path=env_path)

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") # Use Service Role to bypass RLS
supabase = create_client(url, key)

class ProductImporter:
    def __init__(self):
        self.ua = UserAgent()

    def scrape_and_insert(self, product_url):
        print(f"[IMPORTER] Scraping: {product_url}")
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                user_agent=self.ua.random,
                viewport={"width": 1920, "height": 1080}
            )
            page = context.new_page()
            
            try:
                print(f"Navigating to {product_url}...")
                page.goto(product_url, timeout=60000)
                page.wait_for_load_state("domcontentloaded")
                page.wait_for_timeout(3000) # Wait for redirects/js

                print(f"Page Title: {page.title()}")
                
                if "captcha" in page.content().lower():
                    print("[ERROR] Captcha detected!")
                    return False

                # 1. Title (Desktop & Mobile selectors)
                title_el = page.query_selector("#productTitle") or \
                           page.query_selector("#title") or \
                           page.query_selector("h1") or \
                           page.query_selector(".a-size-large")
                
                title = title_el.inner_text().strip() if title_el else "Unknown Title"
                print(f"Title: {title}")

                # 2. Price
                price = 0.0
                price_text = ""
                
                # Priority: Deal Price > Buy Box > Generic
                selectors = [
                    "#corePriceDisplay_desktop_feature_div .a-price.a-text-price.a-size-medium.apexPriceToPay .a-offscreen", # Deal Price (Desktop)
                    "#corePrice_desktop .a-price.apexPriceToPay .a-offscreen", # Deal Price (Desktop Alt)
                    "#priceblock_dealprice", # Old style deal
                    "#priceblock_ourprice", # Standard price
                    "#price_inside_buybox", # Buy box
                    ".a-price.priceToPay .a-offscreen", # Generic "Price to Pay"
                    ".a-price .a-offscreen" # Fallback (might be list price)
                ]

                price_el = None
                for sel in selectors:
                    price_el = page.query_selector(sel)
                    if price_el:
                        print(f"Found price with selector: {sel}")
                        break

                if price_el:
                    price_text = price_el.inner_text().strip()
                    print(f"Raw Price Text: '{price_text}'")
                    
                    try:
                        # Clean up: "$19.99" -> 19.99, "19.99\n." -> 19.99
                        clean = price_text.replace("$", "").replace(",", "").replace("\n", ".").strip()
                        # Handle "19." case from a-price-whole
                        if clean.endswith("."):
                            # Try to find fraction
                            fraction_el = page.query_selector(".a-price-fraction")
                            if fraction_el:
                                clean += fraction_el.inner_text().strip()
                        
                        price = float(clean)
                    except:
                        print(f"[WARN] Could not parse price: {price_text}")
                        price = 0.0
                
                if price == 0.0:
                     # Fallback: Regex search in body
                     import re
                     content = page.content()
                     match = re.search(r'\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)', content)
                     if match:
                         try:
                             price = float(match.group(1).replace(",", ""))
                             print(f"Regex Price: {price}")
                         except:
                             pass

                print(f"Final Price: {price}")

                # 3. Image
                image_url = ""
                img_el = page.query_selector("#landingImage") or page.query_selector("#imgBlkFront")
                if img_el:
                    image_url = img_el.get_attribute("src")
                print(f"Image: {image_url}")

                # 4. BSR
                bsr = "N/A"
                try:
                    bsr_el = page.query_selector("#SalesRank") or \
                             page.query_selector("th:has-text('Best Sellers Rank') + td")
                    if bsr_el:
                        bsr = bsr_el.inner_text().split("(")[0].strip()
                except:
                    pass
                
                # 5. Insert
                clean_title = title[:80]
                slug = clean_title.lower().replace(" ", "-").replace("/", "-")[:50]
                
                payload = {
                    "amazon_id": "MANUAL_" + str(int(price)), # Mock ID
                    "clean_title": clean_title,
                    "title": title,
                    "current_price": price,
                    "original_price": price * 1.2,
                    "discount_percentage": 20,
                    "image_url": image_url,
                    "product_url": product_url,
                    "category": "Manual Import",
                    "lumina_score": 90,
                    "ai_badge": "🔥 Manual Pick",
                    "ai_summary": "Producto seleccionado manualmente para prueba de ventas.",
                    "sales_phrase": "Oportunidad verificada.",
                    "sales_rank": bsr,
                    "slug": slug
                }

                data, count = supabase.table("products").insert(payload).execute()
                print(f"[SUCCESS] Product inserted: {slug}")
                return True

            except Exception as e:
                print(f"[ERROR] Failed to scrape: {e}")
                return False
            finally:
                browser.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python insert_manual_product.py <url>")
        sys.exit(1)
    
    importer = ProductImporter()
    importer.scrape_and_insert(sys.argv[1])
