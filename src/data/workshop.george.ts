import type { Moment, ScreenMeta } from './workshop';

/**
 * Foro Georges Noble School: "Inteligencia Artificial: de la innovación a la
 * transformación de realidades". Las 14 diapositivas de FORO.pdf se proyectan tal cual
 * (public/foro/sNN.jpg) y, entre ellas, hay 4 momentos de diálogo en los que el público
 * participa desde el celular con preguntas abiertas y lluvia de ideas.
 * Tiempo: ~21 min con todo (~18 min si saltas las tres diapositivas marcadas OPCIONAL). Los diálogos
 * son rápidos: dos votaciones de un toque, una nube de UNA palabra y un único texto corto (≤ 15
 * palabras); el debate se hace en voz alta.
 * Público mixto: estudiantes del colegio y público en general. Los diálogos son para escuchar
 * opiniones (sin respuestas correctas). Al final el celular ofrece un certificado de participación
 * firmado solo por el facilitador.
 */
export const G_MOMENTS: Moment[] = [
  { id: 'g1', index: 1, title: 'Consumidores o creadores', short: 'Punto de partida', minutes: 4, accent: 'var(--violet)' },
  { id: 'g2', index: 2, title: 'La evolución de la IA', short: 'Evolución', minutes: 3, accent: 'var(--blue)' },
  { id: 'g3', index: 3, title: 'Implicaciones, oportunidades y desafíos', short: 'Implicaciones', minutes: 3, accent: 'var(--cyan)' },
  { id: 'g4', index: 4, title: 'Cómo construimos soluciones con IA', short: 'Construir', minutes: 4, accent: 'var(--mint)' },
  { id: 'g5', index: 5, title: 'Soluciones reales', short: 'Soluciones', minutes: 4, accent: 'var(--amber)' },
  { id: 'g6', index: 6, title: 'Cierre', short: 'Cierre', minutes: 4, accent: 'var(--rose)' },
];

export const G_OUTCOMES = [
  'Una pregunta que cambia la mirada: ¿consumir o crear?',
  'De dónde viene la IA y hasta dónde ha llegado',
  'Qué ganamos, qué riesgos hay y cómo afecta lo que sueñas ser',
  'Cómo se pasa de una necesidad real a una solución con IA',
  'Tres soluciones reales construidas con estas herramientas',
  'Un problema de tu entorno que comenzarías a resolver',
];

type Notes = ScreenMeta['notes'];

/** Diapositiva del PDF: se proyecta tal cual y el facilitador la explica. */
function slide(id: string, moment: string, title: string, notes: Omit<Notes, 'participant'> & { participant?: string }): ScreenMeta {
  return {
    id,
    moment,
    title,
    kind: 'content',
    notes: { participant: notes.participant ?? `Atiende la presentación: ${title}.`, ...notes },
  };
}

/** Momento de diálogo: pregunta abierta o lluvia de ideas desde el celular. */
function dialogue(id: string, moment: string, title: string, minutes: number, participant: string, notes: Omit<Notes, 'participant' | 'minutes'>): ScreenMeta {
  return { id, moment, title, kind: 'activity', notes: { minutes, participant, activity: 'Muro de ideas desde los celulares.', ...notes } };
}

