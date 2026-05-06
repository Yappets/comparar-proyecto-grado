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
import platform

import requests
import urllib.parse
import unicodedata
import os
from dotenv import load_dotenv
load_dotenv()

from concurrent.futures import ThreadPoolExecutor, as_completed

# ================================
# FUNCIONES MARCA
# ================================
def obtener_marca_desde_producto(driver_detalle, link):
    try:
        driver_detalle.get(link)

        WebDriverWait(driver_detalle, 5).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "span.vtex-store-components-3-x-productBrandName")
            )
        )

        marca_elem = driver_detalle.find_element(
            By.CSS_SELECTOR,
            "span.vtex-store-components-3-x-productBrandName"
        )

        marca = marca_elem.text.strip().lower()
        print(f"🏷️ Marca Selenium: {marca}")
        return marca

    except Exception as e:
        print(f"❌ Error Selenium: {e}")
        return None


def normalizar_titulo_para_api(titulo):
    if not titulo:
        return None

    t = titulo.strip().rstrip(".")
    t = ''.join(c for c in unicodedata.normalize('NFD', t) if unicodedata.category(c) != 'Mn')
    t = re.sub(r'(\d),(\d)', r'\1.\2', t)
    t = t.replace("Lt", "L").replace("lt", "L").replace("Ml", "ml").replace("ML", "ml")
    t = re.sub(r'\s+', ' ', t)

    return t


def obtener_marca_desde_api(titulo):
    try:
        titulo_api = normalizar_titulo_para_api(titulo)

        query = urllib.parse.quote(titulo_api)
        url = f"https://diaonline.supermercadosdia.com.ar/api/catalog_system/pub/products/search?ft={query}"

        headers = {
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json"
        }

        for intento in range(3):
            try:
                time.sleep(0.4)

                response = requests.get(url, headers=headers, timeout=10)

                if response.status_code not in [200, 206]:
                    time.sleep(1)
                    continue

                data = response.json()
                if not data:
                    return None

                titulo_norm = titulo_api.lower()

                for p in data:
                    nombre_api = normalizar_titulo_para_api(p.get("productName", ""))
                    if titulo_norm == nombre_api.lower():
                        return p.get("brand")

                return data[0].get("brand")

            except:
                time.sleep(1)

        return None

    except:
        return None


# ================================
# PARALELIZACIÓN
# ================================
def procesar_item(item):
    link_elem = item.find('a')
    link = f"https://diaonline.supermercadosdia.com.ar{link_elem['href']}" if link_elem else None

    titulo_elem = item.find('span', class_='vtex-product-summary-2-x-productBrand')
    titulo = titulo_elem.get_text(strip=True) if titulo_elem else None

    if titulo:
        titulo = titulo.strip().rstrip(".")

    marca = obtener_marca_desde_api(titulo)

    if not marca:
        marca = titulo.split()[0].lower()

    return {
        "titulo": titulo,
        "marca": marca,
        "link": link,
        "item": item
    }


# ================================
# SELENIUM
# ================================
options = Options()
ES_WINDOWS = platform.system() == "Windows"

options.add_argument("--headless=new")
options.add_argument("--disable-blink-features=AutomationControlled")
options.add_experimental_option("prefs", {"profile.managed_default_content_settings.images": 2})
options.add_argument("user-agent=Mozilla/5.0")

if ES_WINDOWS:
    from webdriver_manager.chrome import ChromeDriverManager
    service = Service(ChromeDriverManager().install())
else:
    service = Service("/usr/bin/chromedriver")
    options.binary_location = "/usr/bin/chromium-browser"

driver = webdriver.Chrome(service=service, options=options)
driver.set_page_load_timeout(20)

driver_detalle = webdriver.Chrome(service=service, options=options)
driver_detalle.set_page_load_timeout(20)

wait = WebDriverWait(driver, 10)

# ================================
# MONGO (NO TOCADO)
# ================================
uri = os.getenv("MONGO_URI") 
client = MongoClient(uri)

db = client["supermercados_db"]
collection = db["productos"]

