# HANDOFF

## Estado Actual
- **Fase**: Publicación y Despliegue en GitHub Pages.
- **Repositorio Público**: [MakxxKansca/superpave-rd](https://github.com/MakxxKansca/superpave-rd)
- **URL en Vivo**: [https://makxxkansca.github.io/superpave-rd/](https://makxxkansca.github.io/superpave-rd/)
- **Entregables Principales**:
  - [index.html](file:///c:/PROYECTOS/01_Ingenieria_Civil/WEB%20PAGE%20TRANSPORTE/index.html) (punto de entrada en GitHub Pages).
  - [PG_RD.html](file:///c:/PROYECTOS/01_Ingenieria_Civil/WEB%20PAGE%20TRANSPORTE/PG_RD.html) (workbench interactivo).
  - [PG_RD_brutalista.html](file:///c:/PROYECTOS/01_Ingenieria_Civil/WEB%20PAGE%20TRANSPORTE/PG_RD_brutalista.html) (variante brutalista).
  - [README.md](file:///c:/PROYECTOS/01_Ingenieria_Civil/WEB%20PAGE%20TRANSPORTE/README.md) (documentación técnica completa con badges y fórmulas).
- **Validación Numérica**: 5/5 casos de prueba cruzada Python vs JS aprobados (error < 5e-9 °C).

## Motor de Mapas y Compatibilidad Web
- Cartografía libre de Esri (Topo, Imagery, Street, Canvas) y OpenTopoMap sin marcas de agua ni API keys.
- Bundle 100% client-side: no requiere servidor dinámico ni base de datos externa.

## Archivos Tocados
- `tools/build_and_test.js`: Emisión simultánea de `PG_RD.html`, `PG_RD_brutalista.html` e `index.html`.
- `index.html`: Entry point para GitHub Pages.
- `README.md`: Documentación formal con formulaciones LTPP, AASHTO M 320 y tabla de pruebas.
- `.gitignore`: Reglas para exclusión de temporales y archivos legados de Colab.
- `CHANGELOG_AGENT.md` y `HANDOFF.md`: Registro de memoria continua del agente.

## Próximo Paso Exacto
- Verificar la propagación del despliegue en GitHub Pages en [https://makxxkansca.github.io/superpave-rd/](https://makxxkansca.github.io/superpave-rd/) y compartir el enlace.
