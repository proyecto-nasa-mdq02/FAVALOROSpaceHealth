# ================================================================
#  UNIDAD DE TRABAJO ACID (UNIT OF WORK - CAPA 3 INFRAESTRUCTURA)
# ================================================================

import sqlite3
from typing import Optional, Union
from src.infraestructura.persistencia.repositorio_tripulantes_sql import RepositorioTripulantesSQL
from src.infraestructura.persistencia.repositorio_botiquin_sql import RepositorioBotiquinSQL
from src.infraestructura.persistencia.repositorio_telemetria_sql import RepositorioTelemetriaSQL


class GestorSQLite:
    """
    Administrador de Contexto transaccional (__enter__ / __exit__).
    Soporta tanto una ruta de archivo ('db/astro_med.db') como una conexión en memoria (:memory:)
    para ejecución ultrarrápida en suites de prueba Pytest.
    """

    def __init__(self, origen_bd: Union[str, sqlite3.Connection] = "db/astro_med.db"):
        self._origen = origen_bd
        self._es_conexion_externa = isinstance(origen_bd, sqlite3.Connection)
        self.conn: Optional[sqlite3.Connection] = None
        self.tripulantes: Optional[RepositorioTripulantesSQL] = None
        self.botiquin: Optional[RepositorioBotiquinSQL] = None
        self.telemetria: Optional[RepositorioTelemetriaSQL] = None

    def __enter__(self):
        if self._es_conexion_externa:
            self.conn = self._origen
        else:
            self.conn = sqlite3.connect(self._origen, check_same_thread=False)

        self.conn.row_factory = sqlite3.Row
        self.conn.execute("PRAGMA foreign_keys = ON;")

        self.tripulantes = RepositorioTripulantesSQL(self.conn)
        self.botiquin = RepositorioBotiquinSQL(self.conn)
        self.telemetria = RepositorioTelemetriaSQL(self.conn)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.conn:
            if exc_type is not None:
                self.conn.rollback()
            else:
                self.conn.commit()

            if not self._es_conexion_externa:
                self.conn.close()
        return False