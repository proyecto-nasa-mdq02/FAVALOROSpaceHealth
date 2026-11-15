# ==============================================================================
#  ENRUTADOR HTTP: TELEMETRÍA, BOTIQUÍN, SIMULADOR Y CONSOLA SQL (CAPA 3 - API)
# ==============================================================================

from dataclasses import asdict
from fastapi import APIRouter, Depends, HTTPException, status
from src.aplicacion.casos_uso_botiquin import ServicioBotiquin
from src.aplicacion.casos_uso_telemetria import ServicioTelemetria
from src.infraestructura.api.esquemas_validacion import (
    PeticionCrearInsumo,
    PeticionRegistrarTelemetria,
    PeticionSimularCrisis,
    PeticionCambiarMision,
    PeticionConsultaSQL,
)
from src.infraestructura.api.inyector_dependencias import (
    obtener_servicio_botiquin,
    obtener_servicio_telemetria,
    obtener_id_operador,
)

router = APIRouter(prefix="/api", tags=["Telemetría, Botiquín y Analítica"])


@router.get("/botiquin", status_code=status.HTTP_200_OK)
def listar_botiquin(
    servicio: ServicioBotiquin = Depends(obtener_servicio_botiquin),
):
    return [asdict(i) for i in servicio.listar_insumos()]


@router.post("/botiquin", status_code=status.HTTP_201_CREATED)
def registrar_insumo_botiquin(
    payload: PeticionCrearInsumo,
    id_operador: int = Depends(obtener_id_operador),
    servicio: ServicioBotiquin = Depends(obtener_servicio_botiquin),
):
    insumo = servicio.registrar_insumo(id_operador, payload.model_dump())
    return asdict(insumo)


@router.get("/telemetria", status_code=status.HTTP_200_OK)
def listar_toda_telemetria(
    servicio: ServicioTelemetria = Depends(obtener_servicio_telemetria),
):
    return [asdict(l) for l in servicio.listar_toda_telemetria()]


@router.get("/telemetria/tripulante/{id_tripulante}", status_code=status.HTTP_200_OK)
def listar_telemetria_tripulante(
    id_tripulante: int,
    limite: int = 30,
    servicio: ServicioTelemetria = Depends(obtener_servicio_telemetria),
):
    return [asdict(l) for l in servicio.listar_historial_tripulante(id_tripulante, limite)]


@router.post("/telemetria", status_code=status.HTTP_201_CREATED)
def registrar_chequeo_biometrico(
    payload: PeticionRegistrarTelemetria,
    servicio: ServicioTelemetria = Depends(obtener_servicio_telemetria),
):
    resultado = servicio.registrar_evaluacion_salud(payload.model_dump())
    return {
        "lectura": asdict(resultado["lectura"]),
        "diagnostico": asdict(resultado["diagnostico"]),
        "racha_actualizada": resultado["racha_actualizada"],
    }


