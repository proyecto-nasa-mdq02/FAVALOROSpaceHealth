-- ========================================================================================= --
--    ESQUEMA RELACIONAL NORMALIZADO (3FN) — ASTRO_MED_HUD (NASA SPACE APPS)                 --
-- ========================================================================================= --
--  Arquitectura de persistencia local (Offline-First) para misiones espaciales.             --
--  Respeta jerarquía estricta de Claves Foráneas, Baja Lógica y Triggers de Supervivencia.  --
-- ========================================================================================= --

-- ----------------------------------------------------------
--  FASE 1: TABLAS MAESTRAS (CATÁLOGOS ATOMIZADOS DE MISIÓN)
-- ----------------------------------------------------------

CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rol TEXT NOT NULL, -- Ej: 'Comandante Medico', 'Oficial Cientifico', 'Especialista de Mision'.
    habilitado INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS entornos_mision (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entorno TEXT NOT NULL, -- Ej: 'Transito Espacial (0G)', 'Estacion Espacial', 'Rover Explorador', 'Base Planetaria'.
    gravedad_relativa REAL DEFAULT 0.0,
    nivel_aislamiento INTEGER DEFAULT 3, -- Escala 1 a 5.
    habilitado INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS modulos_ubicacion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    modulo TEXT NOT NULL, -- Ej: 'Bahia Medica A', 'Esclusa EVA', 'Compartimento Rover 1'.
    habilitado INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS estados_insumo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estado TEXT NOT NULL, -- Ej: 'Disponible', 'Stock Critico', 'Agotado'.
    habilitado INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS especialidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    especialidad TEXT NOT NULL, -- Ej: 'Bioingenieria', 'Geologia Planetaria', 'Piloto Comandante'.
    habilitado INTEGER DEFAULT 1
);

-- --------------------------------------
--  FASE 2: TABLA CENTRAL DE TRIPULACIÓN
-- --------------------------------------

CREATE TABLE IF NOT EXISTS tripulantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT UNIQUE NOT NULL,
    nombres TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    codigo_astronauta TEXT UNIQUE NOT NULL, -- Ej: 'AST-001'.
    racha_autocuidado INTEGER DEFAULT 0,    -- Gamificación: días seguidos cumpliendo chequeos.
    habilitado INTEGER DEFAULT 1
);

-- ------------------------------------------------------------
--  FASE 3: TABLAS INTERMEDIAS DE TRIPULACIÓN (RELACIONES 3FN)
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tripulantexroles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_tripulante INTEGER NOT NULL,
    id_rol INTEGER NOT NULL,
    habilitado INTEGER DEFAULT 1,
    FOREIGN KEY (id_tripulante) REFERENCES tripulantes(id),
    FOREIGN KEY (id_rol) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS tripulantexespecialidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_tripulante INTEGER NOT NULL,
    id_especialidad INTEGER NOT NULL,
    habilitado INTEGER DEFAULT 1,
    FOREIGN KEY (id_tripulante) REFERENCES tripulantes(id),
    FOREIGN KEY (id_especialidad) REFERENCES especialidades(id)
);

-- -------------------------------------------------
--  FASE 4: BOTIQUÍN DE MISIÓN Y PROTOCOLOS GUIADOS
-- -------------------------------------------------

CREATE TABLE IF NOT EXISTS insumos_medicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT UNIQUE NOT NULL,       -- Ej: 'MED-GLU-01'.
    nombre TEXT NOT NULL,              -- Ej: 'Gel de Glucosa Oral Rápida'.
    sistema_corporal TEXT NOT NULL,    -- 'NEURO_PSICO', 'CARDIO_RAD', 'METABOLICO_INMUNE', 'MUSCULO_ESQUELETICO'.
    instrucciones_uso TEXT NOT NULL,   -- Guía paso a paso para astronautas no médicos.
    stock_actual REAL DEFAULT 0,
    stock_minimo REAL DEFAULT 0,
    unidad_medida TEXT DEFAULT 'Unidades',
    vencimiento TEXT DEFAULT 'S/D',
    habilitado INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS insumoxestados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_insumo INTEGER NOT NULL,
    id_estado INTEGER NOT NULL,
    habilitado INTEGER DEFAULT 1,
    FOREIGN KEY (id_insumo) REFERENCES insumos_medicos(id),
    FOREIGN KEY (id_estado) REFERENCES estados_insumo(id)
);

CREATE TABLE IF NOT EXISTS insumoxmodulos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_insumo INTEGER NOT NULL,
    id_modulo INTEGER NOT NULL,
    habilitado INTEGER DEFAULT 1,
    FOREIGN KEY (id_insumo) REFERENCES insumos_medicos(id),
    FOREIGN KEY (id_modulo) REFERENCES modulos_ubicacion(id)
);

