// Asistente y lógica de instalación PWA (Android / PC / iOS)

let deferredPrompt;

export function inicializarInstalacionPWA() {
    const banner = document.getElementById("pwa-install-banner");
    const btnInstall = document.getElementById("pwa-btn-install");
    const btnClose = document.getElementById("pwa-btn-close");
    
    const iosModal = document.getElementById("ios-install-modal");
    const iosBtnCloseX = document.getElementById("ios-modal-close-x");
    const iosBtnUnderstand = document.getElementById("ios-modal-btn-understand");
    const iosBackdrop = document.getElementById("ios-modal-backdrop");

    // Si el usuario ya rechazó la instalación en esta sesión, no lo molestamos
    if (localStorage.getItem("pwa-banner-dismissed") === "true") {
        return;
    }

    // A. Capturar prompt nativo para Android / Chrome en PC
    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Mostrar banner si no está en modo standalone
        if (!estaEnStandalone() && banner) {
            banner.classList.add("show");
        }
    });

    // B. Lógica del botón instalar (Android / PC / iOS)
    if (btnInstall) {
        btnInstall.addEventListener("click", async () => {
            if (esDispositivoIOS()) {
                // Si es iOS, mostramos la guía en vez del prompt nativo
                if (iosModal) iosModal.classList.add("show");
                if (banner) banner.classList.remove("show");
            } else if (deferredPrompt) {
                // Si es Android/PC y el prompt está listo
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`Usuario eligió instalar: ${outcome}`);
                deferredPrompt = null;
                if (banner) banner.classList.remove("show");
            }
        });
    }

    // C. Lógica de cerrar el banner
    if (btnClose && banner) {
        btnClose.addEventListener("click", () => {
            banner.classList.remove("show");
            localStorage.setItem("pwa-banner-dismissed", "true");
        });
    }

    // D. Detección específica de iOS y Safari para guiar al usuario
    if (esDispositivoIOS() && !estaEnStandalone()) {
        setTimeout(() => {
            if (banner && btnInstall && localStorage.getItem("pwa-banner-dismissed") !== "true") {
                btnInstall.textContent = "Ver Guía";
                banner.classList.add("show");
            }
        }, 3000);
    }

    // E. Control de cierre del modal guía de iOS
    const cerrarGuiaIos = () => {
        if (iosModal) iosModal.classList.remove("show");
        localStorage.setItem("pwa-banner-dismissed", "true");
    };

    if (iosBtnCloseX) iosBtnCloseX.addEventListener("click", cerrarGuiaIos);
    if (iosBtnUnderstand) iosBtnUnderstand.addEventListener("click", cerrarGuiaIos);
    if (iosBackdrop) iosBackdrop.addEventListener("click", cerrarGuiaIos);
}

// Helpers de PWA
export function esDispositivoIOS() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
}

export function estaEnStandalone() {
    return (window.navigator.standalone === true) || (window.matchMedia('(display-mode: standalone)').matches);
}
