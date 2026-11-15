# 📄 Reporte de Ejecución - Etapa 2: Casos de Uso, Persistencia 3FN y Tests de Integración SQL

## 📌 Resumen de la Etapa
Se implementaron y verificaron la **Capa de Aplicación (Capa 2)** y los **Adaptadores de Persistencia en Tercera Forma Normal (Capa 3)** operando sobre SQLite en memoria RAM (`:memory:`), garantizando atomicidad ACID y protección mediante *Triggers*.

## ⚙️ Componentes Desarrollados
* **`db/esquema.sql`**: Esquema relacional normalizado con catálogos maestros (`roles`, `entornos_mision`, `modulos_ubicacion`, `estados_insumo`, `especialidades`), columna calculada `presion_media` (`GENERATED ALWAYS AS ... STORED`), vista `vista_tripulacion_activa` y *Triggers* de bloqueo de borrado físico y supervivencia del último Comandante Médico.
* **`src/infraestructura/persistencia/`**: Unidad de Trabajo ACID (`GestorSQLite`), helper desacoplado (`obtener_o_crear`) y repositorios concretos (`RepositorioTripulantesSQL`, `RepositorioBotiquinSQL`, `RepositorioTelemetriaSQL`).
* **`src/aplicacion/`**: Servicios orquestadores (`ServicioTripulacion`, `ServicioBotiquin`, `ServicioTelemetria`) que unifican en una sola transacción la evaluación biométrica, el descuento de insumos del botiquín y el incremento de la racha de autocuidado (gamificación).

## 🚀 Resultados de Ejecución en Consola
```text
collected 8 items

tests/integracion/test_repositorios_sql.py::test_alta_tripulante_y_proteccion_trigger_ultimo_comandante PASSED [ 12%]
tests/integracion/test_repositorios_sql.py::test_transaccion_atomica_telemetria_descuenta_botiquin_y_suma_racha PASSED [ 25%]
tests/integracion/test_repositorios_sql.py::test_rollback_atomico_si_stock_botiquin_es_insuficiente PASSED [ 37%]
tests/unitarios/test_dominio_astromed.py::test_rbac_especialista_no_puede_dar_baja PASSED    [ 50%]
tests/unitarios/test_dominio_astromed.py::test_rbac_oficial_cientifico_no_modifica_comandante_medico PASSED [ 62%]
tests/unitarios/test_dominio_astromed.py::test_evaluador_detecta_hipoglucemia_critica_y_asigna_sistema PASSED [ 75%]
tests/unitarios/test_dominio_astromed.py::test_mismo_sueno_es_precaucion_en_estacion_pero_critico_en_rover PASSED [ 87%]
tests/unitarios/test_dominio_astromed.py::test_barrera_biologica_rechaza_valores_imposibles PASSED [100%]

======================================== 8 passed in 2.05s ========================================