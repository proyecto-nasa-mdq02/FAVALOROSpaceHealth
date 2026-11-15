# ===========================================================
#  ADAPTADOR CRIPTOGRÁFICO BCRYPT (CAPA 3 - INFRAESTRUCTURA)
# ===========================================================

import bcrypt
from src.dominio.puertos import PuertoSeguridadHash


class AdaptadorBcrypt(PuertoSeguridadHash):
    """Implementación concreta de hashing de credenciales de tripulación con salt."""

    def generar_hash(self, texto_plano: str) -> str:
         bytes_plano = texto_plano.encode("utf-8")
         sal = bcrypt.gensalt()
         return bcrypt.hashpw(bytes_plano, sal).decode("utf-8")

    def verificar_hash(self, texto_plano: str, hash_almacenado: str) -> bool:
        if not texto_plano or not hash_almacenado:
            return False
        try:
            return bcrypt.checkpw(
                texto_plano.encode("utf-8"),
                hash_almacenado.encode("utf-8"),
            )
        except ValueError:
            return False