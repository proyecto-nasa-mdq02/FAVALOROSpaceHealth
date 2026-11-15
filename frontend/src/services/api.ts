const API_BASE = "http://localhost:8000/api";

export async function fetchJSON(path: string, opts?: RequestInit) {
  const resp = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(opts?.headers || {}) },
    ...opts,
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} en ${path}`);
  return resp.json();
}

export async function getTripulantes() {
  return fetchJSON("/tripulantes");
}

export async function getTelemetriaTripulante(id: number, limite = 15) {
  return fetchJSON(`/telemetria/tripulante/${id}?limite=${limite}`);
}

export async function getAnalitica(id: number) {
  return fetchJSON(`/analitica/${id}`);
}

export async function getBotiquin() {
  return fetchJSON("/botiquin");
}
