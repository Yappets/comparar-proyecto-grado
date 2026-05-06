# ================================
# IMPORTS
# ================================
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from bs4 import BeautifulSoup
from pymongo import MongoClient, UpdateOne

from datetime import datetime
import time
import re
import os
import platform

from dotenv import load_dotenv
load_dotenv()





# ================================
# CONFIG SELENIUM (AUTO OS)
# ================================
options = Options()

ES_WINDOWS = platform.system() == "Windows"
options.add_argument("--headless=new")

if not ES_WINDOWS:
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")

options.add_argument("--disable-blink-features=AutomationControlled")

prefs = {
    "profile.managed_default_content_settings.images": 2
}
options.add_experimental_option("prefs", prefs)

options.add_argument(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
)

# ================================
# DRIVER
# ================================
if ES_WINDOWS:
    from webdriver_manager.chrome import ChromeDriverManager
    service = Service(ChromeDriverManager().install())
else:
    service = Service("/usr/bin/chromedriver")
    options.binary_location = "/usr/bin/chromium-browser"

driver = webdriver.Chrome(service=service, options=options)
driver.set_page_load_timeout(20)

wait = WebDriverWait(driver, 10)

# ================================
# MONGODB
# ================================
uri = os.getenv("MONGO_URI") 
client = MongoClient(uri)


db = client["supermercados_db"]
collection = db["productos"]

# ================================
# FUNCIONES
# ================================
def limpiar_precio(precio_texto):
    if not precio_texto:
        return 0
    limpio = precio_texto.replace("$", "").replace(".", "").replace(",", ".").strip()
    try:
        return float(limpio)
    except:
        return 0


def parsear_promocion(texto):
    if not texto or "no disponible" in texto.lower():
        return {
            "tipo": "SIN_PROMO",
            "cantidad_bloque": 1,
            "estructura": [
                {"unidades": 1, "descuento": 0}
            ]
        }

    texto = texto.lower()

    # =========================
    # N x M (6x5, 3x2, etc)
    # =========================
    match_nxm = re.search(r'(\d+)\s*x\s*(\d+)', texto)
    if match_nxm:
        n = int(match_nxm.group(1))
        m = int(match_nxm.group(2))
        return {
            "tipo": "N_X_M",
            "cantidad_bloque": n,
            "estructura": [
                {"unidades": m, "descuento": 0},
                {"unidades": n - m, "descuento": 100}
            ]
        }

    # =========================
    # 2do al X%
    # =========================
    match_segundo = re.search(r'2do.*?(\d+)%', texto)
    if match_segundo:
        descuento = int(match_segundo.group(1))
        return {
            "tipo": "BLOQUE_DESCUENTO",
            "cantidad_bloque": 2,
            "estructura": [
                {"unidades": 1, "descuento": 0},
                {"unidades": 1, "descuento": descuento}
            ]
        }

    # =========================
    # Descuento simple
    # =========================
    match_desc = re.search(r'-?\s*(\d+)\s*%', texto)
    if match_desc:
        descuento = int(match_desc.group(1))
        return {
            "tipo": "DESCUENTO_UNITARIO",
            "cantidad_bloque": 1,
            "estructura": [
                {"unidades": 1, "descuento": descuento}
            ]
        }

    # =========================
    # Default
    # =========================
    return {
        "tipo": "PROMOCION_NO_CLASIFICADA",
        "cantidad_bloque": 1,
        "estructura": [
            {"unidades": 1, "descuento": 0}
        ]
    }


def scroll_rapido(driver):
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(2)


def scroll_debug(driver):
    print("🔽 Iniciando scroll progresivo...")

    last_count = 0

    for i in range(10):
        driver.execute_script("window.scrollBy(0, 800);")
        time.sleep(1)

        items = driver.find_elements(By.CSS_SELECTOR, "section.vtex-product-summary-2-x-container")
        current_count = len(items)

        print(f"📜 Scroll {i+1}: {current_count} productos")

        if current_count == last_count:
            print("⛔ No cargaron más productos")
            break

        last_count = current_count

