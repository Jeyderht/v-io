import { CLAVES, guardar, leer } from "./storage";

function aleatorio(n: number): Uint8Array {
  const a = new Uint8Array(n);
  try {
    crypto.getRandomValues(a);
  } catch {
    for (let i = 0; i < n; i++) a[i] = Math.floor(Math.random() * 256);
  }
  return a;
}

/**
 * Identificador aleatorio de este dispositivo (para el límite de dispositivos por plan).
 * Se crea una vez y se guarda en localStorage con la misma clave de siempre ("vio_dev").
 */
export function deviceId(): string {
  let d = leer(CLAVES.dispositivo);
  if (!d || d.length < 16) {
    d = Array.from(aleatorio(16))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    guardar(CLAVES.dispositivo, d);
  }
  return d;
}

export { aleatorio };
