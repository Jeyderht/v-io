import type { Pregunta } from "@/types";
import { PRECIO_A_MEDIDA } from "./planes";

/** Preguntas frecuentes (página Contacto) */
export const FAQ: Pregunta[] = [
  { q: "¿Sirve para eventos pagados?", a: "Sí, con los planes PRO y Productora. El plan DJ / VJ cubre tus propios sets y presentaciones." },
  {
    q: "¿En cuántos dispositivos puedo usarlo?",
    a: "DJ / VJ en 1, PRO en 2 y Productora en 5. Tu código se activa en cada dispositivo la primera vez que lo usas. Si cambias de equipo, escríbenos y lo liberamos.",
  },
  { q: "¿Funciona en Resolume?", a: "Sí, y en VirtualDJ, Serato Video, MadMapper o cualquier software VJ." },
  { q: "¿Qué formatos incluye?", a: "MP4 o MOV, en la resolución y formato indicados en cada visual (16:9, vertical o panorámico para LED)." },
  {
    q: "¿Hacen visuales personalizados?",
    a: "Sí. Logos animados, intros, contenido para LED de cualquier medida y shows completos. Cotiza por WhatsApp, desde " + PRECIO_A_MEDIDA + ".",
  },
  { q: "¿Cómo pago?", a: "Con tarjeta, Yape o transferencia por WhatsApp. Al confirmar el pago te enviamos tu código de acceso." },
  { q: "¿Si cancelo, pierdo mis descargas?", a: "No. Lo que descargaste mientras estabas suscrito lo puedes seguir usando." },
  { q: "¿Cómo cancelo?", a: "Escríbenos por WhatsApp y lo cancelamos al instante. Sin permanencia." },
];
