// Estado global mutable de la aplicación

export let tablasEstado = {};
export let partidosGoles = {}; // Almacenará los goles de fase de grupos
export let partidosPlayoffsGoles = {}; // Marcadores de playoffs {partidoId: {s1, s2}}
export let partidosPlayoffsEquipos = {}; // Equipos clasificados de playoffs {partidoId: {t1, t2}}
export let listaPartidosCompleta = []; // Todos los partidos formateados para "Partidos de Hoy"

// Funciones para mutar o resetear el estado si es necesario
export function setListaPartidosCompleta(nuevaLista) {
    listaPartidosCompleta.length = 0;
    listaPartidosCompleta.push(...nuevaLista);
}

export function limpiarListaPartidosCompleta() {
    listaPartidosCompleta.length = 0;
}
