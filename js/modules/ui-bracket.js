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
    
    let mejoresTerceros = terceros.slice(0, 8).map(t => t.id);
    while (mejoresTerceros.length < 8) {
        mejoresTerceros.push("");
    }
    
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

    Object.keys(MAPA_PLAYOFFS).forEach(partidoId => {
        const idPrefijo = MAPA_PLAYOFFS[partidoId];
        
        let t1 = "";
        let t2 = "";
        
        if (partidosPlayoffsEquipos[partidoId]) {
            t1 = partidosPlayoffsEquipos[partidoId].t1;
            t2 = partidosPlayoffsEquipos[partidoId].t2;
        }
        
        const pIdInt = parseInt(partidoId);
        if (!t1 && !t2 && pIdInt >= 73 && pIdInt <= 88 && crucesTeoricos[partidoId]) {
            t1 = crucesTeoricos[partidoId].t1;
            t2 = crucesTeoricos[partidoId].t2;
        }
        
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
        
        if (t1El) {
            const cardEl = t1El.closest(".match-card");
            if (cardEl) {
                cardEl.setAttribute("onclick", `abrirDetallesPartido('${partidoId}')`);
            }
        }
    });
}

/**
 * Renderiza el árbol visual de eliminación directa (Brackets)
 */
export function renderizarBracket() {
    const d16Izq = document.getElementById("d16-izq");
    if (d16Izq) {
        d16Izq.innerHTML = "";
        for(let i=1; i<=8; i++) {
            d16Izq.appendChild(crearCardBracket(`1/16 - #${i}`, `d16-i-${i}`));
        }
    }
    
    const d16Der = document.getElementById("d16-der");
    if (d16Der) {
        d16Der.innerHTML = "";
        for(let i=9; i<=16; i++) {
            d16Der.appendChild(crearCardBracket(`1/16 - #${i}`, `d16-d-${i}`));
        }
    }
    
    const o8Izq = document.getElementById("o8-izq");
    if (o8Izq) {
        o8Izq.innerHTML = "";
        for(let i=1; i<=4; i++) {
            o8Izq.appendChild(crearCardBracket(`1/8 - #${i}`, `o8-i-${i}`));
        }
    }
    
    const o8Der = document.getElementById("o8-der");
    if (o8Der) {
        o8Der.innerHTML = "";
        for(let i=5; i<=8; i++) {
            o8Der.appendChild(crearCardBracket(`1/8 - #${i}`, `o8-d-${i}`));
        }
    }
    
    const c4Izq = document.getElementById("c4-izq");
    if (c4Izq) {
        c4Izq.innerHTML = "";
        for(let i=1; i<=2; i++) {
            c4Izq.appendChild(crearCardBracket(`1/4 - #${i}`, `c4-i-${i}`));
        }
    }
    
    const c4Der = document.getElementById("c4-der");
    if (c4Der) {
        c4Der.innerHTML = "";
        for(let i=3; i<=4; i++) {
            c4Der.appendChild(crearCardBracket(`1/4 - #${i}`, `c4-d-${i}`));
        }
    }
    
    const semiIzq = document.getElementById("semi-izq");
    if (semiIzq) {
        semiIzq.innerHTML = "";
        semiIzq.appendChild(crearCardBracket("SEMIFINAL 1", "semi-i-1"));
    }
    
    const semiDer = document.getElementById("semi-der");
    if (semiDer) {
        semiDer.innerHTML = "";
        semiDer.appendChild(crearCardBracket("SEMIFINAL 2", "semi-d-2"));
    }
}

/**
 * Crea una tarjeta DOM de partido en la estructura de brackets
 */
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
