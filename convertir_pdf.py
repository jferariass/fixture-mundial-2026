import sys

try:
    import fitz  # PyMuPDF
    print("PyMuPDF (fitz) está instalado.")
except ImportError:
    print("PyMuPDF no está instalado. Intentando instalar...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pymupdf"])
    import fitz

def convertir_pdf_a_imagenes(pdf_path):
    doc = fitz.open(pdf_path)
    for i, pagina in enumerate(doc):
        # Convertir a imagen de alta resolución (zoom = 2 para mejor calidad)
        zoom = 2
        mat = fitz.Matrix(zoom, zoom)
        pix = pagina.get_pixmap(matrix=mat)
        output_path = f"preview_pag{i+1}.png"
        pix.save(output_path)
        print(f"Página {i+1} guardada en {output_path}")

if __name__ == "__main__":
    convertir_pdf_a_imagenes("fixture_mundial_2026.pdf")
