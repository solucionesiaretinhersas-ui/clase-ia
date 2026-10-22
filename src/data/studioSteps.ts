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
    action: 'Pega el prompt que te dio ChatGPT',
    detail: 'Copia el prompt que te entregó ChatGPT, léelo y ajústalo si hace falta. Pégalo en Build y envíalo.',
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

/** Pasos para estudiantes: más cortos y con un lenguaje sencillo. */
export const STUDENT_STUDIO_STEPS: StudioStep[] = [
  {
    title: 'Abre AI Studio',
    action: 'Entra a aistudio.google.com',
    detail: 'Escanea el QR o escribe la dirección en el navegador de tu computador, tableta o celular.',
    tip: 'Funciona mejor en un computador o tableta.',
  },
  {
    title: 'Inicia sesión',
    action: 'Usa la cuenta que tu docente indique',
    detail: 'Entra con la cuenta de Google que indicó tu docente. Si te piden aceptar condiciones, léelas con tu docente.',
    tip: 'Nunca le dictes tu contraseña a nadie. El inicio de sesión solo ocurre en la página de Google.',
  },
  {
    title: 'Entra a Build',
    action: 'Busca “Build” en el menú',
    detail: 'En el menú de AI Studio abre Build: ahí se crean las aplicaciones a partir de lo que escribes.',
    tip: 'Si no ves el menú, toca el ícono de las tres rayitas arriba.',
  },
  {
    title: 'Pega tu prompt',
    action: 'Copia tu prompt de “Mi prompt”',
    detail: 'Vuelve a la pantalla “Mi prompt”, copia tu prompt, pégalo en Build y envíalo.',
    tip: 'La primera versión puede tardar uno o dos minutos. ¡Paciencia!',
  },
  {
    title: 'Prueba y mejora',
    action: 'Úsala como si fueras otra persona',
    detail: 'Juega tu app, equivócate a propósito y mira qué pasa. Luego pide UN cambio a la vez en el chat.',
    tip: 'Es mejor “haz los botones más grandes” que una lista larga de cambios.',
  },
  {
    title: 'Muéstrala',
    action: 'Prepárate para presentar',
    detail: 'Decide qué es lo mejor de tu app y cómo se la contarías a tus compañeros.',
    tip: 'Cuenta también qué le pediste a la IA y qué decidiste tú.',
  },
];

export const studioStepsFor = (audience: 'docente' | 'estudiante') => (audience === 'estudiante' ? STUDENT_STUDIO_STEPS : STUDIO_STEPS);