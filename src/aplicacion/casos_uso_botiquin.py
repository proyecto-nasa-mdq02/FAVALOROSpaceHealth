# ============================================================================
#  CASOS DE USO: BOTIQUÍN MÉDICO Y PROTOCOLOS DE MISIÓN (CAPA 2 - APLICACIÓN)
# ============================================================================

from typing import List, Dict, Any
from src.dominio.entidades import InsumoMedico
from src.dominio.excepciones import ErrorEntidadNoEncontrada, ErrorJerarquiaRBAC
from src.infraestructura.persistencia.gestor_sqlite import GestorSQLite


class ServicioBotiquin:
    def __init__(self, uow: GestorSQLite):
        self.uow = uow

    def registrar_insumo(self, id_operador: int, datos: Dict[str, Any]) -> InsumoMedico:
        with self.uow:
            operador = self.uow.tripulantes.obtener_por_id(id_operador)
            if not operador:
                raise ErrorEntidadNoEncontrada("Operador no encontrado.")
            if operador.rol not in ["Comandante Medico", "Oficial Cientifico"]:
                raise ErrorJerarquiaRBAC("Solo oficiales médicos o científicos pueden catalogar insumos en el botiquín.")

            insumo = InsumoMedico(
                codigo=datos["codigo"],
                nombre=datos["nombre"],
                sistema_corporal=datos["sistema_corporal"],
                instrucciones_uso=datos["instrucciones_uso"],
                stock_actual=float(datos["stock_actual"]),
                stock_minimo=float(datos.get("stock_minimo", 2.0)),
                unidad_medida=datos.get("unidad_medida", "Unidades"),
                modulo_ubicacion=datos.get("modulo_ubicacion", "Bahia Medica A"),
                vencimiento=datos.get("vencimiento", "S/D"),
            )
            return self.uow.botiquin.guardar(insumo)

    def listar_insumos(self) -> List[InsumoMedico]:
        with self.uow:
            return self.uow.botiquin.listar_todos()