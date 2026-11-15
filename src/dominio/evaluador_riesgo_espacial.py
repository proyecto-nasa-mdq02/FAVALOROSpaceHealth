# =====================================================================================
#  MOTOR DE EVALUACIÓN DE LOS 5 PELIGROS ESPACIALES (CAPA 1 - NÚCLEO DE DOMINIO)
# =====================================================================================
#  Implementa el Patrón Estrategia (GoF) para evaluar una LecturaBiometrica ajustando
#  umbrales según el entorno (Nave en 0G, Estación Espacial, Rover o Base Planetaria).
# =====================================================================================

from abc import ABC, abstractmethod
from src.dominio.entidades import LecturaBiometrica, DiagnosticoTriage


class EstrategiaEntornoEspacial(ABC):
    """Contrato base para evaluar el impacto ambiental sobre la fisiología del astronauta."""

    @abstractmethod
    def obtener_limites_ambientales(self) -> dict:
        pass

    def evaluar(self, lectura: LecturaBiometrica) -> DiagnosticoTriage:
        lectura.validar_rangos_biologicos()
        limites = self.obtener_limites_ambientales()

        estado_sistemas = {
            "NEURO_PSICO": "NOMINAL",
            "CARDIO_RAD": "NOMINAL",
            "METABOLICO_INMUNE": "NOMINAL",
            "MUSCULO_ESQUELETICO": "NOMINAL",
        }
        hallazgos = []
        instrucciones = []
        requiere_tierra = False

        # 1. Evaluación NEURO_PSICO (Peligro 2: Aislamiento y Confinamiento / Peligro 5: Entorno Cerrado).
        if lectura.horas_sueno < limites["sueno_critico"] or lectura.estado_animo <= 1:
            estado_sistemas["NEURO_PSICO"] = "CRITICO"
            hallazgos.append("Deprivación severa de sueño / fatiga psicológica aguda por confinamiento.")
            instrucciones.append(
                "1. Suspender maniobras críticas o EVA. 2. Ajustar iluminación circadiana del módulo. "
                "3. Iniciar protocolo de descanso protegido de 8h."
            )
            requiere_tierra = True
        elif lectura.horas_sueno < limites["sueno_precaucion"] or lectura.estado_animo == 2:
            estado_sistemas["NEURO_PSICO"] = "PRECAUCION"
            hallazgos.append("Déficit de descanso o estrés conductual leve detectado.")
            instrucciones.append(
                "1. Realizar pausa cognitiva de 30 min. 2. Completar bitácora de bienestar y reducir cafeína."
            )

        # 2. Evaluación CARDIO_RAD (Peligro 1: Radiación Espacial y Peligro 4: Alteración Cardiovascular).
        if (
            lectura.presion_sistolica >= limites["sistolica_critica"]
            or lectura.frecuencia_cardiaca >= limites["fc_critica"]
            or lectura.radiacion_msv >= limites["rad_critica"]
        ):
            estado_sistemas["CARDIO_RAD"] = "CRITICO"
            hallazgos.append("Evento hemodinámico crítico o exposición aguda a radiación espacial.")
            instrucciones.append(
                "1. Replegarse al refugio blindado de tormenta solar si radiación > límite. "
                "2. Colocar electrodos para ECG de 12 derivaciones y reposo absoluto."
            )
            requiere_tierra = True
        elif (
            lectura.presion_sistolica >= limites["sistolica_precaucion"]
            or lectura.frecuencia_cardiaca >= limites["fc_precaucion"]
            or lectura.radiacion_msv >= limites["rad_precaucion"]
        ):
            estado_sistemas["CARDIO_RAD"] = "PRECAUCION"
            hallazgos.append("Sobrecarga cardiovascular o dosimetría de radiación elevada.")
            instrucciones.append(
                "1. Hidratación oral inmediata (500 ml). 2. Repetir toma de presión sentado/sujetado en 15 minutos."
            )

        # 3. Evaluación METABOLICO_INMUNE (Nutrición, Glucosa e Infecciones en Entorno Cerrado).
        if lectura.glucosa_mg_dl < 65.0 or lectura.glucosa_mg_dl > 200.0 or lectura.temperatura_c >= 38.2:
            estado_sistemas["METABOLICO_INMUNE"] = "CRITICO"
            hallazgos.append("Descompensación metabólica (hipo/hiperglucemia) o respuesta febril inmunitaria.")
            instrucciones.append(
                "1. Si glucosa < 65 mg/dL, administrar Gel de Glucosa Oral (MED-GLU-01) de inmediato. "
                "2. Si hay fiebre >= 38.2 °C, aislar ventilación y tomar muestra biológica."
            )
            requiere_tierra = True
        elif lectura.glucosa_mg_dl < 75.0 or lectura.glucosa_mg_dl > 140.0 or lectura.temperatura_c >= 37.5:
            estado_sistemas["METABOLICO_INMUNE"] = "PRECAUCION"
            hallazgos.append("Alteración glucémica leve o subfebrilidad por adaptación ambiental.")
            instrucciones.append(
                "1. Verificar ingesta calórica de la ración diaria. 2. Controlar temperatura nuevamente en 2 horas."
            )

        # 4. Evaluación MUSCULO_ESQUELETICO (Peligro 4: Microgravedad / Pérdida ósea y muscular).
        if lectura.minutos_ejercicio < limites["ejercicio_minimo_critico"]:
            estado_sistemas["MUSCULO_ESQUELETICO"] = "CRITICO" if limites["penaliza_cero_g"] else "PRECAUCION"
            hallazgos.append("Riesgo acelerado de osteopenia y atrofia muscular por déficit de carga mecánica.")
            instrucciones.append(
                "1. Programar sesión obligatoria de 60 min en dispositivo de resistencia (ARED/Cinta con arnés). "
                "2. Verificar suplementación de Vitamina D y Calcio."
            )
        elif lectura.minutos_ejercicio < limites["ejercicio_recomendado"]:
            estado_sistemas["MUSCULO_ESQUELETICO"] = "PRECAUCION"
            hallazgos.append("Tiempo de ejercicio contramedida por debajo de la meta del entorno.")
            instrucciones.append("1. Completar al menos 45 minutos de ejercicio resistivo antes del ciclo de sueño.")

        # Consolidación de severidad (Peligro 3: Distancia a la Tierra exige decisión autónoma clara).
        jerarquia = {"NOMINAL": 0, "PRECAUCION": 1, "CRITICO": 2}
        nivel_global = "NOMINAL"
        sistema_principal = "NINGUNO"

        for sistema, estado in estado_sistemas.items():
            if jerarquia[estado] > jerarquia[nivel_global]:
                nivel_global = estado
                sistema_principal = sistema

        if nivel_global == "NOMINAL":
            resumen = f"[{lectura.entorno}] Estado fisiológico nominal. Todos los subsistemas estables."
            guia = "Mantener rutina operativa, hidratación programada y registro diario en el HUD."
        else:
            resumen = " | ".join(hallazgos)
            guia = " // ".join(instrucciones)

        return DiagnosticoTriage(
            nivel_alerta_global=nivel_global,
            sistema_afectado_principal=sistema_principal,
            resumen_clinico=resumen,
            instruccion_paso_a_paso=guia,
            requiere_atencion_tierra=requiere_tierra,
            estado_sistemas=estado_sistemas,
        )


