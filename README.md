# Aula IA · De la idea a la experiencia

Taller docente de 90 minutos sobre Google AI Studio (Build) — I.E. Santa Rosa de Lima.
React + TypeScript + Vite. Sin backend.

**Sitio publicado:** https://clase-ia-theta.vercel.app/ · **Repositorio:** https://github.com/solucionesiaretinhersas-ui/clase-ia

## Ejecutar

```bash
cd aula-ia
npm install
npm run dev        # http://localhost:5173 (y la IP de red local, para los celulares)
npm run build      # genera dist/ para publicar en cualquier hosting estático
npm run preview    # sirve dist/ localmente
```

## Guion del taller (90 min)

| # | Momento | Min | Qué ocurre |
|---|---|---|---|
| 1 | La IA llegó a la educación | 12 | Votación, **charla “no viene a reemplazarte, viene a ampliar tu diseño”** con gráfica interactiva (Docente vs. Docente + IA), “¿la IA ayuda o solo tú?” y lluvia de ideas en vivo |
| 2 | Google AI Studio | 14 | **Qué es y cómo funciona** (ilustración con puntos para tocar), **aula interactiva completa** simulada que se construye por momentos y se mejora con una frase, la baraja de ideas (dinámica en equipos) y “Llega a Build” |
| 3 | Tu prompt con ROCAS | 20 | **Metodología ROCAS** (piedras, comparador y juego por equipos) y un **único mensaje para ChatGPT** que le pide el prompt para crear el aula en AI Studio |
| 4 | Crea tu aula | 30 | Recorrido ChatGPT → AI Studio, creación guiada con avance en vivo y **lupa pedagógica** |
| 5 | Compartir y mejorar | 6 | Uno o dos docentes presentan (ruleta con pregunta) y diálogo en un mural ilustrado |
| 6 | Llevarlo al aula | 8 | El facilitador cierra explicando **para qué se puede usar**, ética, compromiso de aplicación, asistencia y certificado |

Los murales (ideas, diálogo, reglas, compromisos) usan ilustraciones propias en SVG (`src/components/MuralArt.tsx`), notas con cinta, reacciones y fondos por color.

## Modo claro y oscuro · estilo Apple

El botón de sol/luna (barra superior del tablero y barra del celular) alterna entre modo **claro** y **oscuro**. La elección se recuerda en cada dispositivo; la primera vez se usa la del sistema. Los tokens de color están en `src/styles/global.css` (`:root[data-theme='dark' | 'light']`) con la paleta de iOS/macOS, tipografía del sistema (SF Pro en Apple, Inter de respaldo en Windows/Android), barras translúcidas y listas agrupadas.

La interfaz del docente (`#/m/vivo`) se adapta a celular (una columna con título grande) y a computador (dos columnas: lo que pasa ahora y participar a la izquierda; enlaces y recorrido a la derecha).

## Un solo QR, registro con nombre y enlaces que se abren a medida que avanzas

- **Un único QR de ingreso** (pantalla “La ruta de hoy”, botón QR de la barra inferior o tecla **J** para verlo a pantalla completa). Al escanearlo, cada docente escribe su **nombre** y entra al taller (`#/m/vivo`).
- El celular muestra en tiempo real el momento y la pantalla que proyectas, qué hacer ahora, el cuadro de participación y el recorrido completo.
- **Los enlaces se desbloquean solos** en el celular según la pantalla: Google AI Studio, la guía de creación, ChatGPT, los prompts y el recurso de demostración. No hay que volver a escanear nada.
- La etiqueta superior del facilitador muestra el código de sesión, cuántos docentes están conectados y si la conexión está activa (“En vivo”) o falló (“Sin conexión”).

## Ruleta de docentes

Tecla **R** (o el botón de dados): la ruleta se arma con los docentes que se registraron desde el celular (y nombres añadidos a mano). Gira con animación, anuncia a quién le toca, puede **sacar una pregunta** de un banco pensado para compartir recursos (“¿qué le pediste a la IA?”, “¿qué aportaste tú?”…) y, por defecto, **no repite** a quien ya participó. El ganador queda visible hasta el siguiente giro.

## Cada taller empieza limpio

- Botón **“Nuevo taller: limpiar todo”** (panel del facilitador, tecla N) y “Empezar un taller nuevo” en la portada: borra votos, ideas, tableros, galería, compromisos, cronómetros, ruleta y pizarra, y crea un **código de sesión nuevo**.
- Los celulares que entran con el código nuevo borran automáticamente lo guardado del taller anterior y vuelven a pedir el nombre.
- Si la sesión guardada tiene más de 12 horas, se reinicia sola al abrir la app.
- Los datos antiguos en Firebase quedan bajo el código anterior, sin ningún enlace que los muestre. Para borrarlos de la nube, elimina la colección `sessions` desde la consola de Firebase.
## Diseño de pizarra, sonido y juegos en equipo

