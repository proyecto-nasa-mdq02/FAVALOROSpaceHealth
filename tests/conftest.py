import sqlite3
from pathlib import Path
import pytest
from src.infraestructura.persistencia.gestor_sqlite import GestorSQLite


@pytest.fixture
def conexion_sqlite_memoria():
    """Inicializa el esquema relacional completo de ASTRO_MED_HUD en memoria RAM (:memory:)."""
    conn = sqlite3.connect(":memory:", check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")

    ruta_esquema = Path(__file__).resolve().parent.parent / "db" / "esquema.sql"
    script_sql = ruta_esquema.read_text(encoding="utf-8")
    conn.executescript(script_sql)
    yield conn
    conn.close()


@pytest.fixture
def uow_memoria(conexion_sqlite_memoria):
    return GestorSQLite(conexion_sqlite_memoria)
