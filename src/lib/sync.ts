/**
 * Sincronización en vivo con Firebase Firestore.
 *
 * Solo está activa si las variables VITE_FIREBASE_* están definidas. Sin ellas
 * la app sigue funcionando en modo local y `LIVE_SYNC_AVAILABLE` es falso.
 *
 * Modelo de datos (una colección por sesión):
 *   sessions/{código}/responses/{dispositivo}__{actividad}
 *     → { activityId, value, at }
 * Cada dispositivo tiene un único documento por actividad, así que cambiar la
 * respuesta la reemplaza en lugar de duplicarla. Las reglas están en
 * firestore.rules.
 */
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, setDoc, type Firestore } from 'firebase/firestore';
import { readStored, usePersistentState, writeStored } from './storage';
import { useWorkshop } from '../data/workshops';
import { useEffect, useMemo, useState } from 'react';

const env = import.meta.env;
const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

export const LIVE_SYNC_AVAILABLE = Boolean(config.apiKey && config.projectId && config.appId);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
if (LIVE_SYNC_AVAILABLE) {
  app = initializeApp(config);
  db = getFirestore(app);
}

export interface LiveResponse {
  id: string;
  device: string;
  activityId: string;
  value: string;
  at: number;
}

export function deviceId(): string {
  const KEY = 'aula-ia:device';
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = Math.random().toString(36).slice(2, 10);
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return 'anon' + Math.random().toString(36).slice(2, 6);
  }
}

function newCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

/** Tipo de participante de una sesión (cada taller tiene su propia sesión). */
export type ParticipantKind = 'docente' | 'estudiante';

export interface SessionRecord {
  code: string;
  kind: ParticipantKind;
  startedAt: number;
}

const HISTORY_KEY = 'history:sessions';

/** Sesiones que este equipo ha iniciado (no se borra al empezar un taller nuevo). */
export function readHistory(): SessionRecord[] {
  return readStored<SessionRecord[]>(HISTORY_KEY, []);
}

function remember(code: string, kind: ParticipantKind) {
  const h = readHistory();
  if (h.some((r) => r.code === code)) return;
  writeStored(HISTORY_KEY, [...h, { code, kind, startedAt: Date.now() }].slice(-80));
}

/**
 * Código de la sesión del facilitador. Cada taller (docentes / estudiantes) tiene
 * su propia sesión, así que sus participantes, respuestas y certificados nunca se
 * mezclan. Cambiarlo reinicia las respuestas en vivo.
 */
export function useSessionCode() {
  const ws = useWorkshop();
  const kind = ws.audience;
  const [code, setCode] = usePersistentState<string>(`session:code:${ws.id}`, '');
  useEffect(() => {
    if (!code) {
      // Si otra ejecución del efecto ya creó el código, se reutiliza (evita sesiones huérfanas).
      const existing = readStored<string>(`session:code:${ws.id}`, '');
      if (existing) return setCode(existing);
      const c = newCode();
      setCode(c);
      writeStored(`session:started:${ws.id}`, Date.now());
      remember(c, kind);
    } else remember(code, kind);
  }, [code, setCode, ws.id, kind]);
  const renew = () => {
    const c = newCode();
    setCode(c);
    writeStored(`session:started:${ws.id}`, Date.now());
    remember(c, kind);
  };
  return { code, renew };
}
export async function sendResponse(session: string, activityId: string, value: string): Promise<void> {
  if (!db) throw new Error('Sincronización en vivo no configurada');
  const clean = session.trim().toUpperCase();
  if (!/^[A-Z0-9]{3,12}$/.test(clean)) throw new Error('Código de sesión inválido');
  await setDoc(doc(db, 'sessions', clean, 'responses', `${deviceId()}__${activityId}`), {
    activityId,
    value: value.slice(0, 900),
    at: Date.now(),
  });
}

export type LiveStatus = 'off' | 'connecting' | 'live' | 'error';

/** Actividad que el celular debe mostrar para que los docentes participen. */
export interface LiveAct {
  key: string;
  /** info muestra datos (reto, marcador) sin pedir respuesta. */
  kind: 'choice' | 'ideas' | 'info';
  prompt: string;
  options?: string[];
  open: boolean;
}

export interface LiveState {
  screenId: string;
  at: number;
  act?: LiveAct;
  /** Nombre del facilitador, para el certificado. */
  fac?: string;
}

/** El facilitador publica la pantalla que proyecta y la actividad abierta (si la hay). */
export async function publishLive(session: string, screenId: string, act?: LiveAct | null, fac?: string): Promise<void> {
  if (!db) return;
  const data: LiveState = { screenId, at: Date.now() };
  if (act) data.act = act;
  if (fac?.trim()) data.fac = fac.trim().slice(0, 60);
  await setDoc(doc(db, 'sessions', session.toUpperCase(), 'live', 'state'), data);
}

/** Envía una idea: cada envío es un documento nuevo (un docente puede enviar varias). */
export async function sendIdea(session: string, activityId: string, value: string): Promise<void> {
  if (!db) throw new Error('Sincronización en vivo no configurada');
  const clean = session.trim().toUpperCase();
  if (!/^[A-Z0-9]{3,12}$/.test(clean)) throw new Error('Código de sesión inválido');
  const text = value.trim().slice(0, 280);
  if (!text) return;
  await setDoc(doc(db, 'sessions', clean, 'responses', `${deviceId()}__${activityId}__${Date.now().toString(36)}`), {
    activityId,
    value: text,
    at: Date.now(),
  });
}

