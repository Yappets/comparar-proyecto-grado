# Instructivo de ejecución local - ComparAR

## 1. Enlace al código fuente

El código fuente completo de la solución se encuentra disponible en el siguiente repositorio público de GitHub:

https://github.com/Yappets/comparar-proyecto-grado

Desde dicho enlace se puede visualizar el código fuente o descargarlo en formato ZIP mediante la opción:

Code → Download ZIP

También puede clonarse utilizando Git mediante el siguiente comando:

```bash
git clone https://github.com/Yappets/comparar-proyecto-grado.git
```

---

## 2. Requisitos para la ejecución local

Para ejecutar el proyecto localmente se requiere tener instalado:

- Node.js.
- npm.
- Git.
- Navegador web.
- Variables de entorno del backend y frontend.
- Acceso a una base de datos MongoDB con datos de prueba.

El proyecto se encuentra dividido en dos partes principales:

- `backend`: API desarrollada con Node.js, Express y TypeScript.
- `frontend`: aplicación web desarrollada con React y TypeScript.

---

## 3. Usuario de prueba

Para facilitar la evaluación del sistema, se proporciona el siguiente usuario de prueba:

- Email: comparar.oficial@gmail.com
- Contraseña: ComparAR2026!

Este usuario permite ingresar al sistema y probar las funcionalidades principales de la aplicación, siempre que la ejecución local utilice la base de datos de prueba configurada.

Además, para validar la funcionalidad de recuperación de contraseña, se puede acceder a la cuenta de correo de prueba indicada anteriormente. La contraseña de la cuenta de correo es la misma:

- Email: comparar.oficial@gmail.com
- Contraseña del correo: ComparAR2026!

Esta cuenta fue creada únicamente con fines de prueba del sistema.

---

## 4. Datos de prueba

Para la ejecución local, el sistema debe conectarse a una base de datos MongoDB que cuente con datos de prueba.

Los datos disponibles incluyen:

- Productos de supermercados.
- Precios base.
- Promociones.
- Imágenes de productos.
- Enlaces a productos en los supermercados.
- Supermercados disponibles.
- Usuario de prueba.
- Direcciones de prueba.

Los scripts de scraping se incluyen dentro del proyecto como mecanismo de actualización de datos, pero no son necesarios para realizar la prueba inicial del sistema si se utiliza la base de datos de prueba provista.

Por motivos de seguridad, las credenciales reales de conexión a la base de datos no se incluyen en el repositorio público. Las variables de entorno necesarias para la evaluación local se entregan por separado al evaluador.

---

## 5. Pasos para ejecutar la aplicación localmente

### 5.1 Descargar o clonar el proyecto

Clonar el repositorio desde GitHub:

```bash
git clone https://github.com/Yappets/comparar-proyecto-grado.git
```

Ingresar a la carpeta del proyecto:

```bash
cd comparar-proyecto-grado
```

Si el proyecto fue descargado como ZIP, se debe descomprimir el archivo e ingresar a la carpeta principal del proyecto.

---

### 5.2 Configurar variables de entorno

Para ejecutar el sistema localmente se deben crear dos archivos `.env`:

```txt
backend/.env
frontend/.env
```

Las variables reales necesarias para la evaluación local se entregan por separado al evaluador, ya que contienen credenciales privadas.

#### Archivo `backend/.env`

Crear el archivo `.env` dentro de la carpeta `backend`.

La estructura debe quedar de la siguiente manera:

```txt
backend
├── src
├── package.json
└── .env
```

Contenido de ejemplo:

```env
# SERVER
PORT=5000

# DATABASE
MONGO_URI=URI_DE_MONGODB

# FRONTEND
FRONT_URL=http://localhost:5173

# MAIL
EMAIL_USER=CORREO_DE_PRUEBA
EMAIL_PASS=CONTRASEÑA_O_APP_PASSWORD

# RESEND
RESEND_API_KEY=API_KEY_DE_RESEND

# GEOLOCATION
LOCATIONIQ_API_KEY=API_KEY_DE_LOCATIONIQ
```

