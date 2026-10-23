# WebGIS Interactivo & Dashboard Multi-Panel Superpave RD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a high-performance 100vh 3-panel WebGIS Dashboard for Superpave PG selection in the Dominican Republic with K-NN spider lines, floating HUD tooltip, interactive station popups, dual spatial interpolation (Ordinary Kriging 2D vs. Voronoi Thiessen), radio-button tile layer switcher, hybrid reverse geocoding, AASHTO M 323 traffic/speed grade bumping, interactive crosshair charts, and a sticky-header data catalog.

**Architecture:** The application remains an autonomous, zero-dependency single-page application built in `tools/template.html` and compiled via `tools/build_and_test.js` to `index.html`, `PG_RD.html`, and `PG_RD_brutalista.html`. CSS Grid defines a strict 100vh full-screen layout with 3 columns (Left Controls 330px, Center Stage 1fr with 5 SPA tabs, Right Inspector 350px). All calculations (Acklam standard normal inverse, Superpave 7-day high PG, low PG, rutting DD, AASHTO grade bumping, 2D ordinary kriging, and Voronoi partitioning) run client-side in pure JavaScript with zero external runtime dependencies beyond Leaflet 1.9.4 and Chart.js 4.4.1.

**Tech Stack:** Vanilla JavaScript (ES6+), Vanilla CSS (Design tokens, CSS Grid, Glassmorphism, Neon HUD, Dark/Light mode), Leaflet.js 1.9.4, Chart.js 4.4.1, Node.js test harness.

**Spec:** `docs/superpowers/specs/2026-10-23-webgis-dashboard-design.md`

## Global Constraints
- `html, body { height: 100vh; overflow: hidden; }` — strictly no global window scrollbars.
- Dual theme support (`:root` dark and `[data-theme="light"]` light) with instant toggle and `localStorage` persistence.
- Zero breakage of the 5 Python verification cases: `|Δ| < 0.01 °C` and exact commercial PG matching.
- Hybrid geocoding: OpenStreetMap Nominatim with instant offline Dominican Republic boundary dictionary fallback.
- Test harness in `tools/build_and_test.js` must pass 100% on every build step.

---

### Task 1: Maquetación CSS Grid 100vh, Sistema de 3 Columnas & Tema Dual (Dark/Light)

**Files:**
- Modify: `tools/template.html:15-1460`
- Test: `tools/build_and_test.js`

**Interfaces:**
- Consumes: CSS variables in `:root`, data structures in `<script id="data">`.
- Produces: CSS layout classes `.workbench-body` (3-column grid), `.dock-sidebar` (controls), `.stage-main` (tabs & views), `.dock-inspector` (results & geocoding), and `setTheme(theme)` toggle function.

- [ ] **Step 1: Escribir la estructura CSS del layout de 3 columnas y variables de tema claro/oscuro**
  Actualizar en `tools/template.html`:
  - Variables de tema claro bajo `[data-theme="light"]` con alto contraste y fondos limpios.
  - `.workbench-body` con `grid-template-columns: 330px 1fr 350px; height: calc(100vh - 60px - 32px); overflow: hidden;`.
  - `.dock-sidebar` y `.dock-inspector` con `overflow-y: auto`.
  - Botón selector de tema `btn-theme-toggle` en `.app-header`.

- [ ] **Step 2: Actualizar el HTML del Header, Sidebar Izquierdo e Inspector Derecho**
  - Header: Botón de tema `☀️ / 🌙`.
  - Sidebar izquierdo: Controles de coordenadas, presets, confiabilidad $R$, sliders de ESALs y velocidad, controles de capa térmica con selector de método (Kriging, Voronoi, IDW) y campos numéricos de variograma (*Range*, *Nugget*, *Sill*).
  - Inspector derecho: Tarjeta de Geocodificación Inversa (Ruta / Provincia), Tarjetas KPI con bordes de color neón, Ficha de estación activa y desglose de pesos de estaciones K-NN.
  - Main stage: Barra de 5 pestañas SPA (`tab-map`, `tab-comp`, `tab-charts`, `tab-cat`, `tab-verif`).

- [ ] **Step 3: Compilar y validar el layout base**
  Ejecutar: `node tools/build_and_test.js`
  Esperar: PASS en todos los casos y compilación exitosa de bundles.

- [ ] **Step 4: Commit de la estructura base**
  `git add tools/template.html tools/build_and_test.js`
  `git commit -m "feat(ui): implementar layout de 3 columnas 100vh y tema dual dark/light"`

---

### Task 2: WebGIS: Spider Lines K-NN, Floating Cursor Tooltip & Popups Interactivos

**Files:**
- Modify: `tools/template.html:1600-1860`
- Test: `tools/build_and_test.js`

