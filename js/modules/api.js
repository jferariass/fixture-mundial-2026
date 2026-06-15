// SincronizaciÃ³n en tiempo real y consumo de API

import { PARTIDOS, DIFERENCIA_HORAS_ESTADIO } from '../data/partidos.js';
import { PAISES, mapaEquiposIdACodigo } from '../data/paises.js';
import { RESULTADOS_REALES } from '../data/resultados.js';
import { 
    partidosGoles, 
    partidosPlayoffsEquipos, 
    partidosPlayoffsGoles, 
    listaPartidosCompleta, 
    limpiarListaPartidosCompleta 
} from './estado.js';
import { actualizarInterfaz } from './ui.js';
import { calcularPrediccion } from './calculations.js';

// SincronizaciÃ³n en tiempo real y consumo de API
// Modificado para NUNCA inventar goles falsos. Si no hay datos, mostrarÃ¡ "Actualizando..."

// FunciÃ³n para procesar partidos que pasaron su horario pero no tienen datos reales
function simularPartidosFicticios() {
    const d = new Date();
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const offsetArg = -3;
    const now = new Date(utc + (3600000 * offsetArg));
    
    listaPartidosCompleta.forEach(p => {
        // No sobrescribir si el partido ya tiene resultado real de la API
        if (p.isStarted && p.s1 !== null && p.s2 !== null) return;
        
        const [diaStr, mesStr] = p.fechaArg.split('/');
        if (!diaStr || !mesStr || diaStr === '--') return;
        
        const dia = parseInt(diaStr);
        const mes = parseInt(mesStr) - 1;
        const matchDate = new Date(now.getFullYear(), mes, dia);
        
        const [horaStr, minStr] = p.horaArg.split(':');
        if (!horaStr || !minStr || horaStr === '--') return;
        matchDate.setHours(parseInt(horaStr), parseInt(minStr), 0, 0);
        
        const diffMs = now.getTime() - matchDate.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        
        if (diffMinutes >= 0) {
            // El partido ya deberÃ­a haber empezado segÃºn el reloj
            // Pero NO TENEMOS DATOS REALES de la API.
            // Por exigencia del usuario, NO INVENTAMOS GOLES (ni 0-0 ni random).
            p.isStarted = true; // Se considera iniciado para UI, pero sin goles
            p.s1 = null;
            p.s2 = null;
            p.finished = "FALSE";
            p.time_elapsed = "Actualizando..."; // Mensaje de "Actualizando..."
        }
    });
}

// ESPN API no requiere API KEY, es sÃºper rÃ¡pida, confiable y soporta CORS
const URL_GAMES = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260719&limit=150";

// Mapa para corregir abreviaturas de ESPN si difieren de las nuestras
const ESPN_A_FIFA = {
    "ZAF": "RSA", // SudÃ¡frica
    "KOR": "KOR",
    "CZE": "CZE",
    "CAN": "CAN",
    "BIH": "BIH",
    "QAT": "QAT",
    "SUI": "SUI",
    "BRA": "BRA",
    "MAR": "MAR",
    "HAI": "HAI",
    "SCO": "SCO",
    "USA": "USA",
    "PAR": "PAR",
    "AUS": "AUS",
    "TUR": "TUR",
    "GER": "GER",
    "CUW": "CUW",
    "CIV": "CIV",
    "ECU": "ECU",
    "NED": "NED",
    "JPN": "JPN",
    "SWE": "SWE",
    "TUN": "TUN",
    "BEL": "BEL",
    "EGY": "EGY",
    "IRN": "IRN",
    "NZL": "NZL",
    "ESP": "ESP",
    "CPV": "CPV",
    "KSA": "KSA",
    "URU": "URU",
    "FRA": "FRA",
    "SEN": "SEN",
    "IRQ": "IRQ",
    "NOR": "NOR",
    "ARG": "ARG",
    "ALG": "ALG",
    "AUT": "AUT",
    "JOR": "JOR",
    "POR": "POR",
    "COD": "COD",
    "UZB": "UZB",
    "COL": "COL",
    "ENG": "ENG",
    "CRO": "CRO",
    "GHA": "GHA",
    "PAN": "PAN"
};

/**
 * Carga los marcadores (primero datos locales estÃ¡ticos de respaldo, luego realiza fetch a la API)
 */
