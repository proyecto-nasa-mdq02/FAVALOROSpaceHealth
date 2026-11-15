# ============================================================
#  REPOSITORIO SQL DE TRIPULACIÓN (CAPA 3 - PERSISTENCIA 3FN)
# ============================================================

import sqlite3
from typing import List, Optional
from src.dominio.entidades import Tripulante
from src.dominio.excepciones import ErrorEntidadNoEncontrada
from src.dominio.puertos import PuertoRepositorioTripulantes
from src.infraestructura.persistencia.utilidades_sql import obtener_o_crear


class RepositorioTripulantesSQL(PuertoRepositorioTripulantes):
    def __init__(self, conexion: sqlite3.Connection):
        self.conn = conexion

    @staticmethod
    def _normalizar_rol(rol_bd: str) -> str:
        """Armoniza el almacenamiento UPPERCASE de SQLite con los roles canónicos del Dominio."""
        mapa = {
            "COMANDANTE MEDICO": "Comandante Medico",
            "OFICIAL CIENTIFICO": "Oficial Cientifico",
            "ESPECIALISTA DE MISION": "Especialista de Mision",
        }
        return mapa.get(str(rol_bd).strip().upper(), "Especialista de Mision")

    @staticmethod
    def _normalizar_especialidad(esp_bd: Optional[str]) -> str:
        if not esp_bd:
            return "General"
        return str(esp_bd).strip().title()

    def _mapear_fila(self, fila: sqlite3.Row) -> Tripulante:
        return Tripulante(
            id=fila["id"],
            usuario=fila["usuario"],
            nombres=fila["nombres"],
            apellidos=fila["apellidos"],
            codigo_astronauta=fila["codigo_astronauta"],
            racha_autocuidado=fila["racha_autocuidado"],
            rol=self._normalizar_rol(fila["rol"]),
            especialidad=self._normalizar_especialidad(fila["especialidad"]),
            habilitado=fila["habilitado"],
        )

    def guardar(self, tripulante: Tripulante) -> Tripulante:
        cursor = self.conn.cursor()
        id_rol = obtener_o_crear(cursor, "roles", "rol", tripulante.rol)
        id_esp = obtener_o_crear(cursor, "especialidades", "especialidad", tripulante.especialidad)

        if tripulante.id is None:
            cursor.execute(
                """
                INSERT INTO tripulantes (usuario, nombres, apellidos, codigo_astronauta, racha_autocuidado, habilitado)
                VALUES (?, ?, ?, ?, ?, 1)
                """,
                (
                    tripulante.usuario,
                    tripulante.nombres,
                    tripulante.apellidos,
                    tripulante.codigo_astronauta,
                    tripulante.racha_autocuidado,
                ),
            )
            tripulante.id = cursor.lastrowid
        else:
            cursor.execute(
                """
                UPDATE tripulantes
                SET usuario = ?, nombres = ?, apellidos = ?, codigo_astronauta = ?
                WHERE id = ? AND habilitado = 1
                """,
                (
                    tripulante.usuario,
                    tripulante.nombres,
                    tripulante.apellidos,
                    tripulante.codigo_astronauta,
                    tripulante.id,
                ),
            )
            cursor.execute("UPDATE tripulantexroles SET habilitado = 0 WHERE id_tripulante = ?", (tripulante.id,))
            cursor.execute("UPDATE tripulantexespecialidades SET habilitado = 0 WHERE id_tripulante = ?", (tripulante.id,))

        cursor.execute(
            "INSERT INTO tripulantexroles (id_tripulante, id_rol, habilitado) VALUES (?, ?, 1)",
            (tripulante.id, id_rol),
        )
        cursor.execute(
            "INSERT INTO tripulantexespecialidades (id_tripulante, id_especialidad, habilitado) VALUES (?, ?, 1)",
            (tripulante.id, id_esp),
        )
        tripulante.rol = self._normalizar_rol(tripulante.rol)
        return tripulante

    def obtener_por_id(self, id_tripulante: int) -> Optional[Tripulante]:
        cursor = self.conn.cursor()
        cursor.execute(
            """
            SELECT t.*, r.rol, COALESCE(e.especialidad, 'General') AS especialidad
            FROM tripulantes t
            JOIN tripulantexroles tr ON t.id = tr.id_tripulante AND tr.habilitado = 1
            JOIN roles r ON tr.id_rol = r.id
            LEFT JOIN tripulantexespecialidades te ON t.id = te.id_tripulante AND te.habilitado = 1
            LEFT JOIN especialidades e ON te.id_especialidad = e.id
            WHERE t.id = ? AND t.habilitado = 1
            """,
            (id_tripulante,),
        )
        fila = cursor.fetchone()
        return self._mapear_fila(fila) if fila else None

    def obtener_por_usuario(self, nombre_usuario: str) -> Optional[Tripulante]:
        cursor = self.conn.cursor()
        cursor.execute(
            """
            SELECT t.*, r.rol, COALESCE(e.especialidad, 'General') AS especialidad
            FROM tripulantes t
            JOIN tripulantexroles tr ON t.id = tr.id_tripulante AND tr.habilitado = 1
            JOIN roles r ON tr.id_rol = r.id
            LEFT JOIN tripulantexespecialidades te ON t.id = te.id_tripulante AND te.habilitado = 1
            LEFT JOIN especialidades e ON te.id_especialidad = e.id
            WHERE t.usuario = ? AND t.habilitado = 1
            """,
            (nombre_usuario,),
        )
        fila = cursor.fetchone()
        return self._mapear_fila(fila) if fila else None

    def listar_todos(self) -> List[Tripulante]:
        cursor = self.conn.cursor()
        cursor.execute(
            """
            SELECT t.*, r.rol, COALESCE(e.especialidad, 'General') AS especialidad
            FROM tripulantes t
            JOIN tripulantexroles tr ON t.id = tr.id_tripulante AND tr.habilitado = 1
            JOIN roles r ON tr.id_rol = r.id
            LEFT JOIN tripulantexespecialidades te ON t.id = te.id_tripulante AND te.habilitado = 1
            LEFT JOIN especialidades e ON te.id_especialidad = e.id
            WHERE t.habilitado = 1
            ORDER BY t.id ASC
            """
        )
        return [self._mapear_fila(f) for f in cursor.fetchall()]

    def incrementar_racha(self, id_tripulante: int) -> int:
        cursor = self.conn.cursor()
        cursor.execute(
            "UPDATE tripulantes SET racha_autocuidado = racha_autocuidado + 1 WHERE id = ? AND habilitado = 1",
            (id_tripulante,),
        )
        cursor.execute("SELECT racha_autocuidado FROM tripulantes WHERE id = ?", (id_tripulante,))
        fila = cursor.fetchone()
        if not fila:
            raise ErrorEntidadNoEncontrada(f"Tripulante ID {id_tripulante} no encontrado.")
        return fila[0]

    def eliminar_logico(self, id_tripulante: int) -> None:
        cursor = self.conn.cursor()
        cursor.execute("UPDATE tripulantes SET habilitado = 0 WHERE id = ?", (id_tripulante,))
        if cursor.rowcount == 0:
            raise ErrorEntidadNoEncontrada(f"Tripulante ID {id_tripulante} no encontrado.")