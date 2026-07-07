// Módulo de renderizado de la fase de playoffs y brackets de eliminación directa

import { GRUPOS, PAISES } from '../data/paises.js';
import { MAPA_PLAYOFFS } from '../data/partidos.js';
import { 
    tablasEstado, 
    partidosPlayoffsEquipos, 
    partidosPlayoffsGoles 
} from './estado.js';

const BRACKET_TREE = {
    "r16-1": ["r32-1", "r32-2"], "r16-2": ["r32-3", "r32-4"],
    "r16-3": ["r32-5", "r32-6"], "r16-4": ["r32-7", "r32-8"],
    "r16-5": ["r32-9", "r32-10"], "r16-6": ["r32-11", "r32-12"],
    "r16-7": ["r32-13", "r32-14"], "r16-8": ["r32-15", "r32-16"],
    "qf-1": ["r16-1", "r16-2"], "qf-2": ["r16-3", "r16-4"],
    "qf-3": ["r16-5", "r16-6"], "qf-4": ["r16-7", "r16-8"],
    "sf-1": ["qf-1", "qf-2"], "sf-2": ["qf-3", "qf-4"],
    "final": ["sf-1", "sf-2"], "bronze": ["sf-1", "sf-2"]
};

/**
 * Recalcula y actualiza la llave de playoffs de forma automática en base a las posiciones de los grupos
 */
export function actualizarPlayoffsAutomatico() {
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
    
    // Iterar sobre los nodos DOM guardados dinámicamente por api.js
    Object.keys(partidosPlayoffsEquipos).forEach(idPrefijo => {
        let t1 = partidosPlayoffsEquipos[idPrefijo].t1;
        let t2 = partidosPlayoffsEquipos[idPrefijo].t2;
        let pData = partidosPlayoffsGoles[idPrefijo] || {};
        const t1El = document.getElementById(`${idPrefijo}-t1`);
        const t2El = document.getElementById(`${idPrefijo}-t2`);
        const s1El = document.getElementById(`${idPrefijo}-s1`);
        const s2El = document.getElementById(`${idPrefijo}-s2`);
        
        const f1El = document.getElementById(`${idPrefijo}-f1`);
        const f2El = document.getElementById(`${idPrefijo}-f2`);
        const row1El = document.getElementById(`${idPrefijo}-row1`);
        const row2El = document.getElementById(`${idPrefijo}-row2`);
        const statusEl = document.getElementById(`${idPrefijo}-status`);
        const timeEl = document.getElementById(`${idPrefijo}-time`);
        const cardEl = document.getElementById(`card-${idPrefijo}`);

        // FORZAR PROPAGACIÓN FRONTEND DE GANADORES SI ESTÁN DISPONIBLES
        if (BRACKET_TREE[idPrefijo]) {
            const [p1, p2] = BRACKET_TREE[idPrefijo];
            if (partidosPlayoffsGoles[p1] && partidosPlayoffsGoles[p1].winner) {
                if (idPrefijo === "bronze") {
                    t1 = partidosPlayoffsEquipos[p1].t1 === partidosPlayoffsGoles[p1].winner ? partidosPlayoffsEquipos[p1].t2 : partidosPlayoffsEquipos[p1].t1;
                } else {
                    t1 = partidosPlayoffsGoles[p1].winner;
                }
            }
            if (partidosPlayoffsGoles[p2] && partidosPlayoffsGoles[p2].winner) {
                if (idPrefijo === "bronze") {
                    t2 = partidosPlayoffsEquipos[p2].t1 === partidosPlayoffsGoles[p2].winner ? partidosPlayoffsEquipos[p2].t2 : partidosPlayoffsEquipos[p2].t1;
                } else {
                    t2 = partidosPlayoffsGoles[p2].winner;
                }
            }
        }

        if (t1El) t1El.innerText = t1 ? (PAISES[t1] ? PAISES[t1].nombre : t1) : "___________";
        if (t2El) t2El.innerText = t2 ? (PAISES[t2] ? PAISES[t2].nombre : t2) : "___________";
        
        if (f1El) {
            if (t1) { f1El.src = `banderas/${t1.toLowerCase()}.png`; f1El.style.display = 'inline-block'; }
            else { f1El.style.display = 'none'; }
        }
        if (f2El) {
            if (t2) { f2El.src = `banderas/${t2.toLowerCase()}.png`; f2El.style.display = 'inline-block'; }
            else { f2El.style.display = 'none'; }
        }
        
        // Reset classes
        if (row1El) { row1El.classList.remove('winner', 'loser', 'winner-team', 'loser-team'); }
        if (row2El) { row2El.classList.remove('winner', 'loser', 'winner-team', 'loser-team'); }
        if (cardEl) { cardEl.classList.remove('is-live', 'match-finished'); }
        if (statusEl) { statusEl.innerHTML = ""; statusEl.style.display = 'none'; }
        if (timeEl) { timeEl.innerText = ""; }
        
        if (partidosPlayoffsGoles[idPrefijo] !== undefined) {
            const data = partidosPlayoffsGoles[idPrefijo];
            const s1 = data.s1;
            const s2 = data.s2;
            const pen1 = data.pen1;
            const pen2 = data.pen2;
            
            if (timeEl && data.fechaArg && data.horaArg) {
                timeEl.innerText = `${data.fechaArg} - ${data.horaArg}`;
            }
            
            if (s1El && s2El) {
                s1El.innerText = pen1 !== null ? `${s1} (${pen1})` : s1;
                s1El.classList.add("has-score");
                s2El.innerText = pen2 !== null ? `${s2} (${pen2})` : s2;
                s2El.classList.add("has-score");
            }

            if (data.isLive) {
                if (cardEl) cardEl.classList.add("is-live");
                if (statusEl) {
                    statusEl.innerHTML = `<span class="live-dot"></span> EN VIVO: ${data.timeStr}`;
                    statusEl.style.display = 'block';
                }
            } else if (data.winner) {
                if (cardEl) cardEl.classList.add("match-finished");
                if (data.winner === t1 && row1El && row2El) {
                    row1El.classList.add('winner-team');
                    row2El.classList.add('loser-team');
                } else if (data.winner === t2 && row1El && row2El) {
                    row2El.classList.add('winner-team');
                    row1El.classList.add('loser-team');
                }
            }
        } else {
            if (s1El && s2El) {
                s1El.innerText = "-";
                s1El.classList.remove("has-score");
                s2El.innerText = "-";
                s2El.classList.remove("has-score");
            }
        }
        
        if (t1El) {
            const cEl = t1El.closest(".match-card");
            if (cEl) {
                cEl.setAttribute("onclick", `abrirDetallesPartido('${idPrefijo}')`);
            }
        }
    });
}