- **Estética de pizarra interactiva:** cuadrícula de puntos, subrayados dibujados a mano, piedras 3D animadas, entradas con movimiento y modo claro/oscuro.
- **Sonido** sintetizado en el navegador (sin archivos): aciertos, errores, tic de la ruleta, fanfarria y confeti. El botón del altavoz (barra superior, también en el celular) lo silencia; el navegador exige un primer toque para activarlo.
- **Equipos (tecla E):** divide a los docentes registrados en dos equipos al azar, edita sus nombres y lleva el marcador con turnos. Los juegos suman puntos al equipo en turno.
- **Juego “Arma el prompt”:** en la pizarra táctil, cada equipo arrastra frases a su letra de ROCAS (Rol, Objetivo, Contexto, Acción, Solución). Acierto: +10 y turno al otro equipo; error: la piedra vuelve y también pasa el turno.
- **Google AI Studio:** Google no permite mostrar AI Studio ni su inicio de sesión dentro de otra página, así que se abre en su propia ventana desde los botones de acceso. Si el navegador bloquea las ventanas emergentes, permítelas para este sitio.
## Dos talleres en la misma aplicación

En la portada hay un selector: **Taller para docentes** (90 min, 6 momentos) y **Taller para estudiantes** (90 min, 5 momentos). Cambia el guion, las actividades, los textos del celular y el certificado; el diseño y las herramientas (pizarra, ruleta, QR, tema claro/oscuro) son los mismos. El QR de ingreso lleva el taller en el enlace (`&w=d` o `&w=e`), así que el celular sabe cuál es sin configurar nada.

**Taller de estudiantes** — enfocado en crear aplicaciones con Google AI Studio:

| # | Momento | Min | Qué ocurre |
|---|---|---|---|
| 1 | Despierta tu curiosidad | 12 | Votación, qué es la IA, nube “¿dónde ves IA?” y “¿es IA o no?” |
| 2 | ¿Cómo funciona la IA? | 14 | Datos → modelo → predicción, juego de adivinar la palabra (nube de palabras) y “¿confío o verifico?” |
| 3 | Crear con Google AI Studio | 14 | Qué es AI Studio (nivel gratuito con límites, apps web vs. Android), programar escribiendo (*vibe coding*), ejemplo y acceso a Build |
| 4 | Manos a la obra: tu aplicación | 40 | Idea, constructor de prompt, taller con prompts de mejora (incluye agregar IA con Gemini dentro de la app) y muestra con ruleta |
| 5 | Cierre y reconocimiento | 10 | Uso responsable, “lo que me llevo” y certificados |

> **Antes de usarlo con estudiantes:** verifica las condiciones de uso de Google AI Studio (edad mínima y tipo de cuenta) y las políticas de la institución. Si los estudiantes no pueden tener cuenta propia, usen la del docente en parejas o en pantalla compartida. El uso gratuito de los modelos tiene límites y puede cambiar.

## Registro obligatorio, asistencia y certificados

- Todos los participantes deben escribir **nombre y grado** (docentes: área o grado en que enseñan) al entrar desde el celular.
- Pantalla final **“Asistencia y certificados”**: lista de registrados, descarga de la **lista de asistencia en CSV** (se abre en Excel con tildes) y vista previa del certificado de cualquier participante. Escribe tu nombre de facilitador para que aparezca en la firma.
- Cada participante, desde su celular, descarga su **certificado tipo diploma** de la I.E. Santa Rosa de Lima como **imagen (PNG)** o **PDF**, sin servidor: se genera en el propio dispositivo sobre la plantilla ilustrada public/brand/certificado.png (reemplázala por otra del mismo tamaño, 1491×1055, para cambiar el diseño; si no carga, se usa un diploma vectorial de respaldo). Se escriben el nombre y grado, el nombre del taller, la fecha, la duración y el facilitador, y se estampan las firmas del facilitador y del director (public/brand/firma-facilitador.png y irma-director.png, PNG con fondo transparente; se pueden reemplazar). Se habilita cuando llegas a la pantalla de certificados.
## Docentes y estudiantes nunca se mezclan · certificados que se conservan

- **Una sesión por taller.** El taller de docentes y el de estudiantes tienen cada uno su propio código de sesión: sus registros, respuestas, ruleta, asistencia y certificados quedan separados. Además, cada registro guarda si es docente o estudiante y las listas filtran por ese dato.
- **Historial de sesiones.** Las sesiones que inicias quedan guardadas en el equipo del facilitador (no se borran con “Nuevo taller”). En “Asistencia y certificados” puedes elegir una sesión anterior del mismo taller para volver a descargar su lista de asistencia o ver sus certificados. El nombre del facilitador también se conserva.
- **En el celular del participante:** al llegar a la pantalla de certificados, el certificado queda **guardado en el dispositivo** (con la fecha de su registro) y se puede ver cuando quiera en **Mis certificados** (`#/m/certificados`), aunque cambie de taller o cierre el navegador. No se borra al cambiar de sesión.
- **Si pierde el celular o borra los datos:** en la misma página puede **buscar su certificado con el código del taller y su nombre** desde cualquier dispositivo; se consulta lo registrado en Firebase (mientras esos datos se conserven en la base de datos).

