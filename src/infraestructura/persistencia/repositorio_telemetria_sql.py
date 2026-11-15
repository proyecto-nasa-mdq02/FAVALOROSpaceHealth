# ====================================================================================
#  REPOSITORIO SQL DE TELEMETRÍA Y SERIES TEMPORALES (CAPA 3 - PERSISTENCIA + PANDAS)
# ====================================================================================

import sqlite3
from typing import List, Dict, Any
import pandas as pd
from src.dominio.entidades import LecturaBiometrica
from src.dominio.puertos import PuertoRepositorioTelemetria
from src.infraestructura.persistencia.utilidades_sql import obtener_o_crear


class RepositorioTelemetriaSQL(PuertoRepositorioTelemetria):
    def __init__(self, conexion: sqlite3.Connection):
        self.conn = conexion

    @staticmethod
    def _normalizar_entorno(entorno_bd: str) -> str:
        mapa = {
            "TRANSITO ESPACIAL (0G)": "Transito Espacial (0G)",
            "ESTACION ESPACIAL": "Estacion Espacial",
            "ROVER EXPLORADOR": "Rover Explorador",
            "BASE PLANETARIA": "Base Planetaria",
        }
        return mapa.get(str(entorno_bd).strip().upper(), "Transito Espacial (0G)")

    def _mapear_fila(self, fila: sqlite3.Row) -> LecturaBiometrica:
        return LecturaBiometrica(
            id=fila["id"],
            fecha=fila["fecha"],
            id_tripulante=fila["id_tripulante"],
            entorno=self._normalizar_entorno(fila["entorno"]),
            presion_sistolica=fila["presion_sistolica"],
            presion_diastolica=fila["presion_diastolica"],
            frecuencia_cardiaca=fila["frecuencia_cardiaca"],
            glucosa_mg_dl=fila["glucosa_mg_dl"],
            temperatura_c=fila["temperatura_c"],
            horas_sueno=fila["horas_sueno"],
            estado_animo=fila["estado_animo"],
            radiacion_msv=fila["radiacion_msv"],
            minutos_ejercicio=fila["minutos_ejercicio"],
            presion_media=fila["presion_media"],
            nivel_alerta=fila["nivel_alerta"],
            sistema_afectado=fila["sistema_afectado"],
            diagnostico_resumen=fila["diagnostico_resumen"],
            instruccion_accion=fila["instruccion_accion"],
            id_insumo_aplicado=fila["id_insumo_aplicado"],
            cantidad_insumo=fila["cantidad_insumo"],
            evidencia_adjunta=fila["evidencia_adjunta"],
            habilitado=fila["habilitado"],
        )

    def registrar_lectura(self, lectura: LecturaBiometrica) -> LecturaBiometrica:
        cursor = self.conn.cursor()
        id_entorno = obtener_o_crear(cursor, "entornos_mision", "entorno", lectura.entorno)

        cursor.execute(
            """
            INSERT INTO lecturas_biometricas (
                id_tripulante, id_entorno, presion_sistolica, presion_diastolica,
                frecuencia_cardiaca, glucosa_mg_dl, temperatura_c, horas_sueno,
                estado_animo, radiacion_msv, minutos_ejercicio, nivel_alerta,
                sistema_afectado, diagnostico_resumen, instruccion_accion,
                id_insumo_aplicado, cantidad_insumo, evidencia_adjunta, habilitado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
            """,
            (
                lectura.id_tripulante,
                id_entorno,
                lectura.presion_sistolica,
                lectura.presion_diastolica,
                lectura.frecuencia_cardiaca,
                lectura.glucosa_mg_dl,
                lectura.temperatura_c,
                lectura.horas_sueno,
                lectura.estado_animo,
                lectura.radiacion_msv,
                lectura.minutos_ejercicio,
                lectura.nivel_alerta,
                lectura.sistema_afectado,
                lectura.diagnostico_resumen,
                lectura.instruccion_accion,
                lectura.id_insumo_aplicado,
                lectura.cantidad_insumo,
                lectura.evidencia_adjunta,
            ),
        )
        id_nuevo = cursor.lastrowid
        cursor.execute(
            """
            SELECT l.*, e.entorno
            FROM lecturas_biometricas l
            JOIN entornos_mision e ON l.id_entorno = e.id
            WHERE l.id = ?
            """,
            (id_nuevo,),
        )
        return self._mapear_fila(cursor.fetchone())

    def listar_por_tripulante(self, id_tripulante: int, limite: int = 30) -> List[LecturaBiometrica]:
        cursor = self.conn.cursor()
        cursor.execute(
            """
            SELECT l.*, e.entorno
            FROM lecturas_biometricas l
            JOIN entornos_mision e ON l.id_entorno = e.id
            WHERE l.id_tripulante = ? AND l.habilitado = 1
            ORDER BY l.id DESC
            LIMIT ?
            """,
            (id_tripulante, limite),
        )
        return [self._mapear_fila(f) for f in cursor.fetchall()]

    def listar_todas(self) -> List[LecturaBiometrica]:
        cursor = self.conn.cursor()
        cursor.execute(
            """
            SELECT l.*, e.entorno
            FROM lecturas_biometricas l
            JOIN entornos_mision e ON l.id_entorno = e.id
            WHERE l.habilitado = 1
            ORDER BY l.id DESC
            """
        )
        return [self._mapear_fila(f) for f in cursor.fetchall()]

    def obtener_analitica_tripulante(self, id_tripulante: int) -> Dict[str, Any]:
        """Procesamiento vectorial con Pandas para alimentar los gráficos dinámicos (Tarjeta 6 Trello)."""
        query = """
            SELECT fecha, presion_sistolica, presion_diastolica, presion_media,
                   frecuencia_cardiaca, glucosa_mg_dl, temperatura_c,
                   horas_sueno, estado_animo, radiacion_msv, minutos_ejercicio, nivel_alerta
            FROM lecturas_biometricas
            WHERE id_tripulante = ? AND habilitado = 1
            ORDER BY id ASC
        """
        df = pd.read_sql_query(query, self.conn, params=(id_tripulante,))
        if df.empty:
            return {
                "total_lecturas": 0,
                "series": {},
                "promedios": {},
                "distribucion_alertas": {"NOMINAL": 0, "PRECAUCION": 0, "CRITICO": 0},
            }

        conteo_alertas = df["nivel_alerta"].value_counts().to_dict()
        return {
            "total_lecturas": int(len(df)),
            "promedios": {
                "frecuencia_cardiaca": round(float(df["frecuencia_cardiaca"].mean()), 1),
                "glucosa_mg_dl": round(float(df["glucosa_mg_dl"].mean()), 1),
                "horas_sueno": round(float(df["horas_sueno"].mean()), 1),
                "presion_media": round(float(df["presion_media"].mean()), 1),
                "radiacion_acumulada_msv": round(float(df["radiacion_msv"].sum()), 2),
            },
            "distribucion_alertas": {
                "NOMINAL": int(conteo_alertas.get("NOMINAL", 0)),
                "PRECAUCION": int(conteo_alertas.get("PRECAUCION", 0)),
                "CRITICO": int(conteo_alertas.get("CRITICO", 0)),
            },
            "series": {
                "fechas": df["fecha"].astype(str).tolist()[-15:],
                "frecuencia_cardiaca": df["frecuencia_cardiaca"].tolist()[-15:],
                "presion_sistolica": df["presion_sistolica"].tolist()[-15:],
                "presion_diastolica": df["presion_diastolica"].tolist()[-15:],
                "glucosa_mg_dl": df["glucosa_mg_dl"].tolist()[-15:],
                "horas_sueno": df["horas_sueno"].tolist()[-15:],
                "estado_animo": df["estado_animo"].tolist()[-15:],
            },
        }