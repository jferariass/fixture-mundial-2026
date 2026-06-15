// Módulo de renderizado de la ficha de detalles de partido (Modal, alineaciones, cancha táctica y estadísticas)

import { PAISES } from '../data/paises.js';
import { PARTIDOS, MAPA_PLAYOFFS } from '../data/partidos.js';
import { PLANTILLAS_PAISES } from '../data/plantillas.js';
import { listaPartidosCompleta, partidosGoles } from './estado.js';
import { calcularPrediccion } from './calculations.js';

/**
 * Abre la ficha de detalles de un partido en un popup modal
 */
export function abrirDetallesPartido(partidoId) {
    const modal = document.getElementById("match-detail-modal");
    const content = document.getElementById("modal-detail-content");
    
    if (!modal || !content) return;
    
    const partido = buscarPartidoPorId(partidoId);
    if (!partido) return;
    
    modal.classList.add("show");
    document.body.classList.add("modal-open");
    content.innerHTML = `
        <div class="hoy-loading-loader" style="margin-top: 60px;">
            <div class="clock-spinner">
                <i class="fa-solid fa-clock"></i>
            </div>
            <p class="hoy-loading-text">Cargando incidencias del partido...</p>
        </div>
    `;
    
    setTimeout(() => {
        construirModalDetalles(partido, content);
    }, 500);
}

/**
 * Busca un partido dentro de la lista de partidos formateados por ID
 */
function buscarPartidoPorId(partidoId) {
    let partido = listaPartidosCompleta.find(p => p.id === partidoId);
    if (partido) return partido;
    
    if (partidoId.startsWith("local-")) {
        const parts = partidoId.split("-");
        const letra = parts[1];
        const idx = parseInt(parts[2]);
        
        if (PARTIDOS[letra] && PARTIDOS[letra][idx]) {
            const pLocal = PARTIDOS[letra][idx];
            partido = listaPartidosCompleta.find(p => 
                p.type === "group" && 
                ((p.fifaHome === pLocal.l1 && p.fifaAway === pLocal.l2) || 
                 (p.fifaHome === pLocal.l2 && p.fifaAway === pLocal.l1))
            );
            if (partido) return partido;
            
            const s1 = partidosGoles[`${letra}-${idx}-1`];
            const s2 = partidosGoles[`${letra}-${idx}-2`];
            const jugado = s1 !== undefined && s2 !== undefined;
            return {
                id: partidoId,
                type: "group",
                group: letra,
                matchday: Math.floor(idx / 2) + 1,
                finished: jugado ? "TRUE" : "FALSE",
                time_elapsed: jugado ? "finished" : "notstarted",
                isStarted: jugado,
                fifaHome: pLocal.l1,
                fifaAway: pLocal.l2,
                nombreHome: PAISES[pLocal.l1].nombre,
                nombreAway: PAISES[pLocal.l2].nombre,
                fechaArg: pLocal.fecha,
                horaArg: pLocal.hora,
                s1: jugado ? s1 : null,
                s2: jugado ? s2 : null
            };
        }
    }
    
    const partidoPlayoffId = Object.keys(MAPA_PLAYOFFS).find(k => MAPA_PLAYOFFS[k] === partidoId);
    if (partidoPlayoffId) {
        return buscarPartidoPorId(partidoPlayoffId);
    }
    
    return null;
}

/**
 * Cierra la ficha de detalles del partido
 */
export function cerrarDetallesPartido() {
    const modal = document.getElementById("match-detail-modal");
    if (modal) {
        modal.classList.remove("show");
        document.body.classList.remove("modal-open");
    }
}

/**
 * Cambia la pestaña interna del modal (Alineaciones, Incidencias, Estadísticas)
 */
export function switchModalTab(btn, tabId) {
    const tabsContainer = btn.parentElement;
    tabsContainer.querySelectorAll(".modal-tab-btn").forEach(b => {
        b.classList.remove("active");
    });
    
    btn.classList.add("active");
    
    const modalContainer = tabsContainer.nextElementSibling.parentElement;
    modalContainer.querySelectorAll(".modal-tab-content").forEach(c => {
        c.classList.remove("active");
    });
    
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.classList.add("active");
    }
}

/**
 * Obtiene la alineación real o fallback de un país
 */