> Privacidad: la búsqueda funciona con el código de 5 caracteres del taller; cualquier persona que lo conozca podría consultar los nombres registrados en esa sesión. Si necesitas más control, activa Firebase Authentication y restringe la lectura en `firestore.rules`.
## Participación desde los celulares

Con Firebase activo, el celular (`#/m/vivo`) muestra un cuadro **“Tu turno”** cada vez que el facilitador abre una actividad, y lo que envían aparece en el tablero al instante:

- **Votación de apertura** y **“¿La IA ayuda o solo tú?” / “Tradicional o interactiva”**: botones por situación; el tablero muestra cuántos votaron desde el celular.
- **Muros de ideas** (lluvia de ideas, diálogo tras la galería, regla ética): ideas ilimitadas que caen como notas adhesivas; el facilitador puede destacar (estrella) u ocultar.
- **Reto pedagógico**: los temas difíciles llegan desde los celulares y se pueden marcar para el laboratorio.
- **Cierre**: los compromisos enviados forman el muro final.

La participación solo está habilitada mientras la actividad esté “En curso” (botón Abrir/Cerrar del tablero).

## Pizarra interactiva

Tecla **D** (o el botón de lápiz de la barra inferior) abre las herramientas sobre cualquier pantalla: lápiz, resaltador, texto, flecha, rectángulo, círculo, borrador, **puntero láser** y **foco** para señalar, deshacer/rehacer (Ctrl+Z), borrar todo, 7 colores, 3 grosores, y **pizarra en blanco** (oscura o blanca). Funciona con el dedo o lápiz en pizarras táctiles. Cada pantalla conserva sus anotaciones mientras no se recargue la página. `Esc` cierra las herramientas.

## Atajos del facilitador

| Tecla | Acción | | Tecla | Acción |
|---|---|---|---|---|
| → / Espacio | Siguiente | | N | Notas del facilitador |
| ← | Anterior | | G | Vista general |
| Inicio | Portada | | T | Iniciar/pausar cronómetro del momento |
| F | Pantalla completa | | D | Pizarra interactiva |
| Esc | Cerrar paneles y pizarra | | M | **Centro de mando** |
| E | Equipos y marcador | | R / J | Ruleta / QR de ingreso |

### Centro de mando (tecla M o botón del extremo izquierdo de la barra)
Botones grandes y táctiles para equipos, ruleta, QR, pizarra, notas, vista general, cronómetro, pantalla completa, sonido, tema, vista de participación (`#/m`), accesos a Google AI Studio y ChatGPT (pestaña nueva), salto a cualquier actividad y, al final, el **reinicio protegido**: hay que mantener presionado ~2 s, así no se activa por accidente.

### Elementos nuevos del rediseño
- **ROCAS**: piedras, comparador (ejemplo del ciclo del agua), constructor libre de prompts (funciona sin IA) y **juego por equipos** “Construye el prompt más sólido” (arrastrar o tocar, temporizador, puntos, corrección y marcador).
- AI Studio no se puede incrustar ni se simula su sesión: se abre en ventana aparte desde los botones de acceso; la app nunca pide ni guarda credenciales.
- **Flujo ChatGPT → AI Studio**, galería de recursos (demostraciones locales o maquetas rotuladas) y **lupa pedagógica** que sugiere, no certifica.
- En el celular: barra de avance de la etapa y estado de conexión real (Conectado / Conectando / Sin conexión).
- El fondo neuronal se pausa en pestañas ocultas y respeta `prefers-reduced-motion`; el sonido tiene botón de silencio.

## Estructura

```
src/
  data/        contenido: momentos, notas del facilitador, prompts, misión, enlaces QR
  lib/         router (hash), almacenamiento local, portapapeles, URLs, capa de sincronización
  components/  QRCode, ActivityShell (abrir/cerrar actividad), Toast, UI común
  presenter/   modo presentación: barra, navegación, cronómetros, notas, vista general
  screens/     una pantalla por archivo (15)
  mobile/      modo participación (rutas /m/*)
  demo/        "Misión: salvar el planeta" (ruta /demo)
  styles/      sistema de diseño (tokens + pantallas + móvil)
```

