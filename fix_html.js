const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

c = c.replace(
    /<nav class="nav-tabs">[\s\S]*?<\/nav>/,
    `<nav class="nav-tabs">
            <button class="tab-btn" onclick="switchTab('tab-page-1')"><i class="fa-solid fa-list"></i> GRUPOS</button>
            <button class="tab-btn" onclick="switchTab('tab-page-4')"><i class="fa-solid fa-sitemap"></i> FASE FINAL</button>
            <button class="tab-btn active" onclick="switchTab('tab-page-0')"><i class="fa-solid fa-calendar-day"></i> HOY</button>
            <button class="tab-btn" onclick="switchTab('tab-page-podium')"><i class="fa-solid fa-trophy"></i> PODIO</button>
            <button class="tab-btn" onclick="switchTab('tab-page-teams')"><i class="fa-solid fa-users"></i> EQUIPOS</button>
        </nav>`
);

c = c.replace(
    /<div class="mobile-dropdown-content" id="mobile-dropdown-content">[\s\S]*?<\/div>/,
    `<div class="mobile-dropdown-content" id="mobile-dropdown-content">
                <button class="mobile-dropdown-item active" data-value="tab-page-0">📅 HOY</button>
                <button class="mobile-dropdown-item" data-value="tab-page-1">📄 GRUPOS A-L</button>
                <button class="mobile-dropdown-item" data-value="tab-page-4">🏆 FASE FINAL</button>
                <button class="mobile-dropdown-item" data-value="tab-page-podium">🏅 PODIO (ESTADÍSTICAS)</button>
                <button class="mobile-dropdown-item" data-value="tab-page-teams">👥 EQUIPOS Y PLANTELES</button>
            </div>`
);

c = c.replace(
    `        <!-- PÁGINA 1: GRUPOS A-D -->
        <div class="print-page" id="tab-page-1">
            <div class="print-page-title">FASE DE GRUPOS • PARTE 1 (GRUPOS A, B, C, D)</div>
            <div class="grid-grupos-2x2" id="grid-page-1"></div>
        </div>

        <!-- PÁGINA 2: GRUPOS E-H -->
        <div class="print-page" id="tab-page-2">
            <div class="print-page-title">FASE DE GRUPOS • PARTE 2 (GRUPOS E, F, G, H)</div>
            <div class="grid-grupos-2x2" id="grid-page-2"></div>
        </div>

        <!-- PÁGINA 3: GRUPOS I-L -->
        <div class="print-page" id="tab-page-3">
            <div class="print-page-title">FASE DE GRUPOS • PARTE 3 (GRUPOS I, J, K, L)</div>
            <div class="grid-grupos-2x2" id="grid-page-3"></div>
        </div>`,
    `        <!-- PÁGINA 1: GRUPOS A-L -->
        <div class="print-page" id="tab-page-1">
            <div class="print-page-title">FASE DE GRUPOS • PARTE 1 (GRUPOS A, B, C, D)</div>
            <div class="grid-grupos-2x2" id="grid-page-1"></div>
            
            <div class="print-page-title mt-4" style="margin-top: 30px;">FASE DE GRUPOS • PARTE 2 (GRUPOS E, F, G, H)</div>
            <div class="grid-grupos-2x2" id="grid-page-2"></div>
            
            <div class="print-page-title mt-4" style="margin-top: 30px;">FASE DE GRUPOS • PARTE 3 (GRUPOS I, J, K, L)</div>
            <div class="grid-grupos-2x2" id="grid-page-3"></div>
        </div>`
);

fs.writeFileSync('index.html', c);
