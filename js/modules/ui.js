// Módulo Barrel (Unificador y Orquestador de la Interfaz Gráfica)

import { calcularGrupo } from './calculations.js';
import { GRUPOS } from '../data/paises.js';
import { actualizarPlayoffsAutomatico } from './ui-bracket.js';
import { actualizarPartidosDeHoy } from './ui-matches-today.js';
import { renderizarPodio } from './ui-podium.js';

// Re-exportar funcionalidades de los submódulos para mantener compatibilidad
export { switchTab } from './navigation.js';
export { renderizarGrupos } from './ui-groups.js';
export { renderizarBracket, actualizarPlayoffsAutomatico } from './ui-bracket.js';
export { abrirDetallesPartido, cerrarDetallesPartido, switchModalTab, inicializarEventosModal } from './ui-modal.js';
export { actualizarPartidosDeHoy, getFechaArgentinaHoy } from './ui-matches-today.js';
export { renderizarPodio } from './ui-podium.js';

/**
 * Actualiza la interfaz entera (grupos, llaves de eliminación directa y hoy)
 */
export function actualizarInterfaz() {
    // Calcular tablas para todos los grupos
    Object.keys(GRUPOS).forEach(letra => {
        calcularGrupo(letra);
    });
    
    // Rellenar brackets de fase final
    actualizarPlayoffsAutomatico();
    
    // Actualizar sección del podio
    renderizarPodio();
    
    // Renderizar los partidos de hoy
    actualizarPartidosDeHoy();
}
