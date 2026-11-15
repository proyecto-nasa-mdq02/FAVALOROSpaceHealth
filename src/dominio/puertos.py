# =========================================================================
#  PUERTOS Y CONTRATOS ABSTRACTOS (CAPA 1 - INVERSIÓN DE DEPENDENCIAS DIP)
# =========================================================================

from abc import ABC, abstractmethod
from typing import List, Optional
from src.dominio.entidades import Tripulante, InsumoMedico, LecturaBiometrica


class PuertoRepositorioTripulantes(ABC):
    @abstractmethod
    def guardar(self, tripulante: Tripulante) -> Tripulante:
        pass

    @abstractmethod
    def obtener_por_id(self, id_tripulante: int) -> Optional[Tripulante]:
        pass

    @abstractmethod
    def obtener_por_usuario(self, nombre_usuario: str) -> Optional[Tripulante]:
        pass

    @abstractmethod
    def listar_todos(self) -> List[Tripulante]:
        pass

    @abstractmethod
    def incrementar_racha(self, id_tripulante: int) -> int:
        pass

    @abstractmethod
    def eliminar_logico(self, id_tripulante: int) -> None:
        pass


class PuertoRepositorioBotiquin(ABC):
    @abstractmethod
    def guardar(self, insumo: InsumoMedico) -> InsumoMedico:
        pass

    @abstractmethod
    def obtener_por_id(self, id_insumo: int) -> Optional[InsumoMedico]:
        pass

    @abstractmethod
    def listar_todos(self) -> List[InsumoMedico]:
        pass

    @abstractmethod
    def descontar_stock(self, id_insumo: int, cantidad: float) -> None:
        pass


class PuertoRepositorioTelemetria(ABC):
    @abstractmethod
    def registrar_lectura(self, lectura: LecturaBiometrica) -> LecturaBiometrica:
        pass

    @abstractmethod
    def listar_por_tripulante(self, id_tripulante: int, limite: int = 30) -> List[LecturaBiometrica]:
        pass

    @abstractmethod
    def listar_todas(self) -> List[LecturaBiometrica]:
        pass