-- -----------------------------------------------------
--  FASE 5: MÓDULO TRANSACCIONAL DE TELEMETRÍA Y TRIAGE
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS lecturas_biometricas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_tripulante INTEGER NOT NULL,
    id_entorno INTEGER NOT NULL,
    
    -- Indicadores de salud requeridos por NASA.
    presion_sistolica INTEGER NOT NULL,
    presion_diastolica INTEGER NOT NULL,
    frecuencia_cardiaca INTEGER NOT NULL,
    glucosa_mg_dl REAL NOT NULL,
    temperatura_c REAL NOT NULL,
    horas_sueno REAL NOT NULL,
    estado_animo INTEGER NOT NULL,           -- Escala 1 (Crítico) a 5 (Óptimo).
    radiacion_msv REAL DEFAULT 0.0,          -- Peligro 1: Radiación espacial acumulada en el día.
    minutos_ejercicio INTEGER DEFAULT 0,     -- Contramedida Peligro 4: Gravedad alterada.
    
    -- COLUMNA GENERADA AUTOMÁTICAMENTE (Presión Arterial Media - MAP en tiempo real).
    presion_media REAL GENERATED ALWAYS AS (
        ROUND(presion_diastolica + ((presion_sistolica - presion_diastolica) / 3.0), 1)
    ) STORED,

    -- Resultados del Motor de Triage y Trazabilidad.
    nivel_alerta TEXT NOT NULL,              -- 'NOMINAL', 'PRECAUCION', 'CRITICO'.
    sistema_afectado TEXT DEFAULT 'NINGUNO', -- Zona del SVG que se ilumina en Amarillo/Rojo.
    diagnostico_resumen TEXT NOT NULL,
    instruccion_accion TEXT NOT NULL,
    id_insumo_aplicado INTEGER,              -- Si el protocolo consumió un insumo del botiquín.
    cantidad_insumo REAL DEFAULT 0.0,
    evidencia_adjunta TEXT DEFAULT 'S/D',    -- Ruta/nombre de imagen de ecografía o cámara.
    
    habilitado INTEGER DEFAULT 1,
    FOREIGN KEY (id_tripulante) REFERENCES tripulantes(id),
    FOREIGN KEY (id_entorno) REFERENCES entornos_mision(id),
    FOREIGN KEY (id_insumo_aplicado) REFERENCES insumos_medicos(id)
);

-- ---------------------------------------------------
--  FASE 6: TRIGGERS DE SEGURIDAD Y VISTAS OPERATIVAS
-- ---------------------------------------------------

-- 1. TRIGGER DE SUPERVIVENCIA: Impide dejar la misión sin Comandante Médico activo.
CREATE TRIGGER IF NOT EXISTS trg_proteger_ultimo_comandante_medico
BEFORE UPDATE OF habilitado ON tripulantes
FOR EACH ROW
WHEN NEW.habilitado = 0 AND OLD.habilitado = 1
BEGIN
    SELECT CASE
        WHEN (
            SELECT UPPER(r.rol) FROM tripulantexroles tr 
            JOIN roles r ON tr.id_rol = r.id 
            WHERE tr.id_tripulante = OLD.id AND tr.habilitado = 1
        ) = 'COMANDANTE MEDICO'
        AND (
            SELECT COUNT(*) FROM tripulantes t 
            JOIN tripulantexroles tr ON t.id = tr.id_tripulante 
            JOIN roles r ON tr.id_rol = r.id 
            WHERE UPPER(r.rol) = 'COMANDANTE MEDICO' AND t.habilitado = 1 AND tr.habilitado = 1
        ) <= 1
        THEN RAISE(ABORT, 'Violación de Seguridad de Misión: No se puede deshabilitar al único Comandante Médico activo.')
    END;
END;

-- 2. VISTA DE TRIPULACIÓN ACTIVA.
DROP VIEW IF EXISTS vista_tripulacion_activa;

CREATE VIEW vista_tripulacion_activa AS
SELECT 
    t.id, t.usuario, t.nombres, t.apellidos, t.codigo_astronauta, 
    t.racha_autocuidado, r.rol, COALESCE(e.especialidad, 'General') AS especialidad
FROM tripulantes t
JOIN tripulantexroles tr ON t.id = tr.id_tripulante AND tr.habilitado = 1
JOIN roles r ON tr.id_rol = r.id AND r.habilitado = 1
LEFT JOIN tripulantexespecialidades te ON t.id = te.id_tripulante AND te.habilitado = 1
LEFT JOIN especialidades e ON te.id_especialidad = e.id AND e.habilitado = 1
WHERE t.habilitado = 1;

-- 3. TRIGGERS DE BLOQUEO DE BORRADO FÍSICO (HARD DELETE LOCK PARA AUDITORÍA DE VUELO).
CREATE TRIGGER IF NOT EXISTS trg_bloquear_delete_tripulantes
BEFORE DELETE ON tripulantes
BEGIN
    SELECT RAISE(ABORT, 'Violación de Seguridad Nivel 1: Prohibido eliminar tripulantes físicamente. Utilice baja lógica.');
END;

CREATE TRIGGER IF NOT EXISTS trg_bloquear_delete_lecturas
BEFORE DELETE ON lecturas_biometricas
BEGIN
    SELECT RAISE(ABORT, 'Violación de Telemetría: Prohibido destruir registros históricos de salud espacial.');
END;

CREATE TRIGGER IF NOT EXISTS trg_bloquear_delete_insumos
BEFORE DELETE ON insumos_medicos
BEGIN
    SELECT RAISE(ABORT, 'Violación de Integridad: Prohibido eliminar insumos del botiquín físicamente.');
END;