**Interfaces:**
- Consumes: `STATIONS` array, Leaflet map instance `map`.
- Produces: `findKNN(lat, lon, k)` function, `updateSpiderLines(e)` event handler, `hudTooltip` DOM controller, `bindStationPopups()` function.

- [ ] **Step 1: Implementar algoritmo espacial K-NN y cálculo de pesos IDW**
  Escribir función `findKNN(lat, lon, k = 4)` que devuelva las $k$ estaciones más cercanas, sus distancias euclidianas $d_i$ y sus pesos normalizados $w_i = (1 / d_i^2) / \sum (1 / d_k^2)$.

- [ ] **Step 2: Implementar trazado de Spider Lines dinámicas en `mousemove`**
  Crear capa `L.layerGroup()` para líneas K-NN. En el evento `mousemove` del mapa:
  - Obtener las 3-4 estaciones más cercanas al puntero.
  - Actualizar polilíneas punteadas neón desde el cursor hacia cada estación con grosor y opacidad proporcionales a su peso.
  - Limpiar líneas en `mouseout`.

- [ ] **Step 3: Implementar Floating Cursor Tooltip (HUD pegado al ratón)**
  Crear elemento HTML `.hud-cursor-tooltip` absoluto con `pointer-events: none`.
  En `mousemove`:
  - Posicionar la caja sobre la pantalla con `transform: translate3d(x + 15, y + 15, 0)`.
  - Renderizar coordenadas en vivo, temperatura estimada interpolada y barra de pesos de las estaciones K-NN.

- [ ] **Step 4: Implementar Popups Interactivos con botón "Seleccionar esta Estación"**
  Actualizar cada marcador de estación `stMarkers[s.id]` para incluir popup con diseño técnico, elevación, temperaturas extremas y botón:
  `<button class="btn-popup-select" data-id="${s.id}">Seleccionar esta Estación</button>`.
  Al hacer clic, centrar mapa, mover el pin del proyecto y ejecutar `setCoord(s.lat, s.lon)`.

- [ ] **Step 5: Ejecutar test de sandbox UI**
  Ejecutar: `node tools/build_and_test.js`
  Esperar: PASS en simulación de eventos Leaflet.

- [ ] **Step 6: Commit de las interacciones WebGIS**
  `git add tools/template.html tools/build_and_test.js`
  `git commit -m "feat(gis): anadir spider lines knn, tooltip hud flotante y popups interactivos"`

---

### Task 3: Motor de Interpolación Espacial Dual: Kriging Ordinario 2D & Diagrama de Voronoi

**Files:**
- Modify: `tools/template.html:1670-1840`
- Test: `tools/build_and_test.js`

**Interfaces:**
- Consumes: Parámetros de variograma (*Range*, *Nugget*, *Sill*), `STATIONS` climáticos.
- Produces: `renderKrigingCanvas()`, `renderVoronoiLayer()`, `updateSpatialOverlay()`, `baseMaps` tile switcher.

- [ ] **Step 1: Implementar resolución matricial de Kriging Ordinario 2D en JavaScript**
  Escribir función `computeKriging(points, variogramParams)`:
  - Construir matriz de covarianza $(N+1) \times (N+1)$ con semivariograma esférico:
    $$\gamma(h) = c_0 + c \cdot (1.5(h/a) - 0.5(h/a)^3)$$
  - Invertir matriz mediante descomposición LU o eliminación gaussiana con pivote parcial.
  - Generar interpolación en grilla regular sobre las fronteras de RD y renderizar en `<canvas>`.

- [ ] **Step 2: Implementar Diagrama de Voronoi (Polígonos de Thiessen)**
  Escribir función `generateVoronoiRD()`:
  - Para cada celda de la grilla territorial de RD, asignar la estación MERRA más cercana.
  - Agrupar en polígonos vectoriales o raster Voronoi y colorear según la paleta térmica activa (verde, amarillo, rojo).

- [ ] **Step 3: Implementar Selector de Mapas Base con Radio Buttons**
  Crear control superior derecho estilizado con Radio Buttons:
  1. Google Híbrido / Satélite (`https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}`)
  2. Esri Dark Canvas HUD
  3. Esri Topográfico
  4. Esri Red Vial (Street)
  5. OpenTopoMap

- [ ] **Step 4: Conectar selector de modo (Kriging / Voronoi / IDW) e inputs de variograma**
  Vincular inputs `kriging-range`, `kriging-nugget`, `kriging-sill` y radio buttons de método para redibujar la capa térmica en tiempo real.

- [ ] **Step 5: Validar ejecución matemática**
  Ejecutar: `node tools/build_and_test.js`
  Esperar: PASS.

