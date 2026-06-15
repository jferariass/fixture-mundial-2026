import { listaPartidosCompleta } from './estado.js';
import { PAISES } from '../data/paises.js';

/**
 * Recalcula y renderiza la pestaña de Podio Estadístico
 */
export function renderizarPodio() {
    const contenedor = document.getElementById("podium-view");
    if (!contenedor) return;

    // Diccionarios para acumular estadísticas
    // Clave: nombre corto + país (ej. "L. Messi (ARG)")
    const stats = {
        goles: {},
        amarillas: {},
        rojas: {},
        penales: {},
        enContra: {},
        golesPorPais: {},
        tarjetasPorPais: {} // amarillas + rojas
    };

    // Función auxiliar para sumar a las métricas del jugador
    const addStat = (dict, id, name, code, flag, qty) => {
        if (!dict[id]) {
            dict[id] = { id: id, name: name, code: code, flag: flag, count: 0 };
        }
        dict[id].count += qty;
    };

    // Función auxiliar para sumar a las métricas del país
    const addCountryStat = (dict, code, qty) => {
        if (!code) return;
        if (!dict[code]) {
            const countryName = PAISES[code] ? PAISES[code].nombre : code;
            const countryFlag = `banderas/${code.toLowerCase()}.png`;
            dict[code] = { code: code, name: countryName, flag: countryFlag, count: 0 };
        }
        dict[code].count += qty;
    };

    // 1. Recorrer todos los partidos y sumar las incidencias
    listaPartidosCompleta.forEach(partido => {
        if (partido.incidenciasReales && partido.incidenciasReales.length > 0) {
            partido.incidenciasReales.forEach(incidencia => {
                const type = incidencia.type;
                const player = incidencia.detail;
                if (!player) return;

                // Identificar a qué país pertenece el jugador basado en 'team' (home o away)
                const fifaCode = incidencia.team === "home" ? partido.fifaHome : partido.fifaAway;
                const flagUrl = fifaCode ? `banderas/${fifaCode.toLowerCase()}.png` : "";
                
                const playerId = `${player} (${fifaCode})`;

                const typeLower = type.toLowerCase();

                // Analizar el tipo de incidencia
                if (typeLower.includes("goal") && !typeLower.includes("own goal")) {
                    addStat(stats.goles, playerId, player, fifaCode, flagUrl, 1);
                    addCountryStat(stats.golesPorPais, fifaCode, 1);
                } else if (typeLower.includes("penalty - scored") || typeLower === "penalty") {
                    addStat(stats.goles, playerId, player, fifaCode, flagUrl, 1); // El penal también es un gol
                    addStat(stats.penales, playerId, player, fifaCode, flagUrl, 1);
                    addCountryStat(stats.golesPorPais, fifaCode, 1);
                } else if (typeLower.includes("yellow")) {
                    addStat(stats.amarillas, playerId, player, fifaCode, flagUrl, 1);
                    addCountryStat(stats.tarjetasPorPais, fifaCode, 1);
                } else if (typeLower.includes("red") && !typeLower.includes("yellow")) {
                    addStat(stats.rojas, playerId, player, fifaCode, flagUrl, 1);
                    addCountryStat(stats.tarjetasPorPais, fifaCode, 1); // Asumimos que la roja suma a la indisciplina
                } else if (typeLower.includes("own goal")) {
                    addStat(stats.enContra, playerId, player, fifaCode, flagUrl, 1);
                    // Los goles en contra se los anotan al país RIVAL
                    const rivalCode = incidencia.team === "home" ? partido.fifaAway : partido.fifaHome;
                    addCountryStat(stats.golesPorPais, rivalCode, 1);
                }
            });
        }
    });

    // 2. Convertir diccionarios a arrays y ordenar (Top 5)
    const topGoleadores = Object.values(stats.goles).sort((a, b) => b.count - a.count).slice(0, 5);
    const topAmarillas = Object.values(stats.amarillas).sort((a, b) => b.count - a.count).slice(0, 5);
    const topRojas = Object.values(stats.rojas).sort((a, b) => b.count - a.count).slice(0, 5);
    const topPenales = Object.values(stats.penales).sort((a, b) => b.count - a.count).slice(0, 5);
    
    // Equipos
    const topPaisesGoles = Object.values(stats.golesPorPais).sort((a, b) => b.count - a.count).slice(0, 5);
    const topPaisesTarjetas = Object.values(stats.tarjetasPorPais).sort((a, b) => b.count - a.count).slice(0, 5);

    // Si aún no hay datos de nada (el torneo no empezó)
    if (topGoleadores.length === 0 && topAmarillas.length === 0 && topPaisesGoles.length === 0) {
        contenedor.innerHTML = `
            <div class="hoy-no-matches" style="grid-column: 1 / -1; margin-top: 40px;">
                <i class="fa-solid fa-chart-bar" style="font-size: 3rem; color: #555; margin-bottom: 15px; display: block;"></i>
                <p>Las estadísticas se generarán automáticamente en cuanto se anote el primer gol o tarjeta del torneo.</p>
            </div>
        `;
        return;
    }

    // 3. Renderizar las tarjetas
    let html = "";

    html += crearTarjetaRanking("⚽ Bota de Oro (Goles)", topGoleadores, "goles");
    html += crearTarjetaRanking("🟨 Al Límite (Amarillas)", topAmarillas, "amarillas");
    html += crearTarjetaRanking("🟥 Expulsados (Rojas)", topRojas, "rojas");
    html += crearTarjetaRanking("🎯 Reyes del Penal", topPenales, "penales");
    html += crearTarjetaRankingPais("📈 Países Más Goleadores", topPaisesGoles, "goles");
    html += crearTarjetaRankingPais("🪓 Selecciones más Amonestadas", topPaisesTarjetas, "tarjetas");

    contenedor.innerHTML = html;
}

