# ==========================================================================
#  SIMULADOR DE MISIÓN 2: MISIÓN ARES — SUPERFICIE Y ROVER EN MARTE (3/8 G)
# ==========================================================================

import random
from datetime import datetime, timedelta
from simulador_misiones.nucleo_simulacion import preparar_base_tripulacion_y_botiquin


def inicializar_mision_marte(ruta_bd: str = "db/astro_med.db", forzar_reinicio: bool = True) -> None:
    uow, srv_tel, ids_tripulacion = preparar_base_tripulacion_y_botiquin(ruta_bd, forzar_reinicio)
    if not ids_tripulacion:
        return

    entornos = ["Base Planetaria", "Rover Explorador"]
    random.seed(2035)
    ahora = datetime.now()

    for idx, id_t in enumerate(ids_tripulacion):
        entorno_asignado = entornos[idx % len(entornos)]
        for dia in range(15, 0, -1):
            fecha_sim = (ahora - timedelta(days=dia)).strftime("%Y-%m-%d %H:%M:%S")
            es_ultimo = (dia == 1)

            if es_ultimo and idx == 1:
                # AST-002 (Marcos Santamaría): Hipoglucemia + Fiebre post-EVA en cráter Jezero.
                sistolica, fc, glucosa, temp, sueno, animo, rad, ejer = 144, 112, 56.0, 38.4, 6.0, 2, 0.9, 85
            elif es_ultimo and idx == 4:
                # AST-005 (Zoe Baiz): Fatiga aguda por confinamiento en Rover durante tormenta de polvo.
                sistolica, fc, glucosa, temp, sueno, animo, rad, ejer = 138, 96, 89.0, 36.8, 4.5, 1, 0.8, 15
            elif es_ultimo and idx in (5, 6):
                # AST-006 (David García) y AST-007 (Iván Jauregui): Sobrecarga cardiovascular moderada en Base Marciana.
                sistolica, fc, glucosa, temp, sueno, animo, rad, ejer = 148, 108, 132.0, 37.3, 6.2, 3, 1.1, 40
            else:
                sistolica = random.randint(120, 138)
                fc = random.randint(74, 98)
                glucosa = round(random.uniform(76.0, 125.0), 1)
                temp = round(random.uniform(36.5, 37.3), 1)
                sueno = round(random.uniform(6.0, 7.5), 1)
                animo = random.choice([3, 4, 3, 5])
                rad = round(random.uniform(0.4, 0.9), 2)
                ejer = random.randint(35, 65)

            res = srv_tel.registrar_evaluacion_salud(
                {
                    "id_tripulante": id_t,
                    "entorno": entorno_asignado,
                    "presion_sistolica": sistolica,
                    "presion_diastolica": sistolica - random.randint(40, 48),
                    "frecuencia_cardiaca": fc,
                    "glucosa_mg_dl": glucosa,
                    "temperatura_c": temp,
                    "horas_sueno": sueno,
                    "estado_animo": animo,
                    "radiacion_msv": rad,
                    "minutos_ejercicio": ejer,
                    "evidencia_adjunta": "ecografia_pulmonar_polvo_marte.png",
                }
            )
            with uow:
                uow.conn.execute(
                    "UPDATE lecturas_biometricas SET fecha = ? WHERE id = ?",
                    (fecha_sim, res["lectura"].id),
                )


if __name__ == "__main__":
    inicializar_mision_marte(forzar_reinicio=True)
    print("Misión Ares (Marte) cargada con éxito en db/astro_med.db (7 tripulantes)")