- [ ] **Step 6: Commit del motor de interpolación espacial**
  `git add tools/template.html tools/build_and_test.js`
  `git commit -m "feat(gis): implementar interpolacion dual kriging 2d ordinario y diagrama de voronoi"`

---

### Task 4: Geocodificación Inversa Híbrida (Nominatim + Diccionario Offline RD)

**Files:**
- Modify: `tools/template.html:1840-1900`
- Test: `tools/build_and_test.js`

**Interfaces:**
- Consumes: Coordenadas del proyecto $(lat, lon)$.
- Produces: `reverseGeocode(lat, lon)` con actualización del badge de ruta/provincia en el inspector derecho.

- [ ] **Step 1: Construir diccionario poligonal/espacial offline de República Dominicana**
  Definir en JS la tabla de las 32 provincias de RD con sus cajas delimitadoras $(lat_{min}, lat_{max}, lon_{min}, lon_{max})$ y centroides, junto con los principales corredores viales (RD-1 Autopista Duarte, RD-2 Carretera Sánchez, RD-3 Las Américas / Autopista del Este, RD-4 Carretera Mella, RD-5 Carretera Navarrete-Samaná).

- [ ] **Step 2: Implementar resolvedor asíncrono híbrido con debounce**
  Escribir función `lookupLocation(lat, lon)`:
  - Intento 1: Fetch a OpenStreetMap Nominatim con timeout de 1500 ms y `AbortController`.
  - Intento 2 (Fallback): Búsqueda espacial inmediata en el diccionario local de RD.
  - Actualizar tarjeta en inspector: Provincia, Municipio y Nombre de la Vía/Ruta.

- [ ] **Step 3: Conectar a eventos de movimiento del pin y clics en mapa**
  Disparar `lookupLocation(state.lat, state.lon)` en `setCoord()`, arrastre del pin y clics.

- [ ] **Step 4: Validar en el harness de test**
  Ejecutar: `node tools/build_and_test.js`
  Esperar: PASS.

- [ ] **Step 5: Commit del geocodificador híbrido**
  `git add tools/template.html tools/build_and_test.js`
  `git commit -m "feat(geo): implementar geocodificacion inversa hibrida nominatim y offline rd"`

---

### Task 5: Ajuste de Tráfico y Velocidad Superpave (AASHTO M 323) & Inspector de Resultados

**Files:**
- Modify: `tools/template.html:1515-1560`, `tools/template.html:2000-2050`
- Test: `tools/build_and_test.js`

**Interfaces:**
- Consumes: `state.esals` (millones), `state.speed` (rápida/lenta/parada).
- Produces: `PG_alto_ajustado`, `PG_com_final`, actualización de KPI cards en el Inspector Derecho.

- [ ] **Step 1: Extender motor de cálculo con reglas AASHTO M 323 / M 320**
  En `computePG()`:
  - Evaluar nivel de tránsito:
    - Standard ($<0.3\text{M}$ o $0.3-3\text{M}$): sin ajuste de tráfico.
    - Heavy ($3-10\text{M}$): sin ajuste si velocidad $>70\text{ km/h}$.
    - Very Heavy ($>10-30\text{M}$): $+1$ grado comercial en PG Alto ($+6\text{ °C}$).
    - Extremely Heavy ($>30\text{M}$): $+2$ grados comerciales en PG Alto ($+12\text{ °C}$).
  - Evaluar velocidad:
    - Lenta ($20-70\text{ km/h}$): $+1$ grado comercial.
    - Parada ($<20\text{ km/h}$): $+2$ grados comerciales.
  - Combinar ajustes respetando el tope máximo de grado comercial normativo ($PG 100$).

- [ ] **Step 2: Conectar controles UI del panel izquierdo**
  - Deslizador de ESALs con etiquetas claras (0.1M a 50M).
  - Selector de velocidad operativa: Rápida ($>70\text{ km/h}$), Lenta ($20-70\text{ km/h}$), Parada ($<20\text{ km/h}$).

- [ ] **Step 3: Actualizar tarjetas KPI y badges en el Inspector Derecho**
  - KPI 01: PG Alto 7 Días (con badge de temperatura exacta).
  - KPI 02: PG Alto por Demanda de Ahuellamiento.
  - KPI 03: PG Bajo Térmico.
  - KPI 04: Grado Comercial Recomendado con Bumping (ej. `PG 76-10` con indicación de causa: *+1 grado por tráfico pesado* o *+1 grado por velocidad lenta*).
  - Ficha de Estación activa y tabla de pesos K-NN en vivo.

- [ ] **Step 4: Verificar casos de prueba**
  Ejecutar: `node tools/build_and_test.js`
  Esperar: PASS.

- [ ] **Step 5: Commit de reglas de tráfico e inspector**
  `git add tools/template.html tools/build_and_test.js`
  `git commit -m "feat(engine): implementar ajuste aashto m 323 por trafico y velocidad en kpis"`

