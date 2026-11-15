# ====================================================================
#  SIMULADOR DE MISIÓN 3: MISIÓN CRIO-EUROPA — LUNA HELADA DE JÚPITER
# ====================================================================

import random
from datetime import datetime, timedelta
from simulador_misiones.nucleo_simulacion import preparar_base_tripulacion_y_botiquin


def inicializar_mision_europa(ruta_bd: str = "db/astro_med.db", forzar_reinicio: bool = True) -> None:
    uow, srv_tel, ids_tripulacion = preparar_base_tripulacion_y_botiquin(ruta_bd, forzar_reinicio)
    if not ids_tripulacion:
        return

    entornos = ["Transito Espacial (0G)", "Rover Explorador", "Base Planetaria"]
    random.seed(2042)
    ahora = datetime.now()

    for idx, id_t in enumerate(ids_tripulacion):
        entorno_asignado = entornos[idx % len(entornos)]
        for dia in range(15, 0, -1):
            fecha_sim = (ahora - timedelta(days=dia)).strftime("%Y-%m-%d %H:%M:%S")
            es_ultimo = (dia == 1)

            if es_ultimo and idx in (0, 3):
                # AST-001 (Alicia López) y AST-004 (David Bravo): Exposición crítica a radiación de Júpiter.
                sistolica, fc, glucosa, temp, sueno, animo, rad, ejer = 162, 126, 118.0, 37.6, 5.2, 2, 2.9, 25
            elif es_ultimo and idx in (2, 4):
                # AST-003 (Jazmín) y AST-005 (Zoe): Deprivación severa de sueño y ánimo crítico por oscuridad/aislamiento.
                sistolica, fc, glucosa, temp, sueno, animo, rad, ejer = 134, 92, 72.0, 35.8, 3.8, 1, 1.4, 15
            elif es_ultimo and idx in (5, 6):
                # AST-006 (David García) y AST-007 (Iván Jauregui): Atrofia muscular por largo tránsito en 0G.
                sistolica, fc, glucosa, temp, sueno, animo, rad, ejer = 128, 88, 94.0, 36.2, 6.0, 2, 1.2, 5
            else:
                sistolica = random.randint(122, 142)
                fc = random.randint(76, 102)
                glucosa = round(random.uniform(74.0, 130.0), 1)
                temp = round(random.uniform(35.9, 36.8), 1)
                sueno = round(random.uniform(5.2, 6.8), 1)
                animo = random.choice([2, 3, 3, 4])
                rad = round(random.uniform(0.7, 1.4), 2)
                ejer = random.randint(20, 50)

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
                    "evidencia_adjunta": "dosimetria_crio_europa_jupiter.png",
                }
            )
            with uow:
                uow.conn.execute(
                    "UPDATE lecturas_biometricas SET fecha = ? WHERE id = ?",
                    (fecha_sim, res["lectura"].id),
                )


if __name__ == "__main__":
    inicializar_mision_europa(forzar_reinicio=True)
    print("Misión Crio-Europa (Luna Helada de Júpiter) cargada con éxito en db/astro_med.db (7 tripulantes)")