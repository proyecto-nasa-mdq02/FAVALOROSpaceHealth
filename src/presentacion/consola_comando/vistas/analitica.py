# ===========================================================================
#  TABLERO DE ANALÍTICA BIOMÉTRICA Y SERIES TEMPORALES (CAPA 4 - MATPLOTLIB)
# ===========================================================================

import tkinter as tk
from matplotlib.figure import Figure
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from src.presentacion.consola_comando.cliente_api import ClienteAPIAstroMed


class VentanaAnalitica:
    def __init__(self, master: tk.Toplevel, cliente_api: ClienteAPIAstroMed, id_tripulante_inicial: int = 1):
        self.master = master
        self.api = cliente_api
        self.id_tripulante = id_tripulante_inicial

        self.master.title("ASTRO-MED | Analítica Histórica de Indicadores Vitales (Pandas + Matplotlib)")
        self.master.geometry("940x620")
        self.master.configure(bg="#0b0f19")

        barra = tk.Frame(self.master, bg="#131b2e", pady=8, padx=12)
        barra.pack(fill="x")

        tk.Label(
            barra,
            text=f"📈 EVOLUCIÓN BIOMÉTRICA DEL TRIPULANTE ID #{self.id_tripulante}",
            fg="#38bdf8",
            bg="#131b2e",
            font=("Segoe UI", 11, "bold"),
        ).pack(side="left")

        self.lbl_resumen = tk.Label(barra, text="", fg="#f8fafc", bg="#131b2e", font=("Segoe UI", 9))
        self.lbl_resumen.pack(side="right")

        self.figura = Figure(figsize=(9, 5.2), dpi=100, facecolor="#0b0f19")
        self.canvas = FigureCanvasTkAgg(self.figura, master=self.master)
        self.canvas.get_tk_widget().pack(fill="both", expand=True, padx=10, pady=10)

        self.cargar_y_dibujar()

    def cargar_y_dibujar(self) -> None:
        datos = self.api.obtener_analitica(self.id_tripulante)
        self.datos_actuales = datos

        prom = datos.get("promedios", {})
        self.lbl_resumen.configure(
            text=f"Lecturas: {datos.get('total_lecturas', 0)} | "
                 f"Prom. FC: {prom.get('frecuencia_cardiaca', 0)} bpm | "
                 f"Prom. Glucosa: {prom.get('glucosa_mg_dl', 0)} mg/dL | "
                 f"Rad. Acumulada: {prom.get('radiacion_acumulada_msv', 0)} mSv"
        )

        self.figura.clear()
        series = datos.get("series", {})
        if not series:
            return

        ax1 = self.figura.add_subplot(211, facecolor="#131b2e")
        ax1.plot(series.get("presion_sistolica", []), label="Presión Sistólica (mmHg)", color="#38bdf8", marker="o")
        ax1.plot(series.get("frecuencia_cardiaca", []), label="Frecuencia Cardíaca (BPM)", color="#FF9800", marker="s")
        ax1.set_title("Tendencia Cardiovascular (Últimos 15 Registros)", color="white", fontsize=10)
        ax1.tick_params(colors="#94a3b8")
        ax1.legend(loc="upper left", fontsize=8)
        ax1.grid(True, color="#1e293b", linestyle="--")

        ax2 = self.figura.add_subplot(212, facecolor="#131b2e")
        ax2.plot(series.get("glucosa_mg_dl", []), label="Glucosa en Sangre (mg/dL)", color="#4CAF50", marker="^")
        ax2.set_title("Control Metabólico / Glucémico en Misión", color="white", fontsize=10)
        ax2.tick_params(colors="#94a3b8")
        ax2.legend(loc="upper left", fontsize=8)
        ax2.grid(True, color="#1e293b", linestyle="--")

        self.figura.tight_layout()
        self.canvas.draw()