function obtenerAlineacionPais(codigoFifa) {
    if (PLANTILLAS_PAISES[codigoFifa]) {
        return PLANTILLAS_PAISES[codigoFifa];
    }
    
    const nombrePais = PAISES[codigoFifa] ? PAISES[codigoFifa].nombre : codigoFifa;
    const formacion = "4-3-3";
    const dt = `DT de ${nombrePais}`;
    
    const apellidos = [
        "González", "Rodríguez", "Smith", "Johnson", "Müller", "Schmidt", "Dupont", "Martin",
        "Silva", "Santos", "Jones", "Williams", "Brown", "Taylor", "Davies", "Wilson",
        "García", "Fernández", "López", "Martínez", "Pérez", "Sanchez", "Gomez", "Diaz"
    ];
    
    const titulares = [
        { n: 1, name: "Arquero GK", pos: "gk" },
        { n: 2, name: "Lateral Izq.", pos: "df" },
        { n: 3, name: "Defensa Central 1", pos: "df" },
        { n: 4, name: "Defensa Central 2", pos: "df" },
        { n: 5, name: "Lateral Der.", pos: "df" },
        { n: 6, name: "Pivote Def.", pos: "mf" },
        { n: 8, name: "Volante Mixto 1", pos: "mf" },
        { n: 10, name: "Creador de Juego", pos: "mf" },
        { n: 7, name: "Extremo Izq.", pos: "fw" },
        { n: 9, name: "Centro Delantero", pos: "fw" },
        { n: 11, name: "Extremo Der.", pos: "fw" }
    ];
    
    titulares.forEach((p, idx) => {
        if (idx > 0) {
            const apellido = apellidos[(codigoFifa.charCodeAt(0) + idx * 7) % apellidos.length];
            p.name = `${p.name.split(" ")[0]} ${apellido}`;
        } else {
            p.name = `G. ${(PAISES[codigoFifa] ? PAISES[codigoFifa].nombre.substring(0, 4) : "Portero")}`;
        }
    });
    
    const suplentes = [];
    for (let i = 12; i <= 20; i++) {
        const apellido = apellidos[(codigoFifa.charCodeAt(1) + i * 3) % apellidos.length];
        suplentes.push(`J. ${apellido}`);
    }
    
    return {
        nombre: nombrePais,
        formacion: formacion,
        titulares: titulares,
        suplentes: suplentes,
        dt: dt
    };
}

/**
 * Calcula las coordenadas X y Y de un futbolista en la cancha de fútbol
 */
function obtenerCoordenadasJugador(pos, idx, equipo, formacion) {
    let coords = { x: 50, y: 50 };
    
    if (pos === "gk") {
        coords.x = (equipo === "home") ? 8 : 92;
        coords.y = 50;
        return coords;
    }
    
    if (pos === "df") {
        coords.x = (equipo === "home") ? 18 : 82;
        const yCoords = [20, 40, 60, 80];
        coords.y = yCoords[idx % yCoords.length];
    } else if (pos === "mf") {
        coords.x = (equipo === "home") ? 31 : 69;
        const yCoords = [25, 50, 75];
        coords.y = yCoords[idx % yCoords.length];
    } else if (pos === "fw") {
        coords.x = (equipo === "home") ? 43 : 57;
        const yCoords = [25, 50, 75];
        coords.y = yCoords[idx % yCoords.length];
    }
    
    return coords;
}

/**
 * Crea las incidencias y estadísticas comparativas ficticias pero realistas para el modal
 */
