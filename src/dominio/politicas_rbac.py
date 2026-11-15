# ===========================================================================================
#  POLÍTICAS DE JERARQUÍA DE MISIÓN RBAC (CAPA 1 - NÚCLEO DE NEGOCIO)
# ===========================================================================================
#  Adaptación del Patrón Estrategia a la cadena de mando aeroespacial:
#  - Comandante Medico: Control total (protegido contra baja del último activo por Trigger).
#  - Oficial Cientifico: Gestiona Especialistas e Insumos, sin alterar Comandantes.
#  - Especialista de Mision: Registra su propia telemetría y consulta protocolos.
# ===========================================================================================

from abc import ABC, abstractmethod
from src.dominio.excepciones import ErrorJerarquiaRBAC


class PoliticaAccesoMision(ABC):
    """Contrato obligatorio para las estrategias de permisos de la tripulación."""
    @abstractmethod
    def validar_creacion(self, rol_destino: str) -> None:
        pass

    @abstractmethod
    def validar_modificacion(self, rol_destino: str, id_destino: int, id_operador: int) -> None:
        pass

    @abstractmethod
    def validar_baja(self, rol_destino: str, id_destino: int, id_operador: int) -> None:
        pass


class EstrategiaComandanteMedico(PoliticaAccesoMision):
    """
    Autoridad médica y operativa máxima a bordo.
    El bloqueo de seguridad para no deshabilitar al último Comandante Médico
    reside en el Trigger 'trg_proteger_ultimo_comandante_medico' de SQLite.
    """
    def validar_creacion(self, rol_destino: str) -> None:
        pass

    def validar_modificacion(self, rol_destino: str, id_destino: int, id_operador: int) -> None:
        pass

    def validar_baja(self, rol_destino: str, id_destino: int, id_operador: int) -> None:
        pass


class EstrategiaOficialCientifico(PoliticaAccesoMision):
    """
    Segundo escalafón de mando. Puede dar de alta y gestionar Especialistas de Misión,
    pero no puede alterar ni dar de baja a un Comandante Médico ni auto-eliminarse.
    """
    def validar_creacion(self, rol_destino: str) -> None:
        if rol_destino in ["Comandante Medico", "Oficial Cientifico"]:
            raise ErrorJerarquiaRBAC("Rango insuficiente para habilitar perfiles de mando médico o científico.")

    def validar_modificacion(self, rol_destino: str, id_destino: int, id_operador: int) -> None:
        if rol_destino == "Comandante Medico" or (rol_destino == "Oficial Cientifico" and id_destino != id_operador):
            raise ErrorJerarquiaRBAC("Rango insuficiente para modificar el legajo de este oficial.")

    def validar_baja(self, rol_destino: str, id_destino: int, id_operador: int) -> None:
        if rol_destino in ["Comandante Medico", "Oficial Cientifico"]:
            if id_destino == id_operador:
                raise ErrorJerarquiaRBAC("Protocolo de seguridad: un Oficial no puede deshabilitar su propio perfil en misión.")
            raise ErrorJerarquiaRBAC("Rango insuficiente para desafectar a un oficial superior o par.")


class EstrategiaEspecialistaMision(PoliticaAccesoMision):
    """
    Rol operativo estándar del astronauta. Puede actualizar únicamente sus propios
    datos personales y registrar su telemetría, pero no gestionar a otros tripulantes.
    """
    def validar_creacion(self, rol_destino: str) -> None:
        raise ErrorJerarquiaRBAC("Acceso denegado: solo el Comandante Médico u Oficial Científico pueden incorporar tripulantes.")

    def validar_modificacion(self, rol_destino: str, id_destino: int, id_operador: int) -> None:
        if id_destino != id_operador:
            raise ErrorJerarquiaRBAC("Un Especialista de Misión solo puede actualizar su propio perfil biométrico.")

    def validar_baja(self, rol_destino: str, id_destino: int, id_operador: int) -> None:
        raise ErrorJerarquiaRBAC("Acceso denegado: un Especialista de Misión no tiene permisos para desafectar tripulantes.")


def obtener_estrategia_rbac(rol_operador: str) -> PoliticaAccesoMision:
    """Fábrica polimórfica de permisos según el rango del tripulante autenticado."""
    estrategias = {
        "Comandante Medico": EstrategiaComandanteMedico(),
        "Oficial Cientifico": EstrategiaOficialCientifico(),
    }
    return estrategias.get(rol_operador, EstrategiaEspecialistaMision())