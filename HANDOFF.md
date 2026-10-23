# HANDOFF

## Estado Actual
- **Fase**: Mapa de Calor Térmico (Heatmap) Desplegado en GitHub Pages.
- **Repositorio Público**: [MakxxKansca/superpave-rd](https://github.com/MakxxKansca/superpave-rd)
- **URL en Vivo**: [https://makxxkansca.github.io/superpave-rd/](https://makxxkansca.github.io/superpave-rd/)
- **Entregables Principales**:
  - [index.html](file:///c:/PROYECTOS/01_Ingenieria_Civil/WEB%20PAGE%20TRANSPORTE/index.html) (punto de entrada en GitHub Pages con Heatmap).
  - [PG_RD.html](file:///c:/PROYECTOS/01_Ingenieria_Civil/WEB%20PAGE%20TRANSPORTE/PG_RD.html) y [PG_RD_brutalista.html](file:///c:/PROYECTOS/01_Ingenieria_Civil/WEB%20PAGE%20TRANSPORTE/PG_RD_brutalista.html).
  - [README.md](file:///c:/PROYECTOS/01_Ingenieria_Civil/WEB%20PAGE%20TRANSPORTE/README.md) (documentación con sección de Capa Térmica).
- **Validación Numérica**: 5/5 casos de prueba cruzada Python vs JS aprobados (error < 5e-9 °C).

## Características de la Capa Térmica (Heatmap)
- **Algoritmo**: Interpolación IDW ($1/d^2$) sobre grilla de $0.07^\circ$ (~1,400 puntos) recortada al territorio dominicano.
- **Variables Seleccionables**:
  1. 🔥 *T. Pavimento Alta (PG Alto)*: Zonas críticas de calor según LTPP y confiabilidad $R$.
  2. ❄️ *T. Pavimento Baja (PG Bajo)*: Gradiente térmico nocturno y de montaña.
  3. ⚠️ *Demanda Ahuellamiento (DD)*: Severidad plástica y acumulación de daño.
  4. ☀️ *Temp. Máx. Aire (7 Días)*: Promedio histórico 2000–2025.
- **Controles y Visualización**:
  - Switch on/off en Sección 04 del sidebar dock y en control de capas de Leaflet.
  - Slider de opacidad térmica (20% – 100%).
  - Leyenda flotante dinámica en esquina superior derecha con valores mín, prom y máx en $^{\circ}\text{C}$.
  - Fallback offline integrado de Leaflet.heat para compatibilidad total `file:///`.

## Archivos Tocados
- `tools/template.html`: Implementación del motor de calor, estilos y leyenda.
- `tools/leaflet-heat.min.js`: Script minificado como respaldo offline.
- `index.html`, `PG_RD.html`, `PG_RD_brutalista.html`: Bundles compilados.
- `README.md`: Documentación de la nueva funcionalidad.
- `CHANGELOG_AGENT.md` y `HANDOFF.md`: Registro de memoria.

## Próximo Paso Exacto
- Abrir [https://makxxkansca.github.io/superpave-rd/](https://makxxkansca.github.io/superpave-rd/) o el archivo local [index.html](file:///c:/PROYECTOS/01_Ingenieria_Civil/WEB%20PAGE%20TRANSPORTE/index.html) para explorar el nuevo mapa de calor interactivo y alternar entre las variables térmicas.
