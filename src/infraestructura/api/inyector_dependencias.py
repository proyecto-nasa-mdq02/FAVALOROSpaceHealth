# =========================================================================
#  FÁBRICA DE INYECCIÓN DE DEPENDENCIAS IoC (CAPA 3 - INFRAESTRUCTURA API)
# =========================================================================

from pathlib import Path
from fastapi import Header, Depends
from src.infraestructura.persistencia.gestor_sqlite import GestorSQLite
from src.aplicacion.casos_uso_tripulacion import ServicioTripulacion
from src.aplicacion.casos_uso_botiquin import ServicioBotiquin
from src.aplicacion.casos_uso_telemetria import ServicioTelemetria

RAIZ_PROYECTO = Path(__file__).resolve().parent.parent.parent.parent
RUTA_BD_PRODUCCION = str(RAIZ_PROYECTO / "db" / "astro_med.db")


def obtener_uow() -> GestorSQLite:
    return GestorSQLite(RUTA_BD_PRODUCCION)


def obtener_id_operador(x_operador_id: int = Header(default=1, alias="X-Operador-Id")) -> int:
    """Extrae la identidad del tripulante operador desde la cabecera HTTP."""
    return x_operador_id


def obtener_servicio_tripulacion(
    uow: GestorSQLite = Depends(obtener_uow),
) -> ServicioTripulacion:
    return ServicioTripulacion(uow)


def obtener_servicio_botiquin(
    uow: GestorSQLite = Depends(obtener_uow),
) -> ServicioBotiquin:
    return ServicioBotiquin(uow)


def obtener_servicio_telemetria(
    uow: GestorSQLite = Depends(obtener_uow),
) -> ServicioTelemetria:
    return ServicioTelemetria(uow)