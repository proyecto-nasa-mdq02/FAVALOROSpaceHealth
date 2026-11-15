# 📄 Reporte de Ejecución - Etapa 1: Núcleo de Dominio Clínico-Espacial y Pruebas Unitarias

## 📌 Resumen de la Etapa
Se construyó y validó la **Capa de Dominio (Capa 1)** bajo Arquitectura Hexagonal y principios S.O.L.I.D. El núcleo modela las entidades biométricas y evalúa el impacto de los **5 Peligros de los Vuelos Espaciales de la NASA** de forma 100% aislada en memoria RAM, sin dependencias de bases de datos ni frameworks web.

## ⚙️ Componentes Desarrollados
* **`src/dominio/entidades.py`**: Implementación de `Tripulante`, `InsumoMedico`, `DiagnosticoTriage` y `LecturaBiometrica`, incluyendo el cálculo de Presión Arterial Media (MAP) y la barrera fisiológica contra lecturas imposibles de sensores.
* **`src/dominio/excepciones.py`**: Jerarquía de errores de negocio (`ErrorJerarquiaRBAC`, `ErrorInsumoInsuficiente`, `ErrorBiometriaFueraDeRangoFisico`).
* **`src/dominio/politicas_rbac.py`**: Implementación del **Patrón Estrategia** para los rangos `Comandante Medico`, `Oficial Cientifico` y `Especialista de Mision`.
* **`src/dominio/evaluador_riesgo_espacial.py`**: Motor polimórfico que ajusta los umbrales de sueño, ánimo, presión arterial, pulso, glucosa, temperatura, radiación y ejercicio según el entorno (`Transito Espacial (0G)`, `Estacion Espacial`, `Rover Explorador`, `Base Planetaria`).
* **`src/dominio/puertos.py`**: Contratos abstractos (`ABC`) aplicando Inversión de Dependencias (DIP).

## 🚀 Resultados de Ejecución en Consola
```text
collected 5 items

tests/unitarios/test_dominio_astromed.py::test_rbac_especialista_no_puede_dar_baja PASSED    [ 20%]
tests/unitarios/test_dominio_astromed.py::test_rbac_oficial_cientifico_no_modifica_comandante_medico PASSED [ 40%]
tests/unitarios/test_dominio_astromed.py::test_evaluador_detecta_hipoglucemia_critica_y_asigna_sistema PASSED [ 60%]
tests/unitarios/test_dominio_astromed.py::test_mismo_sueno_es_precaucion_en_estacion_pero_critico_en_rover PASSED [ 80%]
tests/unitarios/test_dominio_astromed.py::test_barrera_biologica_rechaza_valores_imposibles PASSED [100%]

======================================== 5 passed in 0.98s ========================================