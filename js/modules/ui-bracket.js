// Módulo de renderizado de la fase de playoffs y brackets de eliminación directa

import { GRUPOS, PAISES } from '../data/paises.js';
import { MAPA_PLAYOFFS } from '../data/partidos.js';
import { 
    tablasEstado, 
    partidosPlayoffsEquipos, 
    partidosPlayoffsGoles 
} from './estado.js';

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

/**
 * Renderiza el árbol visual de eliminación directa (Brackets)
 */
export function renderizarBracket() {
    const r32C = document.getElementById("r32-container");
    if (r32C) { r32C.innerHTML = ""; for(let i=1; i<=16; i++) r32C.appendChild(crearCardBracket(`1/16 - #${i}`, `r32-${i}`)); }
    
    const r16C = document.getElementById("r16-container");
    if (r16C) { r16C.innerHTML = ""; for(let i=1; i<=8; i++) r16C.appendChild(crearCardBracket(`1/8 - #${i}`, `r16-${i}`)); }
    
    const qfC = document.getElementById("qf-container");
    if (qfC) { qfC.innerHTML = ""; for(let i=1; i<=4; i++) qfC.appendChild(crearCardBracket(`1/4 - #${i}`, `qf-${i}`)); }
    
    const sfC = document.getElementById("sf-container");
    if (sfC) { sfC.innerHTML = ""; for(let i=1; i<=2; i++) sfC.appendChild(crearCardBracket(`SEMIFINAL ${i}`, `sf-${i}`)); }
    
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
