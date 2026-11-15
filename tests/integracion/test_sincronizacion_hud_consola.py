from pathlib import Path
import tkinter as tk
from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient

from src.infraestructura.api.servidor import app
from src.infraestructura.api.inyector_dependencias import obtener_uow
from src.dominio.entidades import Tripulante
from src.presentacion.consola_comando.cliente_api import ClienteAPIAstroMed
from src.presentacion.consola_comando.vistas.panel_control import VentanaPanelControl
from src.presentacion.consola_comando.vistas.consola import VentanaConsolaSQL


@pytest.fixture
def entorno_sincronizado(uow_memoria):
    with uow_memoria:
        uow_memoria.tripulantes.guardar(
            Tripulante(
                usuario="admin",
                nombres="Elena",
                apellidos="Vega",
                codigo_astronauta="AST-001",
                rol="Comandante Medico",
                especialidad="Medicina Aeroespacial",
                racha_autocuidado=10,
            )
        )
        uow_memoria.tripulantes.guardar(
            Tripulante(
                usuario="esp_bravo",
                nombres="David",
                apellidos="Bravo",
                codigo_astronauta="AST-004",
                rol="Especialista de Mision",
                especialidad="Sistemas de Soporte Vital",
                racha_autocuidado=5,
            )
        )

    app.dependency_overrides[obtener_uow] = lambda: uow_memoria
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def test_estructura_hud_astronauta_svg_y_semaforo_responsive():
    raiz_hud = Path(__file__).resolve().parent.parent.parent / "src" / "presentacion" / "hud_astronauta"
    html = (raiz_hud / "index.html").read_text(encoding="utf-8")
    css = (raiz_hud / "estilos.css").read_text(encoding="utf-8")
    js = (raiz_hud / "app_web.js").read_text(encoding="utf-8")

    # Verifica las 4 regiones anatómicas clicables del SVG humano.
    assert 'id="svg-humano"' in html
    assert 'id="zona-NEURO_PSICO"' in html
    assert 'id="zona-CARDIO_RAD"' in html
    assert 'id="zona-METABOLICO_INMUNE"' in html
    assert 'id="zona-MUSCULO_ESQUELETICO"' in html

    # Verifica codificación cromática (Tarjeta 5 Trello) y diseño responsive móvil.
    assert "--color-nominal: #4CAF50" in css
    assert "--color-precaucion: #FF9800" in css
    assert "--color-critico: #F44336" in css
    assert "@media (max-width: 640px)" in css
    assert "window.location.hostname" in js


def test_cors_preflight_para_dispositivos_moviles_en_lan(entorno_sincronizado):
    origen_movil = "http://192.168.1.38:8080"
    resp = entorno_sincronizado.options(
        "/api/telemetria",
        headers={
            "Origin": origen_movil,
            "Access-Control-Request-Method": "POST",
        },
    )
    assert resp.status_code == 200
    assert resp.headers.get("access-control-allow-origin") in ("*", origen_movil)


def test_sincronizacion_tiempo_real_entre_hud_web_y_consola_tkinter(entorno_sincronizado):
    # Puenteamos requests hacia el TestClient en memoria.
    with patch("src.presentacion.consola_comando.cliente_api.requests") as mock_req:
        mock_req.get.side_effect = lambda url, headers=None, timeout=5: entorno_sincronizado.get(
            url.replace("http://127.0.0.1:8000", ""), headers=headers
        )
        mock_req.post.side_effect = lambda url, json=None, headers=None, timeout=5: entorno_sincronizado.post(
            url.replace("http://127.0.0.1:8000", ""), json=json, headers=headers
        )

        # 1. El astronauta David Bravo envía una lectura crítica desde el HUD Web móvil.
        resp_web = entorno_sincronizado.post(
            "/api/telemetria",
            json={
                "id_tripulante": 2,
                "entorno": "Rover Explorador",
                "presion_sistolica": 142,
                "presion_diastolica": 90,
                "frecuencia_cardiaca": 102,
                "glucosa_mg_dl": 58.0,
                "temperatura_c": 36.8,
                "horas_sueno": 5.0,
                "estado_animo": 2,
                "minutos_ejercicio": 20,
            },
        )
        assert resp_web.status_code == 201

        # 2. El Comandante Médico abre la Consola de Comando en Tkinter (Headless).
        root = tk.Tk()
        root.withdraw()
        top = tk.Toplevel(root)
        top.withdraw()

        api_desktop = ClienteAPIAstroMed()
        panel = VentanaPanelControl(top, api_desktop)

        # Verifica que la lectura enviada desde el HUD Web impactó en el Treeview de Tkinter.
        filas_telemetria = panel.tabla_telemetria.get_children()
        assert len(filas_telemetria) == 1
        valores_fila = panel.tabla_telemetria.item(filas_telemetria[0], "values")
        assert "CRITICO" in valores_fila
        assert "Rover Explorador" in valores_fila

        # 3. Prueba de la Consola SQL Sandbox desde Tkinter.
        top_sql = tk.Toplevel(root)
        top_sql.withdraw()
        consola = VentanaConsolaSQL(top_sql, api_desktop)
        assert consola.ejecutar_consulta() is True

        top_sql.destroy()
        top.destroy()
        root.destroy()