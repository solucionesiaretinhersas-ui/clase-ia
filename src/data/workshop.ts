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
      participant: 'Escucha: la IA no viene a reemplazarte, viene a ampliar lo que puedes diseñar. Tú diriges.',
      objective: 'Abrir con la idea central: la IA llegó a la educación para potenciar las capacidades de diseño del docente, no para reemplazarlo.',
      explanation:
        'Con la IA el docente puede diseñar más materiales, más personalizados y más interactivos en menos tiempo, y dedicar ese tiempo a sus estudiantes. El criterio, el vínculo y la sabiduría siguen siendo humanos.',
      steps: [
        'Cuenta brevemente cómo está llegando la IA a las aulas y por qué hoy es una oportunidad para el docente.',
        'Toca “Docente + IA” en la gráfica: la IA amplía las capacidades de diseño (es una ilustración, no una medición).',
        'Cierra con: la IA acelera el borrador, el docente dirige. Y pasa a la actividad “¿la IA ayuda o solo tú?”.',
      ],
      activity: 'Charla breve con gráfica interactiva.',
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
    title: 'Lluvia de ideas',
    kind: 'activity',
    notes: {
      minutes: 3,
      participant: 'Escribe tu idea en el celular y envíala: aparecerá en el tablero al instante.',
      objective: 'Abrir un espacio de diálogo: que cada docente exprese qué espera de la IA.',
      explanation:
        'Las ideas del grupo muestran para qué se quiere la IA: ahorrar tiempo, crear recursos, personalizar. Ahí está la oportunidad de la docencia aumentada.',
      steps: [
        'Pulsa “Abrir muro” y pide que escaneen el QR y escriban su idea.',
        'Lee en voz alta 3 o 4 ideas, destaca las que más se repiten con la estrella y oculta las que no aplican.',
        'Conecta con la siguiente actividad: ¿qué tareas ayuda la IA y cuáles solo tú puedes hacer?',
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
      participant: 'El facilitador crea una aplicación en vivo en Google AI Studio. Observa cómo se escribe el prompt y cómo se mejora.',
      objective: 'Mostrar en vivo Google AI Studio: iniciar sesión, entrar a Build, pedir una aplicación, probarla y mejorarla.',
      explanation:
        'Google AI Studio no se puede mostrar dentro de otra página (ni su inicio de sesión). Se abre en una ventana propia al lado de la presentación y un panel pequeño con el guion te acompaña.',
      steps: [
        'Pulsa “Abrir Google AI Studio”: se abre en una ventana a la derecha. Inicia sesión allí con tu cuenta.',
        'Abre el panel del guion y ponlo sobre AI Studio para seguir los pasos y copiar los prompts.',
        'Pide la aplicación de ejemplo, pruébala con un voluntario y pide una mejora.',
        'Si el navegador bloquea ventanas emergentes, permítelas para este sitio.',
      ],
      activity: 'Demostración guiada con guion de 7 pasos.',
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
    title: 'Juego: arma el prompt',
    kind: 'activity',
    notes: {
      minutes: 6,
      participant: 'Dos equipos juegan en la pizarra: arrastran cada frase a su letra de ROCAS. ¡Anima a tu equipo!',
      objective: 'Practicar ROCAS jugando: cada equipo, por turnos, coloca fragmentos de prompt en la letra correcta.',
      explanation: 'Es un juego por turnos en la pizarra táctil. Acierto: +10 puntos y sigue el otro equipo. Error: la piedra vuelve y también pasa el turno.',
      steps: [
        'Pulsa el botón de equipos (tecla E) y divide el salón en dos grupos; pon nombre a cada equipo.',
        'Un integrante del equipo con el turno arrastra una frase a su letra.',
        'Pide que el resto del equipo opine antes de soltar: el debate es parte del aprendizaje.',
        'Al terminar se muestra el equipo ganador; el marcador se puede ajustar a mano.',
      ],
      activity: 'Juego por equipos de arrastrar y soltar en la pizarra táctil.',
    },
  },
  {
    id: 'laboratorio',
    moment: 'm3',
    title: 'Laboratorio de prompts',
    kind: 'tool',
    notes: {
      minutes: 7,
      participant: 'Completa tus datos, copia el Prompt 1 y pégalo en ChatGPT para que estructure tu clase.',
      objective: 'Definir los parámetros de la clase y obtener la estructura con ChatGPT (Prompt 1).',
      explanation:
        'Primero se pregunta a ChatGPT qué debe tener cada parte de la clase. Esa estructura será la base del Prompt 2 para AI Studio.',
      steps: [
        'Carga el tema marcado en el reto pedagógico o uno de los tres ejemplos.',
        'Los docentes completan tema, grado, área, objetivo y contexto de su aula.',
        'Copian el Prompt 1, lo pegan en ChatGPT y guardan la estructura que les devuelve.',
        'Recuerda: describan cosas puntuales de su contexto. Esa es la parte humana que la IA no puede inventar.',
      ],
      activity: 'Personalización del prompt y consulta a ChatGPT en vivo.',
    },
  },
  {
    id: 'demo',
    moment: 'm4',
    title: 'Recurso de demostración',
    kind: 'content',
    notes: {
      minutes: 4,
      participant: 'Mira el ejemplo terminado: así puede verse el recurso que vas a crear.',
      objective: 'Mostrar un ejemplo terminado del tipo de recurso que van a crear.',
      explanation:
        '“Misión: salvar el planeta” tiene introducción, tres retos, puntos, progreso y resultados: lo que pide el prompt para AI Studio.',
      steps: [
        'Abre la misión en pantalla completa y juega el primer reto con el grupo.',
        'Pide a un voluntario que resuelva un reto en el tablero.',
        'Señala qué partes del prompt produjeron cada elemento de la aplicación.',
      ],
      activity: 'Un voluntario juega un reto frente al grupo.',
    },
  },
  {
    id: 'taller',
    moment: 'm4',
    title: 'Construye y prueba tu recurso',
    kind: 'tool',
    notes: {
      minutes: 26,
      participant: 'Pega el Prompt 2 en Build, pruébalo con la lupa pedagógica, perfecciónalo y marca cómo vas en cada fase.',
      objective: 'Cada docente genera su recurso en AI Studio, lo humaniza con su contexto y lo perfecciona.',
      explanation:
        'Cuatro fases: estructura (ya con ChatGPT), generar en Build, humanizar con contexto propio y perfeccionar probando como estudiante.',
      steps: [
        'Inicia el temporizador de 35 minutos del Momento 4.',
        'Pide que incluyan siempre interactividad: simuladores y actividades para que un estudiante pase al tablero proyectado.',
        'Avanza las fases en pantalla: el tablero muestra en vivo cuántos van listos para ajustar el ritmo.',
        'En la fase 3 abre la lupa pedagógica: cada criterio que falla trae su prompt de arreglo.',
        'Recuerda en voz alta la parte humana: contexto, ejemplos de su comunidad, criterio para revisar.',
        'A los 30 minutos, pide que guarden o preparen su recurso para presentarlo.',
      ],
      activity: 'Reto de creación con fases y prompts de mejora listos para copiar.',
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
    title: 'Ética y docencia humanizada',
    kind: 'content',
    notes: {
      minutes: 3,
      participant: 'Cierre: uso ético de la IA, docencia humanizada y cómo evaluar de otra manera.',
      objective: 'Cerrar con el uso ético de la IA, la docencia humanizada y una evaluación que amplíe el conocimiento.',
      explanation:
        'La IA llegó para ayudarnos, no para reemplazarnos. Ya no basta con pedir “investiga y entrega”: hay que evaluar cómo el estudiante crea, decide y mejora con la IA.',
      steps: [
        'Recorre los cuatro ejes tocando cada uno.',
        'Invita a motivar a los estudiantes a crear recursos con IA, con acompañamiento y transparencia.',
        'Cierra con la frase: tú diriges, la IA acompaña.',
      ],
      activity: 'Charla final con los cuatro ejes.',
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
    title: 'Cierre y compromiso',
    kind: 'activity',
    notes: {
      minutes: 2,
      participant: 'Escribe tu compromiso desde el celular: qué recurso vas a crear y cómo lo aplicarás.',
      objective: 'Consolidar aprendizajes y concretar un compromiso de aplicación en el aula.',
      explanation: 'La IA propone, el docente dispone: el criterio pedagógico sigue siendo humano.',
      steps: [
        'Repasa el resumen visual de los aprendizajes.',
        'Los docentes envían su compromiso desde el celular y aparece en el muro.',
        'Invita a 3 docentes a leer el suyo y agradece su participación.',
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
