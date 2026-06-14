// Motor del Fixture 100% Automático (Solo Lectura y Conexión API)

const GRUPOS = {
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
};

const PAISES = {
    "MEX": {nombre: "México", bandera: "mx"},
    "RSA": {nombre: "Sudáfrica", bandera: "za"},
    "KOR": {nombre: "Corea del Sur", bandera: "kr"},
    "CZE": {nombre: "R. Checa", bandera: "cz"},
    "CAN": {nombre: "Canadá", bandera: "ca"},
    "BIH": {nombre: "Bosnia y H.", bandera: "ba"},
    "QAT": {nombre: "Catar", bandera: "qa"},
    "SUI": {nombre: "Suiza", bandera: "ch"},
    "BRA": {nombre: "Brasil", bandera: "br"},
    "MAR": {nombre: "Marruecos", bandera: "ma"},
    "HAI": {nombre: "Haití", bandera: "ht"},
    "SCO": {nombre: "Escocia", bandera: "gb-sct"},
    "USA": {nombre: "EE. UU.", bandera: "us"},
    "PAR": {nombre: "Paraguay", bandera: "py"},
    "AUS": {nombre: "Australia", bandera: "au"},
    "TUR": {nombre: "Turquía", bandera: "tr"},
    "GER": {nombre: "Alemania", bandera: "de"},
    "CUW": {nombre: "Curazao", bandera: "cw"},
    "CIV": {nombre: "C. de Marfil", bandera: "ci"},
    "ECU": {nombre: "Ecuador", bandera: "ec"},
    "NED": {nombre: "Países Bajos", bandera: "nl"},
    "JPN": {nombre: "Japón", bandera: "jp"},
    "SWE": {nombre: "Suecia", bandera: "se"},
    "TUN": {nombre: "Túnez", bandera: "tn"},
    "BEL": {nombre: "Bélgica", bandera: "be"},
    "EGY": {nombre: "Egipto", bandera: "eg"},
    "IRN": {nombre: "Irán", bandera: "ir"},
    "NZL": {nombre: "N. Zelanda", bandera: "nz"},
    "ESP": {nombre: "España", bandera: "es"},
    "CPV": {nombre: "Cabo Verde", bandera: "cv"},
    "KSA": {nombre: "Arabia Saudita", bandera: "sa"},
    "URU": {nombre: "Uruguay", bandera: "uy"},
    "FRA": {nombre: "Francia", bandera: "fr"},
    "SEN": {nombre: "Senegal", bandera: "sn"},
    "IRQ": {nombre: "Irak", bandera: "iq"},
    "NOR": {nombre: "Noruega", bandera: "no"},
    "ARG": {nombre: "Argentina", bandera: "ar"},
    "ALG": {nombre: "Argelia", bandera: "dz"},
    "AUT": {nombre: "Austria", bandera: "at"},
    "JOR": {nombre: "Jordania", bandera: "jo"},
    "POR": {nombre: "Portugal", bandera: "pt"},
    "COD": {nombre: "RD Congo", bandera: "cd"},
    "UZB": {nombre: "Uzbekistán", bandera: "uz"},
    "COL": {nombre: "Colombia", bandera: "co"},
    "ENG": {nombre: "Inglaterra", bandera: "gb-eng"},
    "CRO": {nombre: "Croacia", bandera: "hr"},
    "GHA": {nombre: "Ghana", bandera: "gh"},
    "PAN": {nombre: "Panamá", bandera: "pa"}
};