Rutas (`#/…`): `/s/<pantalla>` presentación · `/m`, `/m/responder`, `/m/prompt`, `/m/guia`, `/m/cierre` móvil · `/demo` recurso de demostración.

## Qué funciona localmente (sin servidor)

- Navegación, cronómetros por momento, notas del facilitador, progreso (persisten en el navegador).
- Todas las actividades del tablero: votación, tradicional vs interactiva, tablero de temas, constructor de prompt, galería con sorteo y temporizador, muro de compromisos.
- Laboratorio de prompts con copiado real, tres ejemplos y edición manual.
- Códigos QR reales (biblioteca `qrcode`), ampliables y descargables en PNG.
- Misión: salvar el planeta (3 retos, puntos, progreso, resultados).
- Modo celular: prompt, guía, tarjeta de respuesta y ticket de salida, guardados en el propio celular.

## Qué requiere publicar la web

Los QR **internos** (prompt, guía, demo, cierre, tarjeta de respuesta) solo abren desde otro celular si la app es accesible:

1. **Misma red Wi-Fi:** con `npm run dev`, la ventana del QR de ingreso (tecla J) detecta la IP de red local; pulsa el botón con la IP y el QR se regenera. (Puede requerir permitir Node en el firewall de Windows.)
2. **Publicada:** sube `dist/` a Netlify, Vercel, GitHub Pages o similar, y escribe esa URL en "Dirección base" de la ventana del QR (J). El enlace a Google AI Studio funciona siempre.

La ventana del QR avisa en pantalla cuando la dirección actual (localhost) no sirve para otros dispositivos.

## Sincronización en vivo con Firebase (opcional)

Con Firebase configurado, los votos y compromisos enviados desde los celulares aparecen en la pantalla del facilitador en tiempo real. Sin configurarlo, la app funciona en modo local.

> **Importante:** usa un proyecto de Firebase **exclusivo para este taller**. Publicar `firestore.rules` reemplaza las reglas existentes del proyecto y dejaría sin protección (o rompería) cualquier otra aplicación que lo use.

1. Crea un proyecto nuevo en la [consola de Firebase](https://console.firebase.google.com/), registra una app web y activa **Firestore Database**.
2. Copia `.env.example` a `.env.local` y completa las variables `VITE_FIREBASE_*`.
3. En Firestore → **Reglas**, pega el contenido de `firestore.rules` y publica.
4. En Vercel, agrega las mismas variables en *Settings → Environment Variables*.

Cada facilitador tiene un código de sesión (visible junto al QR de la votación). Los QR de "Tarjeta de respuesta" y "Cierre" lo incluyen, y "Nueva sesión" reinicia las respuestas en vivo.

> La API key de Firebase web no es un secreto, pero sin reglas restrictivas cualquiera con el código podría escribir. Las reglas incluidas limitan forma, tamaño y prohíben borrar.

## Publicar en GitHub y Vercel

```bash
git add . && git commit -m "Aula IA"
git remote add origin https://github.com/<usuario>/aula-ia.git
git push -u origin main
```

Luego en [vercel.com/new](https://vercel.com/new) importa el repositorio (Vite se detecta solo; `vercel.json` ya está listo), agrega las variables de Firebase y despliega. Pega la URL resultante en el campo "Dirección base" de la ventana del QR (J) si no se detecta automáticamente (se detecta sola al abrir la web publicada).

## Logos

Copia el logo oficial de Google AI Studio a `public/brand/ai-studio.svg` (ver `public/brand/README.md`). Sin el archivo se muestra un ícono genérico.

## Qué requiere un backend (ya cubierto si activas Firebase)

Las respuestas de los celulares **no llegan** a la pantalla del facilitador. En este prototipo los celulares usan "tarjetas de respuesta" (levantan el celular) y guardan sus datos solo en su dispositivo. No hay sincronización simulada.

Arquitectura recomendada para sincronizar en vivo:

- **Servicio:** Supabase (Postgres + Realtime) o Firebase Firestore; alternativas Ably/Pusher.
- **Modelo:** `sessions(code)`, `activities(session, id, status)`, `responses(session, activity, device, value, at)`.
- **Flujo:** el facilitador crea una sesión con código corto; el QR abre `/m/responder?s=CODE`; el celular inserta una respuesta (una por dispositivo y actividad); el tablero se suscribe a los cambios y recalcula los resultados.
- **Integración:** implementar la interfaz `ResponseChannel` de `src/lib/sync.ts` y asignarla a `remoteChannel`. Se necesita además limitar escrituras (reglas de seguridad) y no almacenar datos personales de estudiantes.

## Google AI Studio

La app solo abre `https://aistudio.google.com/` en una pestaña nueva. No simula el inicio de sesión ni afirma que un recurso se haya guardado o publicado. La interfaz de Google cambia: la guía describe las secciones por nombre (Build), no por posición.
