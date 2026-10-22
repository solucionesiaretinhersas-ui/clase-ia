export type MomentId = string;

export interface Moment {
  id: MomentId;
  index: number;
  title: string;
  short: string;
  minutes: number;
  /** Variable CSS del color de acento del momento */
  accent: string;
}

export const MOMENTS: Moment[] = [
  { id: 'm1', index: 1, title: 'La IA llegó a la educación', short: 'La IA', minutes: 12, accent: 'var(--violet)' },
  { id: 'm2', index: 2, title: 'Google AI Studio y el vibe coding', short: 'AI Studio', minutes: 14, accent: 'var(--blue)' },
  { id: 'm3', index: 3, title: 'Tu prompt con ROCAS', short: 'ROCAS', minutes: 20, accent: 'var(--cyan)' },
  { id: 'm4', index: 4, title: 'Construir y probar', short: 'Construir', minutes: 30, accent: 'var(--mint)' },
  { id: 'm5', index: 5, title: 'Compartir y mejorar', short: 'Compartir', minutes: 6, accent: 'var(--amber)' },
  { id: 'm6', index: 6, title: 'Llevarlo al aula', short: 'Aplicar', minutes: 8, accent: 'var(--rose)' },
];

export const TOTAL_MINUTES = MOMENTS.reduce((s, m) => s + m.minutes, 0);

export interface FacilitatorNotes {
  objective: string;
  explanation: string;
  steps: string[];
  activity?: string;
  /** Qué ven y hacen los docentes en su celular mientras esta pantalla está proyectada */
  participant: string;
  /** Minutos sugeridos para esta pantalla dentro del momento */
  minutes: number;
}

export interface ScreenMeta {
  id: string;
  moment: MomentId;
  title: string;
  kind: 'cover' | 'content' | 'activity' | 'tool';
  notes: FacilitatorNotes;
}

