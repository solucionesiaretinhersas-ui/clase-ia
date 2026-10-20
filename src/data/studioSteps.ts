export interface StudioStep {
  title: string;
  action: string;
  detail: string;
  tip: string;
}

/**
 * Guía de acceso a Google AI Studio. La interfaz de Google cambia con el
 * tiempo: los pasos se describen por el nombre de cada sección, no por su
 * posición exacta en pantalla.
 */
export const STUDIO_STEPS: StudioStep[] = [
  {
    title: 'Accede a Google AI Studio',
    action: 'Abre aistudio.google.com',
    detail: 'Escanea el QR o escribe la dirección en el navegador de tu celular o computador.',
    tip: 'Funciona mejor en un computador o tableta, pero también puedes usarlo desde el celular.',
  },
  {
    title: 'Inicia sesión con Google',
    action: 'Usa tu cuenta de Google',
    detail: 'Ingresa con tu cuenta personal o institucional. Si es la primera vez, acepta las condiciones de uso de Google.',
    tip: 'Esta app nunca te pide tu contraseña: el inicio de sesión ocurre únicamente en la página de Google.',
  },
  {
    title: 'Entra a Build',
    action: 'Busca “Build” en el menú',
    detail: 'En el menú de AI Studio, abre la sección Build. Allí se crean aplicaciones a partir de una descripción.',
    tip: 'Si no ves el menú en el celular, toca el ícono de menú (tres líneas) en la parte superior.',
  },
  {
    title: 'Escribe tu prompt',
    action: 'Pega el prompt del laboratorio',
    detail: 'Copia el Prompt 2 del laboratorio, reemplaza el marcador por la estructura que te dio ChatGPT, pégalo en Build y envíalo.',
    tip: 'La primera generación puede tardar uno o dos minutos. Es normal.',
  },
  {
    title: 'Revisa, prueba y mejora',
    action: 'Úsalo como si fueras estudiante',
    detail: 'Responde las preguntas, equivócate a propósito, revisa los textos. Luego pide mejoras concretas en el chat.',
    tip: 'Pide un cambio a la vez: “Haz los botones más grandes” funciona mejor que una lista larga.',
  },
  {
    title: 'Comparte o presenta',
    action: 'Guarda y comparte tu recurso',
    detail: 'Usa las opciones de guardar o compartir que ofrece AI Studio en tu cuenta. Antes de enviar el enlace, ábrelo en otro dispositivo para verificar que funciona.',
    tip: 'Si no puedes compartir todavía, presenta el recurso desde tu pantalla en la socialización.',
  },
];
