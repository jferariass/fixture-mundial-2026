import http.server
import socketserver
import urllib.request
import urllib.error
import sys

PORT = 8000

class ProxyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Si la petición es para obtener los partidos o equipos, actuamos como proxy
        if self.path.startswith('/api-proxy/games'):
            self.fetch_from_api("https://worldcup26.ir/get/games")
        elif self.path.startswith('/api-proxy/teams'):
            self.fetch_from_api("https://worldcup26.ir/get/teams")
        else:
            # Si es cualquier otro archivo (html, css, js, etc.), lo servimos de forma normal
            super().do_GET()
            
    def fetch_from_api(self, url):
        try:
            # Establecer un User-Agent normal para que no nos bloquee el servidor de worldcup26.ir
            req = urllib.request.Request(
                url, 
                headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            )
            with urllib.request.urlopen(req) as response:
                data = response.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(data)
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(f'{{"error": "{str(e)}"}}'.encode('utf-8'))

# Permitir cambiar el puerto si se pasa como argumento
port = PORT
if len(sys.argv) > 1:
    try:
        port = int(sys.argv[1])
    except ValueError:
        pass

# Levantar el servidor
socketserver.TCPServer.allow_reuse_address = True
try:
    with socketserver.TCPServer(("", port), ProxyHTTPRequestHandler) as httpd:
        print(f"\n========================================================")
        print(f" 🚀 SERVIDOR PROXY DE DESARROLLO INICIADO")
        print(f" 🏠 URL Local: http://localhost:{port}")
        print(f" 🔄 API Proxy Activo: /api-proxy/games -> worldcup26.ir")
        print(f"========================================================\n")
        print("Presiona Ctrl + C para detener el servidor.\n")
        httpd.serve_forever()
except Exception as e:
    print(f"Error al iniciar el servidor en el puerto {port}: {e}", file=sys.stderr)
    sys.exit(1)