// Calendario Oficial (Horario de Argentina GMT-3) — Fuentes: FIFA, FOX Sports, TyC Sports
const PARTIDOS = {
    "A": [
        {fecha: "11/06", hora: "16:00", l1: "MEX", l2: "RSA"},
        {fecha: "11/06", hora: "23:00", l1: "KOR", l2: "CZE"},
        {fecha: "18/06", hora: "22:00", l1: "MEX", l2: "KOR"},
        {fecha: "18/06", hora: "13:00", l1: "CZE", l2: "RSA"},
        {fecha: "24/06", hora: "18:00", l1: "CZE", l2: "MEX"},
        {fecha: "24/06", hora: "18:00", l1: "RSA", l2: "KOR"}
    ],
    "B": [
        {fecha: "12/06", hora: "16:00", l1: "CAN", l2: "BIH"},
        {fecha: "13/06", hora: "16:00", l1: "QAT", l2: "SUI"},
        {fecha: "18/06", hora: "16:00", l1: "CAN", l2: "QAT"},
        {fecha: "18/06", hora: "19:00", l1: "SUI", l2: "BIH"},
        {fecha: "24/06", hora: "22:00", l1: "SUI", l2: "CAN"},
        {fecha: "24/06", hora: "22:00", l1: "BIH", l2: "QAT"}
    ],
    "C": [
        {fecha: "13/06", hora: "19:00", l1: "BRA", l2: "MAR"},
        {fecha: "13/06", hora: "22:00", l1: "HAI", l2: "SCO"},
        {fecha: "19/06", hora: "16:00", l1: "BRA", l2: "HAI"},
        {fecha: "19/06", hora: "19:00", l1: "SCO", l2: "MAR"},
        {fecha: "25/06", hora: "16:00", l1: "SCO", l2: "BRA"},
        {fecha: "25/06", hora: "16:00", l1: "MAR", l2: "HAI"}
    ],
    "D": [
        {fecha: "12/06", hora: "22:00", l1: "USA", l2: "PAR"},
        {fecha: "14/06", hora: "01:00", l1: "AUS", l2: "TUR"},
        {fecha: "19/06", hora: "22:00", l1: "USA", l2: "AUS"},
        {fecha: "19/06", hora: "16:00", l1: "TUR", l2: "PAR"},
        {fecha: "25/06", hora: "22:00", l1: "TUR", l2: "USA"},
        {fecha: "25/06", hora: "22:00", l1: "PAR", l2: "AUS"}
    ],
    "E": [
        {fecha: "14/06", hora: "14:00", l1: "GER", l2: "CUW"},
        {fecha: "14/06", hora: "20:00", l1: "CIV", l2: "ECU"},
        {fecha: "20/06", hora: "13:00", l1: "GER", l2: "CIV"},
        {fecha: "20/06", hora: "16:00", l1: "ECU", l2: "CUW"},
        {fecha: "26/06", hora: "13:00", l1: "ECU", l2: "GER"},
        {fecha: "26/06", hora: "13:00", l1: "CUW", l2: "CIV"}
    ],
    "F": [
        {fecha: "14/06", hora: "17:00", l1: "NED", l2: "JPN"},
        {fecha: "14/06", hora: "23:00", l1: "SWE", l2: "TUN"},
        {fecha: "20/06", hora: "19:00", l1: "NED", l2: "SWE"},
        {fecha: "20/06", hora: "22:00", l1: "TUN", l2: "JPN"},
        {fecha: "26/06", hora: "16:00", l1: "TUN", l2: "NED"},
        {fecha: "26/06", hora: "16:00", l1: "JPN", l2: "SWE"}
    ],
    "G": [
        {fecha: "15/06", hora: "16:00", l1: "BEL", l2: "EGY"},
        {fecha: "15/06", hora: "19:00", l1: "IRN", l2: "NZL"},
        {fecha: "21/06", hora: "13:00", l1: "BEL", l2: "IRN"},
        {fecha: "21/06", hora: "16:00", l1: "NZL", l2: "EGY"},
        {fecha: "26/06", hora: "19:00", l1: "NZL", l2: "BEL"},
        {fecha: "26/06", hora: "19:00", l1: "EGY", l2: "IRN"}
    ],
    "H": [
        {fecha: "15/06", hora: "13:00", l1: "ESP", l2: "CPV"},
        {fecha: "15/06", hora: "19:00", l1: "KSA", l2: "URU"},
        {fecha: "21/06", hora: "19:00", l1: "ESP", l2: "KSA"},
        {fecha: "21/06", hora: "22:00", l1: "URU", l2: "CPV"},
        {fecha: "26/06", hora: "22:00", l1: "URU", l2: "ESP"},
        {fecha: "26/06", hora: "22:00", l1: "CPV", l2: "KSA"}
    ],
    "I": [
        {fecha: "16/06", hora: "16:00", l1: "FRA", l2: "SEN"},
        {fecha: "16/06", hora: "19:00", l1: "IRQ", l2: "NOR"},
        {fecha: "22/06", hora: "13:00", l1: "FRA", l2: "IRQ"},
        {fecha: "22/06", hora: "16:00", l1: "NOR", l2: "SEN"},
        {fecha: "27/06", hora: "13:00", l1: "NOR", l2: "FRA"},
        {fecha: "27/06", hora: "13:00", l1: "SEN", l2: "IRQ"}
    ],
    "J": [
        {fecha: "16/06", hora: "22:00", l1: "ARG", l2: "ALG"},
        {fecha: "17/06", hora: "01:00", l1: "AUT", l2: "JOR"},
        {fecha: "22/06", hora: "14:00", l1: "ARG", l2: "AUT"},
        {fecha: "22/06", hora: "22:00", l1: "JOR", l2: "ALG"},
        {fecha: "27/06", hora: "23:00", l1: "JOR", l2: "ARG"},
        {fecha: "27/06", hora: "23:00", l1: "ALG", l2: "AUT"}
    ],
    "K": [
        {fecha: "17/06", hora: "14:00", l1: "POR", l2: "COD"},
        {fecha: "17/06", hora: "20:00", l1: "UZB", l2: "COL"},
        {fecha: "23/06", hora: "13:00", l1: "POR", l2: "UZB"},
        {fecha: "23/06", hora: "16:00", l1: "COL", l2: "COD"},
        {fecha: "27/06", hora: "19:00", l1: "COL", l2: "POR"},
        {fecha: "27/06", hora: "19:00", l1: "COD", l2: "UZB"}
    ],
    "L": [
        {fecha: "17/06", hora: "17:00", l1: "ENG", l2: "CRO"},
        {fecha: "17/06", hora: "21:00", l1: "GHA", l2: "PAN"},
        {fecha: "23/06", hora: "16:00", l1: "ENG", l2: "GHA"},
        {fecha: "23/06", hora: "19:00", l1: "PAN", l2: "CRO"},
        {fecha: "27/06", hora: "16:00", l1: "PAN", l2: "ENG"},
        {fecha: "27/06", hora: "16:00", l1: "CRO", l2: "GHA"}
    ]
};

