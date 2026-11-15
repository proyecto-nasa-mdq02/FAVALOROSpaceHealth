# =============================================================================
#  PANEL DE CONTROL DE MISIÓN Y MONITOREO GRUPAL (CAPA 4 - CONSOLA DE COMANDO)
# =============================================================================

import tkinter as tk
from tkinter import ttk, messagebox
from src.presentacion.consola_comando.cliente_api import ClienteAPIAstroMed, ErrorClienteAPI
from src.presentacion.consola_comando.vistas.analitica import VentanaAnalitica
from src.presentacion.consola_comando.vistas.consola import VentanaConsolaSQL


class VentanaPanelControl:
    def __init__(self, master: tk.Toplevel, cliente_api: ClienteAPIAstroMed, al_cerrar=None):
        self.master = master
        self.api = cliente_api
        self.al_cerrar = al_cerrar

        op = self.api.operador_actual or {"nombres": "Operador", "rol": "Comandante Medico"}
        self.master.title(f"ASTRO-MED | Centro de Monitoreo de Tripulación — Operador: {op['nombres']} ({op['rol']})")
        self.master.geometry("1140x700")
        self.master.configure(bg="#0b0f19")

        if self.al_cerrar:
            self.master.protocol("WM_DELETE_WINDOW", self._cerrar)

        # Barra superior de acciones y cambio de misión.
        barra = tk.Frame(self.master, bg="#131b2e", pady=10, padx=14)
        barra.pack(fill="x")

        tk.Label(
            barra,
            text="🛰️ TELEMETRÍA DE TRIPULACIÓN EN TIEMPO REAL",
            fg="#38bdf8",
            bg="#131b2e",
            font=("Segoe UI", 12, "bold"),
        ).pack(side="left")

        tk.Button(
            barra,
            text="🔄 Sincronizar",
            bg="#2196F3",
            fg="white",
            font=("Segoe UI", 9, "bold"),
            relief="flat",
            padx=10,
            command=self.refrescar_tablero,
        ).pack(side="right", padx=4)

        self.btn_consola = tk.Button(
            barra,
            text="🛡️ Consola SQL Sandbox",
            bg="#607D8B",
            fg="white",
            font=("Segoe UI", 9, "bold"),
            relief="flat",
            padx=10,
            command=self.abrir_consola_sql,
        )
        self.btn_consola.pack(side="right", padx=4)
        if op.get("rol") == "Especialista de Mision":
            self.btn_consola.configure(state="disabled")

        tk.Button(
            barra,
            text="📈 Gráficos de Evolución (BI)",
            bg="#9C27B0",
            fg="white",
            font=("Segoe UI", 9, "bold"),
            relief="flat",
            padx=10,
            command=self.abrir_analitica,
        ).pack(side="right", padx=4)

        # Barra de conmutación de Misiones Interplanetarias.
        marco_misiones = tk.Frame(self.master, bg="#0b0f19", pady=6)
        marco_misiones.pack(fill="x", padx=14)

        tk.Label(
            marco_misiones,
            text="Simulador de Escenario Interplanetario:",
            bg="#0b0f19",
            fg="#38bdf8",
            font=("Segoe UI", 9, "bold"),
        ).pack(side="left", padx=(0, 8))

        for texto_m, cod_m, col_m in [
            ("🌕 Misión Artemis (Luna)", "ARTEMIS_LUNA", "#009688"),
            ("🔴 Misión Ares (Marte)", "ARES_MARTE", "#E65100"),
            ("❄️ Misión Crio-Europa (Luna Helada de Júpiter)", "EUROPA_JUPITER", "#1565C0"),
        ]:
            tk.Button(
                marco_misiones,
                text=texto_m,
                bg=col_m,
                fg="white",
                font=("Segoe UI", 9, "bold"),
                relief="flat",
                padx=8,
                command=lambda m=cod_m: self.conmutar_mision(m),
            ).pack(side="left", padx=4)

        # Grilla 1: Estado de los Tripulantes.
        marco_trip = tk.LabelFrame(
            self.master,
            text=" Nómina Activa del Escuadrón (7 Astronautas — Seleccioná uno para simular o auditar) ",
            bg="#0b0f19",
            fg="#94a3b8",
            font=("Segoe UI", 10, "bold"),
            padx=10,
            pady=8,
        )
        marco_trip.pack(fill="x", padx=14, pady=(6, 6))

        cols_t = ("id", "codigo", "nombre", "rol", "especialidad", "racha")
        self.tabla_tripulantes = ttk.Treeview(marco_trip, columns=cols_t, show="headings", height=7)
        encabezados_t = {
            "id": ("ID", 45),
            "codigo": ("Código NASA", 100),
            "nombre": ("Astronauta", 220),
            "rol": ("Rango de Misión", 180),
            "especialidad": ("Especialidad Operativa", 240),
            "racha": ("🔥 Racha Autocuidado", 140),
        }
        for col, (txt, ancho) in encabezados_t.items():
            self.tabla_tripulantes.heading(col, text=txt)
            self.tabla_tripulantes.column(col, width=ancho, anchor="center")
        self.tabla_tripulantes.pack(fill="x")

        # Botonera de Simulación de los 5 Peligros de la NASA.
        marco_sim = tk.Frame(self.master, bg="#0b0f19", pady=6)
        marco_sim.pack(fill="x", padx=14)

        tk.Label(
            marco_sim,
            text="Inyectar Escenario de Crisis al Tripulante Seleccionado:",
            bg="#0b0f19",
            fg="#f8fafc",
            font=("Segoe UI", 9, "bold"),
        ).pack(side="left", padx=(0, 8))

        escenarios = [
            ("☢️ Tormenta Solar (0G)", "TORMENTA_SOLAR", "#F44336"),
            ("🧠 Confinamiento Rover", "CONFINAMIENTO_ROVER", "#9C27B0"),
            ("🩸 Hipoglucemia + Fiebre EVA", "HIPOGLUCEMIA_EVA", "#FF9800"),
            ("🦴 Déficit Ejercicio 0G", "ATROFIA_CERO_G", "#009688"),
        ]
        for etiqueta, cod, color in escenarios:
            tk.Button(
                marco_sim,
                text=etiqueta,
                bg=color,
                fg="white",
                font=("Segoe UI", 9, "bold"),
                relief="flat",
                padx=8,
                command=lambda c=cod: self.disparar_simulacion(c),
            ).pack(side="left", padx=4)

        # Grilla 2: Bitácora Histórica de Lecturas Biométricas y Triage.
        marco_tel = tk.LabelFrame(
            self.master,
            text=" Bitácora de Telemetría Biométrica y Diagnóstico Autónomo (Sincronizada con HUD Web) ",
            bg="#0b0f19",
            fg="#94a3b8",
            font=("Segoe UI", 10, "bold"),
            padx=10,
            pady=8,
        )
        marco_tel.pack(fill="both", expand=True, padx=14, pady=8)

        cols_l = ("id", "fecha", "tripulante", "entorno", "pa", "fc", "glucosa", "sueno", "alerta", "sistema", "diagnostico")
        self.tabla_telemetria = ttk.Treeview(marco_tel, columns=cols_l, show="headings", height=10)
        encabezados_l = {
            "id": ("ID", 40),
            "fecha": ("Fecha / Hora", 135),
            "tripulante": ("ID Trip.", 60),
            "entorno": ("Entorno Espacial", 150),
            "pa": ("PA (MAP)", 105),
            "fc": ("Pulso", 65),
            "glucosa": ("Glucosa", 75),
            "sueno": ("Sueño", 60),
            "alerta": ("Estado Triage", 95),
            "sistema": ("Sistema Afectado", 135),
            "diagnostico": ("Diagnóstico / Instrucción", 320),
        }
        for col, (txt, ancho) in encabezados_l.items():
            self.tabla_telemetria.heading(col, text=txt)
            self.tabla_telemetria.column(col, width=ancho, anchor="center")

        self.tabla_telemetria.tag_configure("NOMINAL", background="#e8f5e9", foreground="#1b5e20")
        self.tabla_telemetria.tag_configure("PRECAUCION", background="#fff3e0", foreground="#e65100")
        self.tabla_telemetria.tag_configure("CRITICO", background="#ffebee", foreground="#b71c1c")
        self.tabla_telemetria.pack(fill="both", expand=True)

        self.refrescar_tablero()

    def obtener_id_tripulante_seleccionado(self) -> int:
        sel = self.tabla_tripulantes.selection()
        if sel:
            valores = self.tabla_tripulantes.item(sel[0], "values")
            return int(valores[0])
        items = self.tabla_tripulantes.get_children()
        if items:
            return int(self.tabla_tripulantes.item(items[0], "values")[0])
        return 1

    def refrescar_tablero(self) -> None:
        for item in self.tabla_tripulantes.get_children():
            self.tabla_tripulantes.delete(item)
        for item in self.tabla_telemetria.get_children():
            self.tabla_telemetria.delete(item)

        tripulantes = self.api.listar_tripulantes()
        for t in tripulantes:
            self.tabla_tripulantes.insert(
                "",
                "end",
                values=(
                    t["id"],
                    t["codigo_astronauta"],
                    f"{t['nombres']} {t['apellidos']}",
                    t["rol"],
                    t["especialidad"],
                    f"{t['racha_autocuidado']} días Sol",
                ),
            )

        lecturas = self.api.listar_telemetria()
        for l in lecturas[:45]:
            alerta = l["nivel_alerta"]
            self.tabla_telemetria.insert(
                "",
                "end",
                values=(
                    l["id"],
                    l["fecha"],
                    f"AST-00{l['id_tripulante']}",
                    l["entorno"],
                    f"{l['presion_sistolica']}/{l['presion_diastolica']} ({l['presion_media']})",
                    f"{l['frecuencia_cardiaca']} bpm",
                    f"{l['glucosa_mg_dl']} mg/dL",
                    f"{l['horas_sueno']} h",
                    alerta,
                    l["sistema_afectado"],
                    l["instruccion_accion"],
                ),
                tags=(alerta,),
            )

    def conmutar_mision(self, codigo_mision: str) -> None:
        try:
            self.api.cambiar_mision(codigo_mision)
            self.refrescar_tablero()
            messagebox.showinfo("Simulador Interplanetario", f"Escenario {codigo_mision} cargado y sincronizado.")
        except ErrorClienteAPI as e:
            messagebox.showerror("Error de Simulación", str(e))

    def disparar_simulacion(self, escenario: str) -> None:
        id_t = self.obtener_id_tripulante_seleccionado()
        try:
            res = self.api.simular_crisis(id_t, escenario)
            diag = res["diagnostico"]
            self.refrescar_tablero()
            messagebox.showwarning(
                f"Triage Disparado: {diag['nivel_alerta_global']}",
                f"Sistema Afectado: {diag['sistema_afectado_principal']}\n\n"
                f"Diagnóstico: {diag['resumen_clinico']}\n\n"
                f"Protocolo Guiado: {diag['instruccion_paso_a_paso']}",
            )
        except ErrorClienteAPI as e:
            messagebox.showerror("Error de Telemetría", str(e))

    def abrir_analitica(self) -> None:
        id_t = self.obtener_id_tripulante_seleccionado()
        top = tk.Toplevel(self.master)
        VentanaAnalitica(top, self.api, id_tripulante_inicial=id_t)

    def abrir_consola_sql(self) -> None:
        top = tk.Toplevel(self.master)
        VentanaConsolaSQL(top, self.api)

    def _cerrar(self) -> None:
        self.master.destroy()
        if self.al_cerrar:
            self.al_cerrar()