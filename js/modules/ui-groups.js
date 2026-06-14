// Módulo de renderizado de la fase de grupos y tablas de posiciones

import { GRUPOS, PAISES } from '../data/paises.js';
import { PARTIDOS } from '../data/partidos.js';
import { tablasEstado } from './estado.js';

/**
 * Renderiza todas las tarjetas de grupos en sus páginas correspondientes
 */
export function renderizarGrupos() {
    const p1 = document.getElementById("grid-page-1");
    const p2 = document.getElementById("grid-page-2");
    const p3 = document.getElementById("grid-page-3");
    
    if (p1) {
        p1.innerHTML = "";
        ["A", "B", "C", "D"].forEach(letra => {
            p1.appendChild(crearTarjetaGrupoAmplia(letra));
        });
    }
    
    if (p2) {
        p2.innerHTML = "";
        ["E", "F", "G", "H"].forEach(letra => {
            p2.appendChild(crearTarjetaGrupoAmplia(letra));
        });
    }
    
    if (p3) {
        p3.innerHTML = "";
        ["I", "J", "K", "L"].forEach(letra => {
            p3.appendChild(crearTarjetaGrupoAmplia(letra));
        });
    }
}

/**
 * Crea el elemento DOM de la tarjeta de un grupo (incluye tabla y partidos)
 */
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
            <div class="partido-row" onclick="abrirDetallesPartido('local-${letra}-${idx}')">
                <div class="partido-info">${p.fecha} ${p.hora}</div>
                <div class="partido-team-l">
                    <span class="team-fullname">${n1}</span>
                    <span class="team-shortname">${p.l1}</span>
                    <img src="banderas/${p.l1.toLowerCase()}.png" class="eq-flag" alt="${p.l1}">
                </div>
                <div class="partido-score">
                    <span class="score-display" id="sc-${letra}-${idx}-1">-</span>
                    <span class="score-divider">-</span>
                    <span class="score-display" id="sc-${letra}-${idx}-2">-</span>
                </div>
                <div class="partido-team-r">
                    <img src="banderas/${p.l2.toLowerCase()}.png" class="eq-flag" alt="${p.l2}">
                    <span class="team-fullname">${n2}</span>
                    <span class="team-shortname">${p.l2}</span>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    card.innerHTML = html;
    return card;
}