@router.post("/telemetria/simular-crisis", status_code=status.HTTP_201_CREATED)
def simular_anomalia_mision(
    payload: PeticionSimularCrisis,
    servicio: ServicioTelemetria = Depends(obtener_servicio_telemetria),
):
    """
    Inyecta escenarios de crisis basados en los 5 Peligros de la NASA
    y dispara el protocolo de triage autónomo.
    """
    escenarios = {
        "TORMENTA_SOLAR": {
            "entorno": "Transito Espacial (0G)",
            "presion_sistolica": 158,
            "presion_diastolica": 98,
            "frecuencia_cardiaca": 124,
            "glucosa_mg_dl": 105.0,
            "temperatura_c": 37.2,
            "horas_sueno": 6.5,
            "estado_animo": 3,
            "radiacion_msv": 3.4,
            "minutos_ejercicio": 45,
            "evidencia_adjunta": "dosimetria_alerta_solar.png",
        },
        "CONFINAMIENTO_ROVER": {
            "entorno": "Rover Explorador",
            "presion_sistolica": 136,
            "presion_diastolica": 88,
            "frecuencia_cardiaca": 96,
            "glucosa_mg_dl": 88.0,
            "temperatura_c": 36.7,
            "horas_sueno": 4.0,
            "estado_animo": 1,
            "radiacion_msv": 0.4,
            "minutos_ejercicio": 15,
            "evidencia_adjunta": "test_fatiga_pupilar_cam.jpg",
        },
        "HIPOGLUCEMIA_EVA": {
            "entorno": "Base Planetaria",
            "presion_sistolica": 110,
            "presion_diastolica": 70,
            "frecuencia_cardiaca": 108,
            "glucosa_mg_dl": 54.0,
            "temperatura_c": 38.4,
            "horas_sueno": 7.0,
            "estado_animo": 3,
            "radiacion_msv": 0.6,
            "minutos_ejercicio": 90,
            "evidencia_adjunta": "ecografia_abdominal_eva.png",
        },
        "ATROFIA_CERO_G": {
            "entorno": "Estacion Espacial",
            "presion_sistolica": 124,
            "presion_diastolica": 80,
            "frecuencia_cardiaca": 78,
            "glucosa_mg_dl": 94.0,
            "temperatura_c": 36.6,
            "horas_sueno": 7.5,
            "estado_animo": 4,
            "radiacion_msv": 0.3,
            "minutos_ejercicio": 0,
            "evidencia_adjunta": "densitometria_ultrasonido_femur.png",
        },
    }

    datos_crisis = escenarios.get(payload.escenario.upper(), escenarios["TORMENTA_SOLAR"]).copy()
    datos_crisis["id_tripulante"] = payload.id_tripulante

    resultado = servicio.registrar_evaluacion_salud(datos_crisis)
    return {
        "lectura": asdict(resultado["lectura"]),
        "diagnostico": asdict(resultado["diagnostico"]),
        "racha_actualizada": resultado["racha_actualizada"],
    }


@router.post("/telemetria/cargar-mision", status_code=status.HTTP_200_OK)
def cambiar_mision_activa(
    payload: PeticionCambiarMision,
    servicio: ServicioTelemetria = Depends(obtener_servicio_telemetria),
):
    """Permite conmutar en caliente entre las misiones de Luna, Marte y Europa (Júpiter)."""
    from simulador_misiones.generador_mision_artemis import inicializar_y_poblar_mision
    from simulador_misiones.generador_mision_ares_marte import inicializar_mision_marte
    from simulador_misiones.generador_mision_europa_jupiter import inicializar_mision_europa

    origen = servicio.uow._origen
    mision = payload.mision.upper()

    if mision == "ARES_MARTE":
        inicializar_mision_marte(origen, forzar_reinicio=True)
    elif mision == "EUROPA_JUPITER":
        inicializar_mision_europa(origen, forzar_reinicio=True)
    else:
        inicializar_y_poblar_mision(origen, forzar_reinicio=True)

    return {"mensaje": f"Misión {mision} inicializada con éxito (105 registros biométricos)."}


@router.get("/analitica/{id_tripulante}", status_code=status.HTTP_200_OK)
def obtener_analitica_biometrica(
    id_tripulante: int,
    servicio: ServicioTelemetria = Depends(obtener_servicio_telemetria),
):
    return servicio.obtener_tablero_bi(id_tripulante)


@router.post("/consola-sql", status_code=status.HTTP_200_OK)
def ejecutar_consulta_sandbox(
    payload: PeticionConsultaSQL,
    servicio: ServicioTelemetria = Depends(obtener_servicio_telemetria),
):
    """Sandboxing SQL: solo permite sentencias SELECT de auditoría médica."""
    consulta = payload.query.strip()
    palabras_prohibidas = ["DROP", "DELETE", "UPDATE", "INSERT", "ALTER", "PRAGMA", "ATTACH"]
    consulta_upper = consulta.upper()

    if not consulta_upper.startswith("SELECT") or any(p in consulta_upper for p in palabras_prohibidas):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Violación de Sandboxing: La consola de telemetría solo permite consultas de lectura (SELECT).",
        )

    with servicio.uow:
        cursor = servicio.uow.conn.cursor()
        cursor.execute(consulta)
        columnas = [desc[0] for desc in cursor.description] if cursor.description else []
        filas = [dict(zip(columnas, fila)) for fila in cursor.fetchall()]
        return {"columnas": columnas, "filas": filas}