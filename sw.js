const CACHE_NAME = "fixture-mundial-2026-v2";
const ASSETS = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./manifest.json",
    "./icono-192.png",
    "./icono-512.png",
    "./fondo_cancha.png",
    "./fondo_cancha_final.png",
    "./fondo_cancha_grupos.png"
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
// 1. Network First para llamadas a la API (worldcup26.ir) -> siempre actual, pero disponible offline.
// 2. Cache First para recursos estáticos (imágenes, banderas, fuentes, etc.) -> carga instantánea.
self.addEventListener("fetch", e => {
    const url = new URL(e.request.url);
    
    if (url.hostname.includes("worldcup26.ir")) {
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
                    // Cachear dinámicamente recursos nuevos (ej. banderas)
                    if (response && response.status === 200) {
                        const resClone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(e.request, resClone);
                        });
                    }
                    return response;
                }).catch(() => {
                    // Si falla la red y no está en caché, simplemente dejamos pasar o devolvemos error
                    return null;
                });
            })
        );
    }
});