#### Archivo `frontend/.env`

Crear el archivo `.env` dentro de la carpeta `frontend`.

La estructura debe quedar de la siguiente manera:

```txt
frontend
├── src
├── package.json
└── .env
```

Contenido:

```env
VITE_API_URL=http://localhost:5000
```

---

### 5.3 Instalar dependencias del backend

Ingresar a la carpeta del backend:

```bash
cd backend
```

Instalar las dependencias:

```bash
npm install
```

---

### 5.4 Ejecutar el backend

Desde la carpeta `backend`, ejecutar:

```bash
npm run dev
```

El backend quedará disponible en:

```txt
http://localhost:5000
```

Para verificar que el backend funciona, abrir en el navegador:

```txt
http://localhost:5000
```

Debería mostrarse un mensaje indicando que la API está funcionando correctamente.

---

### 5.5 Instalar dependencias del frontend

Abrir otra terminal e ingresar a la carpeta `frontend`:

```bash
cd frontend
```

Instalar las dependencias:

```bash
npm install
```

---

### 5.6 Ejecutar el frontend

Desde la carpeta `frontend`, ejecutar:

```bash
npm run dev
```

La aplicación quedará disponible en:

```txt
http://localhost:5173
```

Abrir ese enlace en el navegador para utilizar el sistema localmente.

---

### 5.7 Iniciar sesión

Presionar el ícono de usuario e ingresar con el usuario de prueba:

- Email: comparar.oficial@gmail.com
- Contraseña: ComparAR2026!

Luego de iniciar sesión, el sistema permite acceder al perfil, gestionar direcciones y utilizar las funcionalidades asociadas al usuario.

Si se ejecuta el sistema con una base de datos vacía, será necesario registrar un nuevo usuario desde la pantalla de registro o cargar previamente un usuario de prueba en MongoDB.

---

### 5.8 Agregar o seleccionar una dirección

Desde la pantalla principal, presionar sobre la opción de dirección.

El sistema permite:

- Buscar una dirección.
- Seleccionar una ubicación desde el mapa.
- Guardar una dirección asociada al usuario.

La ubicación se utiliza para calcular distancias aproximadas respecto a los supermercados disponibles.

---

### 5.9 Buscar productos

Desde la pantalla principal se puede:

- Buscar productos por nombre.
- Visualizar ofertas destacadas.
- Activar o desactivar el filtro de ofertas.
- Ingresar a la categoría “Bebidas”.

La categoría “Bebidas” es la principal categoría implementada en el prototipo, debido al alcance definido para la carga y comparación de productos.

---

### 5.10 Ver detalle de producto

Al seleccionar un producto, el sistema muestra una pantalla de detalle donde se puede visualizar:

- Nombre del producto.
- Imagen.
- Precio base.
- Supermercados donde se encuentra disponible.
- Promociones aplicables.
- Precio calculado considerando promociones.
- Comparación entre supermercados.

Esta funcionalidad permite analizar un mismo producto o productos equivalentes entre distintos supermercados.

---

### 5.11 Agregar productos al carrito

Desde una tarjeta de producto o desde el detalle, presionar el botón “Agregar”.

El producto se incorpora al carrito con una cantidad inicial.

Desde el carrito se puede:

- Ver los productos agregados.
- Modificar cantidades.
- Eliminar productos.
- Vaciar el carrito.

---

### 5.12 Comparar precios del carrito

Abrir el carrito para visualizar la comparación de precios entre supermercados.

El sistema calcula el total considerando:

- Productos seleccionados.
- Cantidades.
- Precios disponibles.
- Promociones aplicables.
- Disponibilidad de productos por supermercado.

De esta manera, el usuario puede identificar qué supermercado resulta más conveniente para la compra simulada.

---

### 5.13 Ver producto en el supermercado

Desde la pantalla de compra, presionar el botón “Ver”.

Esta acción abre el producto en el sitio web del supermercado correspondiente.

