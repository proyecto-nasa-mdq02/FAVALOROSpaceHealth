# =======================================================================================
#  ENTIDADES DE DOMINIO (CAPA 1 - NÚCLEO CLÍNICO-ESPACIAL)
# =======================================================================================
#  Objetos puros en memoria RAM (POJOs). Cero dependencias de SQLite, FastAPI o Tkinter.
# =======================================================================================

from dataclasses import dataclass, field
from typing import Optional, Dict
from src.dominio.excepciones import ErrorBiometriaFueraDeRangoFisico


@dataclass
class Tripulante:
    """
    Representa a un miembro de la misión espacial (Comandante Médico, Oficial Científico
    o Especialista de Misión).
    """
    nombres: str
    apellidos: str
    codigo_astronauta: str
    rol: str
    especialidad: str = "Especialista de Misión"
    usuario: Optional[str] = None
    racha_autocuidado: int = 0
    id: Optional[int] = None
    habilitado: int = 1


@dataclass
class InsumoMedico:
    """
    Representa un suministro o kit de protocolo dentro del botiquín de la nave/rover.
    Incluye instrucciones paso a paso para guiar a tripulantes sin título médico.
    """
    codigo: str
    nombre: str
    sistema_corporal: str  # 'NEURO_PSICO', 'CARDIO_RAD', 'METABOLICO_INMUNE', 'MUSCULO_ESQUELETICO'.
    instrucciones_uso: str
    stock_actual: float
    stock_minimo: float = 2.0
    unidad_medida: str = "Unidades"
    modulo_ubicacion: str = "Bahia Medica A"
    vencimiento: str = "S/D"
    id: Optional[int] = None
    habilitado: int = 1

    def hay_stock_disponible(self, dosis_requerida: float) -> bool:
        """Regla de negocio encapsulada: verifica si el botiquín cubre la dosis."""
        return self.stock_actual >= dosis_requerida

    def esta_en_alerta_stock(self) -> bool:
        """Determina si es necesario solicitar reabastecimiento o racionamiento."""
        return self.stock_actual <= self.stock_minimo


@dataclass
class DiagnosticoTriage:
    """
    Objeto de Valor (Value Object) devuelto por el Evaluador de Riesgo Espacial.
    Determina qué colores pintar en el SVG humano del HUD y qué guía mostrar.
    """
    nivel_alerta_global: str  # 'NOMINAL', 'PRECAUCION', 'CRITICO'.
    sistema_afectado_principal: str
    resumen_clinico: str
    instruccion_paso_a_paso: str
    requiere_atencion_tierra: bool
    estado_sistemas: Dict[str, str] = field(default_factory=dict)


@dataclass
class LecturaBiometrica:
    """
    Entidad transaccional que registra una evaluación de salud de un astronauta
    en un entorno espacial determinado.
    """
    id_tripulante: int
    entorno: str  # 'Transito Espacial (0G)', 'Estacion Espacial', 'Rover Explorador', 'Base Planetaria'.
    presion_sistolica: int
    presion_diastolica: int
    frecuencia_cardiaca: int
    glucosa_mg_dl: float
    temperatura_c: float
    horas_sueno: float
    estado_animo: int  # 1 a 5
    radiacion_msv: float = 0.0
    minutos_ejercicio: int = 0
    id_insumo_aplicado: Optional[int] = None
    cantidad_insumo: float = 0.0
    evidencia_adjunta: str = "S/D"
    # Campos completados por el motor de dominio o la base de datos.
    nivel_alerta: str = "NOMINAL"
    sistema_afectado: str = "NINGUNO"
    diagnostico_resumen: str = "Parámetros dentro de rangos nominales de misión."
    instruccion_accion: str = "Continuar con rutina estándar programada."
    presion_media: Optional[float] = None
    fecha: Optional[str] = None
    id: Optional[int] = None
    habilitado: int = 1

    def validar_rangos_biologicos(self) -> None:
        """
        Barrera de integridad de dominio: rechaza valores imposibles por fallo de sensor.
        """
        if not (40 <= self.presion_sistolica <= 260) or not (20 <= self.presion_diastolica <= 160):
            raise ErrorBiometriaFueraDeRangoFisico("Presión arterial fuera de rango fisiológico humano.")
        if self.presion_diastolica >= self.presion_sistolica:
            raise ErrorBiometriaFueraDeRangoFisico("La presión diastólica no puede superar o igualar a la sistólica.")
        if not (25 <= self.frecuencia_cardiaca <= 240):
            raise ErrorBiometriaFueraDeRangoFisico("Frecuencia cardíaca fuera de límites biológicos (25-240 BPM).")
        if not (20.0 <= self.glucosa_mg_dl <= 600.0):
            raise ErrorBiometriaFueraDeRangoFisico("Nivel de glucosa fuera de rango medible (20-600 mg/dL).")
        if not (32.0 <= self.temperatura_c <= 43.0):
            raise ErrorBiometriaFueraDeRangoFisico("Temperatura corporal fuera de rango vital (32.0-43.0 °C).")
        if not (0.0 <= self.horas_sueno <= 24.0):
            raise ErrorBiometriaFueraDeRangoFisico("Las horas de sueño diarias deben ubicarse entre 0 y 24.")
        if not (1 <= self.estado_animo <= 5):
            raise ErrorBiometriaFueraDeRangoFisico("El estado de ánimo debe calificarse en la escala del 1 al 5.")

    def calcular_presion_media_estimada(self) -> float:
        """Calcula la Presión Arterial Media (MAP) en RAM antes de persistir."""
        return round(self.presion_diastolica + ((self.presion_sistolica - self.presion_diastolica) / 3.0), 1)