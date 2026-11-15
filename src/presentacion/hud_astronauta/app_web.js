// ===================================================================================
//  MOTOR ASÍNCRONO SPA — ASTRO_MED_HUD (DETECCIÓN LAN + SVG INTERACTIVO + CANVAS BI)
// ===================================================================================

const HOST_LAN = window.location.hostname || "127.0.0.1";
const API_BASE = `http://${HOST_LAN}:8000/api`;

let tripulantesCache = [];
let botiquinCache = [];
let analiticaActual = null;
let ultimoDiagnosticoSistemas = {
    NEURO_PSICO: "NOMINAL",
    CARDIO_RAD: "NOMINAL",
    METABOLICO_INMUNE: "NOMINAL",
    MUSCULO_ESQUELETICO: "NOMINAL"
};

const ENCICLOPEDIA_ORGANOS = {
    NEURO_PSICO: {
        titulo: "🧠 Sistema Neuro-Psicológico y Circadiano",
        peligros: "Peligros NASA: Aislamiento y Confinamiento + Entornos Cerrados.",
        explicacion: "Monitorea horas de sueño y estado de ánimo. En misiones a Marte o dentro de un Rover, la alteración de ciclos de luz de 24h y el encierro degradan la atención cognitiva y aumentan el riesgo de errores críticos en maniobras EVA."
    },
    CARDIO_RAD: {
        titulo: "❤️ Sistema Cardiovascular y Dosimetría de Radiación",
        peligros: "Peligros NASA: Radiación Espacial + Campos Gravitatorios Alterados.",
        explicacion: "En microgravedad (0G), los fluidos corporales se desplazan hacia el tórax y la cabeza, alterando la presión arterial. La radiación cósmica y las tormentas solares dañan el endotelio vascular y aceleran eventos coronarios."
    },
    METABOLICO_INMUNE: {
        titulo: "🩸 Sistema Metabólico, Endócrino e Inmunitario",
        peligros: "Peligros NASA: Entorno Hostil Cerrado + Estrés de Vuelo.",
        explicacion: "Controla la glucosa en sangre (mg/dL) y la temperatura corporal (°C). El estrés espacial provoca resistencia subclínica a la insulina y reactivación de virus latentes por inmunosupresión."
    },
    MUSCULO_ESQUELETICO: {
        titulo: "🦴 Sistema Músculo-Esquelético y Carga Mecánica",
        peligros: "Peligro NASA: Ausencia de Gravedad (0G) o Gravedad Parcial (Luna/Marte).",
        explicacion: "Sin carga gravitatoria terrestre, un astronauta pierde hasta 1.5% de densidad mineral ósea por mes y sufre atrofia muscular rápida si no cumple su cuota diaria en el equipo de ejercicio resistivo (ARED)."
    }
};

async function inicializarDatosHUD() {
    await Promise.all([cargarTripulantes(), cargarBotiquin()]);
    await cambiarTripulanteActivo();
}

async function cargarTripulantes() {
    const resp = await fetch(`${API_BASE}/tripulantes`);
    tripulantesCache = await resp.json();
    const select = document.getElementById("select-tripulante");
    select.innerHTML = "";

    tripulantesCache.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.id;
        opt.textContent = `${t.codigo_astronauta} — ${t.nombres} ${t.apellidos} (${t.especialidad})`;
        select.appendChild(opt);
    });
}

async function cargarBotiquin() {
    const resp = await fetch(`${API_BASE}/botiquin`);
    botiquinCache = await resp.json();

    const selectInsumo = document.getElementById("in-insumo");
    const listaUl = document.getElementById("lista-botiquin");
    selectInsumo.innerHTML = '<option value="">-- Ninguno --</option>';
    listaUl.innerHTML = "";

    botiquinCache.forEach(ins => {
        const opt = document.createElement("option");
        opt.value = ins.id;
        opt.textContent = `${ins.codigo} - ${ins.nombre} (Stock: ${ins.stock_actual})`;
        selectInsumo.appendChild(opt);

        const li = document.createElement("li");
        li.innerHTML = `<span><strong>${ins.codigo}</strong> ${ins.nombre}</span> <b>${ins.stock_actual} ${ins.unidad_medida}</b>`;
        listaUl.appendChild(li);
    });
}

