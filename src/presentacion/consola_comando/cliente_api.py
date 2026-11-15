# ======================================================================================
#  CLIENTE HTTP CENTRALIZADO PARA CONSOLA DE ESCRITORIO TKINTER (CAPA 4 - PRESENTACIÓN)
# ======================================================================================

from typing import Any, Dict, List, Optional
import requests


class ErrorClienteAPI(Exception):
    """Excepción normalizada para mostrar errores de la API en las vistas de escritorio."""
    pass


class ClienteAPIAstroMed:
    def __init__(self, url_base: str = "http://127.0.0.1:8000/api"):
        self.url_base = url_base.rstrip("/")
        self.operador_actual: Optional[Dict[str, Any]] = None

    def _cabeceras(self) -> Dict[str, str]:
        id_op = self.operador_actual["id"] if self.operador_actual else 1
        return {"X-Operador-Id": str(id_op)}

    def _procesar_respuesta(self, resp: requests.Response) -> Any:
        if resp.status_code >= 400:
            try:
                data = resp.json()
                mensaje = data.get("detalle") or data.get("detail") or f"Error HTTP {resp.status_code}"
            except Exception:
                mensaje = f"Error de comunicación HTTP {resp.status_code}"
            raise ErrorClienteAPI(str(mensaje))
        return resp.json()

    def listar_tripulantes(self) -> List[Dict[str, Any]]:
        resp = requests.get(f"{self.url_base}/tripulantes", headers=self._cabeceras(), timeout=5)
        return self._procesar_respuesta(resp)

    def listar_botiquin(self) -> List[Dict[str, Any]]:
        resp = requests.get(f"{self.url_base}/botiquin", headers=self._cabeceras(), timeout=5)
        return self._procesar_respuesta(resp)

    def listar_telemetria(self) -> List[Dict[str, Any]]:
        resp = requests.get(f"{self.url_base}/telemetria", headers=self._cabeceras(), timeout=5)
        return self._procesar_respuesta(resp)

    def listar_telemetria_tripulante(self, id_tripulante: int) -> List[Dict[str, Any]]:
        resp = requests.get(
            f"{self.url_base}/telemetria/tripulante/{id_tripulante}",
            headers=self._cabeceras(),
            timeout=5,
        )
        return self._procesar_respuesta(resp)

    def registrar_telemetria(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        resp = requests.post(
            f"{self.url_base}/telemetria",
            json=payload,
            headers=self._cabeceras(),
            timeout=5,
        )
        return self._procesar_respuesta(resp)

    def simular_crisis(self, id_tripulante: int, escenario: str) -> Dict[str, Any]:
        resp = requests.post(
            f"{self.url_base}/telemetria/simular-crisis",
            json={"id_tripulante": id_tripulante, "escenario": escenario},
            headers=self._cabeceras(),
            timeout=5,
        )
        return self._procesar_respuesta(resp)

    def cambiar_mision(self, codigo_mision: str) -> Dict[str, Any]:
        resp = requests.post(
            f"{self.url_base}/telemetria/cargar-mision",
            json={"mision": codigo_mision},
            headers=self._cabeceras(),
            timeout=10,
        )
        return self._procesar_respuesta(resp)

    def obtener_analitica(self, id_tripulante: int) -> Dict[str, Any]:
        resp = requests.get(
            f"{self.url_base}/analitica/{id_tripulante}",
            headers=self._cabeceras(),
            timeout=5,
        )
        return self._procesar_respuesta(resp)

    def ejecutar_sql_sandbox(self, query: str) -> Dict[str, Any]:
        resp = requests.post(
            f"{self.url_base}/consola-sql",
            json={"query": query},
            headers=self._cabeceras(),
            timeout=5,
        )
        return self._procesar_respuesta(resp)