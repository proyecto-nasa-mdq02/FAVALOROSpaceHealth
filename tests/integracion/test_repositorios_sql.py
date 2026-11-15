import sqlite3
import pytest
from src.aplicacion.casos_uso_tripulacion import ServicioTripulacion
from src.aplicacion.casos_uso_botiquin import ServicioBotiquin
from src.aplicacion.casos_uso_telemetria import ServicioTelemetria
from src.dominio.excepciones import ErrorInsumoInsuficiente
from src.dominio.entidades import Tripulante


def test_alta_tripulante_y_proteccion_trigger_ultimo_comandante(uow_memoria):
    srv_trip = ServicioTripulacion(uow_memoria)

    with uow_memoria:
        cmd = uow_memoria.tripulantes.guardar(
            Tripulante(
                usuario="cmd_shepard",
                nombres="Alan",
                apellidos="Shepard",
                codigo_astronauta="AST-001",
                rol="Comandante Medico",
                especialidad="Medicina Aeroespacial",
            )
        )

    # Intentar dar de baja al único Comandante Médico activo debe disparar el Trigger de SQLite.
    with pytest.raises(sqlite3.IntegrityError, match="Comandante Médico"):
        srv_trip.dar_baja_tripulante(id_operador=cmd.id, id_destino=cmd.id)


def test_transaccion_atomica_telemetria_descuenta_botiquin_y_suma_racha(uow_memoria):
    srv_trip = ServicioTripulacion(uow_memoria)
    srv_bot = ServicioBotiquin(uow_memoria)
    srv_tel = ServicioTelemetria(uow_memoria)

    with uow_memoria:
        from src.dominio.entidades import Tripulante
        cmd = uow_memoria.tripulantes.guardar(
            Tripulante(
                usuario="medico_vuelo",
                nombres="Alicia",
                apellidos="López",
                codigo_astronauta="AST-010",
                rol="Comandante Medico",
            )
        )

    insumo = srv_bot.registrar_insumo(
        id_operador=cmd.id,
        datos={
            "codigo": "MED-GLU-01",
            "nombre": "Gel de Glucosa Oral",
            "sistema_corporal": "METABOLICO_INMUNE",
            "instrucciones_uso": "Ingerir un sobre completo vía oral y esperar 15 minutos.",
            "stock_actual": 5.0,
            "stock_minimo": 2.0,
            "modulo_ubicacion": "Rover Explorador",
        },
    )

    resultado = srv_tel.registrar_evaluacion_salud(
        {
            "id_tripulante": cmd.id,
            "entorno": "Rover Explorador",
            "presion_sistolica": 122,
            "presion_diastolica": 78,
            "frecuencia_cardiaca": 84,
            "glucosa_mg_dl": 58.0,  # Hipoglucemia crítica.
            "temperatura_c": 36.5,
            "horas_sueno": 7.0,
            "estado_animo": 4,
            "minutos_ejercicio": 30,
            "id_insumo_aplicado": insumo.id,
            "cantidad_insumo": 1.0,
        }
    )

    assert resultado["lectura"].nivel_alerta == "CRITICO"
    assert resultado["lectura"].presion_media == 92.7
    assert resultado["racha_actualizada"] == 1

    insumos_actualizados = srv_bot.listar_insumos()
    assert insumos_actualizados[0].stock_actual == 4.0


def test_rollback_atomico_si_stock_botiquin_es_insuficiente(uow_memoria):
    srv_bot = ServicioBotiquin(uow_memoria)
    srv_tel = ServicioTelemetria(uow_memoria)

    with uow_memoria:
        from src.dominio.entidades import Tripulante
        cmd = uow_memoria.tripulantes.guardar(
            Tripulante(
                usuario="cmd_kirk",
                nombres="James",
                apellidos="Kirk",
                codigo_astronauta="AST-099",
                rol="Comandante Medico",
            )
        )

    insumo = srv_bot.registrar_insumo(
        id_operador=cmd.id,
        datos={
            "codigo": "MED-RAD-01",
            "nombre": "Yoduro Protector Radiación",
            "sistema_corporal": "CARDIO_RAD",
            "instrucciones_uso": "Tomar 1 comprimido con 300ml de agua.",
            "stock_actual": 1.0,
        },
    )

    with pytest.raises(ErrorInsumoInsuficiente):
        srv_tel.registrar_evaluacion_salud(
            {
                "id_tripulante": cmd.id,
                "entorno": "Transito Espacial (0G)",
                "presion_sistolica": 120,
                "presion_diastolica": 80,
                "frecuencia_cardiaca": 75,
                "glucosa_mg_dl": 90.0,
                "temperatura_c": 36.6,
                "horas_sueno": 8.0,
                "estado_animo": 5,
                "id_insumo_aplicado": insumo.id,
                "cantidad_insumo": 5.0,  # Excede el stock de 1.0.
            }
        )

    # Verifica que no hayan quedado lecturas huérfanas tras el fallo.
    assert len(srv_tel.listar_toda_telemetria()) == 0