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
import { collection, doc, getFirestore, onSnapshot, setDoc, type Firestore } from 'firebase/firestore';
import { usePersistentState } from './storage';
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

/** Código de la sesión del facilitador. Cambiarlo reinicia las respuestas en vivo. */
export function useSessionCode() {
  const [code, setCode] = usePersistentState<string>('session:code', '');
  useEffect(() => {
    if (!code) setCode(newCode());
  }, [code, setCode]);
  return { code, renew: () => setCode(newCode()) };
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
  kind: 'choice' | 'ideas';
  prompt: string;
  options?: string[];
  open: boolean;
}

export interface LiveState {
  screenId: string;
  at: number;
  act?: LiveAct;
}

/** El facilitador publica la pantalla que proyecta y la actividad abierta (si la hay). */
export async function publishLive(session: string, screenId: string, act?: LiveAct | null): Promise<void> {
  if (!db) return;
  const data: LiveState = { screenId, at: Date.now() };
  if (act) data.act = act;
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