// Sincronización en tiempo real y consumo de API

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

const URL_TEAMS = "https://worldcup26.ir/get/teams";
const URL_GAMES = "https://worldcup26.ir/get/games";

/**
 * Carga los marcadores (primero datos locales estáticos de respaldo, luego realiza fetch a la API)
 */
export function cargarResultados() {
    // Inicializar marcadores con datos estáticos locales de respaldo si no se han cargado antes
    Object.keys(RESULTADOS_REALES).forEach(letra => {
        RESULTADOS_REALES[letra].forEach(res => {
            partidosGoles[`${letra}-${res.idx}-1`] = res.s1;
            partidosGoles[`${letra}-${res.idx}-2`] = res.s2;
        });
    });

    // Función de fallback local si la API falla
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

    // Intentar descargar de la API con fallback encadenado a proxies CORS y timeouts adaptativos
    const fetchConProxy = (url, proxyIdx = 0) => {
        const rutaProxyLocal = url.includes("games") ? "/api-proxy/games" : "/api-proxy/teams";
        
        const proxies = [
            rutaProxyLocal, // 1. Proxy local / Vercel rewrite (sin CORS, rápido y de confianza)
            url,            // 2. Intento directo original
            `https://corsproxy.io/?${encodeURIComponent(url)}`,
            `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
        ];
        
        if (proxyIdx >= proxies.length) {
            return Promise.reject(new Error("Todos los intentos (directo y proxies CORS) fallaron."));
        }
        
        // Timeout de 15 segundos para el proxy local/Vercel (por lentitud del servidor remoto), 5 segundos para proxies públicos
        const timeouts = [15000, 5000, 5000, 5000];
        const timeoutMs = timeouts[proxyIdx] || 5000;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        
        return fetch(proxies[proxyIdx], { signal: controller.signal })
            .then(res => {
                clearTimeout(timeoutId);
                if (!res.ok) throw new Error(`Status ${res.status}`);
                
                // AllOrigins devuelve la respuesta en una propiedad "contents" como string JSON si se consulta directo
                if (proxies[proxyIdx].includes("allorigins")) {
                    return res.json().then(json => {
                        if (json && json.contents) {
                            return JSON.parse(json.contents);
                        }
                        return json;
                    });
                }
                return res.json();
            })
            .catch(err => {
                clearTimeout(timeoutId);
                const isTimeout = err.name === 'AbortError';
                const msg = isTimeout ? 'Timeout superado' : err.message;
                console.warn(`Intento ${proxyIdx + 1} fallido para ${url} (${msg}). Probando alternativa...`);
                return fetchConProxy(url, proxyIdx + 1);
            });
    };

    // Intentar cargar datos cacheados de la API en localStorage para mostrar resultados en vivo de visitas previas al instante
    const juegosCache = localStorage.getItem('cached_worldcup_games');
    if (juegosCache) {
        try {
            console.log("Cargando marcadores en vivo cacheados de localStorage...");
            const games = JSON.parse(juegosCache);
            limpiarListaPartidosCompleta();
            games.forEach(match => {
                procesarPartidoAPI(match);
            });
            actualizarInterfaz();
        } catch (e) {
            console.warn("Error leyendo caché de localStorage, usando respaldo estático:", e.message);
            poblarListaPartidosLocal();
            actualizarInterfaz();
        }
    } else {
        // Fallback local estático inicial
        poblarListaPartidosLocal();
        actualizarInterfaz();
    }

    // Consultar la API de partidos en segundo plano (con timeouts adaptativos de hasta 15 segundos)
    fetchConProxy(URL_GAMES)
        .then(data => {
            console.log("Carga de API exitosa:", data);
            if (data && data.games) {
                // Guardar los datos frescos en la caché de localStorage
                localStorage.setItem('cached_worldcup_games', JSON.stringify(data.games));
                
                limpiarListaPartidosCompleta();
                data.games.forEach(match => {
                    procesarPartidoAPI(match);
                });
                actualizarInterfaz();
            }
        })
        .catch(err => {
            console.warn("API de partidos no disponible en vivo (se muestran datos cacheados o estáticos):", err.message);
        });
}

/**
 * Procesa un partido devuelto por la API y lo formatea/guarda en el estado global
 */
function procesarPartidoAPI(match) {
    const id = match.id.toString();
    const type = match.type;
    
    const idHome = match.home_team_id ? match.home_team_id.toString() : "0";
    const idAway = match.away_team_id ? match.away_team_id.toString() : "0";
    
    const fifaHome = (idHome !== "0" && mapaEquiposIdACodigo[idHome]) ? mapaEquiposIdACodigo[idHome] : "";
    const fifaAway = (idAway !== "0" && mapaEquiposIdACodigo[idAway]) ? mapaEquiposIdACodigo[idAway] : "";
    
    const timeElap = match.time_elapsed ? match.time_elapsed.toLowerCase().replace("_", "").trim() : "";
    const isStarted = match.finished === "TRUE" || (timeElap && timeElap !== "notstarted" && timeElap !== "finished" && timeElap !== "not_started" && timeElap !== "null");
    
    const g1 = (isStarted && match.home_score !== null && match.home_score !== undefined && match.home_score !== "") ? parseInt(match.home_score) : null;
    const g2 = (isStarted && match.away_score !== null && match.away_score !== undefined && match.away_score !== "") ? parseInt(match.away_score) : null;
    
    const argentinaInfo = obtenerFechaHoraArgentina(match.local_date, match.stadium_id);
    
    if (type === "group") {
        if (fifaHome && fifaAway) {
            Object.keys(PARTIDOS).forEach(letra => {
                PARTIDOS[letra].forEach((p, idx) => {
                    if (p.l1 === fifaHome && p.l2 === fifaAway) {
                        if (g1 !== null && g2 !== null) {
                            partidosGoles[`${letra}-${idx}-1`] = g1;
                            partidosGoles[`${letra}-${idx}-2`] = g2;
                        }
                    }
                });
            });
        }
    } else {
        partidosPlayoffsEquipos[id] = { t1: fifaHome, t2: fifaAway };
        if (g1 !== null && g2 !== null && match.finished === "TRUE") {
            partidosPlayoffsGoles[id] = { s1: g1, s2: g2 };
        }
    }
    
    listaPartidosCompleta.push({
        id: id,
        type: type,
        group: match.group,
        matchday: match.matchday,
        finished: match.finished,
        time_elapsed: match.time_elapsed,
        isStarted: isStarted,
        fifaHome: fifaHome,
        fifaAway: fifaAway,
        nombreHome: fifaHome ? PAISES[fifaHome].nombre : (match.home_team_name_en || "Pendiente"),
        nombreAway: fifaAway ? PAISES[fifaAway].nombre : (match.away_team_name_en || "Pendiente"),
        fechaArg: argentinaInfo.fecha,
        horaArg: argentinaInfo.hora,
        s1: g1,
        s2: g2
    });
}

/**
 * Convierte la fecha y hora del estadio de la API a horario de Argentina
 */
function obtenerFechaHoraArgentina(localDateStr, stadiumId) {
    if (!localDateStr) return { fecha: "--/--", hora: "--:--" };
    try {
        const parts = localDateStr.split(" ");
        const dateParts = parts[0].split("/");
        const timeParts = parts[1].split(":");
        
        const mes = parseInt(dateParts[0]) - 1;
        const dia = parseInt(dateParts[1]);
        const anio = parseInt(dateParts[2]);
        const hora = parseInt(timeParts[0]);
        const min = parseInt(timeParts[1]);
        
        const fechaEstadio = new Date(anio, mes, dia, hora, min);
        const diffHoras = DIFERENCIA_HORAS_ESTADIO[stadiumId] || 1;
        const fechaArg = new Date(fechaEstadio.getTime() + (diffHoras * 3600000));
        
        const diaStr = String(fechaArg.getDate()).padStart(2, '0');
        const mesStr = String(fechaArg.getMonth() + 1).padStart(2, '0');
        const horaStr = String(fechaArg.getHours()).padStart(2, '0');
        const minStr = String(fechaArg.getMinutes()).padStart(2, '0');
        
        return {
            fecha: `${diaStr}/${mesStr}`,
            hora: `${horaStr}:${minStr}`
        };
    } catch (e) {
        console.warn("Error formateando fecha de API:", localDateStr, e.message);
        return { fecha: "--/--", hora: "--:--" };
    }
}