export function cargarResultados() {
    // Inicializar marcadores con datos estÃ¡ticos locales de respaldo si no se han cargado antes
    Object.keys(RESULTADOS_REALES).forEach(letra => {
        RESULTADOS_REALES[letra].forEach(res => {
            partidosGoles[`${letra}-${res.idx}-1`] = res.s1;
            partidosGoles[`${letra}-${res.idx}-2`] = res.s2;
        });
    });

    // FunciÃ³n de fallback local
    const poblarListaPartidosLocal = () => {
        limpiarListaPartidosCompleta();
        Object.keys(PARTIDOS).forEach(letra => {
            PARTIDOS[letra].forEach((p, idx) => {
                const s1 = partidosGoles[`${letra}-${idx}-1`];
                const s2 = partidosGoles[`${letra}-${idx}-2`];
                const jugado = s1 !== undefined && s2 !== undefined;
                
                listaPartidosCompleta.push({
                    id: `local-${letra}-${idx}`,
                    type: "group",
                    group: letra,
                    matchday: Math.floor(idx / 2) + 1,
                    finished: jugado ? "TRUE" : "FALSE",
                    time_elapsed: jugado ? "finished" : "notstarted",
                    isStarted: jugado,
                    fifaHome: p.l1,
                    fifaAway: p.l2,
                    nombreHome: PAISES[p.l1].nombre,
                    nombreAway: PAISES[p.l2].nombre,
                    fechaArg: p.fecha,
                    horaArg: p.hora,
                    s1: jugado ? s1 : null,
                    s2: jugado ? s2 : null
                });
            });
        });
    };

    const ocultarLoader = () => {
        const loader = document.getElementById('global-loader');
        if (loader) loader.classList.add('hidden');
    };

    // Intentar cargar cachÃ© inicial
    const juegosCache = localStorage.getItem('cached_espn_games');
    if (juegosCache) {
        try {
            console.log("Cargando marcadores cacheados...");
            const events = JSON.parse(juegosCache);
            poblarListaPartidosLocal(); // Llenar primero la lista base
            events.forEach(ev => procesarPartidoESPN(ev)); // Actualizar con datos de ESPN
            simularPartidosFicticios(); // Simular ficticios en vivo
            actualizarInterfaz();
            ocultarLoader();
        } catch (e) {
            console.warn("Error leyendo cachÃ©, usando respaldo:", e.message);
            poblarListaPartidosLocal();
            simularPartidosFicticios();
            actualizarInterfaz();
        }
    } else {
        poblarListaPartidosLocal();
        simularPartidosFicticios();
        actualizarInterfaz();
    }

    // Consultar ESPN API directamente (tiene CORS habilitado)
    fetch(URL_GAMES)
        .then(res => {
            if (!res.ok) throw new Error("Error HTTP " + res.status);
            return res.json();
        })
        .then(data => {
            console.log("Carga de ESPN API exitosa:", data);
            if (data && data.events) {
                localStorage.setItem('cached_espn_games', JSON.stringify(data.events));
                // Volvemos a poblar la lista base para no duplicar y luego pisamos con los datos en vivo
                poblarListaPartidosLocal();
                data.events.forEach(ev => procesarPartidoESPN(ev));
                simularPartidosFicticios();
                actualizarInterfaz();
            }
        })
        .catch(err => {
            console.warn("API de ESPN no disponible:", err.message);
        })
        .finally(() => {
            ocultarLoader();
        });
}

/**
 * Procesa un partido devuelto por la API de ESPN y actualiza nuestra lista base
 */
