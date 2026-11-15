# =======================================================================
#  ESQUEMAS DE VALIDACIÓN Y CONTRATOS DTO (CAPA 3 - INFRAESTRUCTURA API)
# =======================================================================

from typing import Optional
from pydantic import BaseModel, Field


class PeticionCrearTripulante(BaseModel):
    usuario: str
    nombres: str
    apellidos: str
    codigo_astronauta: str
    rol: str = "Especialista de Mision"
    especialidad: str = "General"
    racha_autocuidado: int = 0


class PeticionModificarTripulante(BaseModel):
    nombres: Optional[str] = None
    apellidos: Optional[str] = None
    codigo_astronauta: Optional[str] = None
    rol: Optional[str] = None
    especialidad: Optional[str] = None


class PeticionCrearInsumo(BaseModel):
    codigo: str
    nombre: str
    sistema_corporal: str  # 'NEURO_PSICO', 'CARDIO_RAD', 'METABOLICO_INMUNE', 'MUSCULO_ESQUELETICO'.
    instrucciones_uso: str
    stock_actual: float = Field(..., ge=0.0)
    stock_minimo: float = Field(default=2.0, ge=0.0)
    unidad_medida: str = "Unidades"
    modulo_ubicacion: str = "Bahia Medica A"
    vencimiento: str = "S/D"


class PeticionRegistrarTelemetria(BaseModel):
    id_tripulante: int
    entorno: str = "Transito Espacial (0G)"
    presion_sistolica: int
    presion_diastolica: int
    frecuencia_cardiaca: int
    glucosa_mg_dl: float
    temperatura_c: float
    horas_sueno: float
    estado_animo: int
    radiacion_msv: float = 0.0
    minutos_ejercicio: int = 0
    id_insumo_aplicado: Optional[int] = None
    cantidad_insumo: float = 0.0
    evidencia_adjunta: str = "S/D"


class PeticionSimularCrisis(BaseModel):
    id_tripulante: int
    escenario: str  # 'TORMENTA_SOLAR', 'CONFINAMIENTO_ROVER', 'HIPOGLUCEMIA_EVA', 'ATROFIA_CERO_G'.


class PeticionCambiarMision(BaseModel):
    mision: str  # 'ARTEMIS_LUNA', 'ARES_MARTE', 'EUROPA_JUPITER'.


class PeticionConsultaSQL(BaseModel):
    query: str