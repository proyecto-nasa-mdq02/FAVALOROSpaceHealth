import atexit
import functools
import threading
import time
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import tkinter as tk
import uvicorn

from simulador_misiones.generador_mision_artemis import inicializar_y_poblar_mision
from src.infraestructura.api.servidor import app
from src.presentacion.consola_comando.cliente_api import ClienteAPIAstroMed
from src.presentacion.consola_comando.vistas.panel_control import VentanaPanelControl

_SERVIDOR_WEB_HTTP = None


def iniciar_demonios_red() -> None:
    """Inicializa la base de datos y levanta API REST (8000) + HUD Web (8080)."""
    global _SERVIDOR_WEB_HTTP
    inicializar_y_poblar_mision("db/astro_med.db")

    def correr_api():
        config = uvicorn.Config(app, host="0.0.0.0", port=8000, log_level="warning")
        uvicorn.Server(config).run()

    hilo_api = threading.Thread(target=correr_api, daemon=True)
    hilo_api.start()

    ruta_hud = Path(__file__).resolve().parents[2] / "hud_astronauta"
    manejador = functools.partial(SimpleHTTPRequestHandler, directory=str(ruta_hud))
    try:
        _SERVIDOR_WEB_HTTP = HTTPServer(("0.0.0.0", 8080), manejador)
        threading.Thread(target=_SERVIDOR_WEB_HTTP.serve_forever, daemon=True).start()
    except OSError:
        pass

    atexit.register(apagar_demonios)
    time.sleep(0.6)


def apagar_demonios() -> None:
    if _SERVIDOR_WEB_HTTP:
        try:
            _SERVIDOR_WEB_HTTP.shutdown()
        except Exception:
            pass


def main() -> None:
    iniciar_demonios_red()
    raiz = tk.Tk()
    raiz.withdraw()
    cliente = ClienteAPIAstroMed("http://127.0.0.1:8000/api")
    VentanaPanelControl(tk.Toplevel(raiz), cliente, al_cerrar=raiz.destroy)
    webbrowser.open("http://127.0.0.1:8080")
    raiz.mainloop()


if __name__ == "__main__":
    main()