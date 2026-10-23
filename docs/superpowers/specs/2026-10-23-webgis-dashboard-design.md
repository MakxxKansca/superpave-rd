# Especificación de Diseño: WebGIS Interactivo & Dashboard Multi-Panel Superpave RD

- **Fecha**: 2026-10-23
- **Proyecto**: Superpave PG República Dominicana (Asignación 03)
- **Estado**: Aprobado por el usuario
- **Destino del Bundle**: `tools/template.html` compilado mediante `tools/build_and_test.js` hacia `index.html`, `PG_RD.html` y `PG_RD_brutalista.html`.

---

## 1. Visión General & Objetivos

Transformar la herramienta analítica Superpave PG para República Dominicana en un **Dashboard Multi-Panel WebGIS de Alta Gama (100vh Full-Screen)**, integrando:
1. **WebGIS Avanzado**: Líneas de influencia K-NN dinámicas (*Spider Lines*), tooltip HUD flotante pegado al cursor, popups interactivos en estaciones, interpolación dual continua (Kriging Ordinario 2D vs. Diagrama de Voronoi / Polígonos de Thiessen), selector de mapas base por radio buttons y geocodificación inversa híbrida (Nominatim OSM + diccionario espacial offline de RD).
2. **Estructura UI/UX de 3 Columnas**: Panel de control a la izquierda (~330px), escenario principal al centro (1fr), e inspector técnico a la derecha (~350px), con selector de tema claro/oscuro (*Dark / Light Mode Toggle*).
3. **Controles de Tráfico y Velocidad Superpave**: Ajuste (*Grade Bumping*) según normas AASHTO M 323 / M 320 por nivel de tránsito en ESALs ($<0.3\text{M}$ a $>30\text{M}$) y velocidad operativa ($>70\text{ km/h}$, $20-70\text{ km/h}$, $<20\text{ km/h}$).
4. **Visualizaciones y Pestañas SPA**:
   - Pestaña 1: 🗺️ Mapa Vial (WebGIS Leaflet completo).
   - Pestaña 2: ⚖️ Comparativa (Sensibilidad a confiabilidad $R$, estaciones vecinas e impacto de tráfico).
   - Pestaña 3: 📈 Gráficas (Chart.js con *Crosshair* vertical interactivo en series anuales y curvas normales Gaussianas).
   - Pestaña 4: 📋 Catálogo (Tabla con *sticky header*, búsqueda en vivo, resaltado hover y filas interactivas sincronizadas con el mapa).
   - Pestaña 5: 🔬 Memoria & Verificación (Preservando los 6 pasos analíticos y los 5 casos Python vs. JS).

---

## 2. Arquitectura del Sistema & Layout

### 2.1 Maquetación CSS Grid (100vh sin scroll global)
- `html, body`: Altura exacta `100vh`, `overflow: hidden`, tipografía técnica con Inter / Plus Jakarta Sans y JetBrains Mono.
- `.app-header`: Fijo superior (altura 60px), incluye logo, marca, badges de metadatos, selector de presets de ciudades y botón de conmutación de tema (🌙 / ☀️).
- `.workbench-body`:
  ```css
  display: grid;
  grid-template-columns: 330px 1fr 350px;
  height: calc(100vh - 60px - 32px);
  overflow: hidden;
  ```
- `.dock-sidebar` (Izquierda): Controles de entrada con barra de desplazamiento independiente.
- `.stage-main` (Centro): Barra horizontal de pestañas SPA y contenedor de vistas activas.
- `.dock-inspector` (Derecha): Inspector técnico con geocodificación en vivo, tarjetas KPI con bordes de color neón (verde, azul, amarillo, morado) y desglose de pesos de estaciones.
- `.workbench-statusbar`: Barra de estado inferior técnica (altura 32px).

### 2.2 Tema Dual (Dark SaaS / Light Technical)
- Implementado mediante variables CSS bajo `:root` (Dark por defecto) y `[data-theme="light"]`.
- Almacenamiento de preferencia en `localStorage.getItem('theme')`.

---

## 3. Especificación Detallada del Módulo WebGIS