async function cambiarTripulanteActivo() {
    const idTripulante = parseInt(document.getElementById("select-tripulante").value);
    const tripulante = tripulantesCache.find(t => t.id === idTripulante);
    if (tripulante) {
        document.getElementById("lbl-racha").textContent = `${tripulante.racha_autocuidado} Días Sol`;
    }

    const [respHist, respBi] = await Promise.all([
        fetch(`${API_BASE}/telemetria/tripulante/${idTripulante}?limite=15`),
        fetch(`${API_BASE}/analitica/${idTripulante}`)
    ]);

    const historial = await respHist.json();
    analiticaActual = await respBi.json();

    if (historial.length > 0) {
        const ultima = historial[0];
        document.getElementById("select-entorno").value = ultima.entorno;
        renderizarUltimaLectura(ultima);
    }
    dibujarGraficoEvolucion();
}

function renderizarUltimaLectura(lectura, diagnosticoExplicito = null) {
    // Actualizar KPIs numéricos.
    document.getElementById("kpi-presion").textContent = `${lectura.presion_sistolica} / ${lectura.presion_diastolica}`;
    document.getElementById("kpi-map").textContent = `Media (MAP): ${lectura.presion_media} mmHg`;
    document.getElementById("kpi-fc").textContent = `${lectura.frecuencia_cardiaca} BPM`;
    document.getElementById("kpi-glucosa").textContent = `${lectura.glucosa_mg_dl} mg/dL`;
    document.getElementById("kpi-temp").textContent = `${lectura.temperatura_c} °C`;
    document.getElementById("kpi-rad").textContent = `Rad: ${lectura.radiacion_msv} mSv`;
    document.getElementById("kpi-sueno").textContent = `${lectura.horas_sueno} hs`;
    document.getElementById("kpi-animo").textContent = `Ánimo: ${lectura.estado_animo} / 5`;
    document.getElementById("kpi-ejercicio").textContent = `${lectura.minutos_ejercicio} min`;
    document.getElementById("kpi-evidencia").textContent = `Imagen: ${lectura.evidencia_adjunta}`;

    // Nivel de alerta y colores.
    const claseAlerta = lectura.nivel_alerta.toLowerCase();
    const badgeGlobal = document.getElementById("badge-global");
    badgeGlobal.textContent = lectura.nivel_alerta;
    badgeGlobal.className = `badge ${claseAlerta}`;

    const panelProtocolo = document.getElementById("panel-protocolo");
    panelProtocolo.className = `bloque-triage ${claseAlerta}`;
    document.getElementById("triage-resumen").textContent = lectura.diagnostico_resumen;
    document.getElementById("triage-instruccion").textContent = lectura.instruccion_accion;

    const tagTierra = document.getElementById("triage-tierra");
    if (lectura.nivel_alerta === "CRITICO") {
        tagTierra.textContent = "📡 ALERTA MÉDICOS EN TIERRA (Paquete Prioritario)";
        tagTierra.style.color = "#F44336";
    } else {
        tagTierra.textContent = "🛡️ Autonomía Local Activa";
        tagTierra.style.color = "#38bdf8";
    }

    // Pintar las 4 zonas del cuerpo humano en SVG.
    const sistemas = ["NEURO_PSICO", "CARDIO_RAD", "METABOLICO_INMUNE", "MUSCULO_ESQUELETICO"];
    sistemas.forEach(sis => {
        let estadoZona = "NOMINAL";
        if (diagnosticoExplicito && diagnosticoExplicito.estado_sistemas) {
            estadoZona = diagnosticoExplicito.estado_sistemas[sis] || "NOMINAL";
        } else if (lectura.sistema_afectado === sis) {
            estadoZona = lectura.nivel_alerta;
        }
        ultimoDiagnosticoSistemas[sis] = estadoZona;
        const nodoSvg = document.getElementById(`zona-${sis}`);
        if (nodoSvg) {
            nodoSvg.setAttribute("class", `zona-clicable ${estadoZona.toLowerCase()}`);
        }
    });

    if (lectura.sistema_afectado && lectura.sistema_afectado !== "NINGUNO") {
        seleccionarSistema(lectura.sistema_afectado);
    }
}

function seleccionarSistema(codigoSistema) {
    const info = ENCICLOPEDIA_ORGANOS[codigoSistema];
    if (!info) return;
    const estadoActual = ultimoDiagnosticoSistemas[codigoSistema] || "NOMINAL";
    document.getElementById("titulo-organo").textContent = `${info.titulo} [${estadoActual}]`;
    document.getElementById("desc-organo").innerHTML =
        `<strong>${info.peligros}</strong><br>${info.explicacion}`;
}

