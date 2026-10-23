# Superpave PG Workbench · República Dominicana 🇩🇴
### Asignación 03 · Ingeniería de Pavimentos & Transporte

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen?logo=github&style=for-the-badge)](https://makxxkansca.github.io/superpave-rd/)
[![Leaflet](https://img.shields.io/badge/Maps-Leaflet%201.9-199900?logo=leaflet&style=for-the-badge)](https://leafletjs.com/)
[![Chart.js](https://img.shields.io/badge/Charts-Chart.js%204.4-FF6384?logo=chartdotjs&style=for-the-badge)](https://www.chartjs.org/)
[![Norma](https://img.shields.io/badge/Standard-AASHTO%20M%20320-blue?style=for-the-badge)](https://www.transportation.org/)
[![Validation](https://img.shields.io/badge/Python%20Cross--Check-5%2F5%20PASS-success?style=for-the-badge)](#validación-numérica-y-precisión)

Workbench interactivo de ingeniería civil de alta precisión para el cálculo, análisis geoespacial y selección del **Grado de Desempeño (Performance Grade - PG)** de ligantes asfálticos en toda la **República Dominicana**, conforme a las metodologías **Superpave (AASHTO M 320)** y modelos **LTPP (Long-Term Pavement Performance)**.

---

## 🌐 Aplicación Web en Vivo

Puedes acceder y utilizar el workbench directamente desde tu navegador sin instalar nada:

👉 **[https://makxxkansca.github.io/superpave-rd/](https://makxxkansca.github.io/superpave-rd/)**

> **Vistas disponibles:**
> - [Versión Workbench Principal (index.html / PG_RD.html)](https://makxxkansca.github.io/superpave-rd/)
> - [Versión Brutalista de Alto Contraste (PG_RD_brutalista.html)](https://makxxkansca.github.io/superpave-rd/PG_RD_brutalista.html)

---

## 🚀 Características Principales

- **44 Estaciones Meteorológicas de República Dominicana**: Base de datos de series históricas de temperatura máxima de 7 días consecutivos y mínimas anuales en todo el territorio nacional.
- **Cálculo de Grado de Desempeño (PG)**:
  - **PG Alto (Temperatura Máxima de Pavimento)**: Algoritmo LTPP a 20 mm de profundidad con ajuste por latitud y nivel de confiabilidad estadística ($R \in [50\%, 98\%]$).
  - **PG Bajo (Temperatura Mínima de Pavimento)**: Modelo empírico a la superficie del pavimento con confiabilidad estadística Gaussiana.
  - **Susceptibilidad a Ahuellamiento (Rutting)**: Cálculo del parámetro de daño relativo con respecto a $52\,^\circ\text{C}$ y selección del grado de desempeño para rigidez a altas temperaturas de servicio.
- **Cartografía Geoespacial Multicapa (Sin Marcas de Agua ni API Keys)**:
  - 🗺️ *Esri World Topo Map*: Malla vial completa, poblados y relieve topográfico detallado (por defecto).
  - 🛰️ *Esri World Imagery*: Fotografía aérea y satelital de alta resolución.
  - 🛣️ *Esri World Street Map*: Enfoque urbano y red de autopistas.
  - 📐 *Esri Light Gray Canvas*: Cartografía técnica minimalista de alto contraste.
  - ⛰️ *OpenTopoMap*: Curvas de nivel y relieve sombreado.
- **Gráficos Analíticos Dinámicos**:
  - Series temporales multianuales de temperaturas máximas y mínimas por estación.
  - Curvas de distribución normal Gaussiana con indicador del percentil de confiabilidad seleccionado ($Z \cdot \sigma$).
- **🔥 Mapa de Calor Térmico Interactivo (Heatmap)**:
  - Interpolación continua en tiempo real mediante **IDW (Inverse Distance Weighting)** sobre toda la geografía y red vial de República Dominicana.
  - Selección dinámica de variable térmica:
    - 🔥 **Temperatura Alta de Pavimento ($T_{\text{pav, alto}}$)**: Detección visual de zonas críticas de calor (Cibao, Línea Noroeste, Valle de San Juan, Santo Domingo).
    - ❄️ **Temperatura Baja de Pavimento ($T_{\text{pav, bajo}}$)**: Gradiente térmico nocturno e invernal (Cordillera Central, Constanza, Jarabacoa vs litorales).
    - ⚠️ **Demanda por Ahuellamiento (DD)**: Acumulación de daño y severidad plástica.
    - ☀️ **Temperatura Máxima del Aire (7 días consecutivos)**.
  - Control de opacidad térmica deslizable (20% – 100%), activación/desactivación instantánea y leyenda flotante calibrada en $^{\circ}\text{C}$.
- **Modo Standalone / 100% Client-Side**:
  - Funciona tanto online mediante GitHub Pages como en modo offline local (`file:///`).
  - Cero dependencias de backend: los datasets y los algoritmos residen integrados en el bundle HTML/JS.

---

## 📐 Fundamento Teórico y Metodología

### 1. Temperatura Alta de Diseño del Pavimento ($T_{\text{pav, alto}}$)
A partir de la media ($\bar{T}_{\text{air, max}}$) y desviación estándar ($\sigma$) del promedio de 7 días consecutivos más calurosos:
$$T_{\text{air, max, } R} = \bar{T}_{\text{air, max}} + Z_R \cdot \sigma_{\text{air, max}}$$

A una profundidad de $d = 20\text{ mm}$ y latitud $\phi$ (grados):
$$T_{\text{pav, alto}} = (T_{\text{air, max, } R} - 0.00618 \cdot \phi^2 + 0.2289 \cdot \phi + 24.4) \cdot \left(0.9545 - 0.00075 \cdot d\right) - 0.063$$

El grado alto se redondea al múltiplo estándar de $6\,^\circ\text{C}$ inmediatamente superior:
$$\text{PG}_{\text{alto}} = 6 \cdot \left\lceil \frac{T_{\text{pav, alto}}}{6} \right\rceil$$

### 2. Temperatura Baja de Diseño del Pavimento ($T_{\text{pav, bajo}}$)
A partir de la temperatura mínima anual del aire con confiabilidad $R$:
$$T_{\text{air, min, } R} = \bar{T}_{\text{air, min}} - Z_R \cdot \sigma_{\text{air, min}}$$
$$T_{\text{pav, bajo}} = 0.859 \cdot T_{\text{air, min, } R} + 1.7\,^\circ\text{C}$$

El grado bajo se redondea al múltiplo estándar de $6\,^\circ\text{C}$ hacia abajo (lado conservador):
$$\text{PG}_{\text{bajo}} = -6 \cdot \left\lceil \frac{|T_{\text{pav, bajo}}|}{6} \right\rceil \quad \text{o el valor normativo más desfavorable}$$

### 3. Daño Relativo por Ahuellamiento (Rutting)
Se evalúa la acumulación de deformación permanente y la temperatura efectiva requerida para el ligante:
$$\text{DD} = \sum \exp\left( \frac{-E_a}{R \cdot (T_k)} \right)$$

---

## 🧪 Validación Numérica y Precisión

El motor matemático de JavaScript implementado en el workbench fue auditado y sometido a **validación cruzada** contra una suite independiente en Python (`tools/preprocess_and_verify.py` vs `tools/build_and_test.js`):

| Caso de Prueba | Coordenadas $(\phi, \lambda)$ | Confiabilidad ($R / R_{\text{ah}}$) | Estación ID | $T_{\text{pav, alto}}$ | $T_{\text{pav, bajo}}$ | PG Resultante | Error Máximo vs Python |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Santo Domingo** | `18.508, -70.006` | $98\% / 50\%$ | `119409` | $60.4337\,^\circ\text{C}$ | $14.8942\,^\circ\text{C}$ | **PG 64-10 (Ah: 82)** | $< 4.93 \times 10^{-9}$ |
| **Santiago** | `19.451, -70.697` | $98\% / 50\%$ | `120560` | $61.5927\,^\circ\text{C}$ | $12.8923\,^\circ\text{C}$ | **PG 64-10 (Ah: 82)** | $< 5.01 \times 10^{-9}$ |
| **La Romana** | `18.427, -68.972` | $50\% / 50\%$ | `119411` | $54.5616\,^\circ\text{C}$ | $20.3907\,^\circ\text{C}$ | **PG 58-10 (Ah: 82)** | $< 1.42 \times 10^{-14}$ |
| **Barahona** | `18.208, -71.100` | $98\% / 98\%$ | `118831` | $58.1823\,^\circ\text{C}$ | $15.3593\,^\circ\text{C}$ | **PG 64-10 (Ah: 82)** | $< 4.93 \times 10^{-9}$ |
| **Puerto Plata** | `19.790, -70.690` | $90\% / 90\%$ | `120560` | $59.1862\,^\circ\text{C}$ | $14.5402\,^\circ\text{C}$ | **PG 64-10 (Ah: 82)** | $< 4.32 \times 10^{-9}$ |

**Resultado:** 5/5 pruebas aprobadas con tolerancia nula a discrepancias (`PASS`).

---

## 📁 Estructura del Repositorio

```text
├── index.html                   # Punto de entrada principal servido por GitHub Pages
├── PG_RD.html                   # Workbench interactivo completo (bundle standalone)
├── PG_RD_brutalista.html        # Variante de estilo brutalista de alto contraste
├── asignacion_03.pdf            # Enunciado y requerimientos técnicos de la asignación
├── data_temp_RD.txt             # Dataset meteorológico de temperaturas crudas
├── estaciones_RD.txt            # Catálogo de 44 estaciones con coordenadas geográficas
├── PG RepDominicana.ipynb       # Libreta original de análisis exploratorio
├── tools/
│   ├── annual_series.json       # Series anuales preprocesadas de 7 días consecutivos
│   ├── verificacion_python.json # Vectores de prueba generados por script Python
│   ├── preprocess_and_verify.py # Script de extracción estadística y prueba de oráculo
│   ├── template.html            # Plantilla modular HTML5 con Leaflet y Chart.js
│   └── build_and_test.js        # Compilador de bundles y runner de tests numéricos
└── README.md                    # Documentación técnica completa
```

---

## 💻 Ejecución Local

Para ejecutar el workbench en tu máquina local:

### Opción 1: Abrir directamente (Sin servidor)
Haz doble clic en [index.html](file:///c:/PROYECTOS/01_Ingenieria_Civil/WEB%20PAGE%20TRANSPORTE/index.html) o arrástralo a cualquier navegador web (Chrome, Edge, Firefox, Safari).

### Opción 2: Con servidor local de desarrollo
Si dispones de Python o Node.js:
```bash
# Con Python
python -m http.server 8000

# Con Node.js
npx serve .
```
Luego abre `http://localhost:8000` en tu navegador.

### Opción 3: Recompilar y validar
Para reejecutar la compilación del bundle y correr la suite de verificación matemática:
```bash
node tools/build_and_test.js
```

---

## 👨‍💻 Autor y Asignatura

- **Asignatura:** Pavimentos / Ingeniería de Transporte
- **Entorno:** Workbench Interactivo para Selección de Ligantes Asfálticos Superpave
- **Región de Estudio:** República Dominicana 🇩🇴
