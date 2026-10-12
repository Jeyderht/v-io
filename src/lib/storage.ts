/** localStorage seguro: nunca lanza (modo privado, almacenamiento bloqueado...). */
export function leer(clave: string): string | null {
  try {
    return localStorage.getItem(clave);
  } catch {
    return null;
  }
}
export function guardar(clave: string, valor: string | null): void {
  try {
    if (valor === null) localStorage.removeItem(clave);
    else localStorage.setItem(clave, valor);
  } catch {
    /* sin almacenamiento: la sesión no se recuerda */
  }
}

/** Claves usadas (las mismas que la versión anterior de la web). */
export const CLAVES = {
  dispositivo: "vio_dev",
  codigo: "vio_code",
} as const;
