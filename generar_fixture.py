import os
from PIL import Image, ImageDraw
from fpdf import FPDF

# Datos de los equipos con nombres completos en español
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

GRUPOS = {
    "A": ["MEX", "RSA", "KOR", "CZE"],
    "B": ["CAN", "BIH", "QAT", "SUI"],
    "C": ["BRA", "MAR", "HAI", "SCO"],
    "D": ["USA", "PAR", "AUS", "TUR"],
    "E": ["GER", "CUW", "CIV", "ECU"],
    "F": ["NED", "JPN", "SWE", "TUN"],
    "G": ["BEL", "EGY", "IRN", "NZL"],
    "H": ["ESP", "CPV", "KSA", "URU"],
    "I": ["FRA", "SEN", "IRQ", "NOR"],
    "J": ["ARG", "ALG", "AUT", "JOR"],
    "K": ["POR", "COD", "UZB", "COL"],
    "L": ["ENG", "CRO", "GHA", "PAN"]
}

# Calendario de partidos en Hora de Argentina (GMT-3) — Fuentes: FIFA, FOX Sports, TyC Sports
PARTIDOS = {
    "A": [
        {"fecha": "11/06", "hora": "16:00", "l1": "MEX", "l2": "RSA"},
        {"fecha": "11/06", "hora": "23:00", "l1": "KOR", "l2": "CZE"},
        {"fecha": "18/06", "hora": "22:00", "l1": "MEX", "l2": "KOR"},
        {"fecha": "18/06", "hora": "13:00", "l1": "CZE", "l2": "RSA"},
        {"fecha": "24/06", "hora": "18:00", "l1": "CZE", "l2": "MEX"},
        {"fecha": "24/06", "hora": "18:00", "l1": "RSA", "l2": "KOR"}
    ],
    "B": [
        {"fecha": "12/06", "hora": "16:00", "l1": "CAN", "l2": "BIH"},
        {"fecha": "13/06", "hora": "16:00", "l1": "QAT", "l2": "SUI"},
        {"fecha": "18/06", "hora": "16:00", "l1": "CAN", "l2": "QAT"},
        {"fecha": "18/06", "hora": "19:00", "l1": "SUI", "l2": "BIH"},
        {"fecha": "24/06", "hora": "22:00", "l1": "SUI", "l2": "CAN"},
        {"fecha": "24/06", "hora": "22:00", "l1": "BIH", "l2": "QAT"}
    ],
    "C": [
        {"fecha": "13/06", "hora": "19:00", "l1": "BRA", "l2": "MAR"},
        {"fecha": "13/06", "hora": "22:00", "l1": "HAI", "l2": "SCO"},
        {"fecha": "19/06", "hora": "16:00", "l1": "BRA", "l2": "HAI"},
        {"fecha": "19/06", "hora": "19:00", "l1": "SCO", "l2": "MAR"},
        {"fecha": "25/06", "hora": "16:00", "l1": "SCO", "l2": "BRA"},
        {"fecha": "25/06", "hora": "16:00", "l1": "MAR", "l2": "HAI"}
    ],
    "D": [
        {"fecha": "12/06", "hora": "22:00", "l1": "USA", "l2": "PAR"},
        {"fecha": "14/06", "hora": "01:00", "l1": "AUS", "l2": "TUR"},
        {"fecha": "19/06", "hora": "22:00", "l1": "USA", "l2": "AUS"},
        {"fecha": "19/06", "hora": "16:00", "l1": "TUR", "l2": "PAR"},
        {"fecha": "25/06", "hora": "22:00", "l1": "TUR", "l2": "USA"},
        {"fecha": "25/06", "hora": "22:00", "l1": "PAR", "l2": "AUS"}
    ],
    "E": [
        {"fecha": "14/06", "hora": "14:00", "l1": "GER", "l2": "CUW"},
        {"fecha": "14/06", "hora": "20:00", "l1": "CIV", "l2": "ECU"},
        {"fecha": "20/06", "hora": "13:00", "l1": "GER", "l2": "CIV"},
        {"fecha": "20/06", "hora": "16:00", "l1": "ECU", "l2": "CUW"},
        {"fecha": "26/06", "hora": "13:00", "l1": "ECU", "l2": "GER"},
        {"fecha": "26/06", "hora": "13:00", "l1": "CUW", "l2": "CIV"}
    ],
    "F": [
        {"fecha": "14/06", "hora": "17:00", "l1": "NED", "l2": "JPN"},
        {"fecha": "14/06", "hora": "23:00", "l1": "SWE", "l2": "TUN"},
        {"fecha": "20/06", "hora": "19:00", "l1": "NED", "l2": "SWE"},
        {"fecha": "20/06", "hora": "22:00", "l1": "TUN", "l2": "JPN"},
        {"fecha": "26/06", "hora": "16:00", "l1": "TUN", "l2": "NED"},
        {"fecha": "26/06", "hora": "16:00", "l1": "JPN", "l2": "SWE"}
    ],
    "G": [
        {"fecha": "15/06", "hora": "16:00", "l1": "BEL", "l2": "EGY"},
        {"fecha": "15/06", "hora": "19:00", "l1": "IRN", "l2": "NZL"},
        {"fecha": "21/06", "hora": "13:00", "l1": "BEL", "l2": "IRN"},
        {"fecha": "21/06", "hora": "16:00", "l1": "NZL", "l2": "EGY"},
        {"fecha": "26/06", "hora": "19:00", "l1": "NZL", "l2": "BEL"},
        {"fecha": "26/06", "hora": "19:00", "l1": "EGY", "l2": "IRN"}
    ],
    "H": [
        {"fecha": "15/06", "hora": "13:00", "l1": "ESP", "l2": "CPV"},
        {"fecha": "15/06", "hora": "19:00", "l1": "KSA", "l2": "URU"},
        {"fecha": "21/06", "hora": "19:00", "l1": "ESP", "l2": "KSA"},
        {"fecha": "21/06", "hora": "22:00", "l1": "URU", "l2": "CPV"},
        {"fecha": "26/06", "hora": "22:00", "l1": "URU", "l2": "ESP"},
        {"fecha": "26/06", "hora": "22:00", "l1": "CPV", "l2": "KSA"}
    ],
    "I": [
        {"fecha": "16/06", "hora": "16:00", "l1": "FRA", "l2": "SEN"},
        {"fecha": "16/06", "hora": "19:00", "l1": "IRQ", "l2": "NOR"},
        {"fecha": "22/06", "hora": "13:00", "l1": "FRA", "l2": "IRQ"},
        {"fecha": "22/06", "hora": "16:00", "l1": "NOR", "l2": "SEN"},
        {"fecha": "27/06", "hora": "13:00", "l1": "NOR", "l2": "FRA"},
        {"fecha": "27/06", "hora": "13:00", "l1": "SEN", "l2": "IRQ"}
    ],
    "J": [
        {"fecha": "16/06", "hora": "22:00", "l1": "ARG", "l2": "ALG"},
        {"fecha": "17/06", "hora": "01:00", "l1": "AUT", "l2": "JOR"},
        {"fecha": "22/06", "hora": "14:00", "l1": "ARG", "l2": "AUT"},
        {"fecha": "22/06", "hora": "22:00", "l1": "JOR", "l2": "ALG"},
        {"fecha": "27/06", "hora": "23:00", "l1": "JOR", "l2": "ARG"},
        {"fecha": "27/06", "hora": "23:00", "l1": "ALG", "l2": "AUT"}
    ],
    "K": [
        {"fecha": "17/06", "hora": "14:00", "l1": "POR", "l2": "COD"},
        {"fecha": "17/06", "hora": "20:00", "l1": "UZB", "l2": "COL"},
        {"fecha": "23/06", "hora": "13:00", "l1": "POR", "l2": "UZB"},
        {"fecha": "23/06", "hora": "16:00", "l1": "COL", "l2": "COD"},
        {"fecha": "27/06", "hora": "19:00", "l1": "COL", "l2": "POR"},
        {"fecha": "27/06", "hora": "19:00", "l1": "COD", "l2": "UZB"}
    ],
    "L": [
        {"fecha": "17/06", "hora": "17:00", "l1": "ENG", "l2": "CRO"},
        {"fecha": "17/06", "hora": "21:00", "l1": "GHA", "l2": "PAN"},
        {"fecha": "23/06", "hora": "16:00", "l1": "ENG", "l2": "GHA"},
        {"fecha": "23/06", "hora": "19:00", "l1": "PAN", "l2": "CRO"},
        {"fecha": "27/06", "hora": "16:00", "l1": "PAN", "l2": "ENG"},
        {"fecha": "27/06", "hora": "16:00", "l1": "CRO", "l2": "GHA"}
    ]
}

