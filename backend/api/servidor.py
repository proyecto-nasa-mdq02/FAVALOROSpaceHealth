# ===========================================================================
#  SERVIDOR CENTRAL FASTAPI Y MANEJADOR GLOBAL DE EXCEPCIONES (CAPA 3 - API)
# ===========================================================================

import sqlite3
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from src.dominio.excepciones import (
    ErrorJerarquiaRBAC,
    ErrorInsumoInsuficiente,
    ErrorEntidadNoEncontrada,
    ErrorBiometriaFueraDeRangoFisico,
)
from src.infraestructura.api.rutas_tripulacion import router as router_tripulacion
from src.infraestructura.api.rutas_telemetria import router as router_telemetria
from simulador_misiones.nucleo_simulacion import preparar_base_tripulacion_y_botiquin


@asynccontextmanager
async def lifespan(_app: FastAPI):
    preparar_base_tripulacion_y_botiquin()
    yield

app = FastAPI(
    title="ASTRO_MED_HUD API — NASA Space Apps",
    description="Sistema Autónomo de Monitoreo Biométrico y Soporte a la Decisión Clínica Espacial.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(ErrorJerarquiaRBAC)
async def manejador_rbac(request: Request, exc: ErrorJerarquiaRBAC):
    return JSONResponse(status_code=status.HTTP_403_FORBIDDEN, content={"detalle": str(exc)})


@app.exception_handler(ErrorEntidadNoEncontrada)
async def manejador_no_encontrado(request: Request, exc: ErrorEntidadNoEncontrada):
    return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"detalle": str(exc)})


@app.exception_handler(ErrorInsumoInsuficiente)
async def manejador_insumo(request: Request, exc: ErrorInsumoInsuficiente):
    return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"detalle": str(exc)})


@app.exception_handler(ErrorBiometriaFueraDeRangoFisico)
async def manejador_rango_biologico(request: Request, exc: ErrorBiometriaFueraDeRangoFisico):
    return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"detalle": str(exc)})


@app.exception_handler(sqlite3.Error)
async def manejador_sqlite(request: Request, exc: sqlite3.Error):
    return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"detalle": str(exc)})


@app.get("/")
def raiz():
    return {"mensaje": "FAVALORO SpaceHealth API está activa", "endpoints": ["/api/tripulantes", "/api/telemetria/tripulante/{id}", "/api/analitica/{id}", "/api/botiquin"]}

app.include_router(router_tripulacion)
app.include_router(router_telemetria)

@app.get("/health")
async def health_check():
    return {"status": "ok"}