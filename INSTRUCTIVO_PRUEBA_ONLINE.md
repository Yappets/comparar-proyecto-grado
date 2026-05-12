# Instructivo de prueba online - ComparAR

## 1. Enlace al código fuente

El código fuente completo de la solución se encuentra disponible en el siguiente repositorio público de GitHub:

https://github.com/Yappets/comparar-proyecto-grado

Desde dicho enlace se puede visualizar el código fuente o descargarlo en formato ZIP mediante la opción:

Code → Download ZIP

---

## 2. Enlace a la aplicación desplegada

La aplicación se encuentra disponible para su prueba directa desde navegador en:

https://comparar-proyecto-grado.vercel.app

No es necesario instalar dependencias ni configurar un entorno local para realizar la prueba online.

---

## 3. Usuario de prueba

Para facilitar la evaluación del sistema, se proporciona el siguiente usuario de prueba:

- Email: comparar.oficial@gmail.com
- Contraseña: ComparAR2026!

Este usuario permite ingresar al sistema y probar las funcionalidades principales de la aplicación.

Además, para validar la funcionalidad de recuperación de contraseña, se puede acceder a la cuenta de correo de prueba indicada anteriormente. La contraseña de la cuenta de correo es la misma:

- Email: comparar.oficial@gmail.com
- Contraseña del correo: ComparAR2026!

Esta cuenta fue creada únicamente con fines de prueba del sistema.

---

## 4. Datos de prueba

La versión desplegada cuenta con datos de prueba cargados en una base de datos MongoDB Atlas.

Los datos disponibles incluyen:

- Productos de supermercados.
- Precios base.
- Promociones.
- Imágenes de productos.
- Enlaces a productos en los supermercados.
- Supermercados disponibles.
- Usuario de prueba.
- Direcciones de prueba.

Los scripts de scraping se incluyen dentro del proyecto como mecanismo de actualización de datos, pero no son necesarios para realizar la prueba inicial del sistema, ya que la versión online cuenta con información previamente cargada.

---

## 5. Pasos para probar la aplicación

### 5.1 Ingresar al sistema

Abrir el siguiente enlace en el navegador:

https://comparar-proyecto-grado.vercel.app

---

### 5.2 Iniciar sesión

Presionar el ícono de usuario e ingresar con el usuario de prueba:

- Email: comparar.oficial@gmail.com
- Contraseña: ComparAR2026!

Luego de iniciar sesión, el sistema permite acceder al perfil, gestionar direcciones y utilizar las funcionalidades asociadas al usuario.

---

### 5.3 Agregar o seleccionar una dirección

Desde la pantalla principal, presionar sobre la opción de dirección.

El sistema permite:

- Buscar una dirección.
- Seleccionar una ubicación desde el mapa.
- Guardar una dirección asociada al usuario.

La ubicación se utiliza para calcular distancias aproximadas respecto a los supermercados disponibles.

---

### 5.4 Buscar productos

Desde la pantalla principal se puede:

- Buscar productos por nombre.
- Visualizar ofertas destacadas.
- Activar o desactivar el filtro de ofertas.
- Ingresar a la categoría “Bebidas”.

La categoría “Bebidas” es la principal categoría implementada en el prototipo, debido al alcance definido para la carga y comparación de productos.

---

### 5.5 Ver detalle de producto

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

### 5.6 Agregar productos al carrito

Desde una tarjeta de producto o desde el detalle, presionar el botón “Agregar”.

El producto se incorpora al carrito con una cantidad inicial.

Desde el carrito se puede:

- Ver los productos agregados.
- Modificar cantidades.
- Eliminar productos.
- Vaciar el carrito.

---

### 5.7 Comparar precios del carrito

Abrir el carrito para visualizar la comparación de precios entre supermercados.

El sistema calcula el total considerando:

- Productos seleccionados.
- Cantidades.
- Precios disponibles.
- Promociones aplicables.
- Disponibilidad de productos por supermercado.

De esta manera, el usuario puede identificar qué supermercado resulta más conveniente para la compra simulada.

---

### 5.8 Ver producto en el supermercado

Desde la pantalla de compra, presionar el botón “Ver”.

Esta acción abre el producto en el sitio web del supermercado correspondiente.

La aplicación no realiza pagos ni compras dentro del sistema. El objetivo es comparar precios y redirigir al usuario al sitio del supermercado para continuar la compra fuera de la plataforma.

---

### 5.9 Probar vista mobile / responsive

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

En la versión desplegada, el envío real de correos se encuentra configurado para el entorno de prueba. Debido a las limitaciones del servicio de correo utilizado en su modalidad gratuita/prueba, la recuperación debe validarse con el correo de prueba indicado anteriormente.

El enlace y el código de recuperación tienen una validez limitada de tiempo.

---

## 7. Funcionalidades principales disponibles para la prueba

La versión online permite probar las siguientes funcionalidades:

- Registro e inicio de sesión de usuarios.
- Inicio de sesión con usuario de prueba.
- Recuperación de contraseña.
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

La versión online utiliza datos de prueba previamente cargados, por lo que no es necesario ejecutar los scripts de scraping para realizar la evaluación.

Los scripts de scraping incluidos en el repositorio forman parte del mecanismo de carga y actualización de datos, pero su ejecución no es requerida para probar el sistema desplegado.

La aplicación no realiza pagos, compras ni integración directa con los sistemas internos de los supermercados. Su finalidad es permitir la comparación de precios y promociones, y redirigir al usuario al sitio web del supermercado correspondiente.

La funcionalidad de recuperación de contraseña se encuentra disponible, pero en el entorno de prueba el envío real del correo está limitado al usuario de prueba configurado.

La velocidad de carga de los productos puede variar debido a que el backend se encuentra desplegado en un servicio de hosting gratuito. En algunos casos, si el servidor estuvo inactivo durante un período de tiempo, la primera carga puede demorar más de lo habitual. Luego de esa primera solicitud, el sistema suele responder con mayor rapidez.

El sistema cuenta con diseño responsive. Por lo tanto, además de probarse en vista de escritorio, también puede evaluarse en vista mobile utilizando las herramientas de inspección del navegador o accediendo desde un dispositivo móvil.