# Base de datos de marcadores reales ya jugados
RESULTADOS_REALES = {
    "A": [
        {"idx": 0, "s1": 2, "s2": 0}, # MEX 2-0 RSA
        {"idx": 1, "s1": 2, "s2": 1}  # KOR 2-1 CZE
    ],
    "B": [
        {"idx": 0, "s1": 1, "s2": 1}, # CAN 1-1 BIH
        {"idx": 1, "s1": 1, "s2": 1}  # QAT 1-1 SUI
    ],
    "C": [
        {"idx": 0, "s1": 1, "s2": 1}, # BRA 1-1 MAR
        {"idx": 1, "s1": 0, "s2": 1}  # HAI 0-1 SCO
    ],
    "D": [
        {"idx": 0, "s1": 4, "s2": 1}, # USA 4-1 PAR
        {"idx": 1, "s1": 2, "s2": 0}  # AUS 2-0 TUR
    ]
}

# Calcular tablas de posiciones dinámicamente en Python para pintarlas en el PDF
tablas_posiciones = {}

def calcular_tablas():
    for letra, equipos in GRUPOS.items():
        stats = {eq: {"pts": 0, "pj": 0, "pg": 0, "pe": 0, "pp": 0, "gf": 0, "gc": 0, "dg": 0} for eq in equipos}
        partidos = PARTIDOS[letra]
        res_grupo = RESULTADOS_REALES.get(letra, [])
        
        # Procesar los partidos que ya tienen goles
        for r in res_grupo:
            p = partidos[r["idx"]]
            g1, g2 = r["s1"], r["s2"]
            stats[p["l1"]]["pj"] += 1
            stats[p["l2"]]["pj"] += 1
            stats[p["l1"]]["gf"] += g1; stats[p["l1"]]["gc"] += g2
            stats[p["l2"]]["gf"] += g2; stats[p["l2"]]["gc"] += g1
            
            if g1 > g2:
                stats[p["l1"]]["pts"] += 3
                stats[p["l1"]]["pg"] += 1
                stats[p["l2"]]["pp"] += 1
            elif g2 > g1:
                stats[p["l2"]]["pts"] += 3
                stats[p["l2"]]["pg"] += 1
                stats[p["l1"]]["pp"] += 1
            else:
                stats[p["l1"]]["pts"] += 1; stats[p["l2"]]["pts"] += 1
                stats[p["l1"]]["pe"] += 1; stats[p["l2"]]["pe"] += 1
                
        for eq in equipos:
            stats[eq]["dg"] = stats[eq]["gf"] - stats[eq]["gc"]
            
        lista_stats = [{"id": eq, **stats[eq]} for eq in equipos]
        lista_stats.sort(key=lambda x: (-x["pts"], -x["dg"], -x["gf"], x["id"]))
        tablas_posiciones[letra] = lista_stats

