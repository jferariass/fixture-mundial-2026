// Motor del Fixture 100% Automático (Orquestador Modular)

import { 
    switchTab, 
    renderizarGrupos, 
    renderizarBracket, 
    abrirDetallesPartido, 
    cerrarDetallesPartido, 
    switchModalTab,
    inicializarEventosModal,
    inicializarSelectorFecha
} from './js/modules/ui.js';
import { cargarResultados } from './js/modules/api.js';
import { inicializarInstalacionPWA } from './js/modules/pwa.js';

// Exponer funciones necesarias al objeto global window para compatibilidad con eventos inline de index.html
window.switchTab = switchTab;
window.abrirDetallesPartido = abrirDetallesPartido;
window.cerrarDetallesPartido = cerrarDetallesPartido;
window.switchModalTab = switchModalTab;

// Iniciar aplicación cargando recursos
window.onload = () => {
    // Si por algún motivo no existe la pestaña de hoy en el DOM (HTML viejo en caché),
    // mostramos la primera página de grupos para evitar pantalla en blanco.
    if (!document.getElementById("tab-page-0")) {
        switchTab("tab-page-1");
    }

    // Inicializar eventos de cierre del modal de detalles
    inicializarEventosModal();

    // Inicializar asistente de instalación PWA
    inicializarInstalacionPWA();

    // Configurar Dropdown Personalizado Móvil
    const dropdownBtn = document.getElementById("mobile-dropdown-btn");
    const dropdownContent = document.getElementById("mobile-dropdown-content");
    
    if (dropdownBtn && dropdownContent) {
        // Toggle abrir/cerrar
        dropdownBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownContent.classList.toggle("show");
        });
        
        // Clic en opciones del dropdown
        const dropdownItems = document.querySelectorAll(".mobile-dropdown-item");
        dropdownItems.forEach(item => {
            item.addEventListener("click", () => {
                const targetValue = item.getAttribute("data-value");
                switchTab(targetValue);
                dropdownContent.classList.remove("show");
            });
        });
        
        // Cerrar al hacer clic en cualquier otra parte de la pantalla
        document.addEventListener("click", () => {
            dropdownContent.classList.remove("show");
        });
    }

    inicializarSelectorFecha();
    renderizarGrupos();
    renderizarBracket();
    cargarResultados();
    
    // Configurar refresco automático en vivo cada 60 segundos
    setInterval(cargarResultados, 60000);
    
    // Registrar Service Worker para soporte PWA y offline con auto-reload
    if ("serviceWorker" in navigator) {
        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
            if (!refreshing) {
                refreshing = true;
                console.log("Nuevo Service Worker activo. Recargando página para actualizar a la última versión...");
                window.location.reload();
            }
        });

        navigator.serviceWorker.register("./sw.js")
            .then(reg => {
                console.log("Service Worker registrado con éxito:", reg.scope);
                reg.onupdatefound = () => {
                    const installingWorker = reg.installing;
                    if (installingWorker) {
                        installingWorker.onstatechange = () => {
                            if (installingWorker.state === "installed") {
                                if (navigator.serviceWorker.controller) {
                                    console.log("Nueva actualización disponible. El Service Worker se activará automáticamente.");
                                }
                            }
                        };
                    }
                };
            })
            .catch(err => console.warn("Error al registrar Service Worker:", err));
    }
};