/**
 * Genera el HTML de una tarjeta de ranking para jugadores
 */
function crearTarjetaRanking(titulo, arrayDatos, tipo) {
    if (arrayDatos.length === 0) return ""; // Si no hay datos, no mostrar la tarjeta

    let html = `
        <div class="ranking-card">
            <h3 class="ranking-title">${titulo}</h3>
            <div class="ranking-list">
    `;

    arrayDatos.forEach((item, index) => {
        const posicion = index + 1;
        let medalla = "";
        if (posicion === 1) medalla = "🥇";
        else if (posicion === 2) medalla = "🥈";
        else if (posicion === 3) medalla = "🥉";
        else medalla = `<span class="ranking-pos-num">${posicion}</span>`;

        html += `
            <div class="ranking-row">
                <div class="ranking-pos">${medalla}</div>
                <div class="ranking-player">
                    ${item.flag ? `<img src="${item.flag}" class="ranking-flag" alt="${item.code}" onerror="this.style.display='none'">` : ""}
                    <span class="ranking-name">${item.name}</span>
                </div>
                <div class="ranking-count">${item.count}</div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;
    return html;
}

/**
 * Genera el HTML de una tarjeta de ranking para Países
 */
function crearTarjetaRankingPais(titulo, arrayDatos, tipo) {
    if (arrayDatos.length === 0) return ""; 

    let html = `
        <div class="ranking-card">
            <h3 class="ranking-title">${titulo}</h3>
            <div class="ranking-list">
    `;

    arrayDatos.forEach((item, index) => {
        const posicion = index + 1;
        let medalla = "";
        if (posicion === 1) medalla = "🥇";
        else if (posicion === 2) medalla = "🥈";
        else if (posicion === 3) medalla = "🥉";
        else medalla = `<span class="ranking-pos-num">${posicion}</span>`;

        html += `
            <div class="ranking-row">
                <div class="ranking-pos">${medalla}</div>
                <div class="ranking-player">
                    ${item.flag ? `<img src="${item.flag}" class="ranking-flag" alt="${item.code}" onerror="this.style.display='none'">` : ""}
                    <span class="ranking-name">${item.name}</span>
                </div>
                <div class="ranking-count">${item.count}</div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;
    return html;
}
