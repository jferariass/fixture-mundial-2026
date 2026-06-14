// Módulo de navegación de pestañas y selectores móviles

/**
 * Cambia la pestaña activa de la aplicación y sincroniza el dropdown móvil.
 */
export function switchTab(tabId) {
    const targetPage = document.getElementById(tabId);
    if (!targetPage) return; // protección contra HTML viejo
    
    document.querySelectorAll(".print-page").forEach(page => {
        page.classList.remove("active");
    });
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    
    targetPage.classList.add("active");
    
    const index = parseInt(tabId.split("-")[2]);
    const botones = document.querySelectorAll(".tab-btn");
    if (botones[index]) {
        botones[index].classList.add("active");
    }
    
    // Sincronizar el selector móvil personalizado
    const dropdownBtnText = document.getElementById("mobile-dropdown-current");
    const dropdownItems = document.querySelectorAll(".mobile-dropdown-item");
    if (dropdownItems.length > 0) {
        dropdownItems.forEach(item => {
            if (item.getAttribute("data-value") === tabId) {
                item.classList.add("active");
                if (dropdownBtnText) {
                    dropdownBtnText.textContent = item.textContent;
                }
            } else {
                item.classList.remove("active");
            }
        });
    }
}