class EstrategiaTransitoCeroG(EstrategiaEntornoEspacial):
    """Nave espacial o Estación en microgravedad (0G): máxima exigencia de ejercicio y control de fluidos."""
    def obtener_limites_ambientales(self) -> dict:
        return {
            "sueno_critico": 5.0,
            "sueno_precaucion": 6.5,
            "sistolica_critica": 150,
            "sistolica_precaucion": 135,
            "fc_critica": 115,
            "fc_precaucion": 95,
            "rad_critica": 2.0,
            "rad_precaucion": 0.8,
            "ejercicio_minimo_critico": 20,
            "ejercicio_recomendado": 60,
            "penaliza_cero_g": True,
        }


class EstrategiaRoverExplorador(EstrategiaEntornoEspacial):
    """Vehículo presurizado: alto estrés por confinamiento extremo; menor espacio para ejercicio."""
    def obtener_limites_ambientales(self) -> dict:
        return {
            "sueno_critico": 6.0,       # Más estricto por fatiga de conducción y confinamiento.
            "sueno_precaucion": 7.0,
            "sistolica_critica": 155,
            "sistolica_precaucion": 138,
            "fc_critica": 120,
            "fc_precaucion": 100,
            "rad_critica": 1.5,         # Menor blindaje que la base principal.
            "rad_precaucion": 0.6,
            "ejercicio_minimo_critico": 10,
            "ejercicio_recomendado": 30,
            "penaliza_cero_g": False,
        }


class EstrategiaBasePlanetaria(EstrategiaEntornoEspacial):
    """Base en Luna (1/6 G) o Marte (3/8 G): gravedad parcial y alta carga física por salidas EVA."""
    def obtener_limites_ambientales(self) -> dict:
        return {
            "sueno_critico": 5.0,
            "sueno_precaucion": 6.5,
            "sistolica_critica": 160,
            "sistolica_precaucion": 140,
            "fc_critica": 125,
            "fc_precaucion": 105,
            "rad_critica": 1.8,
            "rad_precaucion": 0.7,
            "ejercicio_minimo_critico": 15,
            "ejercicio_recomendado": 40,
            "penaliza_cero_g": False,
        }


def obtener_estrategia_entorno(nombre_entorno: str) -> EstrategiaEntornoEspacial:
    """Fábrica que selecciona la estrategia biométrica según el entorno operativo actual."""
    mapa = {
        "Transito Espacial (0G)": EstrategiaTransitoCeroG(),
        "Estacion Espacial": EstrategiaTransitoCeroG(),
        "Rover Explorador": EstrategiaRoverExplorador(),
        "Base Planetaria": EstrategiaBasePlanetaria(),
    }
    return mapa.get(nombre_entorno, EstrategiaTransitoCeroG())