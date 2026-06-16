const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

c = c.replace(
    /<!-- PÁGINA 1: GRUPOS A-D -->[\s\S]*?<!-- PÁGINA 4: FASE FINAL -->/,
    `<!-- PÁGINA 1: GRUPOS A-L -->
        <div class="print-page" id="tab-page-1">
            <div class="print-page-title">FASE DE GRUPOS • PARTE 1 (GRUPOS A, B, C, D)</div>
            <div class="grid-grupos-2x2" id="grid-page-1"></div>
            
            <div class="print-page-title mt-4" style="margin-top: 30px;">FASE DE GRUPOS • PARTE 2 (GRUPOS E, F, G, H)</div>
            <div class="grid-grupos-2x2" id="grid-page-2"></div>
            
            <div class="print-page-title mt-4" style="margin-top: 30px;">FASE DE GRUPOS • PARTE 3 (GRUPOS I, J, K, L)</div>
            <div class="grid-grupos-2x2" id="grid-page-3"></div>
        </div>

        <!-- PÁGINA 4: FASE FINAL -->`
);

fs.writeFileSync('index.html', c);