function actualizarInfoEntorno() {
    const entorno = document.getElementById("select-entorno").value;
    document.getElementById("titulo-organo").textContent = `Entorno Seleccionado: ${entorno}`;
    document.getElementById("desc-organo").textContent =
        "El motor de reglas ajustó automáticamente los umbrales de sueño, radiación, presión y ejercicio para este entorno.";
}

document.getElementById("form-telemetria").addEventListener("submit", async (e) => {
    e.preventDefault();
    const idTripulante = parseInt(document.getElementById("select-tripulante").value);
    const idInsumoVal = document.getElementById("in-insumo").value;

    const payload = {
        id_tripulante: idTripulante,
        entorno: document.getElementById("select-entorno").value,
        presion_sistolica: parseInt(document.getElementById("in-sistolica").value),
        presion_diastolica: parseInt(document.getElementById("in-diastolica").value),
        frecuencia_cardiaca: parseInt(document.getElementById("in-fc").value),
        glucosa_mg_dl: parseFloat(document.getElementById("in-glucosa").value),
        temperatura_c: parseFloat(document.getElementById("in-temp").value),
        horas_sueno: parseFloat(document.getElementById("in-sueno").value),
        estado_animo: parseInt(document.getElementById("in-animo").value),
        minutos_ejercicio: parseInt(document.getElementById("in-ejercicio").value),
        radiacion_msv: parseFloat(document.getElementById("in-rad").value),
        evidencia_adjunta: document.getElementById("in-evidencia").value,
        id_insumo_aplicado: idInsumoVal ? parseInt(idInsumoVal) : null,
        cantidad_insumo: parseFloat(document.getElementById("in-cant-insumo").value || 0)
    };

    try {
        const resp = await fetch(`${API_BASE}/telemetria`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.detalle || "Error al registrar telemetría");

        document.getElementById("lbl-racha").textContent = `${data.racha_actualizada} Días Sol`;
        await cargarTripulantes();
        document.getElementById("select-tripulante").value = idTripulante;
        await cargarBotiquin();
        renderizarUltimaLectura(data.lectura, data.diagnostico);

        const respBi = await fetch(`${API_BASE}/analitica/${idTripulante}`);
        analiticaActual = await respBi.json();
        dibujarGraficoEvolucion();
    } catch (err) {
        alert("Alerta del Sistema: " + err.message);
    }
});

async function simularCrisis(escenario) {
    const idTripulante = parseInt(document.getElementById("select-tripulante").value);
    const resp = await fetch(`${API_BASE}/telemetria/simular-crisis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_tripulante: idTripulante, escenario })
    });
    const data = await resp.json();
    if (resp.ok) {
        document.getElementById("select-entorno").value = data.lectura.entorno;
        document.getElementById("lbl-racha").textContent = `${data.racha_actualizada} Días Sol`;
        renderizarUltimaLectura(data.lectura, data.diagnostico);
        const respBi = await fetch(`${API_BASE}/analitica/${idTripulante}`);
        analiticaActual = await respBi.json();
        dibujarGraficoEvolucion();
    }
}

function dibujarGraficoEvolucion() {
    const canvas = document.getElementById("canvas-evolucion");
    if (!canvas || !analiticaActual || !analiticaActual.series) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const metrica = document.getElementById("select-metrica-grafico").value;
    const valores = analiticaActual.series[metrica] || [];
    if (valores.length === 0) return;

    const padL = 42, padR = 20, padT = 20, padB = 30;
    const minVal = Math.min(...valores) * 0.9;
    const maxVal = Math.max(...valores) * 1.1 || 10;

    // Líneas guía horizontales.
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padT + ((H - padT - padB) / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(W - padR, y);
        ctx.stroke();

        const valEtiqueta = (maxVal - ((maxVal - minVal) / 4) * i).toFixed(0);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "11px sans-serif";
        ctx.fillText(valEtiqueta, 6, y + 4);
    }

    // Trazado de la curva.
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    valores.forEach((v, i) => {
        const x = padL + (i / Math.max(valores.length - 1, 1)) * (W - padL - padR);
        const y = padT + (1 - (v - minVal) / (maxVal - minVal || 1)) * (H - padT - padB);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Puntos de telemetría.
    valores.forEach((v, i) => {
        const x = padL + (i / Math.max(valores.length - 1, 1)) * (W - padL - padR);
        const y = padT + (1 - (v - minVal) / (maxVal - minVal || 1)) * (H - padT - padB);
        ctx.fillStyle = i === valores.length - 1 ? "#FF9800" : "#38bdf8";
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
}

inicializarDatosHUD().catch((error) => {
    document.getElementById("triage-resumen").textContent =
        `No se pudo cargar la información: ${error.message}`;
});