# ================================
# UTILS
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
        return {"tipo": "SIN_PROMO", "cantidad_bloque": 1, "estructura": [{"unidades": 1, "descuento": 0}]}

    texto = texto.lower()

    match_nxm = re.search(r'(\d+)\s*x\s*(\d+)', texto)
    if match_nxm:
        n, m = int(match_nxm.group(1)), int(match_nxm.group(2))
        return {"tipo": "N_X_M", "cantidad_bloque": n, "estructura": [{"unidades": m, "descuento": 0}, {"unidades": n-m, "descuento": 100}]}

    match_segundo = re.search(r'2do.*?(\d+)%', texto)
    if match_segundo:
        d = int(match_segundo.group(1))
        return {"tipo": "BLOQUE_DESCUENTO", "cantidad_bloque": 2, "estructura": [{"unidades": 1, "descuento": 0}, {"unidades": 1, "descuento": d}]}

    match_desc = re.search(r'-?\s*(\d+)\s*%', texto)
    if match_desc:
        d = int(match_desc.group(1))
        return {"tipo": "DESCUENTO_UNITARIO", "cantidad_bloque": 1, "estructura": [{"unidades": 1, "descuento": d}]}

    return {"tipo": "PROMOCION_NO_CLASIFICADA", "cantidad_bloque": 1, "estructura": [{"unidades": 1, "descuento": 0}]}


def scroll_debug(driver):
    last_count = 0
    for i in range(10):
        driver.execute_script("window.scrollBy(0, 800);")
        time.sleep(1)

        items = driver.find_elements(By.CSS_SELECTOR, "section.vtex-product-summary-2-x-container")
        if len(items) == last_count:
            break
        last_count = len(items)


# ================================
# SCRAPING
# ================================
try:
    supermercado = "Super Dia"

    for pagina_actual in range(1, 50):

        url = f"https://diaonline.supermercadosdia.com.ar/bebidas?page={pagina_actual}"
        print(f"\nPágina {pagina_actual}")

        driver.get(url)

        wait.until(EC.presence_of_all_elements_located(
            (By.CSS_SELECTOR, "section.vtex-product-summary-2-x-container")
        ))

        scroll_debug(driver)

        soup = BeautifulSoup(driver.page_source, "html.parser")
        items = soup.find_all('section', class_='vtex-product-summary-2-x-container')[:16]

        print(f"📦 Productos: {len(items)}")

        # =========================
        # PARALELIZACIÓN
        # =========================
        resultados = []
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(procesar_item, item) for item in items]

            for future in as_completed(futures):
                try:
                    resultados.append(future.result())
                except Exception as e:
                    print(f"❌ Error paralelo: {e}")

        operaciones = []

        for data in resultados:
            item = data["item"]
            titulo = data["titulo"]
            marca = data["marca"]
            link = data["link"]

            # =========================
            # 🔥 PRECIO BASE (TU LÓGICA)
            # =========================
            precio_texto = None

            precio_regular_elem = item.find(
                'span',
                class_='diaio-store-5-x-listPriceValue'
            )

            precio_sin_oferta_elem = item.find(
                'span',
                class_='diaio-store-5-x-sellingPriceValue'
            )

            if precio_regular_elem:
                precio_texto = precio_regular_elem.get_text(strip=True)

            elif precio_sin_oferta_elem:
                precio_texto = precio_sin_oferta_elem.get_text(strip=True)

            else:
                fallback = item.find('div', class_=re.compile("store-theme"))
                if fallback:
                    precio_texto = fallback.get_text(strip=True)

            precio_base = limpiar_precio(precio_texto)

            # =========================
            # 🔥 PROMOCIONES (TU LÓGICA)
            # =========================
            oferta_texto = "No disponible"

            promo_elem = item.find(
                'span',
                class_='vtex-product-highlights-2-x-productHighlightText'
            )

            if promo_elem:
                oferta_texto = promo_elem.get_text(strip=True)

            else:
                descuento_elem = item.find(
                    'span',
                    class_=re.compile("savingsPercentage")
                )

                if descuento_elem:
                    oferta_texto = descuento_elem.get_text(strip=True)

            promocion = parsear_promocion(oferta_texto)

            # =========================
            # IMAGEN
            # =========================
            img = item.find('img')
            imagen = img['src'] if img else None

            # =========================
            # PRODUCTO FINAL
            # =========================
            producto = {
                "titulo": titulo,
                "precio_base": precio_base,
                "imagen": imagen,
                "oferta_texto": oferta_texto,
                "promocion": promocion,
                "link": link,
                "supermercado": supermercado,
                "fecha_scraping": datetime.now(),
                "marca": marca
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

        print(f"✅ Página {pagina_actual} procesada")

finally:
    driver.quit()
    driver_detalle.quit()
    print("🏁 Scraping finalizado")