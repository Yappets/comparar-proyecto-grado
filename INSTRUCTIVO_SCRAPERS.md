# Instructivo de ejecución de scrapers - ComparAR

## 1. Aclaración inicial

Los scripts de scraping forman parte del proyecto como mecanismo de carga y actualización de productos.

Su ejecución es opcional para la evaluación, ya que la versión online y la base de datos de prueba cuentan con productos previamente cargados.

Los scrapers permiten actualizar:

- Productos.
- Precios.
- Promociones.
- Imágenes.
- Enlaces a productos.
- Fecha de scraping.
- Supermercado de origen.
- Marca u otros datos complementarios.

---

## 2. Ubicación de los scrapers

Los scripts se encuentran dentro del backend, en la siguiente carpeta:

```txt
backend/scrapers
```

En esa carpeta se encuentran los scrapers correspondientes a los supermercados utilizados en el proyecto:

```txt
dia_scraper.py
jumbo_scraper.py
vea_scraper.py
```

Estos archivos se encuentran separados del código principal de la API para mantener organizada la lógica de extracción de datos.

---

## 3. Requisitos previos

Para ejecutar los scrapers se requiere tener instalado:

- Python.
- Google Chrome o Chromium.
- Conexión a internet.
- Dependencias de Python necesarias.
- Archivo `.env` del backend configurado.

Los scrapers utilizan Selenium para cargar las páginas de los supermercados y BeautifulSoup para procesar la información obtenida.

---

## 4. Configuración requerida

Los scrapers utilizan el mismo archivo `.env` del backend.

Por lo tanto, si el archivo:

```txt
backend/.env
```

ya se encuentra configurado correctamente para ejecutar el backend, también sirve para ejecutar los scrapers.

La variable principal utilizada por los scrapers es:

```env
MONGO_URI=URI_DE_MONGODB
```

Esta variable permite conectar los scripts con la base de datos MongoDB donde se guardan o actualizan los productos obtenidos.

No es necesario crear un archivo `.env` adicional para los scrapers.

Por seguridad, la URI real de MongoDB no se incluye en el repositorio público. Para la evaluación local, las variables reales se entregan por separado al evaluador.

---

## 5. Instalar dependencias de Python

Desde la carpeta `backend`, ejecutar:

```bash
cd backend
pip install selenium beautifulsoup4 pymongo python-dotenv webdriver-manager requests
```

En algunos entornos puede ser necesario usar:

```bash
python -m pip install selenium beautifulsoup4 pymongo python-dotenv webdriver-manager requests
```

---

## 6. Ejecutar los scrapers

Desde la raíz del proyecto, ingresar a la carpeta de scrapers:

```bash
cd backend/scrapers
```

Luego ejecutar el scraper correspondiente.

Ejemplo para Super Día:

```bash
python dia_scraper.py
```

Ejemplo para Super Jumbo:

```bash
python jumbo_scraper.py
```

Ejemplo para Super Vea:

```bash
python vea_scraper.py
```

En algunos entornos puede ser necesario usar:

```bash
python3 dia_scraper.py
```

---

## 7. Resultado esperado

Al ejecutarse correctamente, cada scraper obtiene información desde el sitio web del supermercado correspondiente.

Luego, los datos se guardan o actualizan en la colección `productos` de la base de datos MongoDB configurada mediante `MONGO_URI`.

Estos productos son utilizados posteriormente por la aplicación para:

- Mostrar productos y ofertas.
- Comparar precios entre supermercados.
- Aplicar promociones.
- Calcular totales en el carrito.
- Redirigir al usuario al producto en el sitio web del supermercado.

---

## 8. Impacto en la base de datos

Los scrapers actualizan la colección `productos` de la base de datos configurada en `MONGO_URI`.

Este comportamiento es esperado, ya que el sistema funciona como comparador de precios y necesita mantener actualizados los precios, promociones, imágenes y enlaces de los productos.

La actualización se realiza mediante operaciones `upsert`.

Esto significa que:

- Si el producto ya existe en la base de datos, se actualizan sus datos.
- Si el producto no existe, se inserta como un nuevo registro.
- Los scrapers no eliminan productos de la base de datos.

La identificación de cada producto se realiza principalmente por el título del producto y el supermercado correspondiente.

Por ejemplo, si ya existe un producto con el mismo título y supermercado, el scraper actualiza su precio, promoción, imagen, enlace y fecha de scraping.

---

## 9. Manejo de carga de páginas

Los scrapers incorporan mecanismos de reintento durante la carga de páginas.

Esto permite volver a intentar la carga cuando una página demora demasiado o cuando Selenium no detecta los productos en el primer intento.

Además, los scripts realizan desplazamiento automático de la página para forzar la carga de productos dinámicos antes de extraer la información.

---

## 10. Relación con la prueba del sistema

La ejecución de los scrapers no es obligatoria para evaluar las funcionalidades principales del sistema.

La base de datos de prueba ya cuenta con productos cargados, por lo que el evaluador puede probar la aplicación sin ejecutar estos scripts.

Los scrapers se incluyen para mostrar cómo se realiza la carga y actualización de datos desde los sitios web de los supermercados.

En caso de ejecutarlos, los datos de productos pueden actualizarse con la información obtenida en ese momento desde los sitios web correspondientes.

---

## 11. Observación final

La finalidad de los scrapers es alimentar la base de datos con información pública obtenida desde los sitios web de los supermercados.

La aplicación no depende de la ejecución inmediata de los scrapers para funcionar si ya existen datos cargados en MongoDB.

Sin embargo, al tratarse de un comparador de precios, la ejecución periódica de los scrapers permite mantener la información más actualizada.

Para una prueba funcional rápida se recomienda utilizar primero la versión online o la ejecución local con base de datos de prueba ya configurada. La ejecución de los scrapers queda disponible como mecanismo opcional de actualización de datos.