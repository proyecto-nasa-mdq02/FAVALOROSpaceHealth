# 🧪 Plan de Construcción Guiado por Pruebas (Metodología TDD) — ASTRO_MED_HUD

El desarrollo de **ASTRO_MED_HUD** se construye de adentro hacia afuera (*Inside-Out*), diseñando y validando las reglas clínicas de los 5 peligros espaciales y la integridad transaccional antes de acoplar los adaptadores gráficos.

---

## Etapa 1: Núcleo de Dominio Clínico-Espacial y Tests Unitarios (TDD Ciclo 1)

* **Objetivo:** Modelar las entidades biométricas, las barreras fisiológicas, el control jerárquico de misión (RBAC) y el motor polimórfico de evaluación de riesgo espacial sin dependencias externas.
* **Archivos construidos:**
  * `requirements.txt` y `pytest.ini`
  * `src/dominio/excepciones.py`
  * `src/dominio/entidades.py`
  * `src/dominio/politicas_rbac.py`
  * `src/dominio/evaluador_riesgo_espacial.py`
  * `src/dominio/puertos.py`
  * `tests/unitarios/test_dominio_astromed.py`
* **Criterio de Aceptación TDD:** Ejecución en memoria RAM verificando que un Especialista de Misión no pueda desafectar tripulantes, que la barrera biológica rechace signos vitales imposibles (ej. presión diastólica superior a la sistólica) y que una misma lectura de horas de sueño dispare `PRECAUCION` en la Estación Espacial pero escale a `CRITICO` dentro de un Rover Explorador confinado.

---

## Etapa 2: Casos de Uso, Persistencia 3FN en SQLite y Tests de Integración (TDD Ciclo 2)

* **Objetivo:** Implementar la orquestación de aplicación, el hashing con Bcrypt y los repositorios relacionales en Tercera Forma Normal sobre una base aislada en memoria (`:memory:`), validando la columna calculada (`presion_media`) y los *Triggers* de supervivencia.
* **Archivos construidos:**
  * `db/esquema.sql`
  * `src/infraestructura/seguridad/adaptador_bcrypt.py`
  * `src/infraestructura/persistencia/utilidades_sql.py`
  * `src/infraestructura/persistencia/repositorio_tripulantes_sql.py`
  * `src/infraestructura/persistencia/repositorio_botiquin_sql.py`
  * `src/infraestructura/persistencia/repositorio_telemetria_sql.py`
  * `src/infraestructura/persistencia/gestor_sqlite.py`
  * `src/aplicacion/casos_uso_tripulacion.py`
  * `src/aplicacion/casos_uso_botiquin.py`
  * `src/aplicacion/casos_uso_telemetria.py`
  * `tests/conftest.py` y `tests/integracion/test_repositorios_sql.py`
* **Criterio de Aceptación TDD:** Comprobación del disparo del *Trigger* `trg_proteger_ultimo_comandante_medico` ante el intento de baja del único médico activo, descuento atómico de stock del botiquín e incremento de racha de gamificación al registrar una lectura, y reversión total (`rollback`) si el suministro médico es insuficiente.

---

## Etapa 3: Adaptador API RESTful (FastAPI), Simulador Multi-Misión y Tests HTTP (TDD Ciclo 3)

* **Objetivo:** Exponer los casos de uso mediante endpoints RESTful validados con Pydantic, incorporar el simulador de anomalías espaciales en vivo, blindar la consola SQL mediante Sandboxing y poblar los escenarios interplanetarios (Luna, Marte y Europa) con los 7 astronautas del equipo y 105 registros históricos.
* **Archivos construidos:**
  * `src/infraestructura/api/esquemas_validacion.py`
  * `src/infraestructura/api/inyector_dependencias.py`
  * `src/infraestructura/api/rutas_tripulacion.py`
  * `src/infraestructura/api/rutas_telemetria.py`
  * `src/infraestructura/api/servidor.py`
  * `simulador_misiones/nucleo_simulacion.py`
  * `simulador_misiones/generador_mision_artemis.py`
  * `simulador_misiones/generador_mision_ares_marte.py`
  * `simulador_misiones/generador_mision_europa_jupiter.py`
  * `tests/integracion/test_api_rest.py`
* **Criterio de Aceptación TDD:** Auditoría automatizada con `TestClient` validando autenticación (`200`/`401`), bloqueo jerárquico (`403`), inyección de tormenta solar (`201` + series temporales con Pandas) y rechazo de instrucciones destructivas (`DELETE`/`DROP`) en la consola SQL.

---

## Etapa 4: Adaptadores de Presentación (`hud_astronauta` + `consola_comando`) y Sincronización LAN (TDD Ciclo 4)

* **Objetivo:** Construir el visor web interactivo con el cuerpo humano en SVG y la consola médica de escritorio en Tkinter, garantizando la sincronización bidireccional en tiempo real dentro de la red local.
* **Archivos construidos:**
  * `src/presentacion/hud_astronauta/index.html`, `estilos.css`, `app_web.js`
  * `src/presentacion/consola_comando/cliente_api.py`
  * `src/presentacion/consola_comando/vistas/login.py`, `panel_control.py`, `analitica.py`, `consola.py`
  * `tests/integracion/test_sincronizacion_hud_consola.py`
* **Criterio de Aceptación TDD:** Verificación estructural del SVG anatómico y semáforo cromático, validación de peticiones *Preflight CORS* (`OPTIONS`) desde dispositivos móviles en red local y comprobación E2E de que una lectura crítica emitida desde el HUD Web se refleje instantáneamente en la grilla `Treeview` de la Consola de Comando en Tkinter.