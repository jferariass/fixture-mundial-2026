import { PAISES } from '../data/paises.js';
import { podioStats, calcularPodioStats } from './ui-podium.js';

window.abrirPlayerCard = abrirPlayerCard;
export function abrirPlayerCard(jugador, fifaCode, teamColor) {
    const modal = document.getElementById('player-card-modal');
    const content = document.getElementById('player-card-content');
    
    // Asegurarnos de que las estadísticas estén calculadas
    if (typeof calcularPodioStats === 'function') {
        calcularPodioStats();
    }
    
    // Obtener estadísticas del jugador de nuestro Podium (torneo actual)
    const playerId = `${jugador.shortName || jugador.displayName} (${fifaCode})`;
    
    const goles = podioStats.goles[playerId] ? podioStats.goles[playerId].count : 0;
    const amarillas = podioStats.amarillas[playerId] ? podioStats.amarillas[playerId].count : 0;
    const rojas = podioStats.rojas[playerId] ? podioStats.rojas[playerId].count : 0;
    
    // Buscar la bandera del país
    const flagUrl = `banderas/${fifaCode.toLowerCase()}.png`;
    const photoUrl = jugador.id ? `https://a.espncdn.com/i/headshots/soccer/players/full/${jugador.id}.png` : 'https://a.espncdn.com/i/headshots/soccer/players/full/fallback.png';
    
    const age = jugador.age || '-';
    let height = '-';
    if (jugador.height) {
        height = Math.round(jugador.height * 2.54) + ' cm';
    } else if (jugador.displayHeight) {
        height = jugador.displayHeight;
    }
    const weight = jugador.displayWeight || '-';
    
    let positionName = 'Unknown';
    if (typeof jugador.position === 'string') {
        positionName = jugador.position;
    } else if (jugador.position) {
        positionName = jugador.position.abbreviation || jugador.position.name || 'Unknown';
    }
    
    const jersey = jugador.jersey || '#';
    
    // Determinar color de fondo
    const bgColor = teamColor || '#333';
    
    content.innerHTML = `
        <div class="player-card-bg" style="background: linear-gradient(135deg, ${bgColor}, rgba(0,0,0,0.9));"></div>
        
        <div class="player-card-header">
            <div class="player-card-country">
                <img src="${flagUrl}" class="player-card-flag" alt="${fifaCode}">
            </div>
            <div class="player-card-jersey">${jersey}</div>
        </div>
        
        <div class="player-card-photo-container">
            <img src="${photoUrl}" class="player-card-photo" alt="Foto" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'%23666\\'><path d=\\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\\'/></svg>'">
        </div>
        
        <div class="player-card-body" style="border-top-color: ${bgColor}">
            <h3 class="player-card-name">${jugador.displayName || jugador.fullName}</h3>
            <div class="player-card-position-text">${positionName}</div>
            
            <div class="player-card-stats">
                <div class="player-stat-box">
                    <span class="player-stat-label">Edad</span>
                    <span class="player-stat-value">${age}</span>
                </div>
                <div class="player-stat-box">
                    <span class="player-stat-label">Altura</span>
                    <span class="player-stat-value">${height}</span>
                </div>
            </div>
            
            <div class="player-card-tourney-stats">
                <div class="player-card-tourney-title">ESTADÍSTICAS DEL MUNDIAL</div>
                <div class="player-tourney-row">
                    <span class="player-tourney-label">Goles Anotados</span>
                    <span class="player-tourney-val" style="color: ${goles > 0 ? '#fbbf24' : '#fff'}">${goles}</span>
                </div>
                <div class="player-tourney-row">
                    <span class="player-tourney-label">Tarjetas Amarillas</span>
                    <span class="player-tourney-val" style="color: ${amarillas > 0 ? '#facc15' : '#fff'}">${amarillas}</span>
                </div>
                <div class="player-tourney-row">
                    <span class="player-tourney-label">Tarjetas Rojas</span>
                    <span class="player-tourney-val" style="color: ${rojas > 0 ? '#ef4444' : '#fff'}">${rojas}</span>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

window.cerrarPlayerCard = function() {
    document.getElementById('player-card-modal').classList.remove('active');
};