def crear_fondo_cancha(nombre_archivo, width=1754, height=1240, con_copa=False):
    print(f"Generando fondo de cancha ('{nombre_archivo}')...")
    img = Image.new("RGB", (width, height), (27, 94, 32))
    draw = ImageDraw.Draw(img)
    
    num_franjas = 14
    w_franja = width / num_franjas
    for i in range(num_franjas):
        if i % 2 == 0:
            x_start = int(i * w_franja)
            x_end = int((i + 1) * w_franja)
            draw.rectangle([x_start, 0, x_end, height], fill=(34, 107, 39))
            
    margen_x, margen_y = 35, 35
    draw.rectangle([margen_x, margen_y, width - margen_x, height - margen_y], outline=(255, 255, 255, 100), width=3)
    
    centro_x = width // 2
    draw.line([centro_x, margen_y, centro_x, height - margen_y], fill=(255, 255, 255, 100), width=3)
    
    radio_c = 140
    draw.ellipse([centro_x - radio_c, height // 2 - radio_c, centro_x + radio_c, height // 2 + radio_c], outline=(255, 255, 255, 100), width=3)
    draw.ellipse([centro_x - 6, height // 2 - 6, centro_x + 6, height // 2 + 6], fill=(255, 255, 255, 130))
    
    ancho_ap, alto_ap = 200, 520
    y_start_ap = (height - alto_ap) // 2
    draw.rectangle([margen_x, y_start_ap, margen_x + ancho_ap, y_start_ap + alto_ap], outline=(255, 255, 255, 90), width=3)
    draw.rectangle([width - margen_x - ancho_ap, y_start_ap, width - margen_x, y_start_ap + alto_ap], outline=(255, 255, 255, 90), width=3)
    
    if con_copa:
        trofeo_img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        trofeo_draw = ImageDraw.Draw(trofeo_img)
        t_w, t_h = 240, 520
        t_y = (height // 2) - (t_h // 2) - 30
        trofeo_draw.rectangle([centro_x - 80, t_y + t_h - 60, centro_x + 80, t_y + t_h], fill=(212, 175, 55, 25))
        trofeo_draw.polygon([
            (centro_x - 25, t_y + t_h - 60),
            (centro_x + 25, t_y + t_h - 60),
            (centro_x + 40, t_y + 170),
            (centro_x - 40, t_y + 170)
        ], fill=(230, 190, 70, 20))
        trofeo_draw.ellipse([centro_x - 70, t_y + 120, centro_x + 70, t_y + 300], outline=(230, 190, 70, 20), width=24)
        trofeo_draw.ellipse([centro_x - 90, t_y, centro_x + 90, t_y + 170], fill=(244, 208, 63, 30))
        img.paste(trofeo_img, (0, 0), mask=trofeo_img)
        
    img.save(nombre_archivo)

class PDF_Fixture_4Paginas(FPDF):
    def dibujar_caja_grupo_amplia(self, x, y, letra, partidos_grupo):
        w, h = 126, 82
        self.set_fill_color(12, 45, 15)
        self.set_draw_color(255, 255, 255)
        self.set_line_width(0.4)
        self.rect(x, y, w, h, style="FD")
        
        self.set_fill_color(24, 76, 28)
        self.rect(x, y, w, 6.5, style="FD")
        
        self.set_font("ArchivoBlack", "", 11)
        self.set_text_color(255, 255, 255)
        self.text(x + 3, y + 4.8, f"GRUPO {letra}")
        
        # --- TABLA DE POSICIONES REALES ---
        table_x, table_y, table_w = x + 3, y + 9.5, 120
        col_w_eq = 40
        col_w_stats = 10
        
        self.set_fill_color(36, 114, 42)
        self.rect(table_x, table_y, table_w, 4.5, style="F")
        self.set_font("Montserrat-Bold", "", 5.5)
        self.set_text_color(255, 255, 255)
        self.text(table_x + 2, table_y + 3.2, "SELECCIÓN")
        
        headers = ["PTS", "PJ", "PG", "PE", "PP", "GF", "GC", "DG"]
        for i, header in enumerate(headers):
            self.text(table_x + col_w_eq + i * col_w_stats + 2, table_y + 3.2, header)
            
        # Obtener la tabla calculada para este grupo
        stats_grupo = tablas_posiciones[letra]
        self.set_font("Montserrat", "", 6.2)
        for idx, eq_stat in enumerate(stats_grupo):
            eq_code = eq_stat["id"]
            row_y = table_y + 4.5 + idx * 4.2
            
            if idx % 2 == 1:
                self.set_fill_color(20, 60, 24)
                self.rect(table_x, row_y, table_w, 4.2, style="F")
                
            flag_path = f"banderas/{eq_code.lower()}.png"
            if os.path.exists(flag_path):
                self.image(flag_path, x=table_x + 1.5, y=row_y + 0.8, w=4.5, h=2.8)
                
            nombre_pais = PAISES[eq_code]["nombre"]
            self.set_text_color(255, 255, 255)
            self.text(table_x + 7.5, row_y + 3.1, f"{nombre_pais} ({eq_code})")
            
            # Pintar estadísticas
            self.set_text_color(200, 220, 200)
            self.set_font("Montserrat-Bold", "", 5.8)
            
            # Si el equipo no ha jugado, dejamos en blanco
            tiene_juegos = eq_stat["pj"] > 0
            
            valores = [
                str(eq_stat["pts"]) if tiene_juegos else "__",
                str(eq_stat["pj"]) if tiene_juegos else "__",
                str(eq_stat["pg"]) if tiene_juegos else "__",
                str(eq_stat["pe"]) if tiene_juegos else "__",
                str(eq_stat["pp"]) if tiene_juegos else "__",
                str(eq_stat["gf"]) if tiene_juegos else "__",
                str(eq_stat["gc"]) if tiene_juegos else "__",
                ("+" if eq_stat["dg"] > 0 else "") + str(eq_stat["dg"]) if tiene_juegos else "__"
            ]
            
            for i, val in enumerate(valores):
                cx = table_x + col_w_eq + i * col_w_stats
                # Alinear al centro de la columna
                self.text(cx + 3.5, row_y + 3.1, val)
                
        self.set_draw_color(255, 255, 255)
        self.set_line_width(0.3)
        self.line(table_x, table_y + 4.5 + 4 * 4.2, table_x + table_w, table_y + 4.5 + 4 * 4.2)
        
        # --- PARTIDOS ---
        partidos_y_start = y + 34
        row_h = 7.5
        res_grupo = {r["idx"]: r for r in RESULTADOS_REALES.get(letra, [])}
        
        for idx, p in enumerate(partidos_grupo):
            py = partidos_y_start + idx * row_h
            
            if idx > 0:
                self.set_draw_color(50, 100, 60)
                self.set_line_width(0.1)
                self.line(x + 3, py, x + w - 3, py)
                
            # Fecha y Hora en Amarillo
            self.set_font("Montserrat-Bold", "", 6.5)
            self.set_text_color(255, 214, 0)
            self.text(x + 3, py + 5, f"{p['fecha']} {p['hora']}")
            
            # Equipo 1
            self.set_font("Montserrat-Bold", "", 7.5)
            self.set_text_color(255, 255, 255)
            n1 = PAISES[p["l1"]]["nombre"]
            self.text(x + 28, py + 5, n1[:13])
            
            f1 = f"banderas/{p['l1'].lower()}.png"
            if os.path.exists(f1):
                self.image(f1, x=x + 52, y=py + 1.8, w=5.5, h=3.6)
                
            # Marcadores Reales o Vacíos
            self.set_font("Montserrat-Bold", "", 8)
            if idx in res_grupo:
                g1, g2 = res_grupo[idx]["s1"], res_grupo[idx]["s2"]
                self.set_text_color(255, 214, 0) # Amarillo para goles reales
                self.text(x + 60, py + 5.2, f"[  {g1}  ]  -  [  {g2}  ]")
            else:
                self.set_text_color(160, 160, 160)
                self.text(x + 60, py + 5.2, "[     ]  -  [     ]")
            
            # Bandera 2
            f2 = f"banderas/{p['l2'].lower()}.png"
            if os.path.exists(f2):
                self.image(f2, x=x + 82, y=py + 1.8, w=5.5, h=3.6)
                
            # Equipo 2
            self.set_font("Montserrat-Bold", "", 7.5)
            self.set_text_color(255, 255, 255)
            n2 = PAISES[p["l2"]]["nombre"]
            self.text(x + 89, py + 5, n2[:13])

    def dibujar_llave_eliminatoria_grande(self, x, y, w, h, etiqueta, eq1="________________", eq2="________________"):
        self.set_fill_color(15, 50, 18)
        self.set_draw_color(255, 215, 0)
        self.set_line_width(0.4)
        self.rect(x, y, w, h, style="FD")
        
        self.set_fill_color(212, 175, 55)
        self.rect(x, y, w, 4, style="F")
        self.set_font("ArchivoBlack", "", 4.8)
        self.set_text_color(0, 0, 0)
        self.text(x + 2, y + 3, etiqueta.upper())
        
        self.set_font("Montserrat-Bold", "", 6)
        self.set_text_color(255, 255, 255)
        self.text(x + 2, y + 8.5, eq1[:13])
        self.text(x + w - 7.5, y + 8.5, "[   ]")
        self.text(x + 2, y + 13.5, eq2[:13])
        self.text(x + w - 7.5, y + 13.5, "[   ]")

def main():
    calcular_tablas()
    crear_fondo_cancha("fondo_cancha_grupos.png", con_copa=False)
    crear_fondo_cancha("fondo_cancha_final.png", con_copa=True)
    
    pdf = PDF_Fixture_4Paginas(orientation="L", unit="mm", format="A4")
    pdf.set_margins(0, 0, 0)
    pdf.set_auto_page_break(False)
    
    pdf.add_font("ArchivoBlack", "", "fuentes/ArchivoBlack-Regular.ttf")
    pdf.add_font("Montserrat", "", "fuentes/Montserrat-Regular.ttf")
    pdf.add_font("Montserrat-Bold", "", "fuentes/Montserrat-Bold.ttf")
    
    # --- PÁGINA 1 ---
    pdf.add_page()
    pdf.image("fondo_cancha_grupos.png", x=0, y=0, w=297, h=210)
    pdf.set_font("ArchivoBlack", "", 15)
    pdf.set_text_color(255, 255, 255)
    pdf.text(68, 12, "COPA MUNDIAL DE LA FIFA 2026")
    pdf.set_font("Montserrat-Bold", "", 9)
    pdf.set_text_color(255, 214, 0)
    pdf.text(82, 17, "FASE DE GRUPOS • PARTE 1 (GRUPOS A, B, C, D) • HORARIO ARGENTINA")
    
    pdf.dibujar_caja_grupo_amplia(16, 21, "A", PARTIDOS["A"])
    pdf.dibujar_caja_grupo_amplia(155, 21, "B", PARTIDOS["B"])
    pdf.dibujar_caja_grupo_amplia(16, 113, "C", PARTIDOS["C"])
    pdf.dibujar_caja_grupo_amplia(155, 113, "D", PARTIDOS["D"])
    
    # --- PÁGINA 2 ---
    pdf.add_page()
    pdf.image("fondo_cancha_grupos.png", x=0, y=0, w=297, h=210)
    pdf.set_font("ArchivoBlack", "", 15)
    pdf.set_text_color(255, 255, 255)
    pdf.text(68, 12, "COPA MUNDIAL DE LA FIFA 2026")
    pdf.set_font("Montserrat-Bold", "", 9)
    pdf.set_text_color(254, 214, 0)
    pdf.text(82, 17, "FASE DE GRUPOS • PARTE 2 (GRUPOS E, F, G, H) • HORARIO ARGENTINA")
    
    pdf.dibujar_caja_grupo_amplia(16, 21, "E", PARTIDOS["E"])
    pdf.dibujar_caja_grupo_amplia(155, 21, "F", PARTIDOS["F"])
    pdf.dibujar_caja_grupo_amplia(16, 113, "G", PARTIDOS["G"])
    pdf.dibujar_caja_grupo_amplia(155, 113, "H", PARTIDOS["H"])
    
    # --- PÁGINA 3 ---
    pdf.add_page()
    pdf.image("fondo_cancha_grupos.png", x=0, y=0, w=297, h=210)
    pdf.set_font("ArchivoBlack", "", 15)
    pdf.set_text_color(255, 255, 255)
    pdf.text(68, 12, "COPA MUNDIAL DE LA FIFA 2026")
    pdf.set_font("Montserrat-Bold", "", 9)
    pdf.set_text_color(255, 214, 0)
    pdf.text(82, 17, "FASE DE GRUPOS • PARTE 3 (GRUPOS I, J, K, L) • HORARIO ARGENTINA")
    
    pdf.dibujar_caja_grupo_amplia(16, 21, "I", PARTIDOS["I"])
    pdf.dibujar_caja_grupo_amplia(155, 21, "J", PARTIDOS["J"])
    pdf.dibujar_caja_grupo_amplia(16, 113, "K", PARTIDOS["K"])
    pdf.dibujar_caja_grupo_amplia(155, 113, "L", PARTIDOS["L"])
    
    # --- PÁGINA 4 ---
    pdf.add_page()
    pdf.image("fondo_cancha_final.png", x=0, y=0, w=297, h=210)
    pdf.set_font("ArchivoBlack", "", 15)
    pdf.set_text_color(255, 255, 255)
    pdf.text(68, 12, "COPA MUNDIAL DE LA FIFA 2026")
    pdf.set_font("Montserrat-Bold", "", 9)
    pdf.set_text_color(255, 214, 0)
    pdf.text(102, 17, "FASE DE ELIMINACIÓN DIRECTA (PLAYOFFS)")
    
    w_llave, h_llave = 24, 16
    
    # Bracket Izquierdo
    y_d16, gap_d16 = 22, 22
    y_pos_izq_d16 = []
    for i in range(8):
        ly = y_d16 + i * gap_d16
        y_pos_izq_d16.append(ly)
        pdf.dibujar_llave_eliminatoria_grande(15, ly, w_llave, h_llave, f"1/16 - #{i+1}")
        
    y_pos_izq_o8 = []
    for i in range(4):
        ly = (y_pos_izq_d16[2*i] + y_pos_izq_d16[2*i+1]) / 2
        y_pos_izq_o8.append(ly)
        pdf.dibujar_llave_eliminatoria_grande(43, ly, w_llave, h_llave, f"1/8 - #{i+1}")
        pdf.set_draw_color(255, 215, 0)
        pdf.set_line_width(0.4)
        mid_y1 = y_pos_izq_d16[2*i] + h_llave/2
        mid_y2 = y_pos_izq_d16[2*i+1] + h_llave/2
        target_y = ly + h_llave/2
        pdf.line(15 + w_llave, mid_y1, 39, mid_y1)
        pdf.line(15 + w_llave, mid_y2, 39, mid_y2)
        pdf.line(39, mid_y1, 39, mid_y2)
        pdf.line(39, target_y, 43, target_y)
        
    y_pos_izq_c4 = []
    for i in range(2):
        ly = (y_pos_izq_o8[2*i] + y_pos_izq_o8[2*i+1]) / 2
        y_pos_izq_c4.append(ly)
        pdf.dibujar_llave_eliminatoria_grande(71, ly, w_llave, h_llave, f"1/4 - #{i+1}")
        pdf.set_draw_color(255, 215, 0)
        pdf.set_line_width(0.4)
        mid_y1 = y_pos_izq_o8[2*i] + h_llave/2
        mid_y2 = y_pos_izq_o8[2*i+1] + h_llave/2
        target_y = ly + h_llave/2
        pdf.line(43 + w_llave, mid_y1, 67, mid_y1)
        pdf.line(43 + w_llave, mid_y2, 67, mid_y2)
        pdf.line(67, mid_y1, 67, mid_y2)
        pdf.line(67, target_y, 71, target_y)
        
    ly_semi_izq = (y_pos_izq_c4[0] + y_pos_izq_c4[1]) / 2
    pdf.dibujar_llave_eliminatoria_grande(99, ly_semi_izq, w_llave, h_llave, "SEMIFINAL 1")
    pdf.set_draw_color(255, 215, 0)
    pdf.set_line_width(0.4)
    mid_y1 = y_pos_izq_c4[0] + h_llave/2
    mid_y2 = y_pos_izq_c4[1] + h_llave/2
    target_y = ly_semi_izq + h_llave/2
    pdf.line(71 + w_llave, mid_y1, 95, mid_y1)
    pdf.line(71 + w_llave, mid_y2, 95, mid_y2)
    pdf.line(95, mid_y1, 95, mid_y2)
    pdf.line(95, target_y, 99, target_y)
    
    # Bracket Derecho
    y_pos_der_d16 = []
    for i in range(8):
        ly = y_d16 + i * gap_d16
        y_pos_der_d16.append(ly)
        pdf.dibujar_llave_eliminatoria_grande(258, ly, w_llave, h_llave, f"1/16 - #{i+9}")
        
    y_pos_der_o8 = []
    for i in range(4):
        ly = (y_pos_der_d16[2*i] + y_pos_der_d16[2*i+1]) / 2
        y_pos_der_o8.append(ly)
        pdf.dibujar_llave_eliminatoria_grande(230, ly, w_llave, h_llave, f"1/8 - #{i+5}")
        pdf.set_draw_color(255, 215, 0)
        pdf.set_line_width(0.4)
        mid_y1 = y_pos_der_d16[2*i] + h_llave/2
        mid_y2 = y_pos_der_d16[2*i+1] + h_llave/2
        target_y = ly + h_llave/2
        pdf.line(258, mid_y1, 255, mid_y1)
        pdf.line(258, mid_y2, 255, mid_y2)
        pdf.line(255, mid_y1, 255, mid_y2)
        pdf.line(255, target_y, 230 + w_llave, target_y)
        
    y_pos_der_c4 = []
    for i in range(2):
        ly = (y_pos_der_o8[2*i] + y_pos_der_o8[2*i+1]) / 2
        y_pos_der_c4.append(ly)
        pdf.dibujar_llave_eliminatoria_grande(202, ly, w_llave, h_llave, f"1/4 - #{i+3}")
        pdf.set_draw_color(255, 215, 0)
        pdf.set_line_width(0.4)
        mid_y1 = y_pos_der_o8[2*i] + h_llave/2
        mid_y2 = y_pos_der_o8[2*i+1] + h_llave/2
        target_y = ly + h_llave/2
        pdf.line(230, mid_y1, 227, mid_y1)
        pdf.line(230, mid_y2, 227, mid_y2)
        pdf.line(227, mid_y1, 227, mid_y2)
        pdf.line(227, target_y, 202 + w_llave, target_y)
        
    ly_semi_der = (y_pos_der_c4[0] + y_pos_der_c4[1]) / 2
    pdf.dibujar_llave_eliminatoria_grande(174, ly_semi_der, w_llave, h_llave, "SEMIFINAL 2")
    pdf.set_draw_color(255, 215, 0)
    pdf.set_line_width(0.4)
    mid_y1 = y_pos_der_c4[0] + h_llave/2
    mid_y2 = y_pos_der_c4[1] + h_llave/2
    target_y = ly_semi_der + h_llave/2
    pdf.line(202, mid_y1, 199, mid_y1)
    pdf.line(202, mid_y2, 199, mid_y2)
    pdf.line(199, mid_y1, 199, mid_y2)
    pdf.line(199, target_y, 174 + w_llave, target_y)
    
    # Centro
    pdf.set_fill_color(212, 175, 55)
    pdf.set_draw_color(255, 255, 255)
    pdf.set_line_width(0.6)
    pdf.rect(133.5, 75, 30, 22, style="FD")
    pdf.set_font("ArchivoBlack", "", 8)
    pdf.set_text_color(12, 45, 15)
    pdf.text(143.5, 81.5, "FINAL")
    pdf.set_font("Montserrat-Bold", "", 7.5)
    pdf.text(135.5, 87.5, "________________")
    pdf.text(135.5, 93.5, "________________")
    pdf.text(158, 87.5, "[   ]")
    pdf.text(158, 93.5, "[   ]")
    
    pdf.set_draw_color(255, 255, 255)
    pdf.set_line_width(0.5)
    pdf.line(99 + w_llave, ly_semi_izq + h_llave/2, 133.5, 82)
    pdf.line(174, ly_semi_der + h_llave/2, 163.5, 82)
    
    pdf.set_fill_color(180, 100, 40)
    pdf.rect(133.5, 120, 30, 20, style="FD")
    pdf.set_font("Montserrat-Bold", "", 6.5)
    pdf.set_text_color(255, 255, 255)
    pdf.text(138, 125, "3° PUESTO")
    pdf.set_font("Montserrat-Bold", "", 7)
    pdf.text(135.5, 131, "________________")
    pdf.text(135.5, 136, "________________")
    pdf.text(158, 131, "[   ]")
    pdf.text(158, 136, "[   ]")
    
    pdf.output("fixture_mundial_2026.pdf")
    print("¡Fixture PDF de 4 páginas con goles reales generado!")

if __name__ == "__main__":
    main()
