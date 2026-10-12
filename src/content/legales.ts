/**
 * Textos legales (pie de página → Licencia / Términos / Privacidad).
 * "contacto" se arma con el WhatsApp de NEXT_PUBLIC_WHATSAPP.
 */
import type { DocLegal, DocLegalId } from "@/types";

export const LEGAL_FECHA = "12 de octubre de 2026";

export function textosLegales(contacto: string): Record<DocLegalId, DocLegal> {
  const date = LEGAL_FECHA;
  return {
    licencia: {
      label: "Licencia",
      title: "Licencia de uso",
      date,
      intro:
        "Al suscribirte a V-IO recibes una licencia para usar los visuales del catálogo según tu plan. Los visuales siguen siendo propiedad de V-IO; lo que adquieres es el derecho de uso.",
      sections: [
        {
          h: "1. Qué incluye",
          ps: [
            "Una licencia no exclusiva, personal e intransferible para proyectar, mezclar y editar los visuales del catálogo en presentaciones en vivo, mientras tu suscripción esté activa.",
            "Puedes recortar, cambiar colores, combinar y sincronizar los visuales con tu música.",
          ],
        },
        {
          h: "2. Alcance según tu plan",
          ps: [
            "DJ / VJ: uso en tus propias presentaciones y sets como DJ o VJ, incluidas fechas en las que te contraten y transmisiones en vivo de tu set. 1 dispositivo.",
            "PRO: proyección pública en clubs, bares, fiestas y eventos, propios o de terceros. 2 dispositivos.",
            "Productora: uso en múltiples eventos, venues e instalaciones de tu empresa o productora. 5 dispositivos.",
          ],
        },
        {
          h: "3. Qué no está permitido",
          ps: [
            "Revender, compartir, regalar o publicar los archivos (por ejemplo en bancos de video, Drive públicos o grupos).",
            "Compartir tu código de acceso con otras personas.",
            "Usar los visuales como parte principal de publicidad o anuncios de marcas de terceros sin una licencia a medida.",
            "Presentarlos como obra propia, registrarlos o usarlos para entrenar modelos de inteligencia artificial.",
          ],
        },
        {
          h: "4. Si cancelas",
          ps: [
            "Puedes seguir usando en tus presentaciones los visuales que descargaste mientras tu suscripción estaba activa, bajo estas mismas condiciones. No podrás descargar visuales nuevos.",
          ],
        },
        {
          h: "5. Visuales a medida",
          ps: [
            "Los visuales hechos a pedido se rigen por lo acordado en cada cotización. Salvo que se indique lo contrario, el cliente puede usarlos sin límite de eventos y V-IO puede mostrarlos en su portafolio.",
          ],
        },
        {
          h: "6. Incumplimiento",
          ps: [
            "Si se detecta un uso fuera de esta licencia o el código se comparte, V-IO puede suspender el acceso sin reembolso.",
            "Consultas: " + contacto + ".",
          ],
        },
      ],
    },
    terminos: {
      label: "Términos",
      title: "Términos y condiciones",
      date,
      intro: "Estos términos regulan el uso de la web V-IO y la suscripción a su catálogo de visuales. Al suscribirte, los aceptas.",
      sections: [
        {
          h: "1. El servicio",
          ps: ["V-IO ofrece acceso a un catálogo de visuales digitales para DJs, VJs, clubs y eventos, y un servicio de visuales a medida, desde Lima, Perú."],
        },
        {
          h: "2. Suscripción y pago",
          ps: [
            "Los precios se muestran en soles (S/) e incluyen el periodo elegido (mensual o anual). El pago se coordina por WhatsApp mediante tarjeta, Yape o transferencia.",
            "Al confirmar el pago recibes un código de acceso personal, válido hasta la fecha de vencimiento de tu plan. La suscripción no se renueva automáticamente: para continuar, renuevas por WhatsApp.",
          ],
        },
        {
          h: "3. Código y dispositivos",
          ps: [
            "El código es personal y funciona en el número de dispositivos de tu plan (1, 2 o 5). Se activa en cada dispositivo la primera vez que se usa.",
            "Si cambias de equipo, escríbenos y liberamos tus dispositivos. No compartas tu código: hacerlo puede causar la suspensión del acceso.",
          ],
        },
        {
          h: "4. Cancelación y reembolsos",
          ps: [
            "Puedes dejar de renovar cuando quieras, sin permanencia. Una vez entregado el código y habilitado el acceso al catálogo, no se realizan reembolsos del periodo en curso, salvo que la ley aplicable disponga lo contrario o exista una falla del servicio que no podamos resolver.",
          ],
        },
        {
          h: "5. Disponibilidad",
          ps: [
            "Hacemos lo posible por mantener la web y los archivos disponibles, pero pueden existir interrupciones por mantenimiento o por los servicios de terceros que usamos (alojamiento web, base de datos y Google Drive).",
            "El catálogo puede cambiar: agregamos visuales nuevos y podemos retirar algunos.",
          ],
        },
        { h: "6. Cambios", ps: ["Podemos actualizar precios y estos términos. Los cambios de precio no afectan un periodo ya pagado."] },
        {
          h: "7. Ley aplicable y contacto",
          ps: ["Estos términos se rigen por las leyes de la República del Perú.", "Para consultas o reclamos: " + contacto + "."],
        },
      ],
    },
    privacidad: {
      label: "Privacidad",
      title: "Política de privacidad",
      date,
      intro:
        "En V-IO tratamos tus datos personales con cuidado y solo para darte el servicio, conforme a la Ley N.° 29733, Ley de Protección de Datos Personales del Perú.",
      sections: [
        {
          h: "1. Qué datos usamos",
          ps: [
            "Tu nombre, número de WhatsApp y correo, cuando nos escribes para suscribirte o cotizar.",
            "Tu plan, fecha de vencimiento y código de acceso (guardamos el código cifrado, no en texto legible).",
            "Un identificador aleatorio de tu dispositivo, para que tu acceso funcione solo en los dispositivos de tu plan. No incluye tu ubicación ni datos de tu teléfono.",
          ],
        },
        {
          h: "2. Para qué los usamos",
          ps: [
            "Para activar y mantener tu suscripción, darte acceso al catálogo, responder tus consultas y avisarte sobre renovaciones.",
            "No vendemos ni alquilamos tus datos, ni los usamos para publicidad de terceros.",
          ],
        },
        {
          h: "3. Dónde se guardan",
          ps: [
            "La web está alojada en Netlify, los datos de suscripción se guardan en Supabase y los archivos de video se sirven desde Google Drive. Estos proveedores pueden almacenar información fuera del Perú.",
            "En tu navegador guardamos tu código e identificador de dispositivo para que no tengas que ingresar cada vez. Puedes borrarlos cerrando sesión o limpiando los datos del navegador.",
          ],
        },
        {
          h: "4. Cuánto tiempo",
          ps: [
            "Conservamos tus datos mientras tengas una suscripción y hasta 12 meses después, salvo que pidas eliminarlos antes o la ley exija conservarlos.",
          ],
        },
        {
          h: "5. Tus derechos",
          ps: ["Puedes pedir acceder, corregir, cancelar u oponerte al uso de tus datos (derechos ARCO) escribiéndonos por " + contacto + "."],
        },
      ],
    },
  };
}
