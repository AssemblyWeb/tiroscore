# TiroScore

Pequeño dashboard para mostrar los resultados de una planilla de tiro (arquero, estaciones y puntajes).

Contenido principal:
- `index.html` — interfaz del dashboard (módulo ES).
- `index.js` — datos y cálculos exportados como `export default tiroData`.
- Datos del arquero en `arquero` y metadatos de estaciones en `estaciones`.

Cómo abrirlo (recomendado):
1. Abrir terminal y situarse en la carpeta del proyecto:
   cd /Users/alfio/Documents/TiroScore
2. Levantar un servidor local (necesario para importar módulos ES desde el navegador):
   python3 -m http.server 8000
3. Abrir en el navegador:
   http://localhost:8000

Notas:
- `index.js` debe exportar un objeto por defecto (`export default tiroData;`) para que `index.html` lo importe como módulo.
- Si trabajás con Node/paquetes, ignorá los archivos listados en `.gitignore`.
- Para reportar problemas: editar `index.js` o `index.html` en el directorio indicado.

Licencia: uso personal / educativo.