# 📄 Reporte de Ejecución - Etapa 3: Adaptador API RESTful, Simulador Multi-Misión y Pruebas HTTP

## 📌 Resumen de la Etapa
Se expuso el núcleo clínico-espacial a través de un servidor **API RESTful en FastAPI**, integrando validación de esquemas con Pydantic, traducción automática de excepciones de dominio a códigos de estado HTTP, simulador de crisis espaciales y el motor de simulación interplanetaria para la Luna, Marte y Europa (Júpiter).

## ⚙️ Componentes Desarrollados
* **`src/infraestructura/api/`**: Contratos DTO (`esquemas_validacion.py`), contenedor IoC (`inyector_dependencias.py`), controladores (`rutas_tripulacion.py`, `rutas_telemetria.py`) y servidor central con CORS y manejadores globales de error (`servidor.py`).
* **`simulador_misiones/` (`nucleo_simulacion.py`, `generador_mision_artemis.py`, `generador_mision_ares_marte.py`, `generador_mision_europa_jupiter.py`)**: Pipelines ETL bajo principio DRY que inicializan `db/astro_med.db` con los 7 integrantes del escuadrón (`AST-001` a `AST-007`), suministros médicos con instrucciones paso a paso y 105 lecturas históricas (15 días Sol por astronauta) adaptadas a la hostilidad de cada astro.
* **`tests/integracion/test_api_rest.py`**: Pruebas de contrato HTTP mediante `TestClient` y `dependency_overrides`.

## 🚀 Resultados de Ejecución en Consola
```text
collected 12 items

tests/integracion/test_api_rest.py::test_api_login_exitoso_y_credenciales_invalidas PASSED   [  8%]
tests/integracion/test_api_rest.py::test_api_bloqueo_rbac_especialista_intentando_crear_tripulante PASSED [ 16%]
tests/integracion/test_api_rest.py::test_api_registro_telemetria_y_simulador_crisis_solar PASSED [ 25%]
tests/integracion/test_api_rest.py::test_api_consola_sql_bloquea_borrado_y_permite_select PASSED [ 33%]
tests/integracion/test_repositorios_sql.py::test_alta_tripulante_y_proteccion_trigger_ultimo_comandante PASSED [ 41%]
tests/integracion/test_repositorios_sql.py::test_transaccion_atomica_telemetria_descuenta_botiquin_y_suma_racha PASSED [ 50%]
tests/integracion/test_repositorios_sql.py::test_rollback_atomico_si_stock_botiquin_es_insuficiente PASSED [ 58%]
tests/unitarios/test_dominio_astromed.py::test_rbac_especialista_no_puede_dar_baja PASSED    [ 66%]
tests/unitarios/test_dominio_astromed.py::test_rbac_oficial_cientifico_no_modifica_comandante_medico PASSED [ 75%]
tests/unitarios/test_dominio_astromed.py::test_evaluador_detecta_hipoglucemia_critica_y_asigna_sistema PASSED [ 83%]
tests/unitarios/test_dominio_astromed.py::test_mismo_sueno_es_precaucion_en_estacion_pero_critico_en_rover PASSED [ 91%]
tests/unitarios/test_dominio_astromed.py::test_barrera_biologica_rechaza_valores_imposibles PASSED [100%]

================================== 12 passed, 1 warning in 8.06s ==================================
```