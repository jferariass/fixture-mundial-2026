import os
import requests

PAISES = {
    "MEX": {"nombre": "México", "bandera_code": "mx"},
    "RSA": {"nombre": "Sudáfrica", "bandera_code": "za"},
    "KOR": {"nombre": "Corea del Sur", "bandera_code": "kr"},
    "CZE": {"nombre": "R. Checa", "bandera_code": "cz"},
    "CAN": {"nombre": "Canadá", "bandera_code": "ca"},
    "BIH": {"nombre": "Bosnia y H.", "bandera_code": "ba"},
    "QAT": {"nombre": "Catar", "bandera_code": "qa"},
    "SUI": {"nombre": "Suiza", "bandera_code": "ch"},
    "BRA": {"nombre": "Brasil", "bandera_code": "br"},
    "MAR": {"nombre": "Marruecos", "bandera_code": "ma"},
    "HAI": {"nombre": "Haití", "bandera_code": "ht"},
    "SCO": {"nombre": "Escocia", "bandera_code": "gb-sct"},
    "USA": {"nombre": "EE. UU.", "bandera_code": "us"},
    "PAR": {"nombre": "Paraguay", "bandera_code": "py"},
    "AUS": {"nombre": "Australia", "bandera_code": "au"},
    "TUR": {"nombre": "Turquía", "bandera_code": "tr"},
    "GER": {"nombre": "Alemania", "bandera_code": "de"},
    "CUW": {"nombre": "Curazao", "bandera_code": "cw"},
    "CIV": {"nombre": "C. de Marfil", "bandera_code": "ci"},
    "ECU": {"nombre": "Ecuador", "bandera_code": "ec"},
    "NED": {"nombre": "Países Bajos", "bandera_code": "nl"},
    "JPN": {"nombre": "Japón", "bandera_code": "jp"},
    "SWE": {"nombre": "Suecia", "bandera_code": "se"},
    "TUN": {"nombre": "Túnez", "bandera_code": "tn"},
    "BEL": {"nombre": "Bélgica", "bandera_code": "be"},
    "EGY": {"nombre": "Egipto", "bandera_code": "eg"},
    "IRN": {"nombre": "Irán", "bandera_code": "ir"},
    "NZL": {"nombre": "N. Zelanda", "bandera_code": "nz"},
    "ESP": {"nombre": "España", "bandera_code": "es"},
    "CPV": {"nombre": "Cabo Verde", "bandera_code": "cv"},
    "KSA": {"nombre": "Arabia Saudita", "bandera_code": "sa"},
    "URU": {"nombre": "Uruguay", "bandera_code": "uy"},
    "FRA": {"nombre": "Francia", "bandera_code": "fr"},
    "SEN": {"nombre": "Senegal", "bandera_code": "sn"},
    "IRQ": {"nombre": "Irak", "bandera_code": "iq"},
    "NOR": {"nombre": "Noruega", "bandera_code": "no"},
    "ARG": {"nombre": "Argentina", "bandera_code": "ar"},
    "ALG": {"nombre": "Argelia", "bandera_code": "dz"},
    "AUT": {"nombre": "Austria", "bandera_code": "at"},
    "JOR": {"nombre": "Jordania", "bandera_code": "jo"},
    "POR": {"nombre": "Portugal", "bandera_code": "pt"},
    "COD": {"nombre": "RD Congo", "bandera_code": "cd"},
    "UZB": {"nombre": "Uzbekistán", "bandera_code": "uz"},
    "COL": {"nombre": "Colombia", "bandera_code": "co"},
    "ENG": {"nombre": "Inglaterra", "bandera_code": "gb-eng"},
    "CRO": {"nombre": "Croacia", "bandera_code": "hr"},
    "GHA": {"nombre": "Ghana", "bandera_code": "gh"},
    "PAN": {"nombre": "Panamá", "bandera_code": "pa"},
}

# URLs de fuentes de Google Fonts
FUENTES = {
    "ArchivoBlack-Regular.ttf": "https://github.com/google/fonts/raw/main/ofl/archivoblack/ArchivoBlack-Regular.ttf",
    "Montserrat-Regular.ttf": "https://github.com/google/fonts/raw/main/ofl/montserrat/Montserrat-Regular.ttf",
    "Montserrat-Bold.ttf": "https://github.com/google/fonts/raw/main/ofl/montserrat/static/Montserrat-Bold.ttf",
}

def descargar_archivo(url, destino):
    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        with open(destino, "wb") as f:
            f.write(response.content)
        print(f"Descargado: {destino}")
        return True
    except Exception as e:
        print(f"Error al descargar {url}: {e}")
        return False

def main():
    # Crear directorios
    os.makedirs("banderas", exist_ok=True)
    os.makedirs("fuentes", exist_ok=True)

    print("--- Descargando Fuentes ---")
    for nombre, url in FUENTES.items():
        ruta = os.path.join("fuentes", nombre)
        if not os.path.exists(ruta):
            descargar_archivo(url, ruta)
        else:
            print(f"La fuente {nombre} ya existe.")

    print("\n--- Descargando Banderas ---")
    for codigo, info in PAISES.items():
        code = info["bandera_code"]
        # flagcdn.com tiene las banderas en w40 (ancho de 40px)
        url = f"https://flagcdn.com/w40/{code}.png"
        ruta = os.path.join("banderas", f"{codigo.lower()}.png")
        if not os.path.exists(ruta):
            descargar_archivo(url, ruta)
        else:
            print(f"La bandera de {info['nombre']} ya existe.")

    print("\n¡Descarga de recursos completada!")

if __name__ == "__main__":
    main()