# ================================
# SCRAPING
# ================================
try:
    supermercado = "Super Vea"

    for pagina_actual in range(1, 50):

        url = f"https://www.vea.com.ar/bebidas?page={pagina_actual}"
        print(f"Página {pagina_actual}")

        for intento in range(3):
            try:
                driver.get(url)
                print(f"\n🌐 URL cargada: {url}")
                print("⏳ Esperando carga inicial...")

                wait.until(EC.presence_of_all_elements_located(
                    (By.CSS_SELECTOR, "section.vtex-product-summary-2-x-container")
                ))

                print("✅ Primeros productos detectados")
                break
            except:
                print(f"Retry {intento+1}")
                time.sleep(2)

                
        initial_items = driver.find_elements(By.CSS_SELECTOR, "section.vtex-product-summary-2-x-container")
        print(f"🧩 Productos iniciales (sin scroll): {len(initial_items)}")

        height = driver.execute_script("return document.body.scrollHeight")
        print(f"📏 Altura página: {height}")

        #scroll_rapido(driver)
        scroll_debug(driver)
        final_items_selenium = driver.find_elements(By.CSS_SELECTOR, "section.vtex-product-summary-2-x-container")
        print(f"🟢 Total productos (Selenium): {len(final_items_selenium)}")

        soup = BeautifulSoup(driver.page_source, "html.parser")
        items = soup.find_all('section', class_='vtex-product-summary-2-x-container')


        print(f"🍲 Total productos (BeautifulSoup): {len(items)}")

        if len(final_items_selenium) != len(items):
            print("⚠️ Diferencia entre Selenium y BeautifulSoup")

        print(f"📦 Productos encontrados (final): {len(items)}")

        operaciones = []

        for item in items:

            titulo_elem = item.find('h2')
            titulo = titulo_elem.get_text(strip=True) if titulo_elem else None

           
            # MARCA REAL DESDE DOM
        
            marca_elem = item.find(
                'span',
                class_='vtex-product-summary-2-x-productBrandName'
            )

            marca_real = None

            if marca_elem:
                marca_real = marca_elem.get_text(strip=True).lower()

          
          
           
            # PRECIO BASE 
        

            precio_texto = None

            precio_regular_elem = item.find(
                'div',
                class_='veaargentina-store-theme-2t-mVsKNpKjmCAEM_AMCQH'
            )

            precio_sin_oferta_elem = item.find(
                'div',
                class_='veaargentina-store-theme-1dCOMij_MzTzZOCohX1K7w'
            )

            if precio_regular_elem:
                precio_texto = precio_regular_elem.get_text(strip=True)

            elif precio_sin_oferta_elem:
                precio_texto = precio_sin_oferta_elem.get_text(strip=True)

            else:
                # fallback por si cambia VTEX
                fallback = item.find('div', class_=re.compile("store-theme"))
                if fallback:
                    precio_texto = fallback.get_text(strip=True)

            precio_base = limpiar_precio(precio_texto)

            # =========================
            # OFERTA
            # =========================
            oferta_texto = "No disponible"

            oferta_elem = item.find('div', class_=re.compile("store-theme-1LCA"))
            if oferta_elem:
                oferta_texto = oferta_elem.get_text(strip=True)
            else:
                badge = item.find("div", title=re.compile(r'%|\d+\s*x\s*\d+', re.IGNORECASE))
                if badge:
                    oferta_texto = badge.get_text(strip=True)

            promocion = parsear_promocion(oferta_texto)

            # Imagen
            img = item.find('img')
            imagen = img['src'] if img else None

            # Link
            link_elem = item.find('a')
            link = f"https://www.vea.com.ar{link_elem['href']}" if link_elem else None

            producto = {
                "titulo": titulo,
                "precio_base": precio_base,
                "imagen": imagen,
                "oferta_texto": oferta_texto,
                "promocion": promocion,
                "link": link,
                "supermercado": supermercado,
                "fecha_scraping": datetime.now(),
                "marca":marca_real,
                 
            }

            operaciones.append(
                UpdateOne(
                    {"titulo": titulo, "supermercado": supermercado},
                    {"$set": producto},
                    upsert=True
                )
            )

        if operaciones:
            collection.bulk_write(operaciones)

        print(f"Página {pagina_actual} procesada")

finally:
    driver.quit()
    print("Scraping finalizado")