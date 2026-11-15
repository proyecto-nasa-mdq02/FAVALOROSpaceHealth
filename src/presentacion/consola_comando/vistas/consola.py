# =================================================================
#  CONSOLA DE AUDITORÍA SQL EN CAJA DE ARENA (SANDBOXING - CAPA 4)
# =================================================================

import tkinter as tk
from tkinter import ttk, messagebox
from src.presentacion.consola_comando.cliente_api import ClienteAPIAstroMed, ErrorClienteAPI


class VentanaConsolaSQL:
    def __init__(self, master: tk.Toplevel, cliente_api: ClienteAPIAstroMed):
        self.master = master
        self.api = cliente_api
        self.master.title("ASTRO-MED | Consola de Auditoría SQL (Modo Sandbox Solo Lectura)")
        self.master.geometry("820x500")
        self.master.configure(bg="#0b0f19")

        tk.Label(
            self.master,
            text="Consulta SQL (Solo se admiten sentencias SELECT sobre las tablas y vistas de misión):",
            bg="#0b0f19",
            fg="#38bdf8",
            font=("Segoe UI", 10, "bold"),
        ).pack(anchor="w", padx=14, pady=(12, 4))

        self.txt_query = tk.Entry(self.master, font=("Consolas", 11), bg="#131b2e", fg="#ffffff", insertbackground="white")
        self.txt_query.insert(0, "SELECT codigo_astronauta, nombres, apellidos, rol, racha_autocuidado FROM vista_tripulacion_activa")
        self.txt_query.pack(fill="x", padx=14, pady=4)

        tk.Button(
            self.master,
            text="EJECUTAR AUDITORÍA SQL",
            bg="#009688",
            fg="white",
            font=("Segoe UI", 9, "bold"),
            relief="flat",
            pady=6,
            command=self.ejecutar_consulta,
        ).pack(anchor="e", padx=14, pady=6)

        self.tabla = ttk.Treeview(self.master, show="headings", height=14)
        self.tabla.pack(fill="both", expand=True, padx=14, pady=10)

    def ejecutar_consulta(self) -> bool:
        query = self.txt_query.get().strip()
        try:
            res = self.api.ejecutar_sql_sandbox(query)
            columnas = res.get("columnas", [])
            filas = res.get("filas", [])

            self.tabla.delete(*self.tabla.get_children())
            self.tabla["columns"] = columnas
            for c in columnas:
                self.tabla.heading(c, text=c)
                self.tabla.column(c, width=120, anchor="center")

            for f in filas:
                self.tabla.insert("", "end", values=[f.get(c) for c in columnas])
            return True
        except ErrorClienteAPI as e:
            messagebox.showerror("Bloqueo de Seguridad Sandbox", str(e))
            return False