La aplicación no realiza pagos ni compras dentro del sistema. El objetivo es comparar precios y redirigir al usuario al sitio del supermercado para continuar la compra fuera de la plataforma.

---

### 5.14 Probar vista mobile / responsive

La aplicación cuenta con diseño responsive, por lo que puede utilizarse tanto en computadoras de escritorio como en dispositivos móviles.

Para probar la vista mobile desde una computadora, se puede utilizar la herramienta de inspección del navegador:

1. Abrir la aplicación en el navegador.
2. Hacer clic derecho sobre la página y seleccionar “Inspeccionar”.
3. Activar la opción de vista responsive o vista de dispositivo móvil.
4. Seleccionar un tamaño de pantalla móvil.
5. Recargar la página si fuera necesario.

De esta manera se puede verificar el comportamiento de la aplicación en su versión mobile, incluyendo la navegación inferior, visualización de productos, búsqueda, categorías, carrito y gestión de dirección.

---

## 6. Recuperación de contraseña

El sistema cuenta con la funcionalidad “Olvidé mi contraseña”, disponible desde la pantalla de inicio de sesión.

Para probar esta funcionalidad se debe ingresar el correo del usuario de prueba:

- Email: comparar.oficial@gmail.com

El sistema enviará un correo con un código de recuperación y un enlace para restablecer la contraseña.

Para verificar el correo recibido, se puede acceder a la cuenta de correo de prueba con la misma contraseña indicada anteriormente:

- Email: comparar.oficial@gmail.com
- Contraseña del correo: ComparAR2026!

Por seguridad, el sistema muestra una respuesta genérica aunque el correo ingresado no exista en la base de datos. Esto evita revelar si un email se encuentra registrado o no en la plataforma.

Si no se configuran correctamente las variables de correo en local, el resto del sistema puede funcionar, pero no se enviarán emails reales de recuperación de contraseña.

El enlace y el código de recuperación tienen una validez limitada de tiempo.

---

## 7. Funcionalidades principales disponibles para la prueba

La ejecución local permite probar las siguientes funcionalidades:

- Registro e inicio de sesión de usuarios.
- Inicio de sesión con usuario de prueba, si se utiliza la base de datos provista.
- Recuperación de contraseña, si se configuran las variables de correo.
- Gestión de dirección del usuario.
- Búsqueda de productos.
- Visualización de productos con promociones.
- Visualización del detalle de producto.
- Comparación de precios entre supermercados.
- Agregado de productos al carrito.
- Cálculo de totales considerando cantidades y promociones.
- Visualización de disponibilidad por supermercado.
- Redirección al sitio web del supermercado mediante el botón “Ver”.
- Diseño responsive con vista desktop y mobile.

---

## 8. Observaciones

La aplicación fue desarrollada como prototipo funcional para comparar precios y promociones de productos de supermercados.

Para la ejecución local se requiere configurar correctamente las variables de entorno del backend y del frontend.

Las credenciales reales de base de datos, correo y servicios externos no se incluyen en el repositorio público por motivos de seguridad. Para la evaluación local, dichas variables se entregan por separado al evaluador.

Los scripts de scraping incluidos en el repositorio forman parte del mecanismo de carga y actualización de datos, pero su ejecución no es requerida si se utiliza una base de datos de prueba ya cargada.

La aplicación no realiza pagos, compras ni integración directa con los sistemas internos de los supermercados. Su finalidad es permitir la comparación de precios y promociones, y redirigir al usuario al sitio web del supermercado correspondiente.

La funcionalidad de recuperación de contraseña se encuentra disponible, pero en ejecución local depende de la correcta configuración de las variables de correo.

La velocidad de carga de los productos puede variar según la conexión a internet, el servicio de base de datos utilizado y el entorno donde se ejecute el backend.

El sistema cuenta con diseño responsive. Por lo tanto, además de probarse en vista de escritorio, también puede evaluarse en vista mobile utilizando las herramientas de inspección del navegador o accediendo desde un dispositivo móvil.