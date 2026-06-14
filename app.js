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

// Estado global
let tablasEstado = {};
let partidosGoles = {}; // Almacenará los goles cargados de forma dinámica

function switchTab(tabId) {
    document.querySelectorAll(".print-page").forEach(page => {
        page.classList.remove("active");
    });
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    
    document.getElementById(tabId).classList.add("active");
    
    const index = tabId.split("-")[2];
    const botones = document.querySelectorAll(".tab-btn");
    botones[index - 1].classList.add("active");
}

function renderizarGrupos() {
    const p1 = document.getElementById("grid-page-1");
    const p2 = document.getElementById("grid-page-2");
    const p3 = document.getElementById("grid-page-3");
    
    ["A", "B", "C", "D"].forEach(letra => {
        p1.appendChild(crearTarjetaGrupoAmplia(letra));
    });
    
    ["E", "F", "G", "H"].forEach(letra => {
        p2.appendChild(crearTarjetaGrupoAmplia(letra));
    });
    
    ["I", "J", "K", "L"].forEach(letra => {
        p3.appendChild(crearTarjetaGrupoAmplia(letra));
    });
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
    // Inicializar marcadores con datos estáticos locales
    Object.keys(RESULTADOS_REALES).forEach(letra => {
        RESULTADOS_REALES[letra].forEach(res => {
            partidosGoles[`${letra}-${res.idx}-1`] = res.s1;
            partidosGoles[`${letra}-${res.idx}-2`] = res.s2;
        });
    });

    // Intentar descargar en vivo de la API
    fetch("https://api.allorigins.win/raw?url=" + encodeURIComponent("https://worldcup26.ir/api/matches"))
        .then(response => {
            if (!response.ok) throw new Error("API Offline");
            return response.json();
        })
        .then(data => {
            console.log("Carga de API exitosa:", data);
            if (data && data.matches) {
                data.matches.forEach(match => {
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

function procesarPartidoAPI(match) {
    const eq1 = match.home_team_country_code;
    const eq2 = match.away_team_country_code;
    const g1 = match.home_team_score;
    const g2 = match.away_team_score;
    
    if (g1 === null || g2 === null) return;
    
    Object.keys(PARTIDOS).forEach(letra => {
        PARTIDOS[letra].forEach((p, idx) => {
            if (p.l1 === eq1 && p.l2 === eq2) {
                partidosGoles[`${letra}-${idx}-1`] = g1;
                partidosGoles[`${letra}-${idx}-2`] = g2;
            }
        });
    });
}

// Actualizar toda la interfaz (Tablas y Bracket) de forma automática
function actualizarInterfaz() {
    // Calcular tablas para todos los grupos
    Object.keys(GRUPOS).forEach(letra => {
        calcularGrupo(letra);
    });
    
    // Rellenar brackets
    actualizarPlayoffsAutomatico();
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
    
    const cruces = [
        { id: "d16-i-1", t1: ganadores["A"], t2: mejoresTerceros[0] },
        { id: "d16-i-2", t1: segundos["B"], t2: segundos["C"] },
        { id: "d16-i-3", t1: ganadores["C"], t2: mejoresTerceros[1] },
        { id: "d16-i-4", t1: segundos["D"], t2: segundos["E"] },
        { id: "d16-i-5", t1: ganadores["E"], t2: mejoresTerceros[2] },
        { id: "d16-i-6", t1: segundos["F"], t2: segundos["G"] },
        { id: "d16-i-7", t1: ganadores["G"], t2: mejoresTerceros[3] },
        { id: "d16-i-8", t1: segundos["H"], t2: segundos["I"] },
        
        { id: "d16-d-9", t1: ganadores["I"], t2: mejoresTerceros[4] },
        { id: "d16-d-10", t1: segundos["J"], t2: segundos["K"] },
        { id: "d16-d-11", t1: ganadores["K"], t2: mejoresTerceros[5] },
        { id: "d16-d-12", t1: segundos["L"], t2: segundos["A"] },
        { id: "d16-d-13", t1: ganadores["B"], t2: mejoresTerceros[6] },
        { id: "d16-d-14", t1: ganadores["D"], t2: mejoresTerceros[7] },
        { id: "d16-d-15", t1: ganadores["F"], t2: ganadores["H"] },
        { id: "d16-d-16", t1: ganadores["J"], t2: ganadores["L"] }
    ];
    
    cruces.forEach(cruce => {
        const t1El = document.getElementById(`${cruce.id}-t1`);
        const t2El = document.getElementById(`${cruce.id}-t2`);
        
        if (t1El) {
            t1El.innerText = cruce.t1 ? PAISES[cruce.t1].nombre : "___________";
        }
        if (t2El) {
            t2El.innerText = cruce.t2 ? PAISES[cruce.t2].nombre : "___________";
        }
    });
}

function renderizarBracket() {
    const d16Izq = document.getElementById("d16-izq");
    for(let i=1; i<=8; i++) {
        d16Izq.appendChild(crearCardBracket(`1/16 - #${i}`, `d16-i-${i}`));
    }
    
    const d16Der = document.getElementById("d16-der");
    for(let i=9; i<=16; i++) {
        d16Der.appendChild(crearCardBracket(`1/16 - #${i}`, `d16-d-${i}`));
    }
    
    const o8Izq = document.getElementById("o8-izq");
    for(let i=1; i<=4; i++) {
        o8Izq.appendChild(crearCardBracket(`1/8 - #${i}`, `o8-i-${i}`));
    }
    
    const o8Der = document.getElementById("o8-der");
    for(let i=5; i<=8; i++) {
        o8Der.appendChild(crearCardBracket(`1/8 - #${i}`, `o8-d-${i}`));
    }
    
    const c4Izq = document.getElementById("c4-izq");
    for(let i=1; i<=2; i++) {
        c4Izq.appendChild(crearCardBracket(`1/4 - #${i}`, `c4-i-${i}`));
    }
    
    const c4Der = document.getElementById("c4-der");
    for(let i=3; i<=4; i++) {
        c4Der.appendChild(crearCardBracket(`1/4 - #${i}`, `c4-d-${i}`));
    }
    
    const semiIzq = document.getElementById("semi-izq");
    semiIzq.appendChild(crearCardBracket("SEMIFINAL 1", "semi-i-1"));
    
    const semiDer = document.getElementById("semi-der");
    semiDer.appendChild(crearCardBracket("SEMIFINAL 2", "semi-d-2"));
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
    renderizarGrupos();
    renderizarBracket();
    cargarResultados();
};