// Resultados Históricos Reales
const RESULTADOS_REALES = {
    "A": [
        { idx: 0, s1: 2, s2: 0 }, // MEX 2 - 0 RSA (11/06)
        { idx: 1, s1: 2, s2: 1 }  // KOR 2 - 1 CZE (11/06)
    ],
    "B": [
        { idx: 0, s1: 1, s2: 1 }, // CAN 1 - 1 BIH (12/06)
        { idx: 1, s1: 1, s2: 1 }  // QAT 1 - 1 SUI (13/06)
    ],
    "C": [
        { idx: 0, s1: 1, s2: 1 }, // BRA 1 - 1 MAR (13/06)
        { idx: 1, s1: 0, s2: 1 }  // HAI 0 - 1 SCO (13/06)
    ],
    "D": [
        { idx: 0, s1: 4, s2: 1 }, // USA 4 - 1 PAR (12/06)
        { idx: 1, s1: 2, s2: 0 }  // AUS 2 - 0 TUR (13/06)
    ]
};

// Constantes para conversión horaria por estadio de la API a Hora de Argentina (GMT-3)
const DIFERENCIA_HORAS_ESTADIO = {
    "1": 2,  // Estadio Azteca (CDMX) -> GMT-5 a GMT-3 (+2)
    "2": 2,  // Estadio BBVA (Monterrey) -> GMT-5 a GMT-3 (+2)
    "3": 2,  // Estadio Akron (Guadalajara) -> GMT-5 a GMT-3 (+2)
    "4": 4,  // BC Place (Vancouver) -> GMT-7 a GMT-3 (+4)
    "5": 1,  // BMO Field (Toronto) -> GMT-4 a GMT-3 (+1)
    "6": 1,  // MetLife Stadium (NY/NJ) -> GMT-4 a GMT-3 (+1)
    "7": 1,  // Gillette Stadium (Boston) -> GMT-4 a GMT-3 (+1)
    "8": 1,  // Lincoln Financial Field (Filadelfia) -> GMT-4 a GMT-3 (+1)
    "9": 1,  // Mercedes-Benz Stadium (Atlanta) -> GMT-4 a GMT-3 (+1)
    "10": 1, // Hard Rock Stadium (Miami) -> GMT-4 a GMT-3 (+1)
    "11": 2, // Arrowhead Stadium (Kansas City) -> GMT-5 a GMT-3 (+2)
    "12": 2, // AT&T Stadium (Dallas) -> GMT-5 a GMT-3 (+2)
    "13": 2, // NRG Stadium (Houston) -> GMT-5 a GMT-3 (+2)
    "14": 4, // SoFi Stadium (Los Ángeles) -> GMT-7 a GMT-3 (+4)
    "15": 4, // Levi's Stadium (San Francisco) -> GMT-7 a GMT-3 (+4)
    "16": 4  // Lumen Field (Seattle) -> GMT-7 a GMT-3 (+4)
};

// Mapeo de IDs de partidos de Playoffs de la API con los elementos DOM
const MAPA_PLAYOFFS = {
    "73": "d16-i-1", "74": "d16-i-2", "75": "d16-i-3", "76": "d16-i-4",
    "77": "d16-i-5", "78": "d16-i-6", "79": "d16-i-7", "80": "d16-i-8",
    "81": "d16-d-9", "82": "d16-d-10", "83": "d16-d-11", "84": "d16-d-12",
    "85": "d16-d-13", "86": "d16-d-14", "87": "d16-d-15", "88": "d16-d-16",
    "89": "o8-i-1", "90": "o8-i-2", "91": "o8-i-3", "92": "o8-i-4",
    "93": "o8-d-5", "94": "o8-d-6", "95": "o8-d-7", "96": "o8-d-8",
    "97": "c4-i-1", "98": "c4-i-2", "99": "c4-d-3", "100": "c4-d-4",
    "101": "semi-i-1", "102": "semi-d-2",
    "103": "bronze",
    "104": "final"
};

// Estado global
let tablasEstado = {};
let partidosGoles = {}; // Almacenará los goles de fase de grupos
let mapaEquiposIdACodigo = {}; // Mapa de ID -> Código FIFA (ej. 1 -> MEX)
let partidosPlayoffsGoles = {}; // Marcadores de playoffs {partidoId: {s1, s2}}
let partidosPlayoffsEquipos = {}; // Equipos clasificados de playoffs {partidoId: {t1, t2}}
let listaPartidosCompleta = []; // Todos los partidos formateados para "Partidos de Hoy"

function switchTab(tabId) {
    const targetPage = document.getElementById(tabId);
    if (!targetPage) return; // protección contra HTML viejo
    
    document.querySelectorAll(".print-page").forEach(page => {
        page.classList.remove("active");
    });
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    
    targetPage.classList.add("active");
    
    const index = parseInt(tabId.split("-")[2]);
    const botones = document.querySelectorAll(".tab-btn");
    if (botones[index]) {
        botones[index].classList.add("active");
    }
}