export const SCREENS: ScreenMeta[] = [
  {
    id: 'inicio',
    moment: 'm0',
    title: 'Bienvenida',
    kind: 'cover',
    notes: {
      minutes: 1,
      participant: 'Escanea el QR de la siguiente pantalla para seguir el taller desde tu celular.',
      objective: 'Dar la bienvenida y generar expectativa sobre lo que se va a construir hoy.',
      explanation:
        'Hoy no venimos a ver una presentación sobre IA: venimos a salir con un recurso interactivo creado por cada docente, con su criterio y su contexto.',
      steps: [
        'Proyecta esta portada mientras llegan los participantes.',
        'Pide que tengan a mano su celular o computador y su cuenta de Google.',
        'Presiona F para pantalla completa y N para abrir o cerrar estas notas.',
      ],
    },
  },
  {
    id: 'ruta',
    moment: 'm0',
    title: 'La ruta de hoy',
    kind: 'content',
    notes: {
      minutes: 1,
      participant: 'Escanea el QR, escribe tu nombre y entra: tu celular te acompañará todo el taller con los enlaces que vayamos abriendo.',
      objective: 'Mostrar el recorrido de 90 minutos y conectar a los docentes con el seguimiento en vivo.',
      explanation:
        'Seis momentos: abrir con la charla, conocer AI Studio, planear con ChatGPT, crear y perfeccionar, compartir y cerrar. Más de un tercio del tiempo es práctica.',
      steps: [
        'Recorre los seis momentos señalando el tiempo de cada uno.',
        'Pide que escaneen el único QR del taller y escriban su nombre: con él se arma la ruleta de participación.',
        'Inicia el cronómetro del Momento 1 desde la barra superior (tecla T).',
      ],
    },
  },
  {
    id: 'votacion',
    moment: 'm1',
    title: 'Votación de apertura',
    kind: 'activity',
    notes: {
      minutes: 2,
      participant: 'Escanea el QR del tablero, toca tu respuesta y mira cómo se suma la del grupo.',
      objective: 'Diagnosticar cuánta experiencia tiene el grupo con la IA y romper el hielo.',
      explanation: 'El resultado ajusta el ritmo: si la mayoría nunca ha usado IA, dedica más tiempo al Momento 2.',
      steps: [
        'Activa la actividad con “Abrir votación”.',
        'Los docentes votan desde el celular (en vivo) o pasan al tablero.',
        'Muestra los resultados y comenta el punto de partida del grupo.',
      ],
      activity: 'Votación en vivo desde los celulares, o conteo manual en el tablero.',
    },
  },
  {
    id: 'potencia',
    moment: 'm1',
    title: 'La IA llegó para potenciarte',
    kind: 'content',
    notes: {
      minutes: 4,
      participant: 'Escucha: la IA no viene a reemplazarte, viene a ampliar lo que puedes diseñar. Toca la gráfica con tu equipo.',
      objective: 'Generar reflexión, interés y confianza: la IA potencia las capacidades de diseño del docente y le devuelve tiempo para sus estudiantes.',
      explanation:
        'La IA no llegó para reemplazar al docente. Llegó para ayudarle a potenciar sus capacidades, ampliar sus posibilidades de diseño pedagógico y dedicar más tiempo a lo verdaderamente importante: el aprendizaje de sus estudiantes.',
      steps: [
        'Lee la pregunta provocadora y deja diez segundos de silencio.',
        'Toca Docente + IA y luego cada eje de la gráfica: explica qué cambia y qué sigue siendo humano. Es una ilustración, no una medición.',
        'Cierra con la idea: la IA acelera el borrador, tú diriges el diseño. Pasa a la actividad siguiente.',
      ],
      activity: 'Gráfica interactiva que se explica al tocar sus ejes.',
    },
  },
  {
    id: 'humano-ia',
    moment: 'm1',
    title: '¿La IA ayuda o solo tú?',
    kind: 'activity',
    notes: {
      minutes: 3,
      participant: 'Para cada situación, toca en tu celular si la IA ayuda o si solo tú puedes hacerlo.',
      objective: 'Distinguir qué tareas puede acelerar la IA y cuáles solo puede hacer el docente.',
      explanation:
        'La IA ayuda con borradores y variantes; la decisión pedagógica, el cuidado de los estudiantes y la verificación son responsabilidad humana.',
      steps: [
        'Abre la actividad y llama a un docente por situación.',
        'Pide que justifique su elección antes de tocar el botón.',
        'Comenta la retroalimentación y cierra con el resumen de lo humano.',
      ],
      activity: 'Clasificación de 8 tareas docentes: la IA ayuda / solo tú.',
    },
  },
  {
    id: 'lluvia',
    moment: 'm1',
    title: 'Una tarea que quiero mejorar',
    kind: 'activity',
    notes: {
      minutes: 3,
      participant: 'Escribe desde tu celular qué tarea educativa te gustaría mejorar con ayuda de la IA.',
      objective: 'Abrir el diálogo: que cada docente nombre la tarea educativa que más le gustaría mejorar.',
      explanation:
        'Las tareas que se repiten muestran dónde puede ayudar la IA: preparar materiales, personalizar, evaluar, comunicar. Ahí empieza cada recurso.',
      steps: [
        'Pulsa Abrir muro y pide que escaneen el QR y escriban una tarea.',
        'Lee 3 o 4 ideas, destaca las que más se repiten con la estrella y oculta las que no aplican.',
        'Conecta con lo siguiente: veremos cómo una idea se convierte en un recurso digital funcional.',
      ],
      activity: 'Muro de ideas con participación desde los celulares.',
    },
  },
  {
    id: 'vibe',
    moment: 'm2',
    title: 'Vibe coding',
    kind: 'content',
    notes: {
      minutes: 3,
      participant: 'Mira cómo se crea una aplicación escribiendo: se describe, la IA programa, se prueba y se mejora.',
      objective: 'Explicar que Google AI Studio funciona con vibe coding: programar describiendo en lenguaje natural.',
      explanation:
        'No hace falta saber programar para empezar: se describe lo que se quiere, la IA genera el código, se prueba el resultado y se piden mejoras conversando.',
      steps: [
        'Deja correr la animación y narra cada paso: describes, la IA programa, pruebas, mejoras.',
        'Pausa en el paso 3 y pregunta: ¿qué cambiarían ustedes?',
        'Aclara que tú sigues siendo quien decide qué se construye y si sirve para tus estudiantes.',
      ],
      activity: 'Animación guiada paso a paso.',
    },
  },
  {
    id: 'ai-studio',
    moment: 'm2',
    title: 'Galería de experiencias',
    kind: 'content',
    notes: {
      minutes: 3,
      participant: 'Elige desde tu celular qué tipo de experiencia te gustaría crear: quiz, simulador, juego, historia, tutor o laboratorio.',
      objective: 'Descubrir qué se puede crear con Google AI Studio (Build) y elegir el tipo de experiencia que cada docente construirá.',
      explanation:
        'No explicamos la herramienta: la usamos. En Build se describe el recurso con palabras y Gemini lo construye; cada tipo de experiencia se pide con una frase distinta.',
      steps: [
        'Abre la votación y toca cada tarjeta para mostrar su vista previa y el prompt de ejemplo.',
        'Pide a 2 o 3 docentes que cuenten para qué tema usarían el tipo que más les gustó.',
        'Cierra con el ciclo describir, generar, probar y mejorar, y pasa a entrar a Build.',
      ],
      activity: 'Votación en vivo del tipo de experiencia y prompts de ejemplo copiables.',
    },
  },
  {
    id: 'demo-vivo',
    moment: 'm2',
    title: 'Demostración en vivo',
    kind: 'tool',
    notes: {
      minutes: 5,
      participant: 'El facilitador muestra Google AI Studio real. Observa qué hace, qué espera y qué verifica en cada paso.',
      objective: 'Proyectar la herramienta real, iniciar sesión en el sitio de Google, entrar a Build, probar un recurso y mejorarlo, sin perder el hilo de la presentación.',
      explanation:
        'Google no permite mostrar AI Studio ni su inicio de sesión dentro de otra página. Se abre en una ventana propia al lado de la presentación; esta cabina guía cada paso: qué explicas, qué observan, qué haces, qué esperas y qué verificas.',
      steps: [
        'Pulsa Abrir Google AI Studio (ventana a la derecha) e inicia sesión en el sitio de Google.',
        'Abre el guion flotante (vista dividida) y ponlo sobre AI Studio para ver el paso actual y copiar los prompts.',
        'Avanza con Siguiente, retrocede con Anterior o usa Pausar si necesitas atender al grupo.',
        'Si Build no está disponible en tu cuenta, dilo con honestidad y continúa con la galería de recursos.',
      ],
      activity: 'Demostración guiada de ocho pasos con pausa y retroceso.',
    },
  },
  {
    id: 'estacion',
    moment: 'm2',
    title: 'Llega a Build',
    kind: 'tool',
    notes: {
      minutes: 3,
      participant: 'Sigue los pasos hasta llegar a Build y marca desde tu celular cómo vas: listo, en proceso o necesito ayuda.',
      objective: 'Guiar paso a paso el acceso a Google AI Studio y a la sección Build.',
      explanation:
        'Cada docente debe llegar a la pantalla de Build antes de terminar este momento. La interfaz de Google puede cambiar: guíate por los nombres de las secciones.',
      steps: [
        'Pide que abran Google AI Studio desde el enlace que ya aparece en su celular.',
        'Avanza paso a paso: el tablero muestra cuántos docentes ya están listos y cuántos necesitan ayuda.',
        'Atiende primero a quienes marcaron "Necesito ayuda" (suele ser el inicio de sesión).',
      ],
      activity: 'Registro de avance en vivo desde los celulares.',
    },
  },
  {
    id: 'rocas',
    moment: 'm3',
    title: 'Metodología ROCAS',
    kind: 'content',
    notes: {
      minutes: 4,
      participant: 'ROCAS: Rol, Objetivo, Contexto, Acción y Solución. Cinco piedras para un prompt fuerte como las rocas.',
      objective: 'Presentar ROCAS como método para escribir prompts fuertes que sostienen la petición a la IA.',
      explanation:
        'R de Rol (quién es la IA), O de Objetivo (qué quieres lograr), C de Contexto (para quién y cómo es tu aula), A de Acción (qué debe hacer, paso a paso) y S de Solución (qué entrega esperas).',
      steps: [
        'Toca cada piedra y lee su pregunta y su ejemplo en voz alta.',
        'Subraya que el Contexto es la parte humana: la IA no conoce a tus estudiantes.',
        'Anuncia que ahora se van a ensayar con un juego en equipos.',
      ],
      activity: 'Piedras interactivas con ejemplos.',
    },
  },
  {
    id: 'rocas-vs',
    moment: 'm3',
    title: 'Prompt frágil o prompt fuerte',
    kind: 'activity',
    notes: {
      minutes: 3,
      participant: 'Mira cómo se fortalece un prompt al agregar cada piedra de ROCAS.',
      objective: 'Ver el efecto de cada parte de ROCAS sobre la calidad del prompt.',
      explanation: 'Un prompt con una sola frase genera una respuesta genérica; con las cinco piedras genera un recurso a la medida.',
      steps: [
        'Pide a un docente que pase a tocar las piedras una por una.',
        'Lee cómo crece el prompt y cómo sube la fuerza.',
        'Cuando se completen las cinco, celebra y pasa al juego.',
      ],
      activity: 'Una persona pasa al tablero a construir el prompt tocando cada piedra.',
    },
  },
  {
    id: 'rocas-juego',
    moment: 'm3',
    title: 'Construye el prompt más sólido',
    kind: 'activity',
    notes: {
      minutes: 6,
      participant: 'Dos equipos juegan en la pizarra. Miren el reto en su celular y animen: cada fragmento va en su letra de ROCAS.',
      objective: 'Practicar ROCAS jugando: cada equipo ordena fragmentos de prompt en la piedra correcta, con tiempo, comprobación y corrección de errores.',
      explanation:
        'Cada equipo tiene un turno de 90 segundos por reto. Acierto: +10. Completar toda la estructura: +20 y un bonus por tiempo. Los errores vuelven para corregirse.',
      steps: [
        'Pulsa el botón de equipos (tecla E) y divide el salón en dos grupos; pon nombre a cada equipo.',
        'Un integrante arrastra los fragmentos a su letra (o toca el fragmento y luego la letra) y el equipo decide en conjunto.',
        'Pulsa Comprobar: lo correcto se fija, lo incorrecto regresa para corregirlo.',
        'Si el tiempo apremia, termina el turno y pasa al siguiente reto; puedes saltar el juego con la flecha.',
      ],
      activity: 'Juego por equipos de arrastrar y soltar con tres retos y marcador.',
    },
  },
  {
    id: 'laboratorio',
    moment: 'm3',
    title: 'Constructor de prompts ROCAS',
    kind: 'tool',
    notes: {
      minutes: 7,
      participant: 'Escribe tu Rol, Objetivo, Contexto, Acción y Solución. Mira cómo se ensambla tu instrucción y cópiala para ChatGPT.',
      objective: 'Que cada docente construya su prompt completo con ROCAS sobre una necesidad real de su clase.',
      explanation:
        'El constructor solo estructura el texto: no usa ningún modelo. La generación y la mejora ocurren en ChatGPT. La parte humana está en el Contexto.',
      steps: [
        'Pide que carguen un ejemplo si necesitan inspiración y que luego lo cambien por su caso.',
        'Recorre las cinco piedras: R, O, C, A y S. Insiste en que la S es el resultado esperado, no los pasos.',
        'Copian el Prompt 1, lo pegan en ChatGPT y le piden que lo revise y lo mejore.',
        'No pidas contraseñas ni uses cuentas ajenas: cada docente usa su propia cuenta.',
      ],
      activity: 'Constructor de prompts con ensamblado animado.',
    },
  },
  {
    id: 'flujo',
    moment: 'm4',
    title: 'De la necesidad al recurso',
    kind: 'content',
    notes: {
      minutes: 4,
      participant: 'Mira el recorrido completo: necesidad, prompt ROCAS, ChatGPT, AI Studio, prueba y mejora.',
      objective: 'Conectar las dos herramientas y dejar clara la función de cada una dentro del taller.',
      explanation:
        'ChatGPT ayuda a formular y perfeccionar el prompt con ROCAS. Google AI Studio sirve para explorar el desarrollo de un recurso o prototipo interactivo, especialmente en Build cuando esté disponible. El docente decide, prueba y corrige.',
      steps: [
        'Pulsa “Revelar siguiente” para ir mostrando cada paso y nombra quién actúa: tú, ChatGPT o AI Studio.',
        'Detente en los pasos 6 a 8: probar, detectar errores y mejorar. Ahí está el aprendizaje.',
        'Aclara que el recurso generado es un borrador y que el criterio pedagógico es del docente.',
      ],
      activity: 'Recorrido de ocho pasos que se revela con el toque.',
    },
  },
  {
    id: 'recursos',
    moment: 'm4',
    title: 'Galería de recursos',
    kind: 'content',
    notes: {
      minutes: 4,
      participant: 'Explora seis tipos de recursos educativos que se pueden construir. Algunos son demostraciones que funcionan aquí.',
      objective: 'Inspirar con ejemplos concretos de lo que se puede construir y distinguir lo funcional de lo ilustrativo.',
      explanation:
        'Cada tarjeta es un tipo de recurso con identidad propia. Los marcados como demostración funcionan en esta página; los marcados como maqueta solo muestran cómo podrían verse.',
      steps: [
        'Abre el simulador del ciclo del agua y mueve la temperatura con un voluntario.',
        'Abre el juego de fracciones y deja que un docente pase al tablero a jugarlo.',
        'Recuerda que las maquetas no son recursos funcionales: hay que construirlos en AI Studio y probarlos.',
      ],
      activity: 'Demostraciones locales que se manejan al tacto.',
    },
  },
  {
    id: 'taller',
    moment: 'm4',
    title: 'Construye y prueba tu recurso',
    kind: 'tool',
    notes: {
      minutes: 22,
      participant: 'Pega tu instrucción en Build, pruébalo con la lupa pedagógica, mejóralo y marca cómo vas en cada fase.',
      objective: 'Cada docente genera una primera versión de su recurso, la prueba, detecta errores y la mejora.',
      explanation:
        'Cuatro fases: prompt listo, primera versión, prueba con la lupa y mejora. Hay que probar, revisar y corregir: la IA no es infalible.',
      steps: [
        'Inicia el temporizador de la etapa (tecla T).',
        'Avanza las fases en pantalla: el tablero muestra en vivo cuántos van listos para ajustar el ritmo.',
        'En la fase 3 abre la lupa pedagógica: cada criterio trae qué se revisa, cómo corregirlo y un prompt de mejora.',
        'Recuerda que la lupa sugiere, no certifica: la decisión final es del docente.',
      ],
      activity: 'Creación guiada con avance en vivo y lupa pedagógica.',
    },
  },
  {
    id: 'galeria',
    moment: 'm5',
    title: 'Galería de recursos',
    kind: 'activity',
    notes: {
      minutes: 3,
      participant: 'Uno o dos docentes presentan su recurso. Prepárate para dar retroalimentación.',
      objective: 'Socializar uno o dos recursos creados y recibir retroalimentación entre pares.',
      explanation:
        'Cada presentación dura máximo 2 minutos: qué problema resuelve, cómo lo hicieron y qué les pareció el proceso.',
      steps: [
        'Registra en el tablero los recursos que se van a presentar.',
        'Usa “Elegir al azar” o invita a voluntarios.',
        'Pregunta al docente: ¿qué mejoró después de la primera versión? ¿qué aportó usted que la IA no sabía?',
      ],
      activity: 'Galería con sorteo, foco de presentación y temporizador de 2 minutos.',
    },
  },
  {
    id: 'dialogo',
    moment: 'm5',
    title: 'Diálogo y reflexión',
    kind: 'activity',
    notes: {
      minutes: 3,
      participant: 'Después de ver los recursos, comparte un aprendizaje, una duda o una idea desde tu celular.',
      objective: 'Dialogar y reflexionar colectivamente sobre lo visto en los recursos presentados.',
      explanation:
        'El aprendizaje entre colegas multiplica el valor del taller: cada recurso despierta ideas para otra aula.',
      steps: [
        'Abre el muro y pide un aprendizaje, una duda o una idea.',
        'Lee y comenta algunas contribuciones; invita a responderlas oralmente.',
        'Pregunta: ¿qué se llevan para su propia práctica?',
      ],
      activity: 'Muro de diálogo con participación desde los celulares.',
    },
  },
  {
    id: 'etica',
    moment: 'm6',
    title: 'Tres ideas para llevarnos',
    kind: 'content',
    notes: {
      minutes: 3,
      participant: 'Tres ideas para cerrar: el criterio es tuyo, todo se revisa y los datos de los estudiantes se protegen.',
      objective: 'Cerrar con la síntesis ética y humana del taller.',
      explanation:
        'La IA puede ayudar a diseñar, pero el docente mantiene el criterio pedagógico. Todo contenido generado se revisa antes de usarse. La privacidad y los datos de los estudiantes se protegen.',
      steps: [
        'Recorre las tres ideas tocando cada una.',
        'Pide un ejemplo concreto de cada una: qué revisarías, qué datos no compartirías.',
        'Pasa a las reglas éticas del grupo.',
      ],
      activity: 'Síntesis con tres ideas.',
    },
  },
  {
    id: 'reflexion',
    moment: 'm6',
    title: 'Una regla para mi aula',
    kind: 'activity',
    notes: {
      minutes: 2,
      participant: 'Escribe la regla ética que aplicarás al usar IA con tus estudiantes.',
      objective: 'Convertir la reflexión ética en compromisos concretos y compartidos.',
      explanation:
        'Una regla breve y propia, por ejemplo “siempre verifico y lo cuento”, vuelve práctico el uso ético.',
      steps: [
        'Abre el muro y pide una regla ética por docente.',
        'Lee las reglas, agrupa las repetidas y destaca con la estrella las que el grupo quiera adoptar.',
        'Cierra: estas son nuestras reglas como comunidad.',
      ],
      activity: 'Muro de reglas éticas con participación desde los celulares.',
    },
  },
  {
    id: 'cierre',
    moment: 'm6',
    title: 'Tu compromiso',
    kind: 'activity',
    notes: {
      minutes: 2,
      participant: 'Escribe desde el celular qué recurso vas a crear o mejorar con IA en las próximas semanas.',
      objective: 'Concretar un compromiso de aplicación en el aula.',
      explanation:
        'Un compromiso concreto y cercano en el tiempo aumenta la probabilidad de que lo aprendido llegue al aula.',
      steps: [
        'Muestra la pregunta: qué recurso educativo vas a crear o mejorar con IA durante las próximas semanas.',
        'Los docentes envían su compromiso desde el celular y aparece en el muro.',
        'Invita a tres personas a leer el suyo y agradece su participación.',
      ],
      activity: 'Muro de compromisos alimentado desde los celulares.',
    },
  },
  {
    id: 'certificados',
    moment: 'm6',
    title: 'Asistencia y certificados',
    kind: 'tool',
    notes: {
      minutes: 1,
      participant: 'Tu certificado ya está disponible: descárgalo en tu celular como imagen o PDF.',
      objective: 'Cerrar el taller entregando la lista de asistencia y los certificados de participación.',
      explanation: 'Cada docente registrado puede descargar su certificado desde su celular; el facilitador descarga la lista de asistencia.',
      steps: [
        'Escribe tu nombre como facilitador para que aparezca en el certificado.',
        'Descarga la lista de asistencia (CSV, se abre en Excel).',
        'Pide que revisen su celular: en “Hola, …” aparece su certificado para guardar.',
      ],
      activity: 'Descarga de certificados desde los celulares.',
    },
  },
];

export function screenIndex(id: string): number {
  const i = SCREENS.findIndex((s) => s.id === id);
  return i < 0 ? 0 : i;
}

export function momentOf(id: MomentId): Moment | undefined {
  return MOMENTS.find((m) => m.id === id);
}
