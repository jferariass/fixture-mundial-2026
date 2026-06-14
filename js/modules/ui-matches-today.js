// Módulo de renderizado de partidos de hoy y predicciones de victorias

import { listaPartidosCompleta } from './estado.js';
import { calcularPrediccion } from './calculations.js';

/**
 * Obtiene la fecha actual en Argentina ajustada a GMT-3
 */
export function getFechaArgentinaHoy() {
    const d = new Date();
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const offsetArg = -3;
    const fechaArg = new Date(utc + (3600000 * offsetArg));
    
    const dia = String(fechaArg.getDate()).padStart(2, '0');
    const mes = String(fechaArg.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}`;
}

/**
 * Actualiza la lista visual de partidos de hoy
 */
export function actualizarPartidosDeHoy() {
    const contenedor = document.getElementById("hoy-matches-list");
    if (!contenedor) return;
    
    const hoyArg = getFechaArgentinaHoy();
    const partidosDeHoy = listaPartidosCompleta.filter(p => p.fechaArg === hoyArg);
    
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
        
        const mostrarPrediccion = p.fifaHome && p.fifaAway;
        let prediccionHtml = "";
        if (mostrarPrediccion) {
            const pred = calcularPrediccion(p.fifaHome, p.fifaAway);
            
            let labelHome = "";
            if (pred.home >= 18) {
                labelHome = `${p.fifaHome} ${pred.home}%`;
            } else if (pred.home >= 10) {
                labelHome = `${pred.home}%`;
            } else if (pred.home >= 5) {
                labelHome = `${pred.home}`;
            }

            let labelDraw = "";
            if (pred.draw >= 22) {
                labelDraw = `Empate ${pred.draw}%`;
            } else if (pred.draw >= 13) {
                labelDraw = `Emp. ${pred.draw}%`;
            } else if (pred.draw >= 8) {
                labelDraw = `${pred.draw}%`;
            }

            let labelAway = "";
            if (pred.away >= 18) {
                labelAway = `${p.fifaAway} ${pred.away}%`;
            } else if (pred.away >= 10) {
                labelAway = `${pred.away}%`;
            } else if (pred.away >= 5) {
                labelAway = `${pred.away}`;
            }

            prediccionHtml = `
                <div class="hoy-prediction-section">
                    <div class="prediction-title">
                        <i class="fa-solid fa-chart-pie"></i> Probabilidad de Resultado (Fórmula de Expectativa FIFA)
                    </div>
                    <div class="prediction-bar">
                        <div class="bar-segment bar-home" style="width: ${pred.home}%;" title="Victoria ${p.nombreHome}">
                            ${labelHome}
                        </div>
                        <div class="bar-segment bar-draw" style="width: ${pred.draw}%;" title="Empate">
                            ${labelDraw}
                        </div>
                        <div class="bar-segment bar-away" style="width: ${pred.away}%;" title="Victoria ${p.nombreAway}">
                            ${labelAway}
                        </div>
                    </div>
                </div>
            `;
        }
        
        html += `
            <div class="hoy-match-card" onclick="abrirDetallesPartido('${p.id}')">
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
                ${prediccionHtml}
            </div>
        `;
    });
    
    contenedor.innerHTML = html;
}
