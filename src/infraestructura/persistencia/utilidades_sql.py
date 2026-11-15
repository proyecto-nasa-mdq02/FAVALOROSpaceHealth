# ========================================================================================
#  UTILIDADES SQL TRANSVERSALES (CAPA 3 - PERSISTENCIA 3FN)
# ========================================================================================
#  Aplica SRP aislando la resolución de catálogos satélites (Roles, Entornos, Módulos,
#  Especialidades y Estados) y normalizando a UPPERCASE para evitar duplicados por tipeo.
# ========================================================================================

import sqlite3


def obtener_o_crear(
    cursor: sqlite3.Cursor,
    tabla: str,
    columna: str,
    valor: str,
) -> int:
    """
    Busca un valor normalizado en mayúsculas en un catálogo maestro;
    si no existe, lo inserta y retorna su ID primario.
    """
    valor_limpio = str(valor).strip().upper()
    query_buscar = f"SELECT id FROM {tabla} WHERE UPPER({columna}) = ? AND habilitado = 1"
    cursor.execute(query_buscar, (valor_limpio,))
    fila = cursor.fetchone()

    if fila:
        return fila[0]

    query_insertar = f"INSERT INTO {tabla} ({columna}, habilitado) VALUES (?, 1)"
    cursor.execute(query_insertar, (valor_limpio,))
    return cursor.lastrowid