function construirModalDetalles(p, container) {
    const banderaHome = p.fifaHome ? `banderas/${p.fifaHome.toLowerCase()}.png` : "";
    const banderaAway = p.fifaAway ? `banderas/${p.fifaAway.toLowerCase()}.png` : "";
    
    const tieneGoles = p.isStarted && p.s1 !== null && p.s2 !== null;
    
    let statusClass = "status-programado";
    let statusText = "Programado";
    if (p.finished === "TRUE") {
        statusClass = "status-finalizado";
        statusText = "Finalizado";
    } else if (p.isStarted) {
        statusClass = "status-live";
        statusText = `En Vivo • ${p.time_elapsed || "90'"}`;
    }
    
    const alineacionHome = obtenerAlineacionPais(p.fifaHome || "ARG");
    const alineacionAway = obtenerAlineacionPais(p.fifaAway || "CAN");
    
    let todasIncidencias = [];
    
    if (p.incidenciasReales && p.incidenciasReales.length > 0) {
        todasIncidencias = p.incidenciasReales.map(evt => {
            // Mapear los tipos de ESPN a los de nuestra UI
            let tipoUI = "desconocido";
            let texto = evt.type;
            
            if (evt.type.includes("Goal")) {
                tipoUI = "gol";
                texto = `¡GOL de ${evt.team === "home" ? p.nombreHome : p.nombreAway}!`;
            } else if (evt.type.includes("Yellow Card")) {
                tipoUI = "tarjeta-amarilla";
                texto = "Tarjeta Amarilla";
            } else if (evt.type.includes("Red Card")) {
                tipoUI = "tarjeta-roja";
                texto = "Tarjeta Roja";
            } else if (evt.type.includes("Substitution")) {
                tipoUI = "cambio";
                texto = "Sustitución";
            }
            
            return {
                min: parseInt(evt.min.replace(/\D/g, '')) || 0,
                minLabel: evt.min,
                team: evt.team,
                type: tipoUI,
                text: texto,
                detail: evt.detail || "Jugador"
            };
        });
        todasIncidencias.sort((a, b) => a.min - b.min);
    }
    
    let stats = {
        posesionHome: 50,
        posesionAway: 50,
        rematesHome: 0,
        rematesAway: 0,
        rematesArcoHome: 0,
        rematesArcoAway: 0,
        faltasHome: 0,
        faltasAway: 0,
        esquinasHome: 0,
        esquinasAway: 0
    };
    
    if (p.isStarted) {
        const seed = p.id.charCodeAt(p.id.length - 1) || 45;
        const factorGol = (p.s1 || 0) - (p.s2 || 0);
        
        stats.posesionHome = Math.min(Math.max(50 + (factorGol * 4) + (seed % 10 - 5), 30), 70);
        stats.posesionAway = 100 - stats.posesionHome;
        
        stats.rematesHome = Math.max((p.s1 || 0) * 3 + (seed % 6) + 3, 2);
        stats.rematesAway = Math.max((p.s2 || 0) * 3 + (seed % 4) + 2, 1);
        
        stats.rematesArcoHome = Math.max((p.s1 || 0) + Math.floor(stats.rematesHome / 3), (p.s1 || 0));
        stats.rematesArcoAway = Math.max((p.s2 || 0) + Math.floor(stats.rematesAway / 3), (p.s2 || 0));
        
        stats.faltasHome = 8 + (seed % 8);
        stats.faltasAway = 9 + (seed % 7);
        
        stats.esquinasHome = Math.max(stats.rematesHome - 4, 1);
        stats.esquinasAway = Math.max(stats.rematesAway - 3, 1);
    }
    
    let html = `
        <div class="modal-header-match">
            <span class="modal-match-stage">${p.type === "group" ? `Grupo ${p.group} • Jornada ${p.matchday}` : "Eliminación Directa"}</span>
            <div class="modal-match-teams-row">
                <div class="modal-match-team">
                    ${banderaHome ? `<img src="${banderaHome}" class="modal-team-flag" alt="${p.fifaHome}" onerror="this.style.display='none';">` : ""}
                    <span class="modal-team-name">${p.nombreHome}</span>
                </div>
                
                <div class="modal-score-center">
                    ${tieneGoles ? `
                        <div class="modal-score-num">
                            <span>${p.s1}</span>
                            <span class="modal-score-divider">-</span>
                            <span>${p.s2}</span>
                        </div>
                    ` : `
                        <div class="modal-match-time-large">
                            <i class="fa-regular fa-clock"></i> ${p.horaArg} hs
                        </div>
                    `}
                    <span class="modal-match-status-badge ${statusClass}">
                        ${statusText}
                    </span>
                </div>
                
                <div class="modal-match-team">
                    ${banderaAway ? `<img src="${banderaAway}" class="modal-team-flag" alt="${p.fifaAway}" onerror="this.style.display='none';">` : ""}
                    <span class="modal-team-name">${p.nombreAway}</span>
                </div>
            </div>
            <div style="font-size:0.7rem; color:var(--text-muted); margin-top:10px;">
                Fecha: ${p.fechaArg} (Hora Argentina)
            </div>
        </div>
        
        <div class="modal-tabs">
            <button class="modal-tab-btn active" onclick="switchModalTab(this, 'modal-tab-incidencias')">Incidencias</button>
            <button class="modal-tab-btn" onclick="switchModalTab(this, 'modal-tab-alineaciones')">Alineación</button>
            <button class="modal-tab-btn" onclick="switchModalTab(this, 'modal-tab-estadisticas')">Estadísticas</button>
        </div>
        
        <div class="modal-tab-content active" id="modal-tab-incidencias">
            <div class="timeline-container">
    `;
    
    // Almacenamiento global para los atletas clickeables del timeline
    window._timelineAthletes = window._timelineAthletes || {};
    
    if (todasIncidencias.length === 0) {
        html += `
            <div class="timeline-empty">
                <i class="fa-regular fa-clock"></i>
                <p>El partido aún no ha comenzado. Las incidencias aparecerán en tiempo real cuando empiece el juego.</p>
            </div>
        `;
    } else {
        todasIncidencias.forEach(evt => {
            let badgeClass = "badge-goal";
            let icon = '<i class="fa-solid fa-soccer-ball"></i>';
            if (evt.type === "tarjeta-amarilla") {
                badgeClass = "badge-card-yellow";
                icon = '<i class="fa-solid fa-square"></i>';
            } else if (evt.type === "tarjeta-roja") {
                badgeClass = "badge-card-red";
                icon = '<i class="fa-solid fa-square"></i>';
            } else if (evt.type === "cambio") {
                badgeClass = "badge-sub";
                icon = '<i class="fa-solid fa-arrows-rotate"></i>';
            }
            
            let athleteClickHtml = ``;
            if (evt.athlete) {
                const uniqueId = `athlete_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
                window._timelineAthletes[uniqueId] = {
                    athlete: evt.athlete,
                    fifaCode: evt.team === "home" ? p.fifaHome : p.fifaAway
                };
                athleteClickHtml = `onclick="if(window.abrirPlayerCard) window.abrirPlayerCard(window._timelineAthletes['${uniqueId}'].athlete, window._timelineAthletes['${uniqueId}'].fifaCode, '#333')" style="cursor: pointer; color: var(--color-primary); text-decoration: underline;"`;
            }
            
            html += `
                <div class="timeline-item">
                    <div class="timeline-badge ${badgeClass}">${icon}</div>
                    <div class="timeline-info">
                        <span class="timeline-time">${evt.minLabel}</span>
                        <div class="timeline-text">${evt.text}</div>
                        <span class="timeline-detail" ${athleteClickHtml}>${evt.detail}</span>
                    </div>
                </div>
            `;
        });
    }
    
    html += `
            </div>
        </div>
        
        <div class="modal-tab-content" id="modal-tab-alineaciones">
            <div class="lineups-wrapper">
                <div class="soccer-field">
                    <div class="field-center-circle"></div>
                    <div class="field-area-left"></div>
                    <div class="field-area-right"></div>
    `;
    
    let dIdx = 0, mIdx = 0, fIdx = 0;
    alineacionHome.titulares.forEach(p => {
        let idx = 0;
        if (p.pos === "df") { idx = dIdx; dIdx++; }
        else if (p.pos === "mf") { idx = mIdx; mIdx++; }
        else if (p.pos === "fw") { idx = fIdx; fIdx++; }
        
        const coords = obtenerCoordenadasJugador(p.pos, idx, "home", alineacionHome.formacion);
        let shirtClass = "shirt-home";
        if (p.pos === "gk") shirtClass = "shirt-gk";
        
        html += `
            <div class="player-node" style="left: ${coords.x}%; top: ${coords.y}%;" title="${p.name}">
                <div class="player-shirt ${shirtClass}">${p.n}</div>
                <div class="player-name">${p.name}</div>
            </div>
        `;
    });
    
    dIdx = 0; mIdx = 0; fIdx = 0;
    alineacionAway.titulares.forEach(p => {
        let idx = 0;
        if (p.pos === "df") { idx = dIdx; dIdx++; }
        else if (p.pos === "mf") { idx = mIdx; mIdx++; }
        else if (p.pos === "fw") { idx = fIdx; fIdx++; }
        
        const coords = obtenerCoordenadasJugador(p.pos, idx, "away", alineacionAway.formacion);
        let shirtClass = "shirt-away";
        if (p.pos === "gk") shirtClass = "shirt-gk";
        
        html += `
            <div class="player-node" style="left: ${coords.x}%; top: ${coords.y}%;" title="${p.name}">
                <div class="player-shirt ${shirtClass}">${p.n}</div>
                <div class="player-name">${p.name}</div>
            </div>
        `;
    });
    
    html += `
                </div>
                
                <div class="lineups-lists-container">
                    <div class="lineups-list-box">
                        <div class="lineups-list-title">Suplentes ${p.nombreHome}</div>
                        <div class="lineups-manager"><span>DT:</span> ${alineacionHome.dt}</div>
                        <div class="lineups-subs-list">
                            ${alineacionHome.suplentes.join(", ")}
                        </div>
                    </div>
                    
                    <div class="lineups-list-box">
                        <div class="lineups-list-title">Suplentes ${p.nombreAway}</div>
                        <div class="lineups-manager"><span>DT:</span> ${alineacionAway.dt}</div>
                        <div class="lineups-subs-list">
                            ${alineacionAway.suplentes.join(", ")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="modal-tab-content" id="modal-tab-estadisticas">
    `;
    
    if (!p.isStarted) {
        html += `
            <div class="timeline-empty">
                <i class="fa-solid fa-chart-bar"></i>
                <p>Las estadísticas se calcularán y mostrarán en vivo durante el desarrollo del partido.</p>
            </div>
        `;
    } else {
        const remTotales = stats.rematesHome + stats.rematesAway;
        const wRemHome = remTotales > 0 ? (stats.rematesHome / remTotales * 100) : 50;
        const wRemAway = 100 - wRemHome;
        
        const remArco = stats.rematesArcoHome + stats.rematesArcoAway;
        const wArcoHome = remArco > 0 ? (stats.rematesArcoHome / remArco * 100) : 50;
        const wArcoAway = 100 - wArcoHome;
        
        const faltas = stats.faltasHome + stats.faltasAway;
        const wFaltasHome = faltas > 0 ? (stats.faltasHome / faltas * 100) : 50;
        const wFaltasAway = 100 - wFaltasHome;
        
        const esquinas = stats.esquinasHome + stats.esquinasAway;
        const wEsquinasHome = esquinas > 0 ? (stats.esquinasHome / esquinas * 100) : 50;
        const wEsquinasAway = 100 - wEsquinasHome;
        
        html += `
            <div class="stats-container">
                <div class="stat-row">
                    <div class="stat-labels">
                        <span>${stats.posesionHome}%</span>
                        <span class="stat-name">Posesión de Balón</span>
                        <span>${stats.posesionAway}%</span>
                    </div>
                    <div class="stat-bars">
                        <div class="stat-bar-home" style="width: ${stats.posesionHome}%;"></div>
                        <div class="stat-bar-away" style="width: ${stats.posesionAway}%;"></div>
                    </div>
                </div>
                
                <div class="stat-row">
                    <div class="stat-labels">
                        <span>${stats.rematesHome}</span>
                        <span class="stat-name">Remates Totales</span>
                        <span>${stats.rematesAway}</span>
                    </div>
                    <div class="stat-bars">
                        <div class="stat-bar-home" style="width: ${wRemHome}%;"></div>
                        <div class="stat-bar-away" style="width: ${wRemAway}%;"></div>
                    </div>
                </div>
                
                <div class="stat-row">
                    <div class="stat-labels">
                        <span>${stats.rematesArcoHome}</span>
                        <span class="stat-name">Tiros al Arco</span>
                        <span>${stats.rematesArcoAway}</span>
                    </div>
                    <div class="stat-bars">
                        <div class="stat-bar-home" style="width: ${wArcoHome}%;"></div>
                        <div class="stat-bar-away" style="width: ${wArcoAway}%;"></div>
                    </div>
                </div>
                
                <div class="stat-row">
                    <div class="stat-labels">
                        <span>${stats.esquinasHome}</span>
                        <span class="stat-name">Tiros de Esquina</span>
                        <span>${stats.esquinasAway}</span>
                    </div>
                    <div class="stat-bars">
                        <div class="stat-bar-home" style="width: ${wEsquinasHome}%;"></div>
                        <div class="stat-bar-away" style="width: ${wEsquinasAway}%;"></div>
                    </div>
                </div>
                
                <div class="stat-row">
                    <div class="stat-labels">
                        <span>${stats.faltasHome}</span>
                        <span class="stat-name">Faltas Cometidas</span>
                        <span>${stats.faltasAway}</span>
                    </div>
                    <div class="stat-bars">
                        <div class="stat-bar-home" style="width: ${wFaltasHome}%;"></div>
                        <div class="stat-bar-away" style="width: ${wFaltasAway}%;"></div>
                    </div>
                </div>
            </div>
        `;
    }
    
    html += `
        </div>
    `;
    
    container.innerHTML = html;
}

/**
 * Registra los event listeners para cerrar el modal de detalles
 */
export function inicializarEventosModal() {
    const btnCerrar = document.getElementById("modal-close-btn");
    const backdrop = document.getElementById("modal-backdrop");
    
    if (btnCerrar) btnCerrar.addEventListener("click", cerrarDetallesPartido);
    if (backdrop) backdrop.addEventListener("click", cerrarDetallesPartido);
    
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") cerrarDetallesPartido();
    });
}
