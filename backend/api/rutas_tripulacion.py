# ============================================================================
#  ENRUTADOR HTTP: TRIPULACIÓN Y AUTENTICACIÓN (CAPA 3 - INFRAESTRUCTURA API)
# ============================================================================

from dataclasses import asdict
from fastapi import APIRouter, Depends, status
from src.aplicacion.casos_uso_tripulacion import ServicioTripulacion
from src.dominio.excepciones import ErrorEntidadNoEncontrada
from src.infraestructura.api.esquemas_validacion import (
    PeticionCrearTripulante,
    PeticionModificarTripulante,
)
from src.infraestructura.api.inyector_dependencias import (
    obtener_servicio_tripulacion,
    obtener_id_operador,
)

router = APIRouter(prefix="/api", tags=["Tripulación"])


def _serializar_tripulante(t) -> dict:
    return asdict(t)


@router.get("/tripulantes", status_code=status.HTTP_200_OK)
def listar_tripulantes(
    servicio: ServicioTripulacion = Depends(obtener_servicio_tripulacion),
):
    lista = servicio.listar_tripulacion()
    return [_serializar_tripulante(t) for t in lista]


@router.get("/tripulantes/{id_tripulante}", status_code=status.HTTP_200_OK)
def obtener_tripulante(
    id_tripulante: int,
    servicio: ServicioTripulacion = Depends(obtener_servicio_tripulacion),
):
    with servicio.uow:
        t = servicio.uow.tripulantes.obtener_por_id(id_tripulante)
        if not t:
            raise ErrorEntidadNoEncontrada(f"Tripulante ID {id_tripulante} no encontrado.")
        return _serializar_tripulante(t)


@router.post("/tripulantes", status_code=status.HTTP_201_CREATED)
def crear_tripulante(
    payload: PeticionCrearTripulante,
    id_operador: int = Depends(obtener_id_operador),
    servicio: ServicioTripulacion = Depends(obtener_servicio_tripulacion),
):
    creado = servicio.registrar_tripulante(id_operador, payload.model_dump())
    return _serializar_tripulante(creado)


@router.put("/tripulantes/{id_destino}", status_code=status.HTTP_200_OK)
def actualizar_tripulante(
    id_destino: int,
    payload: PeticionModificarTripulante,
    id_operador: int = Depends(obtener_id_operador),
    servicio: ServicioTripulacion = Depends(obtener_servicio_tripulacion),
):
    datos_limpios = {k: v for k, v in payload.model_dump().items() if v is not None}
    modificado = servicio.modificar_tripulante(id_operador, id_destino, datos_limpios)
    return _serializar_tripulante(modificado)


@router.delete("/tripulantes/{id_destino}", status_code=status.HTTP_200_OK)
def eliminar_tripulante(
    id_destino: int,
    id_operador: int = Depends(obtener_id_operador),
    servicio: ServicioTripulacion = Depends(obtener_servicio_tripulacion),
):
    servicio.dar_baja_tripulante(id_operador, id_destino)
    return {"mensaje": f"Tripulante ID {id_destino} desafectado de la misión activa."}