export const G_SCREENS: ScreenMeta[] = [
  {
    id: 'g-inicio',
    moment: 'g0',
    title: 'Bienvenida',
    kind: 'cover',
    notes: {
      minutes: 1,
      participant: 'Escanea el QR de la siguiente pantalla y escribe tu nombre para participar desde tu celular.',
      objective: 'Dar la bienvenida y avisar que habrá cuatro momentos de diálogo con el celular.',
      explanation: 'Es una charla para todos: no hace falta saber de tecnología. La idea es pensar juntos cómo pasar de usar la IA a construir con ella.',
      steps: ['Da la bienvenida.', 'Avisa que habrá cuatro momentos para participar desde el celular.', 'Pasa a la siguiente pantalla para mostrar el QR.'],
    },
  },
  {
    id: 'g-ruta',
    moment: 'g0',
    title: 'La ruta de hoy',
    kind: 'content',
    notes: {
      minutes: 1,
      participant: 'Escanea el QR y escribe tu nombre: así podrás responder y enviar ideas desde tu celular.',
      objective: 'Conectar al público antes de empezar.',
      explanation: 'Seis bloques: el punto de partida, la evolución de la IA, implicaciones, cómo construir, soluciones reales y el cierre. Participar es opcional: la charla se sigue igual desde la pantalla.',
      steps: ['Proyecta el QR (tecla J) y espera a que el contador de conectados suba.', 'Recorre los seis bloques en una frase.', 'Aclara que cada pregunta abierta se responde desde el celular y aparece en pantalla.'],
    },
  },

  /* ───────── 1 · Consumidores o creadores ───────── */
  slide('g-d01', 'g1', 'Inteligencia Artificial: de la innovación a la transformación de realidades', {
    minutes: 1,
    objective: 'Presentarte y enmarcar la charla.',
    explanation: 'Implicaciones, oportunidades, desafíos y construcción de soluciones con propósito. El hilo conductor es pasar de consumir IA a crear soluciones con ella.',
    steps: ['Preséntate: Luis Alejandro Caldera Caldera, Universidad de Córdoba.', 'Menciona los tres campos que ves en la portada: educación, salud y desarrollo de software.', 'Lanza la idea central y pasa a la pregunta.'],
  }),
  slide('g-d02', 'g1', '¿Qué pasaría si dejáramos de ser solo consumidores de IA?', {
    minutes: 1,
    participant: 'Piensa en esta pregunta: ¿qué pasaría si dejáramos de ser solo consumidores de IA y empezáramos a ser creadores de soluciones?',
    objective: 'Abrir con una pregunta que cambie la mirada.',
    explanation: 'Consumidores de tecnología: usan la IA para resolver preguntas, generar textos o crear contenido. Creadores de soluciones: diseñan, desarrollan e implementan herramientas con IA que resuelven necesidades reales. Ninguna es mala: la diferencia es qué tanto decido yo sobre la herramienta.',
    steps: ['Explica las dos columnas con un ejemplo de cada una.', 'Deja la pregunta flotando y pasa al primer momento de diálogo.'],
  }),
  dialogue('g-q1', 'g1', 'Diálogo 1: ¿consumidor o creador?', 2, 'Elige dónde te ubicas hoy: consumidor, consumidor frecuente, en camino o creador de IA. Verás cómo se reparte el grupo.', {
    objective: 'Que cada quien se ubique frente a la pregunta de la diapositiva y ver cómo se reparte el grupo.',
    explanation: 'Es una encuesta de opinión: no hay opción correcta ni se evalúa a nadie. Lo valioso es ver dónde está el grupo y conversar sobre qué haría falta para dar el siguiente paso.',
    steps: ['Abre la encuesta (la tarjeta del tablero explica qué van a hacer).', 'Muestra los resultados y comenta la opción más votada.', 'Pregunta a alguien de “Consumidor” y a alguien de “Creador”: ¿qué te llevó ahí / qué te haría falta?', 'Cierra y continúa con la evolución de la IA.'],
    activity: 'Encuesta con barras en vivo desde los celulares.',
  }),

  /* ───────── 2 · La evolución de la IA ───────── */
  slide('g-d03', 'g2', 'La evolución de la IA: de reconocer patrones a construir soluciones', {
    minutes: 1,
    objective: 'Ordenar los cuatro tipos de IA con los que se van a encontrar.',
    explanation:
      'IA tradicional: reconoce, clasifica y predice a partir de datos (por ejemplo, identificar una hoja). IA generativa: crea texto, imágenes, audio y código. IA multimodal: comprende e integra texto, imagen, audio y video. Agentes de IA: planifican, utilizan herramientas y ejecutan tareas de forma autónoma. El hilo: de la comprensión de datos a la acción inteligente.',
    steps: ['Recorre de izquierda a derecha las cuatro etapas.', 'Pregunta cuáles de las cuatro han usado sin saberlo.', 'Cierra con la frase de la diapositiva: de la comprensión de datos a la acción inteligente.'],
  }),
  slide('g-d04', 'g2', 'Grandes hitos de la IA: de Turing a los agentes actuales', {
    minutes: 1,
    objective: 'Mostrar que la IA es una ciencia con historia y no apareció de golpe.',
    explanation:
      '1950 Turing propone el test; 1956 Dartmouth acuña el término; 1958 Rosenblatt y el perceptrón (primeras redes neuronales); años 80 sistemas expertos; 1997 Deep Blue vence a Kaspárov; 2012 el éxito en ImageNet acelera el deep learning; 2017 surge el Transformer, base de los modelos generativos; 2022 ChatGPT llega al público general; hoy, IA multimodal y agentes. Mensaje: innovar es entender un problema, aprender y construir soluciones con propósito.',
    steps: ['Recorre la línea de arriba (1950–1997) y luego la de abajo (2012–hoy).', 'Detente en 2012 y 2017: son los puntos de quiebre del presente.', 'Cierra con la frase: innovar es entender un problema, aprender y construir soluciones con propósito.'],
  }),
  slide('g-d05', 'g2', 'GPQA Diamond: puntaje vs. costo por tarea', {
    minutes: 1,
    objective: 'OPCIONAL (si vas corto de tiempo, sáltala). Dar una idea concreta de hasta dónde han llegado los modelos y a qué costo.',
    explanation:
      'GPQA Diamond son 198 preguntas de física, biología y química de nivel de doctorado, diseñadas para no resolverse buscando en Google. Los expertos con doctorado aciertan ~65 %; los no expertos, 34 %. En el gráfico, cada punto es un modelo: más arriba es más preciso, más a la derecha es más caro por tarea. La zona verde marca los más económicos y la línea punteada es la frontera de Pareto (la mejor relación entre puntaje y costo). Fuente: Artificial Analysis, evaluación independiente.',
    steps: ['Explica qué mide la prueba y el dato de expertos vs. no expertos.', 'Enseña cómo leer los ejes (precisión arriba, costo a la derecha).', 'Mensaje: los modelos mejoran y a la vez se vuelven más baratos; eso abre la puerta a que más personas construyan.'],
  }),

  /* ───────── 3 · Implicaciones, oportunidades y desafíos ───────── */
  slide('g-d06', 'g3', 'Implicaciones de la IA: una transformación que va más allá de la tecnología', {
    minutes: 1,
    objective: 'Mostrar cuatro frentes donde la IA ya cambia las cosas.',
    explanation: 'Educación: nuevas formas de enseñar y aprender. Salud: apoyo al diagnóstico, la prevención y la atención médica. Trabajo: transformación de los perfiles y procesos profesionales. Sociedad: mayor acceso al conocimiento, la innovación y los servicios.',
    steps: ['Recorre los cuatro frentes con un ejemplo cada uno.', 'Pide que piensen en cuál toca más la profesión que sueñan.'],
  }),
  slide('g-d07', 'g3', 'Oportunidades y desafíos de la IA', {
    minutes: 1,
    participant: 'Mira las oportunidades y los desafíos: en el siguiente momento vas a dar tu opinión.',
    objective: 'Equilibrar: gran potencial, gran responsabilidad.',
    explanation:
      'Oportunidades: automatización de procesos, creatividad e innovación, personalización del aprendizaje, desarrollo de soluciones, mayor productividad y eficiencia. Desafíos: privacidad y seguridad de los datos, sesgos en los algoritmos, información incorrecta o poco confiable, dependencia tecnológica, brechas digitales y desigualdad en el acceso. Cierre: la innovación tecnológica debe avanzar de la mano de la responsabilidad humana.',
    steps: ['Lee las oportunidades y luego los desafíos.', 'Aclara el porqué de dos desafíos: sesgos (aprenden de datos humanos) y desinformación (predicen lo probable, no lo verdadero).', 'Pasa al momento de diálogo.'],
  }),
  dialogue('g-q2', 'g3', 'Diálogo 2: una palabra sobre la IA y lo que sueñas ser', 1, 'En UNA palabra: ¿qué sientes cuando piensas en la IA y en la profesión o el trabajo que sueñas?', {
    objective: 'Escuchar qué sienten frente a la IA (emoción, duda, curiosidad, miedo) y conectarlo con las oportunidades y desafíos de la diapositiva.',
    explanation: 'Nube de palabras: las palabras que más se repiten crecen. Sirve para abrir conversación sin que nadie tenga que escribir mucho; luego pide a quien quiera que explique su palabra.',
    steps: ['Abre la nube (la tarjeta explica qué van a hacer).', 'Señala las palabras más grandes y pregunta “¿quién puso esta?”.', 'Contrasta una palabra de emoción con una de preocupación y conéctalas con la diapositiva 7.', 'Cierra la nube.'],
    activity: 'Nube de palabras en vivo desde los celulares.',
  }),

  /* ───────── 4 · Cómo construimos soluciones con IA ───────── */
  slide('g-d08', 'g4', '¿Cómo construimos soluciones con IA?', {
    minutes: 1,
    objective: 'Dar el método: de una necesidad real a una solución con impacto.',
    explanation: '01 Problema real: identificar una necesidad del contexto (educativo, salud, etc.). 02 Diseño de la solución: definir la propuesta, funcionalidades y herramientas de IA. 03 Desarrollo con IA: construir el prototipo con Python, Google AI Studio, Antigravity o Claude Code. 04 Validación e impacto: probar, ajustar y evaluar con usuarios reales. Es un ciclo continuo de construcción, mejora e innovación.',
    steps: ['Recorre los cuatro pasos siguiendo las flechas.', 'Subraya que se empieza por el problema, no por la herramienta.', 'Insiste en el paso 4: sin validar con usuarios reales no hay solución.'],
  }),
  slide('g-d09', 'g4', 'Ecosistema de herramientas de IA', {
    minutes: 1,
    objective: 'OPCIONAL (si vas corto de tiempo, sáltala o menciónala en una frase). Presentar las herramientas con las que se construye.',
    explanation: 'Google AI Studio: experimentar con modelos, diseñar prototipos y crear aplicaciones con instrucciones en lenguaje natural. Google Antigravity: desarrollo de software asistido por agentes que planifican, programan y ejecutan pruebas. Claude Code: asistencia inteligente para trabajar sobre proyectos de software desde el entorno de desarrollo. Python: programación, procesamiento de datos, automatización e integración de modelos de IA. Se complementan para pasar de una idea a una solución real.',
    steps: ['Presenta cada herramienta con su función en una frase.', 'Aclara que no hay que dominarlas todas: se empieza por una.'],
  }),
  slide('g-d10', 'g4', 'Vibe Coding: una nueva forma de crear software', {
    minutes: 1,
    participant: 'Mira el ciclo del vibe coding: describe, genera, prueba y mejora. Enseguida te toca imaginar tu propia app.',
    objective: 'Explicar el vibe coding y abrir la puerta a la creatividad del público.',
    explanation: 'De una idea a una aplicación mediante lenguaje natural. Google AI Studio: acceso gratuito con límites de uso. Google Antigravity: plan individual gratuito y opciones de pago. Claude Code: acceso mediante planes de pago o consumo de API. El ciclo es describe tu idea → genera → prueba → mejora. No se trata solo de generar código, sino de construir soluciones que funcionen. Las condiciones de uso y precios pueden cambiar: se revisan en cada sitio.',
    steps: ['Explica el ciclo describe → genera → prueba → mejora con un ejemplo cotidiano.', 'Aclara que hay que pensar claro lo que se quiere y probar el resultado.', 'Pasa al momento de diálogo para que imaginen su app.'],
  }),
  dialogue('g-q3', 'g4', 'Diálogo 3: la app que crearías (un toque)', 1, 'Si pudieras crear una app con IA, ¿para qué campo sería? Toca una opción y mira cómo se reparte el grupo.', {
    objective: 'Que imaginen una solución propia en segundos y abrir el debate hablado.',
    explanation: 'Es una votación de un toque, sin escribir. El debate lo haces en voz alta: pide a 2 o 3 personas que cuenten qué app harían y para quién; así el tiempo se va en conversar y no en teclear.',
    steps: ['Abre la votación (30 segundos).', 'Muestra el resultado y pregunta a quien eligió la opción menos votada por qué.', 'Pide a dos personas que cuenten su app en una frase: ¿qué problema resuelve y quién la usaría?', 'Cierra y continúa.'],
    activity: 'Votación de un toque con barras en vivo.',
  }),

  /* ───────── 5 · Soluciones reales ───────── */
  slide('g-d11', 'g5', 'Soluciones creadas con Inteligencia Artificial', {
    minutes: 2,
    objective: 'Mostrar con casos reales que el método funciona.',
    explanation:
      'InspiraTEC: agente de IA que ayuda a los docentes de Tecnología e Informática a crear planes de clase y recursos educativos. Pasar Pro: ayuda a los estudiantes a prepararse para las pruebas Saber Pro; usa un modelo de Knowledge Tracing para detectar cuándo se equivocan, clasificarlos por nivel y entrenarlos con preguntas ajustadas a ese nivel. Mentor STEM: agente de IA que ayuda a crear proyectos STEM mediante una metodología STEM + IA. Son ejemplos de pasar de una idea educativa a una solución funcional y contextualizada.',
    steps: ['Presenta cada solución con la estructura: problema, qué hace y cómo usa la IA.', 'En Pasar Pro explica Knowledge Tracing con una analogía: seguir qué sabe el estudiante para ajustar la dificultad.', 'Relaciónalas con los cuatro pasos del método.'],
  }),
  slide('g-d12', 'g5', 'Accede a nuestras soluciones con IA', {
    minutes: 1,
    participant: 'Escanea el código QR de la herramienta que quieras conocer o probar.',
    objective: 'Que el público pruebe las soluciones desde su celular.',
    explanation: 'Cada QR lleva a una herramienta: InspiraTEC (planes de clase y recursos para docentes de Tecnología e Informática), Pasar Pro (preparación para Saber Pro con rutas por nivel) y Mentor STEM (proyectos STEM con metodología STEM + IA).',
    steps: ['Pide que escaneen el QR de la que más les interese.', 'Da un minuto para explorar.', 'Si algún QR no abre, verifica el enlace antes del evento.'],
  }),
  slide('g-d13', 'g5', 'Diferentes problemas, una misma visión', {
    minutes: 1,
    objective: 'OPCIONAL (si vas corto de tiempo, sáltala). Cerrar el bloque: la IA como herramienta transversal.',
    explanation: 'InspiraTEC, Pasar Pro y Mentor STEM atienden problemas distintos pero comparten una visión: personalización, automatización, acompañamiento, aprendizaje e innovación. La pregunta de fondo: identificar una necesidad y construir una solución que aporte valor.',
    steps: ['Conecta las tres soluciones con las cinco palabras alrededor del círculo.', 'Pregunta: ¿qué palabra te gustaría que tuviera tu propia solución?'],
  }),

  /* ───────── 6 · Cierre ───────── */
  slide('g-d14', 'g6', 'El verdadero poder de la IA está en las realidades que podemos transformar', {
    minutes: 1,
    participant: 'Lee la frase de cierre y piensa: ¿qué problema de tu entorno comenzarías a resolver hoy?',
    objective: 'Cerrar con la frase central y abrir el último diálogo.',
    explanation: 'El verdadero poder de la inteligencia artificial no está en lo que puede generar, sino en las realidades que podemos transformar con ella. Observa tu contexto, identifica una necesidad, usa la IA como aliada y crea soluciones que generen un impacto real. ¡Atrévete a innovar!',
    steps: ['Lee la frase de cierre.', 'Formula la pregunta: ¿qué problema de tu entorno comenzarías a resolver hoy?', 'Abre el último momento de diálogo.'],
  }),
  dialogue('g-q4', 'g6', 'Diálogo 4: el problema que resolverías hoy', 2, 'En una frase corta (máx. 15 palabras): ¿qué problema de tu entorno comenzarías a resolver hoy con IA?', {
    objective: 'Cerrar convirtiendo la charla en un compromiso personal, con poca escritura.',
    explanation: 'Es el único momento de escribir y es corto: una frase de máximo 15 palabras. Cada idea es el “paso 1: problema real” del método de la diapositiva 8. Deja el debate para la voz: lee 3 o 4 ideas y pregunta a quien la escribió.',
    steps: ['Abre el muro y deja 60 a 90 segundos.', 'Lee 3 o 4 ideas y destaca con la estrella las más claras.', 'Pregunta a dos personas: ¿a quién ayudarías primero?', 'Cierra: agradece y avisa que su certificado de participación, firmado por ti, ya está en su celular.'],
  }),
  {
    id: 'g-certificados',
    moment: 'g6',
    title: 'Asistencia y certificados',
    kind: 'tool',
    notes: {
      minutes: 1,
      participant: 'Tu certificado de participación ya está en tu celular: descárgalo como imagen o PDF.',
      objective: 'Ver quiénes se registraron, descargar la asistencia y confirmar cómo se ve el certificado.',
      explanation: 'El certificado ya está habilitado en los celulares desde la diapositiva de cierre y se queda ahí aunque cambies de pantalla. Esta pantalla es solo para ti: lista de registrados, vista previa y asistencia en CSV.',
      steps: ['Revisa la lista de registrados y la vista previa del certificado.', 'Descarga la asistencia (CSV).', 'Quien no lo vea puede entrar de nuevo con el código y su nombre.'],
    },
  },
];