function renderizarGrupos() {
    const p1 = document.getElementById("grid-page-1");
    const p2 = document.getElementById("grid-page-2");
    const p3 = document.getElementById("grid-page-3");
    
    if (p1) {
        ["A", "B", "C", "D"].forEach(letra => {
            p1.appendChild(crearTarjetaGrupoAmplia(letra));
        });
    }
    
    if (p2) {
        ["E", "F", "G", "H"].forEach(letra => {
            p2.appendChild(crearTarjetaGrupoAmplia(letra));
        });
    }
    
    if (p3) {
        ["I", "J", "K", "L"].forEach(letra => {
            p3.appendChild(crearTarjetaGrupoAmplia(letra));
        });
    }
}

function crearTarjetaGrupoAmplia(letra) {
    const equipos = GRUPOS[letra];
    const partidos = PARTIDOS[letra];
    
    // Inicializar estado del grupo
    tablasEstado[letra] = equipos.map(eq => ({
        id: eq, pts: 0, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0
    }));

    const card = document.createElement("div");
    card.className = "grupo-card";
    card.id = `grupo-card-${letra}`;
    
    let html = `
        <div class="grupo-header">GRUPO ${letra}</div>
        <div class="grupo-tabla-pos">
            <table class="tabla-mini">
                <thead>
                    <tr>
                        <th style="width: 45%;">SELECCIÓN</th>
                        <th>PTS</th>
                        <th>PJ</th>
                        <th>PG</th>
                        <th>PE</th>
                        <th>PP</th>
                        <th>GF</th>
                        <th>GC</th>
                        <th>DG</th>
                    </tr>
                </thead>
                <tbody id="tabla-body-${letra}">
    `;
    
    equipos.forEach(eq => {
        const p = PAISES[eq];
        html += `
            <tr id="row-${letra}-${eq}">
                <td>
                    <div class="eq-cell">
                        <img src="banderas/${eq.toLowerCase()}.png" class="eq-flag" alt="${eq}">
                        <span style="font-weight: 800;">${p.nombre} (${eq})</span>
                    </div>
                </td>
                <td class="pts-val" style="font-weight: 800; color: #ffd700;">-</td>
                <td class="pj-val">-</td>
                <td class="pg-val">-</td>
                <td class="pe-val">-</td>
                <td class="pp-val">-</td>
                <td class="gf-val">-</td>
                <td class="gc-val">-</td>
                <td class="dg-val">-</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
        <div class="grupo-partidos">
    `;
    
    partidos.forEach((p, idx) => {
        const n1 = PAISES[p.l1].nombre;
        const n2 = PAISES[p.l2].nombre;
        html += `
            <div class="partido-row">
                <div class="partido-info">${p.fecha} ${p.hora}</div>
                <div class="partido-team-l">
                    <span>${n1}</span>
                    <img src="banderas/${p.l1.toLowerCase()}.png" class="eq-flag" alt="${p.l1}">
                </div>
                <div class="partido-score">
                    <span class="score-display" id="sc-${letra}-${idx}-1">-</span>
                    <span class="score-divider">-</span>
                    <span class="score-display" id="sc-${letra}-${idx}-2">-</span>
                </div>
                <div class="partido-team-r">
                    <img src="banderas/${p.l2.toLowerCase()}.png" class="eq-flag" alt="${p.l2}">
                    <span>${n2}</span>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    card.innerHTML = html;
    return card;
}

// Cargar marcadores (Primero locales de respaldo, luego consulta API)
function cargarResultados() {
    // Inicializar marcadores con datos estáticos locales de respaldo
    Object.keys(RESULTADOS_REALES).forEach(letra => {
        RESULTADOS_REALES[letra].forEach(res => {
            partidosGoles[`${letra}-${res.idx}-1`] = res.s1;
            partidosGoles[`${letra}-${res.idx}-2`] = res.s2;
        });
    });

    // Intentar descargar en vivo de la API
    // 1. Primero consultamos la API de Equipos para mapear IDs a Códigos FIFA
    fetch("https://worldcup26.ir/get/teams")
        .then(response => {
            if (!response.ok) throw new Error("API Equipos Offline");
            return response.json();
        })
        .then(data => {
            if (data && data.teams) {
                data.teams.forEach(t => {
                    mapaEquiposIdACodigo[t.id.toString()] = t.fifa_code;
                });
            }
            // 2. Una vez que tenemos los equipos, consultamos los partidos
            return fetch("https://worldcup26.ir/get/games");
        })
        .then(response => {
            if (!response.ok) throw new Error("API Partidos Offline");
            return response.json();
        })
        .then(data => {
            console.log("Carga de API exitosa:", data);
            if (data && data.games) {
                listaPartidosCompleta = [];
                data.games.forEach(match => {
                    procesarPartidoAPI(match);
                });
            }
            actualizarInterfaz();
        })
        .catch(err => {
            console.warn("Usando base de datos estática local para resultados. API no disponible:", err.message);
            actualizarInterfaz();
        });
}

function obtenerFechaHoraArgentina(localDateStr, stadiumId) {
    if (!localDateStr) return { fecha: "--/--", hora: "--:--" };
    try {
        const parts = localDateStr.split(" ");
        const dateParts = parts[0].split("/");
        const timeParts = parts[1].split(":");
        
        const mes = parseInt(dateParts[0]) - 1;
        const dia = parseInt(dateParts[1]);
        const anio = parseInt(dateParts[2]);
        const hora = parseInt(timeParts[0]);
        const min = parseInt(timeParts[1]);
        
        const fechaEstadio = new Date(anio, mes, dia, hora, min);
        const diffHoras = DIFERENCIA_HORAS_ESTADIO[stadiumId] || 1;
        const fechaArg = new Date(fechaEstadio.getTime() + (diffHoras * 3600000));
        
        const diaStr = String(fechaArg.getDate()).padStart(2, '0');
        const mesStr = String(fechaArg.getMonth() + 1).padStart(2, '0');
        const horaStr = String(fechaArg.getHours()).padStart(2, '0');
        const minStr = String(fechaArg.getMinutes()).padStart(2, '0');
        
        return {
            fecha: `${diaStr}/${mesStr}`,
            hora: `${horaStr}:${minStr}`
        };
    } catch (e) {
        console.warn("Error formateando fecha de API:", localDateStr, e.message);
        return { fecha: "--/--", hora: "--:--" };
    }
}

function getFechaArgentinaHoy() {
    const d = new Date();
    // Ajustar a GMT-3
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const offsetArg = -3;
    const fechaArg = new Date(utc + (3600000 * offsetArg));
    
    const dia = String(fechaArg.getDate()).padStart(2, '0');
    const mes = String(fechaArg.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}`;
}

function procesarPartidoAPI(match) {
    const id = match.id.toString();
    const type = match.type;
    
    const idHome = match.home_team_id ? match.home_team_id.toString() : "0";
    const idAway = match.away_team_id ? match.away_team_id.toString() : "0";
    
    const fifaHome = (idHome !== "0" && mapaEquiposIdACodigo[idHome]) ? mapaEquiposIdACodigo[idHome] : "";
    const fifaAway = (idAway !== "0" && mapaEquiposIdACodigo[idAway]) ? mapaEquiposIdACodigo[idAway] : "";
    
    // Validar si el partido ha comenzado realmente (finished = TRUE, o time_elapsed en vivo)
    const timeElap = match.time_elapsed ? match.time_elapsed.toLowerCase().replace("_", "").trim() : "";
    const isStarted = match.finished === "TRUE" || (timeElap && timeElap !== "notstarted" && timeElap !== "finished" && timeElap !== "not_started" && timeElap !== "null");
    
    const g1 = (isStarted && match.home_score !== null && match.home_score !== undefined && match.home_score !== "") ? parseInt(match.home_score) : null;
    const g2 = (isStarted && match.away_score !== null && match.away_score !== undefined && match.away_score !== "") ? parseInt(match.away_score) : null;
    
    const argentinaInfo = obtenerFechaHoraArgentina(match.local_date, match.stadium_id);
    
    if (type === "group") {
        if (fifaHome && fifaAway) {
            Object.keys(PARTIDOS).forEach(letra => {
                PARTIDOS[letra].forEach((p, idx) => {
                    if (p.l1 === fifaHome && p.l2 === fifaAway) {
                        if (g1 !== null && g2 !== null) {
                            partidosGoles[`${letra}-${idx}-1`] = g1;
                            partidosGoles[`${letra}-${idx}-2`] = g2;
                        }
                    }
                });
            });
        }
    } else {
        partidosPlayoffsEquipos[id] = { t1: fifaHome, t2: fifaAway };
        if (g1 !== null && g2 !== null && match.finished === "TRUE") {
            partidosPlayoffsGoles[id] = { s1: g1, s2: g2 };
        }
    }
    
    // Guardar en la lista completa para partidos de hoy
    listaPartidosCompleta.push({
        id: id,
        type: type,
        group: match.group,
        matchday: match.matchday,
        finished: match.finished,
        time_elapsed: match.time_elapsed,
        isStarted: isStarted,
        fifaHome: fifaHome,
        fifaAway: fifaAway,
        nombreHome: fifaHome ? PAISES[fifaHome].nombre : (match.home_team_name_en || "Pendiente"),
        nombreAway: fifaAway ? PAISES[fifaAway].nombre : (match.away_team_name_en || "Pendiente"),
        fechaArg: argentinaInfo.fecha,
        horaArg: argentinaInfo.hora,
        s1: g1,
        s2: g2
    });
}

function actualizarPartidosDeHoy() {
    const contenedor = document.getElementById("hoy-matches-list");
    if (!contenedor) return;
    
    const hoyArg = getFechaArgentinaHoy();
    
    // Filtrar los partidos que se juegan hoy
    const partidosDeHoy = listaPartidosCompleta.filter(p => p.fechaArg === hoyArg);
    
    // Ordenar por hora de Argentina
    partidosDeHoy.sort((a, b) => a.horaArg.localeCompare(b.horaArg));
    
    if (partidosDeHoy.length === 0) {
        contenedor.innerHTML = `
            <div class="hoy-no-matches">
                <i class="fa-regular fa-calendar-xmark"></i>
                <p>No hay partidos programados para hoy (${hoyArg}) en horario de Argentina.</p>
            </div>
        `;
        return;
    }
    
    let html = "";
    partidosDeHoy.forEach(p => {
        let faseText = "";
        if (p.type === "group") {
            faseText = `Fase de Grupos • Grupo ${p.group} • Jornada ${p.matchday}`;
        } else if (p.type === "r32") {
            faseText = "Dieciseisavos de Final";
        } else if (p.type === "r16") {
            faseText = "Octavos de Final";
        } else if (p.type === "qf") {
            faseText = "Cuartos de Final";
        } else if (p.type === "sf") {
            faseText = "Semifinales";
        } else if (p.type === "third") {
            faseText = "Tercer Puesto";
        } else if (p.type === "final") {
            faseText = "Gran Final";
        }
        
        let statusClass = "status-programado";
        let statusText = "Programado";
        
        const timeElap = p.time_elapsed ? p.time_elapsed.toLowerCase().replace("_", "").trim() : "";
        
        if (p.finished === "TRUE") {
            statusClass = "status-finalizado";
            statusText = "Finalizado";
        } else if (timeElap && timeElap !== "notstarted" && timeElap !== "finished" && timeElap !== "not_started" && timeElap !== "null") {
            statusClass = "status-live";
            statusText = `En Vivo • ${p.time_elapsed}`;
        }
        
        const tieneMarcador = p.isStarted && p.s1 !== null && p.s2 !== null;
        const banderaHome = p.fifaHome ? `banderas/${p.fifaHome.toLowerCase()}.png` : "";
        const banderaAway = p.fifaAway ? `banderas/${p.fifaAway.toLowerCase()}.png` : "";
        
        const imgHomeHtml = banderaHome ? `<img src="${banderaHome}" class="hoy-flag" alt="${p.fifaHome}" onerror="this.style.display='none';">` : "";
        const imgAwayHtml = banderaAway ? `<img src="${banderaAway}" class="hoy-flag" alt="${p.fifaAway}" onerror="this.style.display='none';">` : "";
        
        html += `
            <div class="hoy-match-card">
                <div class="hoy-match-header">
                    <span class="hoy-match-stage">${faseText}</span>
                    <span class="hoy-match-status ${statusClass}">
                        ${statusText.includes("Vivo") ? "🟢 " : ""}${statusText}
                    </span>
                </div>
                <div class="hoy-match-body">
                    <div class="hoy-team team-home">
                        ${imgHomeHtml}
                        <span class="hoy-team-name">${p.nombreHome}</span>
                    </div>
                    
                    <div class="hoy-score-center">
                        ${tieneMarcador ? `
                            <span class="hoy-score-num">${p.s1}</span>
                            <span class="hoy-score-divider">-</span>
                            <span class="hoy-score-num">${p.s2}</span>
                        ` : `
                            <div class="hoy-time-center">
                                <i class="fa-regular fa-clock"></i> ${p.horaArg} hs
                            </div>
                        `}
                    </div>
                    
                    <div class="hoy-team team-away">
                        ${imgAwayHtml}
                        <span class="hoy-team-name">${p.nombreAway}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    contenedor.innerHTML = html;
}

// Actualizar toda la interfaz (Tablas y Bracket) de forma automática
function actualizarInterfaz() {
    // Calcular tablas para todos los grupos
    Object.keys(GRUPOS).forEach(letra => {
        calcularGrupo(letra);
    });
    
    // Rellenar brackets
    actualizarPlayoffsAutomatico();
    
    // Renderizar los partidos de hoy
    actualizarPartidosDeHoy();
}

function calcularGrupo(letra) {
    const equipos = GRUPOS[letra];
    const partidos = PARTIDOS[letra];
    
    let stats = {};
    equipos.forEach(eq => {
        stats[eq] = { id: eq, pts: 0, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0 };
    });
    
    partidos.forEach((p, idx) => {
        const val1 = partidosGoles[`${letra}-${idx}-1`];
        const val2 = partidosGoles[`${letra}-${idx}-2`];
        
        // Pintar goles en la web
        const el1 = document.getElementById(`sc-${letra}-${idx}-1`);
        const el2 = document.getElementById(`sc-${letra}-${idx}-2`);
        
        if (val1 !== undefined && val2 !== undefined) {
            const g1 = parseInt(val1);
            const g2 = parseInt(val2);
            
            if (el1 && el2) {
                el1.innerText = g1;
                el1.classList.add("has-score");
                el2.innerText = g2;
                el2.classList.add("has-score");
            }
            
            stats[p.l1].pj += 1;
            stats[p.l2].pj += 1;
            stats[p.l1].gf += g1;
            stats[p.l1].gc += g2;
            stats[p.l2].gf += g2;
            stats[p.l2].gc += g1;
            
            if (g1 > g2) {
                stats[p.l1].pts += 3;
                stats[p.l1].pg += 1;
                stats[p.l2].pp += 1;
            } else if (g2 > g1) {
                stats[p.l2].pts += 3;
                stats[p.l2].pg += 1;
                stats[p.l1].pp += 1;
            } else {
                stats[p.l1].pts += 1;
                stats[p.l2].pts += 1;
                stats[p.l1].pe += 1;
                stats[p.l2].pe += 1;
            }
        } else {
            if (el1 && el2) {
                el1.innerText = "-";
                el1.classList.remove("has-score");
                el2.innerText = "-";
                el2.classList.remove("has-score");
            }
        }
    });
    
    equipos.forEach(eq => {
        stats[eq].dg = stats[eq].gf - stats[eq].gc;
    });
    
    let listaStats = Object.values(stats);
    listaStats.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.dg !== a.dg) return b.dg - a.dg;
        if (b.gf !== a.gf) return b.gf - a.gf;
        return a.id.localeCompare(b.id);
    });
    
    tablasEstado[letra] = listaStats;
    
    // Pintar tabla ordenada
    const tbody = document.getElementById(`tabla-body-${letra}`);
    if (tbody) {
        tbody.innerHTML = "";
        listaStats.forEach(eqStat => {
            const eq = eqStat.id;
            const p = PAISES[eq];
            
            // Si el equipo no ha jugado ningún partido, mostramos guiones
            const jugado = eqStat.pj > 0;
            const pts = jugado ? eqStat.pts : "-";
            const pj = jugado ? eqStat.pj : "-";
            const pg = jugado ? eqStat.pg : "-";
            const pe = jugado ? eqStat.pe : "-";
            const pp = jugado ? eqStat.pp : "-";
            const gf = jugado ? eqStat.gf : "-";
            const gc = jugado ? eqStat.gc : "-";
            const dg = jugado ? (eqStat.dg > 0 ? "+" + eqStat.dg : eqStat.dg) : "-";
            
            tbody.innerHTML += `
                <tr id="row-${letra}-${eq}">
                    <td>
                        <div class="eq-cell">
                            <img src="banderas/${eq.toLowerCase()}.png" class="eq-flag" alt="${eq}">
                            <span style="font-weight: 800;">${p.nombre} (${eq})</span>
                        </div>
                    </td>
                    <td style="font-weight: 800; color: #ffd700;">${pts}</td>
                    <td>${pj}</td>
                    <td>${pg}</td>
                    <td>${pe}</td>
                    <td>${pp}</td>
                    <td>${gf}</td>
                    <td>${gc}</td>
                    <td>${dg}</td>
                </tr>
            `;
        });
    }
}

function actualizarPlayoffsAutomatico() {
    // 1. Calcular clasificados desde fase de grupos a los dieciseisavos (d16) como fallback si la API no reporta equipos en d16
    let ganadores = {};
    let segundos = {};
    let terceros = [];
    
    Object.keys(GRUPOS).forEach(letra => {
        const stats = tablasEstado[letra];
        if (stats && stats.length >= 3) {
            ganadores[letra] = stats[0].pj > 0 ? stats[0].id : "";
            segundos[letra] = stats[1].pj > 0 ? stats[1].id : "";
            if (stats[2].pj > 0) {
                terceros.push({
                    grupo: letra, id: stats[2].id, pts: stats[2].pts, dg: stats[2].dg, gf: stats[2].gf
                });
            }
        }
    });
    
    terceros.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.dg !== a.dg) return b.dg - a.dg;
        if (b.gf !== a.gf) return b.gf - a.gf;
        return a.grupo.localeCompare(b.grupo);
    });
    
    let mejoresTerceros = terceros.slice(0, 8).map(t => t.id);
    while (mejoresTerceros.length < 8) {
        mejoresTerceros.push("");
    }
    
    // Cruces teóricos de la fase de grupos si la API aún no los calcula
    const crucesTeoricos = {
        "73": { t1: ganadores["A"], t2: mejoresTerceros[0] },
        "74": { t1: segundos["B"], t2: segundos["C"] },
        "75": { t1: ganadores["C"], t2: mejoresTerceros[1] },
        "76": { t1: segundos["D"], t2: segundos["E"] },
        "77": { t1: ganadores["E"], t2: mejoresTerceros[2] },
        "78": { t1: segundos["F"], t2: segundos["G"] },
        "79": { t1: ganadores["G"], t2: mejoresTerceros[3] },
        "80": { t1: segundos["H"], t2: segundos["I"] },
        "81": { t1: ganadores["I"], t2: mejoresTerceros[4] },
        "82": { t1: segundos["J"], t2: segundos["K"] },
        "83": { t1: ganadores["K"], t2: mejoresTerceros[5] },
        "84": { t1: segundos["L"], t2: segundos["A"] },
        "85": { t1: ganadores["B"], t2: mejoresTerceros[6] },
        "86": { t1: ganadores["D"], t2: mejoresTerceros[7] },
        "87": { t1: ganadores["F"], t2: ganadores["H"] },
        "88": { t1: ganadores["J"], t2: ganadores["L"] }
    };

    // 2. Pintar todas las llaves (ID 73 al 104) de forma dinámica con los datos de la API
    Object.keys(MAPA_PLAYOFFS).forEach(partidoId => {
        const idPrefijo = MAPA_PLAYOFFS[partidoId];
        
        let t1 = "";
        let t2 = "";
        
        // Si la API tiene equipos cargados para esta llave de playoffs, los usamos
        if (partidosPlayoffsEquipos[partidoId]) {
            t1 = partidosPlayoffsEquipos[partidoId].t1;
            t2 = partidosPlayoffsEquipos[partidoId].t2;
        }
        
        // Si es Ronda de 32 (73-88) y la API aún no tiene equipos pero nosotros ya calculamos grupos, aplicamos fallback local
        const pIdInt = parseInt(partidoId);
        if (!t1 && !t2 && pIdInt >= 73 && pIdInt <= 88 && crucesTeoricos[partidoId]) {
            t1 = crucesTeoricos[partidoId].t1;
            t2 = crucesTeoricos[partidoId].t2;
        }
        
        // Pintar en el DOM
        const t1El = document.getElementById(`${idPrefijo}-t1`);
        const t2El = document.getElementById(`${idPrefijo}-t2`);
        const s1El = document.getElementById(`${idPrefijo}-s1`);
        const s2El = document.getElementById(`${idPrefijo}-s2`);
        
        if (t1El) {
            t1El.innerText = t1 ? (PAISES[t1] ? PAISES[t1].nombre : t1) : "___________";
        }
        if (t2El) {
            t2El.innerText = t2 ? (PAISES[t2] ? PAISES[t2].nombre : t2) : "___________";
        }
        
        // Pintar marcadores
        if (partidosPlayoffsGoles[partidoId] !== undefined) {
            const s1 = partidosPlayoffsGoles[partidoId].s1;
            const s2 = partidosPlayoffsGoles[partidoId].s2;
            if (s1El && s2El) {
                s1El.innerText = s1;
                s1El.classList.add("has-score");
                s2El.innerText = s2;
                s2El.classList.add("has-score");
            }
        } else {
            if (s1El && s2El) {
                s1El.innerText = "-";
                s1El.classList.remove("has-score");
                s2El.innerText = "-";
                s2El.classList.remove("has-score");
            }
        }
    });
}

function renderizarBracket() {
    const d16Izq = document.getElementById("d16-izq");
    if (d16Izq) {
        for(let i=1; i<=8; i++) {
            d16Izq.appendChild(crearCardBracket(`1/16 - #${i}`, `d16-i-${i}`));
        }
    }
    
    const d16Der = document.getElementById("d16-der");
    if (d16Der) {
        for(let i=9; i<=16; i++) {
            d16Der.appendChild(crearCardBracket(`1/16 - #${i}`, `d16-d-${i}`));
        }
    }
    
    const o8Izq = document.getElementById("o8-izq");
    if (o8Izq) {
        for(let i=1; i<=4; i++) {
            o8Izq.appendChild(crearCardBracket(`1/8 - #${i}`, `o8-i-${i}`));
        }
    }
    
    const o8Der = document.getElementById("o8-der");
    if (o8Der) {
        for(let i=5; i<=8; i++) {
            o8Der.appendChild(crearCardBracket(`1/8 - #${i}`, `o8-d-${i}`));
        }
    }
    
    const c4Izq = document.getElementById("c4-izq");
    if (c4Izq) {
        for(let i=1; i<=2; i++) {
            c4Izq.appendChild(crearCardBracket(`1/4 - #${i}`, `c4-i-${i}`));
        }
    }
    
    const c4Der = document.getElementById("c4-der");
    if (c4Der) {
        for(let i=3; i<=4; i++) {
            c4Der.appendChild(crearCardBracket(`1/4 - #${i}`, `c4-d-${i}`));
        }
    }
    
    const semiIzq = document.getElementById("semi-izq");
    if (semiIzq) {
        semiIzq.appendChild(crearCardBracket("SEMIFINAL 1", "semi-i-1"));
    }
    
    const semiDer = document.getElementById("semi-der");
    if (semiDer) {
        semiDer.appendChild(crearCardBracket("SEMIFINAL 2", "semi-d-2"));
    }
}

function crearCardBracket(titulo, idPrefijo) {
    const card = document.createElement("div");
    card.className = "match-card";
    card.innerHTML = `
        <div class="match-title">${titulo}</div>
        <div class="match-team-row">
            <span class="team-name" id="${idPrefijo}-t1">___________</span>
            <span class="score-display-bracket" id="${idPrefijo}-s1">-</span>
        </div>
        <div class="match-team-row">
            <span class="team-name" id="${idPrefijo}-t2">___________</span>
            <span class="score-display-bracket" id="${idPrefijo}-s2">-</span>
        </div>
    `;
    return card;
}

// Iniciar aplicación cargando recursos
window.onload = () => {
    // Si por algún motivo no existe la pestaña de hoy en el DOM (HTML viejo en caché),
    // mostramos la primera página de grupos para evitar pantalla en blanco.
    if (!document.getElementById("tab-page-0")) {
        switchTab("tab-page-1");
    }

    renderizarGrupos();
    renderizarBracket();
    cargarResultados();
    
    // Configurar refresco automático en vivo cada 60 segundos
    setInterval(cargarResultados, 60000);
    
    // Registrar Service Worker para soporte PWA y offline con auto-reload
    if ("serviceWorker" in navigator) {
        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
            if (!refreshing) {
                refreshing = true;
                console.log("Nuevo Service Worker activo. Recargando página para actualizar a la última versión...");
                window.location.reload();
            }
        });

        navigator.serviceWorker.register("./sw.js")
            .then(reg => {
                console.log("Service Worker registrado con éxito:", reg.scope);
                reg.onupdatefound = () => {
                    const installingWorker = reg.installing;
                    if (installingWorker) {
                        installingWorker.onstatechange = () => {
                            if (installingWorker.state === "installed") {
                                if (navigator.serviceWorker.controller) {
                                    console.log("Nueva actualización disponible. El Service Worker se activará automáticamente.");
                                }
                            }
                        };
                    }
                };
            })
            .catch(err => console.warn("Error al registrar Service Worker:", err));
    }
};
