// Sincronización en tiempo real y consumo de API

// 🔖 Versión de la app - cambiar este valor en cada deploy para forzar
//    la invalidación del caché de ESPN en todos los clientes.
const APP_VERSION = "2026-06-18-v3";
const APP_VERSION_KEY = "app_version";
const ESPN_CACHE_KEY = "cached_espn_games";

/**
 * Compara la versión almacenada con la actual.
 * Si son distintas, limpia el caché de ESPN y actualiza la versión guardada.
 */
function invalidarCacheSiNuevaVersion() {
    const versionGuardada = localStorage.getItem(APP_VERSION_KEY);
    if (versionGuardada !== APP_VERSION) {
        console.log(`🔄 Nueva versión detectada (${versionGuardada} → ${APP_VERSION}). Limpiando caché ESPN...`);
        localStorage.removeItem(ESPN_CACHE_KEY);
        localStorage.setItem(APP_VERSION_KEY, APP_VERSION);
    }
}

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
        
        if (diffMinutes >= 0 && diffMinutes <= 150) {
            // El partido est en curso (entre el inicio y 2.5 horas despus)
            p.isStarted = true;
            p.s1 = null;
            p.s2 = null;
            p.finished = "FALSE";
            p.time_elapsed = "Actualizando..."; // Mensaje de "Actualizando..."
        } else if (diffMinutes > 150) {
            // El partido ya termin hace tiempo, pero no tenemos datos de ESPN
            p.isStarted = true;
            p.s1 = null;
            p.s2 = null;
            p.finished = "TRUE";
            p.time_elapsed = "Finalizado";
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

    // Invalidar caché si la versión de la app cambió
    invalidarCacheSiNuevaVersion();

    // Intentar cargar caché inicial
    const juegosCache = localStorage.getItem(ESPN_CACHE_KEY);
    if (juegosCache) {
        try {
            console.log("Cargando marcadores cacheados...");
            const events = JSON.parse(juegosCache);
            poblarListaPartidosLocal(); // Llenar primero la lista base
            procesarPartidosESPNList(events); // Actualizar con datos de ESPN y playoffs
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
                localStorage.setItem(ESPN_CACHE_KEY, JSON.stringify(data.events));
                // Volvemos a poblar la lista base para no duplicar y luego pisamos con los datos en vivo
                poblarListaPartidosLocal();
                procesarPartidosESPNList(data.events);
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

function procesarPartidosESPNList(events) {
    let playoffEvents = [];

    events.forEach(ev => {
        if (!ev.competitions || ev.competitions.length === 0) return;
        const comp = ev.competitions[0];
        if (!comp.competitors || comp.competitors.length < 2) return;

        const homeTeamData = comp.competitors.find(c => c.homeAway === 'home');
        const awayTeamData = comp.competitors.find(c => c.homeAway === 'away');
        if (!homeTeamData || !awayTeamData) return;

        const espnHome = homeTeamData.team.abbreviation;
        const espnAway = awayTeamData.team.abbreviation;

        const fifaHome = ESPN_A_FIFA[espnHome] || espnHome;
        const fifaAway = ESPN_A_FIFA[espnAway] || espnAway;

        const state = ev.status.type.state; 
        const isStarted = state === "in" || state === "post";
        const isFinished = state === "post";
        
        const g1 = isStarted ? parseInt(homeTeamData.score) : null;
        const g2 = isStarted ? parseInt(awayTeamData.score) : null;
        let time_elapsed = state === "pre" ? "notstarted" : (state === "post" ? "finished" : ev.status.displayClock);

        let realFechaArg = null;
        let realHoraArg = null;
        if (ev.date) {
            const d = new Date(ev.date);
            const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
            const argDate = new Date(utc - (3 * 3600000));
            
            const day = argDate.getDate().toString().padStart(2, '0');
            const month = (argDate.getMonth() + 1).toString().padStart(2, '0');
            realFechaArg = `${day}/${month}`;
            
            const hours = argDate.getHours().toString().padStart(2, '0');
            const mins = argDate.getMinutes().toString().padStart(2, '0');
            realHoraArg = `${hours}:${mins}`;
        }

        let encontradoGrupos = false;
        Object.keys(PARTIDOS).forEach(letra => {
            PARTIDOS[letra].forEach((p, idx) => {
                if ((p.l1 === fifaHome && p.l2 === fifaAway) || (p.l1 === fifaAway && p.l2 === fifaHome)) {
                    encontradoGrupos = true;
                    // ... (logica de grupos intacta)
                    if (g1 !== null && g2 !== null) {
                        let goalL1 = (p.l1 === fifaHome) ? g1 : g2;
                        let goalL2 = (p.l2 === fifaAway) ? g2 : g1;
                        partidosGoles[`${letra}-${idx}-1`] = goalL1;
                        partidosGoles[`${letra}-${idx}-2`] = goalL2;
                    }
                    
                    const idLocal = `local-${letra}-${idx}`;
                    const partidoGuardado = listaPartidosCompleta.find(item => item.id === idLocal);
                    if (partidoGuardado) {
                        partidoGuardado.isStarted = isStarted;
                        partidoGuardado.finished = isFinished ? "TRUE" : "FALSE";
                        partidoGuardado.time_elapsed = time_elapsed;
                        if (g1 !== null) {
                            partidoGuardado.s1 = (p.l1 === fifaHome) ? g1 : g2;
                            partidoGuardado.s2 = (p.l2 === fifaAway) ? g2 : g1;
                        }
                        if (realHoraArg) partidoGuardado.horaArg = realHoraArg;
                        if (realFechaArg) partidoGuardado.fechaArg = realFechaArg;
                    }
                }
            });
        });

        if (!encontradoGrupos) {
            playoffEvents.push({ ev, fifaHome, fifaAway, g1, g2, isStarted, isFinished, time_elapsed, realFechaArg, realHoraArg, homeTeamData, awayTeamData, comp });
        }
    });

    // Algoritmo de Ensamblaje de Bracket Dinámico (Hardcodeado a la ESTRUCTURA EXACTA FIFA 2026 para asegurar flujo visual)
    playoffEvents.sort((a, b) => new Date(a.ev.date) - new Date(b.ev.date));
    
    // Mapeo Maestro Estructural FIFA 2026 (Indices cronológicos de la fase de 32 a sus respectivos nodos visuales)
    // Sabemos exactamente qué partido de 1/16 juega contra cuál.
    const r32Matches = playoffEvents.slice(0, 16);
    
    // MAPA FIFA: El partido 1 cronológico de R32 (Match 73) juega contra el partido 3 (Match 75).
    // El partido 2 (Match 74) juega contra el partido 5 (Match 77)...
    // Asignamos directamente los nodos DOM a los índices cronológicos de los 32vos:
    const R32_INDEX_TO_DOM = {
        0: "d16-i-3",  2: "d16-i-4",   // W73 y W75 -> o8-i-2
        1: "d16-i-1",  4: "d16-i-2",   // W74 y W77 -> o8-i-1
        3: "d16-d-9",  5: "d16-d-10",  // W76 y W78 -> o8-d-5
        6: "d16-i-5",  7: "d16-i-6",   // W79 y W80 -> o8-i-3
        8: "d16-d-11", 10: "d16-d-12", // W81 y W83 -> o8-d-6
        9: "d16-i-7",  12: "d16-i-8",  // W82 y W85 -> o8-i-4
        11: "d16-d-13", 14: "d16-d-14",// W84 y W87 -> o8-d-7
        13: "d16-d-15", 15: "d16-d-16" // W86 y W88 -> o8-d-8
    };

    // Y definimos qué nodo de R16 corresponde a cada par de DOM de R32
    const R16_PAIRS_TO_DOM = {
        "d16-i-1_d16-i-2": "o8-i-1",
        "d16-i-3_d16-i-4": "o8-i-2",
        "d16-i-5_d16-i-6": "o8-i-3",
        "d16-i-7_d16-i-8": "o8-i-4",
        "d16-d-9_d16-d-10": "o8-d-5",
        "d16-d-11_d16-d-12": "o8-d-6",
        "d16-d-13_d16-d-14": "o8-d-7",
        "d16-d-15_d16-d-16": "o8-d-8"
    };

    // QF
    const QF_PAIRS_TO_DOM = {
        "o8-i-1_o8-i-2": "c4-i-1",
        "o8-i-3_o8-i-4": "c4-i-2",
        "o8-d-5_o8-d-6": "c4-d-3",
        "o8-d-7_o8-d-8": "c4-d-4"
    };

    // SF
    const SF_PAIRS_TO_DOM = {
        "c4-i-1_c4-i-2": "semi-i-1",
        "c4-d-3_c4-d-4": "semi-d-2"
    };

    const finalMatchDOM = "final";
    const bronzeMatchDOM = "bronze";

    // Función auxiliar para saber a qué DOM Node pertenece un partido, analizando quiénes juegan
    function findDOMNodeForMatch(pData, matchIndex) {
        if (matchIndex < 16) {
            return R32_INDEX_TO_DOM[matchIndex];
        }
        
        // Si es un partido futuro, buscamos a qué nodo pertenece basándonos en los equipos o placeholders
        const hName = pData.homeTeamData.team.displayName || "";
        const aName = pData.awayTeamData.team.displayName || "";
        const hAbbr = pData.homeTeamData.team.abbreviation || "";
        const aAbbr = pData.awayTeamData.team.abbreviation || "";

        // Buscamos los índices de R32 de los que provienen estos equipos
        function getSourceIndex(name, abbr) {
            let m = name.match(/Round of 32 (\d+)/);
            if (m) return parseInt(m[1]) - 1;
            
            // Buscar por equipo real en r32Matches
            for (let i = 0; i < r32Matches.length; i++) {
                const r32 = r32Matches[i];
                if (r32.homeTeamData.team.abbreviation === abbr || r32.awayTeamData.team.abbreviation === abbr || 
                    r32.homeTeamData.team.displayName === name || r32.awayTeamData.team.displayName === name) {
                    return i;
                }
            }
            return -1;
        }

        const hSrcIdx = getSourceIndex(hName, hAbbr);
        const aSrcIdx = getSourceIndex(aName, aAbbr);

        // Si logramos rastrear ambos orígenes a la Ronda de 32:
        if (hSrcIdx !== -1 && aSrcIdx !== -1) {
            const dom1 = R32_INDEX_TO_DOM[hSrcIdx];
            const dom2 = R32_INDEX_TO_DOM[aSrcIdx];
            
            // Ver si forman un par de R16
            let pair = `${dom1}_${dom2}`;
            let revPair = `${dom2}_${dom1}`;
            if (R16_PAIRS_TO_DOM[pair]) return R16_PAIRS_TO_DOM[pair];
            if (R16_PAIRS_TO_DOM[revPair]) return R16_PAIRS_TO_DOM[revPair];
            
            // Si no son de R16, buscamos recursivamente de qué QF vienen...
            // Es más fácil identificar la ronda por la cantidad de equipos o fechas, 
            // pero si rastreamos los R32 base, sabemos de qué cuadrante vienen!
            
            // Cuadrante 1: d16-i-1 a d16-i-4 -> o8-i-1 y o8-i-2 -> c4-i-1
            const isQFi1 = ["d16-i-1", "d16-i-2", "d16-i-3", "d16-i-4"].includes(dom1) && ["d16-i-1", "d16-i-2", "d16-i-3", "d16-i-4"].includes(dom2);
            if (isQFi1) return "c4-i-1";
            
            const isQFi2 = ["d16-i-5", "d16-i-6", "d16-i-7", "d16-i-8"].includes(dom1) && ["d16-i-5", "d16-i-6", "d16-i-7", "d16-i-8"].includes(dom2);
            if (isQFi2) return "c4-i-2";
            
            const isQFd3 = ["d16-d-9", "d16-d-10", "d16-d-11", "d16-d-12"].includes(dom1) && ["d16-d-9", "d16-d-10", "d16-d-11", "d16-d-12"].includes(dom2);
            if (isQFd3) return "c4-d-3";
            
            const isQFd4 = ["d16-d-13", "d16-d-14", "d16-d-15", "d16-d-16"].includes(dom1) && ["d16-d-13", "d16-d-14", "d16-d-15", "d16-d-16"].includes(dom2);
            if (isQFd4) return "c4-d-4";
            
            // Semifinales
            const isSFi1 = dom1.includes("i-") && dom2.includes("i-");
            if (isSFi1) return "semi-i-1";
            
            const isSFd2 = dom1.includes("d-") && dom2.includes("d-");
            if (isSFd2) return "semi-d-2";
            
            // Finales
            if ((dom1.includes("i-") && dom2.includes("d-")) || (dom1.includes("d-") && dom2.includes("i-"))) {
                // Chequear nombre para saber si es 3er puesto
                if (pData.ev.name && pData.ev.name.includes("3rd")) return "bronze";
                return "final";
            }
        }
        
        // Fallback cronológico si falla el rastreo (solo para QF en adelante por si ESPN falla)
        if (matchIndex >= 24 && matchIndex <= 27) return Object.values(QF_PAIRS_TO_DOM)[matchIndex - 24];
        if (matchIndex === 28) return "semi-i-1";
        if (matchIndex === 29) return "semi-d-2";
        if (matchIndex === 30) return "bronze";
        if (matchIndex === 31) return "final";

        return null;
    }

    playoffEvents.forEach((pData, i) => {
        const domNode = findDOMNodeForMatch(pData, i);
        if (!domNode) return;

        const { ev, fifaHome, fifaAway, g1, g2, isStarted, isFinished, time_elapsed, realFechaArg, realHoraArg, homeTeamData, awayTeamData } = pData;

        let pen1 = null;
        let pen2 = null;
        if (homeTeamData.shootoutScore !== undefined) pen1 = parseInt(homeTeamData.shootoutScore);
        if (awayTeamData.shootoutScore !== undefined) pen2 = parseInt(awayTeamData.shootoutScore);

        let winner = null;
        if (isFinished) {
            if (g1 > g2) winner = fifaHome;
            else if (g2 > g1) winner = fifaAway;
            else if (pen1 !== null && pen2 !== null) {
                if (pen1 > pen2) winner = fifaHome;
                else if (pen2 > pen1) winner = fifaAway;
            }
        }

        // GUARDAMOS DIRECTAMENTE EL DOM NODE!
        partidosPlayoffsEquipos[domNode] = { t1: fifaHome, t2: fifaAway };
        partidosPlayoffsGoles[domNode] = { 
            s1: g1 !== null ? g1 : null, 
            s2: g2 !== null ? g2 : null, 
            pen1: pen1, 
            pen2: pen2, 
            winner: winner,
            isLive: (ev.status.type.state === "in"),
            timeStr: time_elapsed,
            fechaArg: realFechaArg,
            horaArg: realHoraArg
        };

        const existePlayoff = listaPartidosCompleta.find(item => item.id === domNode);
        if (!existePlayoff) {
            const nuevoPartido = {
                id: domNode,
                type: "playoff",
                group: "",
                matchday: 4, 
                finished: isFinished ? "TRUE" : "FALSE",
                time_elapsed: time_elapsed,
                isStarted: isStarted,
                fifaHome: fifaHome,
                fifaAway: fifaAway,
                nombreHome: (fifaHome && PAISES[fifaHome]) ? PAISES[fifaHome].nombre : (homeTeamData.team.displayName || fifaHome),
                nombreAway: (fifaAway && PAISES[fifaAway]) ? PAISES[fifaAway].nombre : (awayTeamData.team.displayName || fifaAway),
                fechaArg: realFechaArg || "--/--",
                horaArg: realHoraArg || "--:--",
                s1: g1,
                s2: g2,
                pen1: pen1,
                pen2: pen2,
                winner: winner
            };
            
            if (pData.comp && pData.comp.details && pData.comp.details.length > 0) {
                nuevoPartido.incidenciasReales = pData.comp.details.map(d => {
                      let targetTeamId = null;
                      if (d.athletesInvolved && d.athletesInvolved.length > 0 && d.athletesInvolved[0].team) {
                          targetTeamId = d.athletesInvolved[0].team.id;
                      } else if (d.team) {
                          targetTeamId = d.team.id;
                      }
                      let teamStr = "home";
                      if (targetTeamId === awayTeamData.team.id) {
                          teamStr = "away";
                      }
                    let player = d.athletesInvolved && d.athletesInvolved.length > 0 ? (d.athletesInvolved[0].shortName || d.athletesInvolved[0].displayName) : "";
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
    });
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