### 3.1 K-Nearest Neighbors (K-NN) Spider Lines
- Al mover el cursor sobre el mapa (`mousemove` en Leaflet):
  1. Detectar coordenada geográfica $(lat, lon)$ bajo el puntero.
  2. Identificar las $K=3$ o $K=4$ estaciones MERRA-2 más cercanas mediante distancia euclidiana:
     $$d_i = \sqrt{(lat_i - lat)^2 + (lon_i - lon)^2}$$
  3. Dibujar polilíneas dinámicas (`L.polyline` con `dashArray: '3, 6'` y opacidad reactiva) conectando el cursor con cada estación.
  4. Calcular los pesos normalizados según el modelo de distancia inversa ($p=2$):
     $$w_i = \frac{1 / (d_i + \epsilon)^2}{\sum_{k=1}^K 1 / (d_k + \epsilon)^2}$$

### 3.2 Floating Cursor Tooltip (HUD Flotante)
- Elemento HTML flotante `.hud-cursor-tooltip` posicionado con CSS `transform: translate3d(x, y, 0)`.
- Se oculta al salir del mapa (`mouseout`) y se actualiza en tiempo real en `mousemove`:
  - Coordenadas formateadas: `18.520° N, -70.150° W`
  - Variable térmica interpolada (ej. `T. Pavimento Alta: 59.8 °C`)
  - Pesos de influencia: ej. `St 119409 (62%) | St 119408 (25%) | St 119985 (13%)`

### 3.3 Ventana Emergente al Hacer Clic (Interactive Map Popup)
- Marcadores de estación con popup estilizado:
  - Título: `Estación MERRA-2 {ID}`
  - Elevación, $T_{\text{max,7d}}$, $T_{\text{min}}$, $\text{DD}$ promedio
  - Botón interactivo: `<button class="btn-select-st" onclick="selectStation({id})">Seleccionar esta Estación</button>`
  - Al hacer clic, traslada el pin del proyecto al centroide de la estación y recalcula la interfaz.

### 3.4 Motor de Interpolación Espacial Dual
- **Modo 1: Kriging Ordinario 2D**:
  - Resuelve el sistema matricial clásico de Kriging ordinario para los puntos observados:
    $$\begin{bmatrix} \mathbf{\Gamma} & \mathbf{1} \\ \mathbf{1}^T & 0 \end{bmatrix} \begin{bmatrix} \mathbf{\lambda} \\ \mu \end{bmatrix} = \begin{bmatrix} \mathbf{\gamma}_0 \\ 1 \end{bmatrix}$$
  - Semivariograma esférico:
    $$\gamma(h) = c_0 + c \left[ 1.5 \left(\frac{h}{a}\right) - 0.5 \left(\frac{h}{a}\right)^3 \right] \quad (h \le a)$$
  - Parámetros ajustables desde el panel izquierdo: *Nugget* ($c_0$), *Sill* ($c$), *Range* ($a$).
  - Raster continuo dibujado dinámicamente en elemento `<canvas>`.
- **Modo 2: Diagrama de Voronoi (Polígonos de Thiessen)**:
  - Generación de celdas de Voronoi a partir de las coordenadas de las 16 estaciones, recortadas a la frontera de RD.
  - Cada celda se representa como un polígono SVG/Canvas coloreado según el valor térmico de la estación (colores clasificados de azul/verde a amarillo/rojo).
- **Modo 3: IDW Clásico** (opción continua existente optimizada).

### 3.5 Selector de Mapas Base (Tile Layer Switcher)
- Cuadro flotante en la esquina superior derecha con Radio Buttons estilizados:
  - 🛰️ Google Híbrido / Satélite
  - 🌌 Esri Dark Gray Base (HUD)
  - 🚗 Esri Topográfico
  - 🛣️ Esri Red Vial (Street)
  - 🏔️ OpenTopoMap

### 3.6 Geocodificación Inversa Híbrida
- Controlador asíncrono con *debounce* (300 ms) activado en `click` y `dragend` del pin de proyecto:
  1. Petición a `https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&zoom=14`.
  2. Extracción de carretera (`road`), provincia (`state`) y municipio/ciudad (`county` / `city`).
  3. Mecanismo de respaldo local offline: diccionario de polígonos/cajas de las 32 provincias dominicanas y ejes viales principales (RD-1 Autopista Duarte, RD-2 Sánchez, RD-3 Las Américas, RD-4 Mella, etc.) para visualización instantánea y sin fallos si no hay red o si se excede el límite de velocidad.

