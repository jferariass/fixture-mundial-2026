const CACHE_NAME = "fixture-mundial-2026-v73";
const ASSETS = [
    "./",
    "./styles.css",
    "./app.js",
    "./manifest.json",
    "./icono-192.png",
    "./icono-512.png",
    "./favicon.ico",
    "./fondo_cancha.png",
    "./fondo_cancha_final.png",
    "./fondo_cancha_grupos.png",
    
    // Archivos de Datos Modularizados
    "./js/data/paises.js",
    "./js/data/partidos.js",
    "./js/data/resultados.js",
    "./js/data/plantillas.js",
    
    // Archivos de Lógica Modularizados
    "./js/modules/estado.js",
    "./js/modules/calculations.js",
    "./js/modules/pwa.js",
    "./js/modules/api.js",
    "./js/modules/ui.js",
    "./js/modules/navigation.js",
    "./js/modules/ui-groups.js",
    "./js/modules/ui-bracket.js",
    "./js/modules/ui-matches-today.js",
    "./js/modules/ui-modal.js",
    
    // Estilos CSS Modularizados
    "./css/variables.css",
    "./css/base.css",
    "./css/tabs.css",
    "./css/grupos.css",
    "./css/playoffs.css",
    "./css/modal.css",
    "./css/pwa.css"
];

// Instalar el Service Worker y almacenar recursos clave en caché
self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Activar y limpiar cachés antiguos
self.addEventListener("activate", e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Estrategia de Cacheo:
// 1. Network First para llamadas a la API (worldcup26.ir, api.espn.com) -> siempre actual.
// 2. Cache First para recursos estáticos (imágenes, banderas, fuentes, etc.) -> carga instantánea.
self.addEventListener("fetch", e => {
    // Solo interceptar y cachear peticiones con método GET
    if (e.request.method !== "GET") {
        return;
    }

    const url = new URL(e.request.url);
    
    if (url.protocol !== "http:" && url.protocol !== "https:") {
        return;
    }
    
    if (url.hostname.includes("worldcup26.ir") || url.hostname.includes("api.espn.com")) {
        // Petición a la API: Network First
        e.respondWith(
            fetch(e.request)
                .then(response => {
                    const resClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(e.request, resClone);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(e.request);
                })
        );
    } else {
        // Recursos estáticos locales: Cache First
        e.respondWith(
            caches.match(e.request).then(cachedResponse => {
                if (cachedResponse) return cachedResponse;
                
                return fetch(e.request).then(response => {
                    if (response && response.status === 200) {
                        const resClone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(e.request, resClone);
                        });
                    }
                    return response;
                }).catch(err => {
                    if (e.request.mode === 'navigate' || e.request.url.includes('index.html')) {
                        return caches.match('./').then(res => res || new Response("Offline", { status: 503 }));
                    }
                    return new Response("Offline", { status: 503, statusText: "Service Unavailable" });
                });
            })
        );
    }
});