---

### Task 6: Pestañas 2, 3 y 4: Comparativa, Gráficas con Crosshair y Catálogo Sticky-Header

**Files:**
- Modify: `tools/template.html:1340-1430`, `tools/template.html:1910-2110`
- Test: `tools/build_and_test.js`

**Interfaces:**
- Consumes: `STATIONS`, `computePG()`, Chart.js.
- Produces: Pestaña Comparativa (`tab-comp`), Plugin Crosshair para Chart.js (`tab-charts`), Tabla Sticky-Header interactiva (`tab-cat`), Pestaña Memoria & Verificación (`tab-verif`).

- [ ] **Step 1: Construir Pestaña 2 (Comparativa Multidimensional)**
  - Tabla comparativa entre la estación MERRA asignada y sus 3 vecinas más cercanas.
  - Matriz de sensibilidad de Confiabilidad $R$ ($50\%, 85\%, 90\%, 95\%, 98\%, 99\%$) con temperaturas y grados comerciales resultantes.
  - Matriz 2D de impacto cruzado de Tráfico (ESALs) vs. Velocidad.

- [ ] **Step 2: Construir Pestaña 3 (Gráficas con Cursor Cruzado Interactivo - Crosshair)**
  - Implementar plugin personalizado de Chart.js para dibujar una línea vertical guía (*Crosshair*) en tiempo real sobre el canvas en `mousemove`.
  - Gráfico 1: Curvas de Densidad de Probabilidad (Gauss) para $T_{\text{max}}$ y $T_{\text{min}}$ con crosshair y lectura exacta.
  - Gráfico 2: Serie Temporal Anual (2000–2025) con barras/líneas y crosshair.

- [ ] **Step 3: Construir Pestaña 4 (Catálogo de Datos con Encabezado Fijo)**
  - Tabla con `position: sticky; top: 0` para los encabezados de columna.
  - Barra de búsqueda y filtro instantáneo por nombre o estación.
  - Despliegue de los 16 registros de estaciones o los 416 registros anuales completos.
  - Filas con efecto `hover` iluminado neón y evento `click` que traslada el mapa a dicha estación y la selecciona.

- [ ] **Step 4: Preservar Pestaña 5 (Memoria de Cálculo & Verificación Python vs. JS)**
  - Integrar los 6 pasos analíticos con formato matemático y la tabla de verificación de los 5 casos aprobados con estricta tolerancia.

- [ ] **Step 5: Ejecutar suite de pruebas completa**
  Ejecutar: `node tools/build_and_test.js`
  Esperar: PASS en todos los casos de cálculo y scripts de UI.

- [ ] **Step 6: Commit de las visualizaciones avanzadas**
  `git add tools/template.html tools/build_and_test.js`
  `git commit -m "feat(ui): implementar pestañas de comparativa, graficas con crosshair y catalogo sticky-header"`

---

### Task 7: Compilación Final, Verificación Numérica en Navegador y Handoff

**Files:**
- Modify: `HANDOFF.md`, `CHANGELOG_AGENT.md`
- Compile: `index.html`, `PG_RD.html`, `PG_RD_brutalista.html`
- Test: `tools/build_and_test.js`

- [ ] **Step 1: Compilar todos los bundles y correr pruebas**
  Ejecutar: `node tools/build_and_test.js`
  Verificar que `index.html`, `PG_RD.html` y `PG_RD_brutalista.html` se actualicen correctamente con todas las nuevas características.

- [ ] **Step 2: Verificación visual y funcional en navegador**
  Verificar:
  1. Conmutador de tema oscuro/claro funcional sin parpadeos.
  2. K-NN Spider lines y tooltip HUD respondiendo al mover el mouse.
  3. Alternancia entre Kriging Ordinario 2D y Diagrama de Voronoi.
  4. Selector de mapas base (Google, Esri, OpenTopoMap).
  5. Geocodificación inversa mostrando provincia/carretera al hacer clic.
  6. Deslizadores de tráfico ESALs y velocidad actualizando el grado PG con bumping AASHTO.
  7. Crosshair interactivo en gráficas.
  8. Tabla de catálogo con encabezado fijo y clic funcional.

- [ ] **Step 3: Registrar cambios en CHANGELOG_AGENT.md (append-only) y actualizar HANDOFF.md**
  Registrar los cambios con marca temporal `[YYYY-MM-DD HH:MM]` y actualizar `HANDOFF.md` (máximo 60 líneas).

- [ ] **Step 4: Commit semántico final y sincronización Git**
  `git add .`
  `git commit -m "feat: completar dashboard webgis interactivo con spider lines, voronoi, kriging y catalogo"`
  `git push origin HEAD`
