# Happy Labour Day 👷

[![forthebadge](https://forthebadge.com/badges/made-with-javascript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/badges/built-with-love.svg)](https://www.linkedin.com/in/drphp/)

Landing page conmemorativa por el Dia del Trabajador.

[![Video](https://img.youtube.com/vi/VXpRDStn5Yk/0.jpg)](https://www.youtube.com/watch?v=VXpRDStn5Yk)

[![Video Demo](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=VXpRDStn5Yk)

## Cómo ejecutar el proyecto 🚀

1. Clonar el proyecto.

```bash
git clone https://github.com/phpeitor/happy-labour-day.git
cd happy-labour-day
```

2. Instala la extensión Live Server en VS Code.
3. Abre `index.html` con Live Server.
4. Prueba el responsive con las DevTools (F12) → Modo dispositivo → selecciona tamaño móvil.

### Opción 2: Abrir el HTML directamente 🌐

Puedes abrir `index.html` en el navegador. Para mejor experiencia:
1. Sirve desde un servidor local (recomendado para pruebas de responsive).
2. Abre las DevTools en modo móvil para validar el diseño adaptatativo.

### Opción 3: Hosting en línea 🌍

Sube los archivos a tu servidor web (Apache, Nginx, etc.) y accede desde dispositivos reales para probar completamente el responsive en móvil.

## Como funciona

- Muestra un video de fondo en bucle.
- Renderiza el mensaje principal: "Feliz dia del Trabajador".
- Agrega una linea secundaria dinamica segun el parametro `id` en la URL:
	- Si existe `id`, lo decodifica en base64 y lo usa como nombre o firma.
	- Si no existe, muestra un mensaje general.

Ejemplo con parametro:

```txt
index.html?id=Sm9zZQ==
```

## Estructura del proyecto

```txt
.
|-- index.html
|-- README.md
|-- REGLAS_DESARROLLO.md
|-- css/
|   |-- style.css
|   |-- fonts.css
|   |-- fonts/
|       |-- 1cXxaUPXBpj2rGoU7C9WhnGFucE.woff2
|       |-- 1cXxaUPXBpj2rGoU7C9WiHGF.woff2
|-- js/
|   |-- main.js
|-- video/
```

## Convenciones de desarrollo

- No mezclar CSS ni JavaScript dentro de las vistas HTML.
- Mantener estilos en `css/` y scripts en `js/`.
- Mantener fuentes dentro de `css/fonts/` y referenciarlas desde `css/fonts.css`.

Para el detalle completo de reglas, revisar `REGLAS_DESARROLLO.md`.