import { PAISES } from '../data/paises.js';
import { fetchTeamRoster } from './api.js';
import { abrirPlayerCard } from './ui-player-card.js';

let isTeamsRendered = false;

// Convertir código FIFA local a ID de equipo de ESPN
const fifaToEspnId = {
    "ARG": "202", "MEX": "203", "USA": "660", "CAN": "1840", "BRA": "205", 
    "URU": "214", "COL": "208", "FRA": "478", "GER": "481", "ENG": "468",
    "ESP": "483", "POR": "482", "ITA": "108", "NED": "449", "CRO": "477",
    "BEL": "474", "JPN": "624", "KOR": "626", "MAR": "644", "SEN": "656",
    // Agregaremos más de forma genérica si es necesario, pero la mayoría
    // en este torneo los tenemos en PAISES. Para simplificar, la API
    // a veces requiere el ID. Buscaremos la forma de machearlos o usar el abbreviation.
};

export function renderizarEquiposInicial() {
    if (isTeamsRendered) return;
    
    const grid = document.getElementById('teams-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Recorrer todos los países definidos y armar las tarjetas de banderas
    Object.keys(PAISES).forEach(codigo => {
        const pais = PAISES[codigo];
        
        const card = document.createElement('div');
        card.className = 'team-flag-card';
        card.innerHTML = `
            <img src="banderas/${codigo.toLowerCase()}.png" alt="Bandera de ${pais.nombre}">
            <span>${pais.nombre}</span>
        `;
        
        card.onclick = () => cargarDetalleEquipo(codigo, pais.nombre, pais.espnId);
        grid.appendChild(card);
    });
    
    isTeamsRendered = true;
}

window.volverAEquipos = function() {
    document.getElementById('team-detail-view').style.display = 'none';
    document.getElementById('teams-list-view').style.display = 'block';
};

export async function cargarDetalleEquipo(codigo, nombre, espnId) {
    document.getElementById('teams-list-view').style.display = 'none';
    const detailView = document.getElementById('team-detail-view');
    detailView.style.display = 'block';
    
    const header = document.getElementById('team-detail-header');
    const rosterGrid = document.getElementById('team-roster-grid');
    
    header.innerHTML = '<p style="color:white;">Cargando información oficial...</p>';
    rosterGrid.innerHTML = '';
    
    // Intentar buscar el ID de ESPN
    const targetId = espnId || fifaToEspnId[codigo];
    
    if (!targetId) {
        header.innerHTML = `
            <img src="banderas/${codigo.toLowerCase()}.png" class="team-detail-flag">
            <h2 class="team-detail-name">${nombre}</h2>
            <p class="team-detail-record">Datos del plantel no disponibles temporalmente.</p>
        `;
        return;
    }
    
    const { roster, team } = await fetchTeamRoster(targetId);
    
    // Configurar header
    let recordStr = "";
    let bgColor = "rgba(0,0,0,0.5)";
    if (team) {
        if (team.standingSummary) recordStr += team.standingSummary + " | ";
        if (team.record && team.record.items && team.record.items[0]) recordStr += "Récord: " + team.record.items[0].summary;
        if (team.color) bgColor = `#${team.color}`;
    }
    
    header.style.borderColor = bgColor;
    
    header.innerHTML = `
        <div class="team-detail-header-bg" style="background-color: ${bgColor};"></div>
        <div class="team-detail-header-content">
            <img src="banderas/${codigo.toLowerCase()}.png" class="team-detail-flag">
            <h2 class="team-detail-name">${nombre}</h2>
            ${recordStr ? `<span class="team-detail-record">${recordStr}</span>` : ''}
        </div>
    `;
    
    if (!roster || roster.length === 0) {
        rosterGrid.innerHTML = '<p style="color:white; padding: 20px;">El plantel aún no ha sido publicado oficialmente por ESPN.</p>';
        return;
    }
    
    // Renderizar roster
    roster.forEach(jugador => {
        const card = document.createElement('div');
        card.className = 'roster-card';
        
        // Imagen del jugador desde Core API ESPN (url directa conocida)
        const photoUrl = jugador.id ? `https://a.espncdn.com/i/headshots/soccer/players/full/${jugador.id}.png` : 'https://a.espncdn.com/i/headshots/soccer/players/full/fallback.png';
        
        card.innerHTML = `
            <div class="roster-card-img-container">
                <img src="${photoUrl}" class="roster-card-img" alt="${jugador.shortName || jugador.displayName}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'%23666\\'><path d=\\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\\'/></svg>'">
            </div>
            <div class="roster-card-info">
                <div class="roster-card-name">${jugador.shortName || jugador.lastName || jugador.displayName}</div>
                <div class="roster-card-pos">${jugador.position ? jugador.position.abbreviation : '-'}</div>
            </div>
        `;
        
        card.onclick = () => abrirPlayerCard(jugador, codigo, bgColor);
        rosterGrid.appendChild(card);
    });
}