---

## 4. Controles de Entrada & Reglas de Tráfico AASHTO

### 4.1 Deslizadores de Rango & Selectores
- **Tráfico en Ejes Equivalentes (ESALs en millones)**:
  - Control deslizante con escala logarítmica/por tramos: $<0.3\text{M}$ (Estándar), $0.3-3\text{M}$ (H), $3-10\text{M}$ (V), $>10\text{M}-30\text{M}$ (E), $>30\text{M}$ (Extremo).
- **Velocidad de Operación**:
  - Opciones: Rápida ($>70\text{ km/h}$), Lenta ($20-70\text{ km/h}$), Parada/Congestión ($<20\text{ km/h}$).
- **Ajuste de Grado de Desempeño (*Grade Bumping* AASHTO M 323)**:
  - Tráfico $>10\text{M}$ o velocidad lenta ($20-70\text{ km/h}$): $+1$ grado en PG Alto ($+6\text{ °C}$).
  - Tráfico $>30\text{M}$ o velocidad parada ($<20\text{ km/h}$): $+2$ grados en PG Alto ($+12\text{ °C}$).
  - El PG comercial resultante se muestra en el badge KPI de diseño con desglose técnico.
- **Parámetros del Semivariograma**:
  - Campos numéricos para *Range* (default: 0.85°), *Nugget* (default: 0.15) y *Sill* (default: 1.20).

---

## 5. Visualizaciones por Pestaña (SPA)

### Pestaña 1: 🗺️ Mapa Vial
- Mapa interactivo Leaflet a escala 100% del contenedor central.

### Pestaña 2: ⚖️ Comparativa
- Matriz multidimensional comparando la estación asignada con las 3 estaciones vecinas más influyentes.
- Tabla de sensibilidad de confiabilidad $R$ ($50\%, 85\%, 90\%, 95\%, 98\%, 99\%$) mostrando la evolución de $T_{\text{alto}}$, $T_{\text{bajo}}$ y los grados comerciales.
- Matriz de ajuste de grado por combinaciones de velocidad y ESALs.

### Pestaña 3: 📈 Gráficas con Cursor Cruzado (Crosshair)
- **Campana de Gauss / PDF Normal**: Gráfico de densidades para $T_{\text{max}}$ y $T_{\text{min}}$ con línea vertical (*Crosshair*) que sigue el mouse y etiquetas en tiempo real de temperatura y probabilidad.
- **Serie Histórica Anual (2000–2025)**: Gráfico temporal con cursor cruzado vertical interactivo.

### Pestaña 4: 📋 Catálogo de Estaciones & Registros (Sticky-Header)
- Tabla desplazable con encabezado fijo (`position: sticky; top: 0`).
- Selector de vista:
  - Vista 1: Catálogo de las 16 estaciones MERRA-2 con elevación, coordenadas, estadísticas climáticas y PG.
  - Vista 2: Serie anual histórica detallada (26 registros por estación = 416 registros anuales).
- Buscador interactivo por texto en tiempo real.
- Filas interactivas: al hacer clic en una fila, el mapa vuela a esa coordenada y actualiza el análisis.

### Pestaña 5: 🔬 Memoria & Verificación
- Los 6 pasos de cálculo analítico de la memoria técnica.
- Tabla comparativa de los 5 casos de prueba Python vs. JS (100% aprobados con tolerancia estricta).

---

## 6. Verificación & Criterios de Aceptación
1. `node tools/build_and_test.js` ejecuta sin advertencias ni errores y valida los 5 casos de prueba numéricos contra Python.
2. El script `<script id="ui">` pasa el test de sandboxing y ejecución de eventos sintéticos sin `ReferenceError`.
3. El layout responde a 100vh en monitores de diferentes resoluciones sin crear barras de scroll globales.
4. Las líneas de influencia K-NN y el tooltip flotante operan a 60 FPS al mover el cursor en el mapa.
