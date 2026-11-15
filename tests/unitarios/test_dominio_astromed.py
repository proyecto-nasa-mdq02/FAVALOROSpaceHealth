import pytest
from src.dominio.entidades import LecturaBiometrica, InsumoMedico
from src.dominio.excepciones import ErrorJerarquiaRBAC, ErrorBiometriaFueraDeRangoFisico
from src.dominio.politicas_rbac import obtener_estrategia_rbac
from src.dominio.evaluador_riesgo_espacial import obtener_estrategia_entorno


def test_rbac_especialista_no_puede_dar_baja():
    estrategia = obtener_estrategia_rbac("Especialista de Mision")
    with pytest.raises(ErrorJerarquiaRBAC):
        estrategia.validar_baja("Especialista de Mision", id_destino=2, id_operador=2)


def test_rbac_oficial_cientifico_no_modifica_comandante_medico():
    estrategia = obtener_estrategia_rbac("Oficial Cientifico")
    with pytest.raises(ErrorJerarquiaRBAC):
        estrategia.validar_modificacion("Comandante Medico", id_destino=1, id_operador=2)


def test_evaluador_detecta_hipoglucemia_critica_y_asigna_sistema():
    lectura = LecturaBiometrica(
        id_tripulante=1,
        entorno="Rover Explorador",
        presion_sistolica=120,
        presion_diastolica=80,
        frecuencia_cardiaca=72,
        glucosa_mg_dl=55.0,  # Crítico (< 65 mg/dL).
        temperatura_c=36.6,
        horas_sueno=7.5,
        estado_animo=4,
        minutos_ejercicio=35,
    )
    evaluador = obtener_estrategia_entorno(lectura.entorno)
    diagnostico = evaluador.evaluar(lectura)

    assert diagnostico.nivel_alerta_global == "CRITICO"
    assert diagnostico.sistema_afectado_principal == "METABOLICO_INMUNE"
    assert diagnostico.requiere_atencion_tierra is True
    assert "MED-GLU-01" in diagnostico.instruccion_paso_a_paso


def test_mismo_sueno_es_precaucion_en_estacion_pero_critico_en_rover():
    datos_base = dict(
        id_tripulante=1,
        presion_sistolica=118,
        presion_diastolica=76,
        frecuencia_cardiaca=68,
        glucosa_mg_dl=92.0,
        temperatura_c=36.5,
        horas_sueno=5.5,  # 5.5h es precaución en 0G (<6.5), pero crítico en Rover (<6.0).
        estado_animo=4,
        minutos_ejercicio=60,
    )
    lectura_estacion = LecturaBiometrica(entorno="Estacion Espacial", **datos_base)
    lectura_rover = LecturaBiometrica(entorno="Rover Explorador", **datos_base)

    diag_estacion = obtener_estrategia_entorno("Estacion Espacial").evaluar(lectura_estacion)
    diag_rover = obtener_estrategia_entorno("Rover Explorador").evaluar(lectura_rover)

    assert diag_estacion.estado_sistemas["NEURO_PSICO"] == "PRECAUCION"
    assert diag_rover.estado_sistemas["NEURO_PSICO"] == "CRITICO"


def test_barrera_biologica_rechaza_valores_imposibles():
    lectura_erronea = LecturaBiometrica(
        id_tripulante=1,
        entorno="Base Planetaria",
        presion_sistolica=90,
        presion_diastolica=120,  # Imposible: diastólica > sistólica.
        frecuencia_cardiaca=70,
        glucosa_mg_dl=90.0,
        temperatura_c=36.5,
        horas_sueno=8.0,
        estado_animo=5,
    )
    evaluador = obtener_estrategia_entorno("Base Planetaria")
    with pytest.raises(ErrorBiometriaFueraDeRangoFisico):
        evaluador.evaluar(lectura_erronea)