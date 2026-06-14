# Fixture Mundial FIFA 2026 — Interactivo y Automático 🏆⚽

Este proyecto contiene un fixture interactivo y automático para el **Mundial de Fútbol FIFA 2026**, diseñado para visualizar todo el calendario del torneo, las tablas de posiciones de los grupos (A al L) y el cuadro de la fase de eliminación directa (Playoffs).

La aplicación es completamente automatizada, adaptada a la **Hora de Argentina (GMT-3)**, y permite descargar el fixture en formato PDF con los goles reales ya impresos.

---

## 🌟 Características Principales

1. **Portal Web de Consulta 100% Automático:**
   - La aplicación web (`index.html`, `app.js`, `styles.css`) consume datos de partidos en vivo desde una API en tiempo real.
   - Actualiza automáticamente los marcadores, los puntos en la tabla de posiciones y define los clasificados de la fase de grupos al cuadro de eliminación directa.
   - No requiere edición manual: se ha deshabilitado cualquier entrada manual para garantizar que la información sea oficial y fidedigna.

2. **Horarios Sincronizados (Hora de Argentina GMT-3):**
   - Todos los partidos del Mundial 2026 tienen configurados sus días y horarios oficiales, convertidos a la zona horaria de Argentina.

3. **PDF Imprimible y Descargable:**
   - Permite descargar la versión imprimible en PDF de 4 páginas en formato A4 apaisado.
   - El PDF se genera automáticamente desde Python, incluyendo los goles y marcadores reales de los partidos que ya se han disputado.
   - Los partidos futuros mantienen sus casillas vacías `[   ] - [   ]` para poder completarse a mano si se imprime.

---

## 📁 Estructura del Proyecto

*   `index.html`: Estructura HTML5 de la aplicación web del fixture.
*   `app.js`: Lógica en JavaScript para el consumo de la API, renderizado del calendario, cálculo automático de tablas de grupos, playoffs y control de pestañas.
*   `styles.css`: Estilos visuales con un diseño moderno de alta gama (fondos con césped difuminado, tipografías personalizadas y diseño adaptativo).
*   `generar_fixture.py`: Script en Python que utiliza la biblioteca `reportlab` para generar el PDF del fixture de 4 páginas con colores temáticos y los marcadores en tiempo real.
*   `convertir_pdf.py`: Script auxiliar en Python que permite convertir el PDF a imágenes (requiere `pdf2image`).
*   `descargar_recursos.py`: Script de utilidad para descargar las banderas y assets gráficos necesarios para el fixture.
*   `banderas/`: Directorio que contiene las banderas en formato PNG de las selecciones participantes.
*   `fuentes/`: Directorio con las fuentes tipográficas del proyecto (como Outfit).
*   `fixture_mundial_2026.pdf`: El fixture en formato PDF listo para descargar.
*   `.gitignore`: Define los archivos temporales e innecesarios que se omiten del control de versiones.

---

## 🚀 Cómo Empezar

### 💻 Ejecutar la Aplicación Web
Solo necesitas abrir el archivo `index.html` en tu navegador favorito:
```bash
# Simplemente haz doble clic sobre index.html o ábrelo desde la terminal:
start index.html
```

### 🐍 Generar el PDF Localmente
Si deseas modificar el código de Python y regenerar el archivo PDF:
1. Asegúrate de tener Python instalado.
2. Instala la dependencia `reportlab`:
   ```bash
   pip install reportlab
   ```
3. Ejecuta el script generador:
   ```bash
   python generar_fixture.py
   ```
   Esto actualizará el archivo `fixture_mundial_2026.pdf` con los datos configurados en el script.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3 Vanilla, JavaScript ES6 (Consumo de API Fetch).
- **Backend / Automatización:** Python 3, ReportLab (Generación de PDF vectorial).
- **Control de Versiones:** Git & GitHub.
