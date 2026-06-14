// Módulo de cálculos y predicciones matemáticas
import { GRUPOS, PAISES } from '../data/paises.js';
import { PARTIDOS } from '../data/partidos.js';
import { RATINGS_FUERZA } from '../data/resultados.js';
import { tablasEstado, partidosGoles } from './estado.js';

/**
 * Calcula la predicción de un partido usando la fórmula de expectativa FIFA basada en ratings de fuerza.
 */
export function calcularPrediccion(fifaHome, fifaAway) {
    const rA = RATINGS_FUERZA[fifaHome] || 1600;
    const rB = RATINGS_FUERZA[fifaAway] || 1600;
    
    const diff = rA - rB;
    const expectedA = 1 / (1 + Math.pow(10, -diff / 400));
    
    // Empate base: 24%, disminuye a medida que la diferencia es mayor
    let pDraw = Math.round(24 * (1 - Math.min(Math.abs(diff) / 500, 0.6)));
    
    // Distribución del resto
    let pResto = 100 - pDraw;
    let pHome = Math.round(expectedA * pResto);
    let pAway = pResto - pHome;
    
    // Ajustar si sumase más de 100 por redondeos
    const suma = pHome + pDraw + pAway;
    if (suma !== 100) {
        pHome += (100 - suma);
    }
    
    return { home: pHome, draw: pDraw, away: pAway };
}

/**
 * Calcula la tabla de posiciones y goles de un grupo y actualiza el DOM de forma reactiva.
 */
export function calcularGrupo(letra) {
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
