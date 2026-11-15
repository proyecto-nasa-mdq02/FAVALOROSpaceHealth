# =============================================================================
#  SIMULADOR DE MISIÓN 1: PROGRAMA ARTEMIS — ÓRBITA Y SUPERFICIE LUNAR (1/6 G)
# =============================================================================

import random
from datetime import datetime, timedelta
from simulador_misiones.nucleo_simulacion import preparar_base_tripulacion_y_botiquin


def inicializar_y_poblar_mision(ruta_bd: str = "db/astro_med.db", forzar_reinicio: bool = False) -> None:
    uow, srv_tel, ids_tripulacion = preparar_base_tripulacion_y_botiquin(ruta_bd, forzar_reinicio)
    if not ids_tripulacion:
        return

    entornos = ["Estacion Espacial", "Base Planetaria", "Rover Explorador", "Transito Espacial (0G)"]
    random.seed(42)
    ahora = datetime.now()

    for idx, id_t in enumerate(ids_tripulacion):
        entorno_asignado = entornos[idx % len(entornos)]
        for dia in range(15, 0, -1):
            fecha_sim = (ahora - timedelta(days=dia)).strftime("%Y-%m-%d %H:%M:%S")
            es_ultimo = (dia == 1)

            if es_ultimo and idx == 2:
                # AST-003 (Jazmín Saavedra): Precaución por déficit de sueño en Rover Lunar.
                sistolica, fc, glucosa, sueno, animo, rad, ejer = 139, 98, 82.0, 5.8, 2, 0.7, 20
            elif es_ultimo and idx == 3:
                # AST-004 (David Bravo): Alerta Crítica simulada en Tránsito Cis-Lunar.
                sistolica, fc, glucosa, sueno, animo, rad, ejer = 156, 122, 58.0, 4.5, 1, 2.3, 10
            elif es_ultimo and idx == 6:
                # AST-007 (Iván Jauregui): Precaución osteomuscular tras jornada de mantenimiento robótico.
                sistolica, fc, glucosa, sueno, animo, rad, ejer = 128, 86, 94.0, 7.0, 4, 0.4, 25
            else:
                sistolica = random.randint(112, 128)
                fc = random.randint(64, 84)
                glucosa = round(random.uniform(84.0, 110.0), 1)
                sueno = round(random.uniform(6.8, 8.2), 1)
                animo = random.choice([4, 5, 4, 5])
                rad = round(random.uniform(0.1, 0.4), 2)
                ejer = random.randint(50, 75)

            res = srv_tel.registrar_evaluacion_salud(
                {
                    "id_tripulante": id_t,
                    "entorno": entorno_asignado,
                    "presion_sistolica": sistolica,
                    "presion_diastolica": sistolica - random.randint(38, 44),
                    "frecuencia_cardiaca": fc,
                    "glucosa_mg_dl": glucosa,
                    "temperatura_c": round(random.uniform(36.4, 36.9), 1),
                    "horas_sueno": sueno,
                    "estado_animo": animo,
                    "radiacion_msv": rad,
                    "minutos_ejercicio": ejer,
                    "evidencia_adjunta": "telemetria_artemis_lunar.dat",
                }
            )
            with uow:
                uow.conn.execute(
                    "UPDATE lecturas_biometricas SET fecha = ? WHERE id = ?",
                    (fecha_sim, res["lectura"].id),
                )


if __name__ == "__main__":
    inicializar_y_poblar_mision(forzar_reinicio=True)
    print("Misión Artemis (Luna) cargada con éxito en db/astro_med.db (7 tripulantes)")