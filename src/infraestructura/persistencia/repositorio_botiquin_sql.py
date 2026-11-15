# ======================================================================
#  REPOSITORIO SQL DE BOTIQUÍN Y PROTOCOLOS (CAPA 3 - PERSISTENCIA 3FN)
# ======================================================================

import sqlite3
from typing import List, Optional
from src.dominio.entidades import InsumoMedico
from src.dominio.excepciones import ErrorEntidadNoEncontrada
from src.dominio.puertos import PuertoRepositorioBotiquin
from src.infraestructura.persistencia.utilidades_sql import obtener_o_crear


class RepositorioBotiquinSQL(PuertoRepositorioBotiquin):
    def __init__(self, conexion: sqlite3.Connection):
        self.conn = conexion

    @staticmethod
    def _calcular_nombre_estado(stock_actual: float, stock_minimo: float) -> str:
        if stock_actual <= 0:
            return "AGOTADO"
        if stock_actual <= stock_minimo:
            return "STOCK CRITICO"
        return "DISPONIBLE"

    def _mapear_fila(self, fila: sqlite3.Row) -> InsumoMedico:
        return InsumoMedico(
            id=fila["id"],
            codigo=fila["codigo"],
            nombre=fila["nombre"],
            sistema_corporal=fila["sistema_corporal"],
            instrucciones_uso=fila["instrucciones_uso"],
            stock_actual=fila["stock_actual"],
            stock_minimo=fila["stock_minimo"],
            unidad_medida=fila["unidad_medida"],
            modulo_ubicacion=fila["modulo"].title() if fila["modulo"] else "Bahia Medica A",
            vencimiento=fila["vencimiento"],
            habilitado=fila["habilitado"],
        )

    def guardar(self, insumo: InsumoMedico) -> InsumoMedico:
        cursor = self.conn.cursor()
        estado_txt = self._calcular_nombre_estado(insumo.stock_actual, insumo.stock_minimo)
        id_estado = obtener_o_crear(cursor, "estados_insumo", "estado", estado_txt)
        id_modulo = obtener_o_crear(cursor, "modulos_ubicacion", "modulo", insumo.modulo_ubicacion)

        if insumo.id is None:
            cursor.execute(
                """
                INSERT INTO insumos_medicos
                (codigo, nombre, sistema_corporal, instrucciones_uso, stock_actual, stock_minimo, unidad_medida, vencimiento, habilitado)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
                """,
                (
                    insumo.codigo,
                    insumo.nombre,
                    insumo.sistema_corporal,
                    insumo.instrucciones_uso,
                    insumo.stock_actual,
                    insumo.stock_minimo,
                    insumo.unidad_medida,
                    insumo.vencimiento,
                ),
            )
            insumo.id = cursor.lastrowid
        else:
            cursor.execute(
                """
                UPDATE insumos_medicos
                SET codigo = ?, nombre = ?, sistema_corporal = ?, instrucciones_uso = ?,
                    stock_actual = ?, stock_minimo = ?, unidad_medida = ?, vencimiento = ?
                WHERE id = ? AND habilitado = 1
                """,
                (
                    insumo.codigo,
                    insumo.nombre,
                    insumo.sistema_corporal,
                    insumo.instrucciones_uso,
                    insumo.stock_actual,
                    insumo.stock_minimo,
                    insumo.unidad_medida,
                    insumo.vencimiento,
                    insumo.id,
                ),
            )
            cursor.execute("UPDATE insumoxestados SET habilitado = 0 WHERE id_insumo = ?", (insumo.id,))
            cursor.execute("UPDATE insumoxmodulos SET habilitado = 0 WHERE id_insumo = ?", (insumo.id,))

        cursor.execute(
            "INSERT INTO insumoxestados (id_insumo, id_estado, habilitado) VALUES (?, ?, 1)",
            (insumo.id, id_estado),
        )
        cursor.execute(
            "INSERT INTO insumoxmodulos (id_insumo, id_modulo, habilitado) VALUES (?, ?, 1)",
            (insumo.id, id_modulo),
        )
        return insumo

    def obtener_por_id(self, id_insumo: int) -> Optional[InsumoMedico]:
        cursor = self.conn.cursor()
        cursor.execute(
            """
            SELECT i.*, COALESCE(m.modulo, 'Bahia Medica A') AS modulo
            FROM insumos_medicos i
            LEFT JOIN insumoxmodulos im ON i.id = im.id_insumo AND im.habilitado = 1
            LEFT JOIN modulos_ubicacion m ON im.id_modulo = m.id
            WHERE i.id = ? AND i.habilitado = 1
            """,
            (id_insumo,),
        )
        fila = cursor.fetchone()
        return self._mapear_fila(fila) if fila else None

    def listar_todos(self) -> List[InsumoMedico]:
        cursor = self.conn.cursor()
        cursor.execute(
            """
            SELECT i.*, COALESCE(m.modulo, 'Bahia Medica A') AS modulo
            FROM insumos_medicos i
            LEFT JOIN insumoxmodulos im ON i.id = im.id_insumo AND im.habilitado = 1
            LEFT JOIN modulos_ubicacion m ON im.id_modulo = m.id
            WHERE i.habilitado = 1
            ORDER BY i.id ASC
            """
        )
        return [self._mapear_fila(f) for f in cursor.fetchall()]

    def descontar_stock(self, id_insumo: int, cantidad: float) -> None:
        insumo = self.obtener_por_id(id_insumo)
        if not insumo:
            raise ErrorEntidadNoEncontrada(f"Insumo médico ID {id_insumo} no encontrado en el botiquín.")
        insumo.stock_actual = round(insumo.stock_actual - cantidad, 2)
        self.guardar(insumo)