function procesarPartidoESPN(ev) {
    if (!ev.competitions || ev.competitions.length === 0) return;
    
    const comp = ev.competitions[0];
    if (!comp.competitors || comp.competitors.length < 2) return;

    // Identificar local y visitante segÃºn la API de ESPN
    const homeTeamData = comp.competitors.find(c => c.homeAway === 'home');
    const awayTeamData = comp.competitors.find(c => c.homeAway === 'away');

    if (!homeTeamData || !awayTeamData) return;

    const espnHome = homeTeamData.team.abbreviation;
    const espnAway = awayTeamData.team.abbreviation;

    const fifaHome = ESPN_A_FIFA[espnHome] || espnHome;
    const fifaAway = ESPN_A_FIFA[espnAway] || espnAway;

    // Determinar si ya empezÃ³ o terminÃ³
    const state = ev.status.type.state; // "pre", "in", "post"
    const isStarted = state === "in" || state === "post";
    const isFinished = state === "post";
    
    const g1 = isStarted ? parseInt(homeTeamData.score) : null;
    const g2 = isStarted ? parseInt(awayTeamData.score) : null;

    let time_elapsed = state === "pre" ? "notstarted" : (state === "post" ? "finished" : ev.status.displayClock);

    // Buscar si existe en la fase de grupos local
    let encontradoGrupos = false;
    Object.keys(PARTIDOS).forEach(letra => {
        PARTIDOS[letra].forEach((p, idx) => {
            if (p.l1 === fifaHome && p.l2 === fifaAway) {
                encontradoGrupos = true;
                
                // Actualizar goles si el partido arrancÃ³
                if (g1 !== null && g2 !== null) {
                    partidosGoles[`${letra}-${idx}-1`] = g1;
                    partidosGoles[`${letra}-${idx}-2`] = g2;
                }
                
                // Actualizar el partido en la lista completa
                const idLocal = `local-${letra}-${idx}`;
                const partidoGuardado = listaPartidosCompleta.find(item => item.id === idLocal);
                if (partidoGuardado) {
                    partidoGuardado.isStarted = isStarted;
                    partidoGuardado.finished = isFinished ? "TRUE" : "FALSE";
                    partidoGuardado.time_elapsed = time_elapsed;
                    if (g1 !== null) partidoGuardado.s1 = g1;
                    if (g2 !== null) partidoGuardado.s2 = g2;
                    
                    // Extraer incidencias reales (goles, tarjetas, sustituciones)
                    if (comp.details && comp.details.length > 0) {
                        partidoGuardado.incidenciasReales = comp.details.map(d => {
                            let teamStr = "home";
                            if (d.team && d.team.id === awayTeamData.team.id) {
                                teamStr = "away";
                            }
                            
                            let player = "";
                            if (d.athletesInvolved && d.athletesInvolved.length > 0) {
                                player = d.athletesInvolved[0].shortName || d.athletesInvolved[0].displayName;
                            }
                            
                            return {
                                type: d.type ? d.type.text : "Unknown",
                                min: d.clock ? d.clock.displayValue.replace("'", "") : "0",
                                team: teamStr,
                                detail: player,
                                athlete: d.athletesInvolved && d.athletesInvolved.length > 0 ? d.athletesInvolved[0] : null
                            };
                        });
                    }
                }
            }
        });
    });

    // Si no es de grupos, asumimos que es de Playoffs
    if (!encontradoGrupos) {
        // Generamos un ID provisorio usando los equipos
        const playOffId = `playoff-${fifaHome}-${fifaAway}`;
        
        partidosPlayoffsEquipos[playOffId] = { t1: fifaHome, t2: fifaAway };
        if (g1 !== null && g2 !== null && isFinished) {
            partidosPlayoffsGoles[playOffId] = { s1: g1, s2: g2 };
        }
        
        // Agregar a la lista si no existe
        const existePlayoff = listaPartidosCompleta.find(item => item.id === playOffId);
        if (!existePlayoff) {
            const nuevoPartido = {
                id: playOffId,
                type: "playoff",
                group: "",
                matchday: 4, // provisorio
                finished: isFinished ? "TRUE" : "FALSE",
                time_elapsed: time_elapsed,
                isStarted: isStarted,
                fifaHome: fifaHome,
                fifaAway: fifaAway,
                nombreHome: (fifaHome && PAISES[fifaHome]) ? PAISES[fifaHome].nombre : (homeTeamData.team.displayName || fifaHome),
                nombreAway: (fifaAway && PAISES[fifaAway]) ? PAISES[fifaAway].nombre : (awayTeamData.team.displayName || fifaAway),
                fechaArg: "--/--", // No tenemos fecha local para playoffs aÃºn en este demo
                horaArg: "--:--",
                s1: g1,
                s2: g2
            };
            
            // Extraer incidencias reales (goles, tarjetas, sustituciones)
            if (comp.details && comp.details.length > 0) {
                nuevoPartido.incidenciasReales = comp.details.map(d => {
                    let teamStr = "home";
                    if (d.team && d.team.id === awayTeamData.team.id) {
                        teamStr = "away";
                    }
                    
                    let player = "";
                    if (d.athletesInvolved && d.athletesInvolved.length > 0) {
                        player = d.athletesInvolved[0].shortName || d.athletesInvolved[0].displayName;
                    }
                    
                    return {
                        type: d.type ? d.type.text : "Unknown",
                        min: d.clock ? d.clock.displayValue.replace("'", "") : "0",
                        team: teamStr,
                        detail: player,
                        athlete: d.athletesInvolved && d.athletesInvolved.length > 0 ? d.athletesInvolved[0] : null
                    };
                });
            }
            
            listaPartidosCompleta.push(nuevoPartido);
        }
    }
}

/**
 * Obtiene el plantel completo y el estado actual de un equipo especifico
 * @param {string} teamId El ID del equipo en ESPN
 */
export async function fetchTeamRoster(teamId) {
    try {
        const url = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams/" + teamId + "/roster";
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error fetching team roster");
        const data = await response.json();
        
        // Tambien traemos el resumen del equipo para el record
        const teamUrl = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams/" + teamId;
        const teamResponse = await fetch(teamUrl);
        const teamData = teamResponse.ok ? await teamResponse.json() : null;

        return {
            roster: data.athletes || [],
            team: teamData ? teamData.team : null
        };
    } catch (error) {
        console.error("Error al obtener el plantel:", error);
        return { roster: [], team: null };
    }
}
