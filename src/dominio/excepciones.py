# ===========================================================
#  EXCEPCIONES DE DOMINIO (CAPA 1 - NÚCLEO CLÍNICO-ESPACIAL)
# ===========================================================

class ErrorDominioAstroMed(Exception):
    """Clase base para todas las excepciones de negocio de ASTRO_MED_HUD."""
    pass


class ErrorJerarquiaRBAC(ErrorDominioAstroMed):
    """Se lanza cuando un tripulante intenta ejecutar una acción fuera de su rango de misión."""
    pass


class ErrorInsumoInsuficiente(ErrorDominioAstroMed):
    """Se lanza cuando el botiquín de la nave no posee stock suficiente para un protocolo."""
    pass


class ErrorEntidadNoEncontrada(ErrorDominioAstroMed):
    """Se lanza cuando un tripulante, insumo o lectura biométrica no existe."""
    pass


class ErrorBiometriaFueraDeRangoFisico(ErrorDominioAstroMed):
    """Se lanza cuando se ingresan valores biológicamente imposibles (error de sensor/tipeo)."""
    pass