export function renderizarBracket() {
    // 16avos
    const r32L = document.getElementById("r32-left");
    if (r32L) { r32L.innerHTML = ""; for(let i=1; i<=8; i++) r32L.appendChild(crearCardBracket(`1/16 - #${i}`, `r32-${i}`)); }
    const r32R = document.getElementById("r32-right");
    if (r32R) { r32R.innerHTML = ""; for(let i=9; i<=16; i++) r32R.appendChild(crearCardBracket(`1/16 - #${i}`, `r32-${i}`)); }
    
    // Octavos
    const r16L = document.getElementById("r16-left");
    if (r16L) { r16L.innerHTML = ""; for(let i=1; i<=4; i++) r16L.appendChild(crearCardBracket(`1/8 - #${i}`, `r16-${i}`)); }
    const r16R = document.getElementById("r16-right");
    if (r16R) { r16R.innerHTML = ""; for(let i=5; i<=8; i++) r16R.appendChild(crearCardBracket(`1/8 - #${i}`, `r16-${i}`)); }
    
    // Cuartos
    const qfL = document.getElementById("qf-left");
    if (qfL) { qfL.innerHTML = ""; for(let i=1; i<=2; i++) qfL.appendChild(crearCardBracket(`1/4 - #${i}`, `qf-${i}`)); }
    const qfR = document.getElementById("qf-right");
    if (qfR) { qfR.innerHTML = ""; for(let i=3; i<=4; i++) qfR.appendChild(crearCardBracket(`1/4 - #${i}`, `qf-${i}`)); }
    
    // Semifinales
    const sfL = document.getElementById("sf-left");
    if (sfL) { sfL.innerHTML = ""; sfL.appendChild(crearCardBracket(`SEMIFINAL 1`, `sf-1`)); }
    const sfR = document.getElementById("sf-right");
    if (sfR) { sfR.innerHTML = ""; sfR.appendChild(crearCardBracket(`SEMIFINAL 2`, `sf-2`)); }
    
    // Final y 3er Puesto
    const finalC = document.getElementById("final-container");
    if (finalC) { 
        finalC.innerHTML = ""; 
        finalC.appendChild(crearCardBracket("FINAL", "final"));
        finalC.appendChild(crearCardBracket("3ER PUESTO", "bronze"));
    }
}

/**
 * Crea una tarjeta DOM de partido en la estructura de brackets
 */
function crearCardBracket(titulo, idPrefijo) {
    const card = document.createElement("div");
    card.className = "match-card";
    card.id = `card-${idPrefijo}`;
    card.innerHTML = `
        <div class="match-title" id="${idPrefijo}-title">${titulo}</div>
        <div class="match-datetime" id="${idPrefijo}-time"></div>
        <div class="match-team-row" id="${idPrefijo}-row1">
            <div class="team-name-container">
                <img src="" class="bracket-flag" id="${idPrefijo}-f1" style="display:none;" />
                <span class="team-name" id="${idPrefijo}-t1">___________</span>
            </div>
            <span class="score-display-bracket" id="${idPrefijo}-s1">-</span>
        </div>
        <div class="match-team-row" id="${idPrefijo}-row2">
            <div class="team-name-container">
                <img src="" class="bracket-flag" id="${idPrefijo}-f2" style="display:none;" />
                <span class="team-name" id="${idPrefijo}-t2">___________</span>
            </div>
            <span class="score-display-bracket" id="${idPrefijo}-s2">-</span>
        </div>
        <div class="match-status-bracket" id="${idPrefijo}-status"></div>
    `;
    return card;
}
