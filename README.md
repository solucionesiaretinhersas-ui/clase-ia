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

## Atajos del facilitador

| Tecla | Acción | | Tecla | Acción |
|---|---|---|---|---|
| → / Espacio | Siguiente | | N | Notas del facilitador |
| ← | Anterior | | G | Vista general |
| Inicio | Portada | | T | Iniciar/pausar cronómetro del momento |
| F | Pantalla completa | | Esc | Cerrar paneles |

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

1. **Misma red Wi-Fi:** con `npm run dev`, el Centro QR detecta la IP de red local; pulsa el botón con la IP y los QR se regeneran. (Puede requerir permitir Node en el firewall de Windows.)
2. **Publicada:** sube `dist/` a Netlify, Vercel, GitHub Pages o similar, y escribe esa URL en "Dirección base" del Centro QR. El enlace a Google AI Studio funciona siempre.

El Centro QR avisa en pantalla cuando la dirección actual (localhost) no sirve para otros dispositivos.

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

Luego en [vercel.com/new](https://vercel.com/new) importa el repositorio (Vite se detecta solo; `vercel.json` ya está listo), agrega las variables de Firebase y despliega. Pega la URL resultante en el campo "Dirección base" del Centro QR si los QR no la detectan automáticamente (se detecta sola al abrir la web publicada).

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
