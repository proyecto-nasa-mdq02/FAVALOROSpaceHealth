# ===============================================================================
#  CASOS DE USO: TELEMETRÍA BIOMÉTRICA, TRIAGE Y ANALÍTICA (CAPA 2 - APLICACIÓN)
# ===============================================================================

from typing import Dict, Any, List
from src.dominio.entidades import LecturaBiometrica
from src.dominio.excepciones import ErrorEntidadNoEncontrada, ErrorInsumoInsuficiente
from src.dominio.evaluador_riesgo_espacial import obtener_estrategia_entorno
from src.infraestructura.persistencia.gestor_sqlite import GestorSQLite


class ServicioTelemetria:
    def __init__(self, uow: GestorSQLite):
        self.uow = uow

    def registrar_evaluacion_salud(self, datos: Dict[str, Any]) -> Dict[str, Any]:
        """
        Orquesta en una única transacción ACID:
        1. Validación y diagnóstico autónomo según el entorno espacial.
        2. Descuento atómico de stock del botiquín si se aplicó una contramedida.
        3. Persistencia de la lectura biométrica y actualización de la racha de autocuidado.
        """
        with self.uow:
            tripulante = self.uow.tripulantes.obtener_por_id(datos["id_tripulante"])
            if not tripulante:
                raise ErrorEntidadNoEncontrada("El tripulante especificado no existe o no está activo.")

            lectura = LecturaBiometrica(
                id_tripulante=datos["id_tripulante"],
                entorno=datos.get("entorno", "Transito Espacial (0G)"),
                presion_sistolica=int(datos["presion_sistolica"]),
                presion_diastolica=int(datos["presion_diastolica"]),
                frecuencia_cardiaca=int(datos["frecuencia_cardiaca"]),
                glucosa_mg_dl=float(datos["glucosa_mg_dl"]),
                temperatura_c=float(datos["temperatura_c"]),
                horas_sueno=float(datos["horas_sueno"]),
                estado_animo=int(datos["estado_animo"]),
                radiacion_msv=float(datos.get("radiacion_msv", 0.0)),
                minutos_ejercicio=int(datos.get("minutos_ejercicio", 0)),
                id_insumo_aplicado=datos.get("id_insumo_aplicado"),
                cantidad_insumo=float(datos.get("cantidad_insumo", 0.0)),
                evidencia_adjunta=datos.get("evidencia_adjunta", "S/D"),
            )

            # 1. Evaluación mediante el Patrón Estrategia Ambiental.
            estrategia_entorno = obtener_estrategia_entorno(lectura.entorno)
            diagnostico = estrategia_entorno.evaluar(lectura)

            lectura.nivel_alerta = diagnostico.nivel_alerta_global
            lectura.sistema_afectado = diagnostico.sistema_afectado_principal
            lectura.diagnostico_resumen = diagnostico.resumen_clinico
            lectura.instruccion_accion = diagnostico.instruccion_paso_a_paso

            # 2. Control atómico de Botiquín si se aplicó un insumo médico.
            if lectura.id_insumo_aplicado and lectura.cantidad_insumo > 0:
                insumo = self.uow.botiquin.obtener_por_id(lectura.id_insumo_aplicado)
                if not insumo:
                    raise ErrorEntidadNoEncontrada("El insumo médico indicado no existe.")
                if not insumo.hay_stock_disponible(lectura.cantidad_insumo):
                    raise ErrorInsumoInsuficiente(
                        f"Stock insuficiente en botiquín para '{insumo.nombre}'. "
                        f"Disponible: {insumo.stock_actual}, Requerido: {lectura.cantidad_insumo}."
                    )
                self.uow.botiquin.descontar_stock(insumo.id, lectura.cantidad_insumo)

            # 3. Persistencia y Gamificación (incremento de racha de monitoreo).
            lectura_guardada = self.uow.telemetria.registrar_lectura(lectura)
            nueva_racha = self.uow.tripulantes.incrementar_racha(tripulante.id)

            return {
                "lectura": lectura_guardada,
                "diagnostico": diagnostico,
                "racha_actualizada": nueva_racha,
            }

    def listar_historial_tripulante(self, id_tripulante: int, limite: int = 30) -> List[LecturaBiometrica]:
        with self.uow:
            return self.uow.telemetria.listar_por_tripulante(id_tripulante, limite)

    def listar_toda_telemetria(self) -> List[LecturaBiometrica]:
        with self.uow:
            return self.uow.telemetria.listar_todas()

    def obtener_tablero_bi(self, id_tripulante: int) -> Dict[str, Any]:
        with self.uow:
            return self.uow.telemetria.obtener_analitica_tripulante(id_tripulante)