/** Los celulares siguen en tiempo real la pantalla del facilitador. */
export function useLiveState(session: string) {
  const [state, setState] = useState<LiveState | null>(null);
  const [status, setStatus] = useState<LiveStatus>(LIVE_SYNC_AVAILABLE ? 'connecting' : 'off');

  useEffect(() => {
    if (!db || !session) return;
    setStatus('connecting');
    const unsub = onSnapshot(
      doc(db, 'sessions', session.toUpperCase(), 'live', 'state'),
      { includeMetadataChanges: true },
      (snap) => {
        setStatus(snap.metadata.fromCache ? 'connecting' : 'live');
        setState(snap.exists() ? (snap.data() as LiveState) : null);
      },
      () => setStatus('error'),
    );
    return unsub;
  }, [session]);

  return { state, status };
}


/** Suscripción en tiempo real a las respuestas de la sesión, filtradas por actividad. */
export function useLiveResponses(session: string, activityId: string) {
  const [all, setAll] = useState<LiveResponse[]>([]);
  const [status, setStatus] = useState<LiveStatus>(LIVE_SYNC_AVAILABLE ? 'connecting' : 'off');

  useEffect(() => {
    if (!db || !session) return;
    setStatus('connecting');
    setAll([]);
    const unsub = onSnapshot(
      collection(db, 'sessions', session, 'responses'),
      { includeMetadataChanges: true },
      (snap) => {
        setStatus(snap.metadata.fromCache ? 'connecting' : 'live');
        setAll(
          snap.docs.map((d) => ({ id: d.id, device: d.id.split('__')[0], ...(d.data() as Omit<LiveResponse, 'id' | 'device'>) })),
        );
      },
      () => setStatus('error'),
    );
    return unsub;
  }, [session]);

  const responses = useMemo(() => all.filter((r) => r.activityId === activityId).sort((a, b) => a.at - b.at), [all, activityId]);
  return { responses, status };
}
export interface Participant {
  id: string;
  name: string;
  /** Docente o estudiante: los certificados y listas no se mezclan. */
  kind?: ParticipantKind;
  /** Grado (estudiantes) o área/grado que enseña (docentes). */
  grade?: string;
  at: number;
}

/** El docente se registra al entrar con su nombre (un documento por dispositivo). */
export async function registerParticipant(session: string, name: string, grade: string, kind: ParticipantKind): Promise<void> {
  if (!db) throw new Error('Sincronización en vivo no configurada');
  const clean = session.trim().toUpperCase();
  if (!/^[A-Z0-9]{3,12}$/.test(clean)) throw new Error('Código de sesión inválido');
  const n = name.trim().slice(0, 40);
  const g = grade.trim().slice(0, 40);
  if (!n || !g) throw new Error('Nombre y grado obligatorios');
  await setDoc(doc(db, 'sessions', clean, 'participants', deviceId()), { name: n, grade: g, kind, at: Date.now() });
}

/** Docentes registrados en la sesión, en tiempo real. */
export function useParticipants(session: string, kind?: ParticipantKind) {
  const [all, setList] = useState<Participant[]>([]);
  useEffect(() => {
    if (!db || !session) return;
    setList([]);
    const unsub = onSnapshot(
      collection(db, 'sessions', session.toUpperCase(), 'participants'),
      (snap) => setList(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Participant, 'id'>) })).sort((a, b) => a.at - b.at)),
      () => {},
    );
    return unsub;
  }, [session]);
  const list = useMemo(() => (kind ? all.filter((p) => !p.kind || p.kind === kind) : all), [all, kind]);
  return list;
}
/* ───────── Consulta de certificados (sin sesión activa) ───────── */
export interface IssuedCertificate {
  session: string;
  kind: ParticipantKind;
  name: string;
  grade: string;
  at: number;
  facilitator?: string;
}

const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

/** Busca a una persona registrada en una sesión por su nombre (sin importar tildes ni mayúsculas). */
export async function lookupCertificate(session: string, name: string): Promise<IssuedCertificate | null> {
  if (!db) throw new Error('Sincronización en vivo no configurada');
  const code = session.trim().toUpperCase();
  if (!/^[A-Z0-9]{3,12}$/.test(code)) throw new Error('Código de sesión inválido');
  const snap = await getDocs(collection(db, 'sessions', code, 'participants'));
  const want = norm(name);
  const hit = snap.docs
    .map((d) => d.data() as { name: string; grade?: string; kind?: ParticipantKind; at: number })
    .find((p) => norm(p.name) === want);
  if (!hit) return null;
  let facilitator: string | undefined;
  try {
    const live = await getDoc(doc(db, 'sessions', code, 'live', 'state'));
    facilitator = (live.data() as { fac?: string } | undefined)?.fac;
  } catch {
    /* el certificado se puede emitir sin el nombre del facilitador */
  }
  return { session: code, kind: hit.kind ?? 'docente', name: hit.name, grade: hit.grade ?? '', at: hit.at, facilitator };
}