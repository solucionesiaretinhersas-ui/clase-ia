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
import { useEffect, useState } from 'react';

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

/** Suscripción en tiempo real a las respuestas de una actividad. */
export function useLiveResponses(session: string, activityId: string) {
  const [responses, setResponses] = useState<LiveResponse[]>([]);
  const [status, setStatus] = useState<LiveStatus>(LIVE_SYNC_AVAILABLE ? 'connecting' : 'off');

  useEffect(() => {
    if (!db || !session) return;
    setStatus('connecting');
    setResponses([]);
    const unsub = onSnapshot(
      collection(db, 'sessions', session, 'responses'),
      (snap) => {
        setStatus('live');
        setResponses(
          snap.docs
            .map((d) => ({ device: d.id.split('__')[0], ...(d.data() as Omit<LiveResponse, 'device'>) }))
            .filter((r) => r.activityId === activityId)
            .sort((a, b) => a.at - b.at),
        );
      },
      () => setStatus('error'),
    );
    return unsub;
  }, [session, activityId]);

  return { responses, status };
}
