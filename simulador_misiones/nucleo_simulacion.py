# ===================================================================
#  NÚCLEO COMÚN DE SIMULACIÓN DE MISIONES ESPACIALES (PRINCIPIO DRY)
# ===================================================================

import sqlite3
from pathlib import Path
from typing import List, Tuple, Union
from src.infraestructura.persistencia.gestor_sqlite import GestorSQLite
from src.aplicacion.casos_uso_tripulacion import ServicioTripulacion
from src.aplicacion.casos_uso_botiquin import ServicioBotiquin
from src.aplicacion.casos_uso_telemetria import ServicioTelemetria
from src.dominio.entidades import Tripulante

RAIZ_PROYECTO = Path(__file__).resolve().parent.parent
RUTA_BD_POR_DEFECTO = str(RAIZ_PROYECTO / "db" / "astro_med.db")


def preparar_base_tripulacion_y_botiquin(
    ruta_bd: Union[str, sqlite3.Connection] = RUTA_BD_POR_DEFECTO,
    forzar_reinicio: bool = False,
) -> Tuple[GestorSQLite, ServicioTelemetria, List[int]]:
    """
    Inicializa el esquema SQLite, limpia las lecturas previas si se conmuta de misión,
    y garantiza que los 7 tripulantes del equipo y los 4 insumos del botiquín estén cargados.
    """
    if isinstance(ruta_bd, str):
        ruta_archivo = Path(ruta_bd)
        if not ruta_archivo.is_absolute():
            ruta_archivo = RAIZ_PROYECTO / ruta_archivo
        ruta_archivo.parent.mkdir(parents=True, exist_ok=True)
        uow = GestorSQLite(str(ruta_archivo))
    else:
        uow = GestorSQLite(ruta_bd)

    ruta_esquema = RAIZ_PROYECTO / "db" / "esquema.sql"
    script_sql = ruta_esquema.read_text(encoding="utf-8")

    srv_trip = ServicioTripulacion(uow)
    srv_bot = ServicioBotiquin(uow)
    srv_tel = ServicioTelemetria(uow)

    with uow:
        uow.conn.executescript(script_sql)
        columnas_tripulantes = {
            fila["name"] for fila in uow.conn.execute("PRAGMA table_info(tripulantes)")
        }
        if "password" in columnas_tripulantes:
            uow.conn.execute("ALTER TABLE tripulantes DROP COLUMN password")
        # Garantiza en cualquier escenario que AST-001 / admin tenga el nombre actualizado.
        uow.conn.execute(
            """
            UPDATE tripulantes
            SET nombres = 'Alicia', apellidos = 'López'
            WHERE usuario = 'admin' OR codigo_astronauta = 'AST-001';
            """
        )
        existentes = uow.tripulantes.listar_todos()

        # Caso 1: La base ya tiene a los 7 tripulantes y es un arranque normal sin reinicio.
        if len(existentes) >= 7 and not forzar_reinicio:
            return uow, srv_tel, []

        # Caso 2: Cambio de misión en caliente con los 7 tripulantes ya registrados.
        if len(existentes) >= 7 and forzar_reinicio:
            uow.conn.execute("DROP TRIGGER IF EXISTS trg_bloquear_delete_lecturas;")
            uow.conn.execute("DELETE FROM lecturas_biometricas;")
            uow.conn.execute("UPDATE tripulantes SET racha_autocuidado = 0;")
            uow.conn.executescript(script_sql)
            return uow, srv_tel, [t.id for t in existentes]

        # Caso 3: Base vieja o incompleta (< 7 tripulantes); se limpia por completo para regenerar.
        if 0 < len(existentes) < 7:
            uow.conn.executescript(
                """
                PRAGMA foreign_keys = OFF;
                DROP TRIGGER IF EXISTS trg_proteger_ultimo_comandante_medico;
                DROP TRIGGER IF EXISTS trg_bloquear_delete_tripulantes;
                DROP TRIGGER IF EXISTS trg_bloquear_delete_lecturas;
                DROP TRIGGER IF EXISTS trg_bloquear_delete_insumos;
                DELETE FROM lecturas_biometricas;
                DELETE FROM insumoxestados;
                DELETE FROM insumoxmodulos;
                DELETE FROM insumos_medicos;
                DELETE FROM tripulantexroles;
                DELETE FROM tripulantexespecialidades;
                DELETE FROM tripulantes;
                DELETE FROM sqlite_sequence;
                PRAGMA foreign_keys = ON;
                """
            )
            uow.conn.executescript(script_sql)

        # 1. Comandante Médico inicial.
        cmd = uow.tripulantes.guardar(
            Tripulante(
                usuario="admin",
                nombres="Alicia",
                apellidos="López",
                codigo_astronauta="AST-001",
                rol="Comandante Medico",
                especialidad="Medicina Aeroespacial",
                racha_autocuidado=0,
            )
        )

    # 2. Resto de la tripulación de misión (Equipo completo de 7 integrantes).
    tripulantes_extra = [
        {
            "usuario": "oficial_santamaria",
            "nombres": "Marcos",
            "apellidos": "Santamaría",
            "codigo_astronauta": "AST-002",
            "rol": "Oficial Cientifico",
            "especialidad": "Astrobiología y Dosimetría",
            "racha_autocuidado": 0,
        },
        {
            "usuario": "esp_saavedra",
            "nombres": "Jazmín",
            "apellidos": "Saavedra",
            "codigo_astronauta": "AST-003",
            "rol": "Especialista de Mision",
            "especialidad": "Ingeniería de Rover y EVA",
            "racha_autocuidado": 0,
        },
        {
            "usuario": "esp_bravo",
            "nombres": "David",
            "apellidos": "Bravo",
            "codigo_astronauta": "AST-004",
            "rol": "Especialista de Mision",
            "especialidad": "Sistemas de Soporte Vital",
            "racha_autocuidado": 0,
        },
        {
            "usuario": "esp_baiz",
            "nombres": "Zoe",
            "apellidos": "Baiz",
            "codigo_astronauta": "AST-005",
            "rol": "Oficial Cientifico",
            "especialidad": "Neurociencia y Factores Humanos",
            "racha_autocuidado": 0,
        },
        {
            "usuario": "esp_garcia",
            "nombres": "David",
            "apellidos": "García",
            "codigo_astronauta": "AST-006",
            "rol": "Especialista de Mision",
            "especialidad": "Telecomunicaciones y Navegación",
            "racha_autocuidado": 0,
        },
        {
            "usuario": "esp_jauregui",
            "nombres": "Iván",
            "apellidos": "Jauregui",
            "codigo_astronauta": "AST-007",
            "rol": "Especialista de Mision",
            "especialidad": "Robótica y Mantenimiento de Módulos",
            "racha_autocuidado": 0,
        },
    ]

    ids_tripulacion = [cmd.id]
    for datos_t in tripulantes_extra:
        creado = srv_trip.registrar_tripulante(cmd.id, datos_t)
        ids_tripulacion.append(creado.id)

    # 3. Botiquín y Protocolos Guiados.
    insumos_base = [
        {
            "codigo": "MED-GLU-01",
            "nombre": "Gel de Glucosa Oral Rápida (15g)",
            "sistema_corporal": "METABOLICO_INMUNE",
            "instrucciones_uso": "Si glucosa < 70 mg/dL: abrir sobre, ingerir completo sin diluir y repetir medición capilar a los 15 min.",
            "stock_actual": 30.0,
            "stock_minimo": 5.0,
            "unidad_medida": "Sobres",
            "modulo_ubicacion": "Bahia Medica A",
            "vencimiento": "2028-12",
        },
        {
            "codigo": "MED-RAD-02",
            "nombre": "Kit Radioprotector + Electrolitos",
            "sistema_corporal": "CARDIO_RAD",
            "instrucciones_uso": "Ante alerta de radiación > 1.5 mSv: disolver 1 sobre en 500ml de agua y permanecer en refugio blindado.",
            "stock_actual": 25.0,
            "stock_minimo": 4.0,
            "unidad_medida": "Dosis",
            "modulo_ubicacion": "Refugio Tormenta Solar",
            "vencimiento": "2029-06",
        },
        {
            "codigo": "MED-NEU-03",
            "nombre": "Melatonina Circadiana + Guía Mindfulness",
            "sistema_corporal": "NEURO_PSICO",
            "instrucciones_uso": "Si sueño < 6h por 2 días: tomar 1 comp. 30 min antes del ciclo nocturno y atenuar luces azules del módulo.",
            "stock_actual": 45.0,
            "stock_minimo": 8.0,
            "unidad_medida": "Comprimidos",
            "modulo_ubicacion": "Camarotes Tripulacion",
            "vencimiento": "2028-08",
        },
        {
            "codigo": "MED-MUS-04",
            "nombre": "Suplemento Osteo-Calcio + Vitamina D3",
            "sistema_corporal": "MUSCULO_ESQUELETICO",
            "instrucciones_uso": "En microgravedad (0G): ingerir 1 cápsula diaria tras completar los 60 min en máquina de resistencia ARED.",
            "stock_actual": 60.0,
            "stock_minimo": 10.0,
            "unidad_medida": "Cápsulas",
            "modulo_ubicacion": "Gimnasio Cero-G",
            "vencimiento": "2029-01",
        },
    ]

    for ins in insumos_base:
        srv_bot.registrar_insumo(cmd.id, ins)

    return uow, srv_tel, ids_tripulacion