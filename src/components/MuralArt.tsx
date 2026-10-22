import type { CSSProperties, ReactNode } from 'react';

/** Ilustraciones vectoriales propias para los murales: ligeras, a color y sin depender de internet. */
export type ArtName = 'rocket' | 'bulb' | 'book' | 'robot' | 'planet' | 'pencil' | 'cloud' | 'star' | 'trophy' | 'heart';

export const ART_NAMES: ArtName[] = ['rocket', 'bulb', 'book', 'robot', 'planet', 'pencil', 'cloud', 'star', 'trophy', 'heart'];

const SHAPES: Record<ArtName, ReactNode> = {
  rocket: (
    <>
      <path d="M60 8c18 14 26 36 22 62H38C34 44 42 22 60 8z" fill="#f5f7ff" />
      <path d="M60 8c18 14 26 36 22 62H60z" fill="#d8def5" />
      <circle cx="60" cy="42" r="10" fill="#22e0ff" stroke="#3b82ff" strokeWidth="4" />
      <path d="M38 56l-16 22 18-4zM82 56l16 22-18-4z" fill="#ff5d7a" />
      <path d="M48 70h24l-12 34z" fill="#ffb02e" />
      <path d="M54 70h12l-6 20z" fill="#ffe27a" />
    </>
  ),
  bulb: (
    <>
      <g stroke="#ffd24a" strokeWidth="5" strokeLinecap="round">
        <path d="M60 6v10M22 22l7 7M98 22l-7 7M10 58h10M100 58h10" />
      </g>
      <path d="M60 24c-17 0-28 12-28 27 0 11 6 17 11 23 3 4 4 7 4 11h26c0-4 1-7 4-11 5-6 11-12 11-23 0-15-11-27-28-27z" fill="#ffd24a" />
      <path d="M60 24c17 0 28 12 28 27 0 11-6 17-11 23-3 4-4 7-4 11H60z" fill="#ffb02e" />
      <path d="M50 52l10 10 10-10M60 62v22" fill="none" stroke="#fff6cf" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="44" y="88" width="32" height="8" rx="4" fill="#8892b0" />
      <rect x="49" y="98" width="22" height="8" rx="4" fill="#6b7596" />
    </>
  ),
  book: (
    <>
      <path d="M60 30c-10-8-30-10-46-6v64c16-4 36-2 46 6z" fill="#3b82ff" />
      <path d="M60 30c10-8 30-10 46-6v64c-16-4-36-2-46 6z" fill="#a66bff" />
      <path d="M60 30v64" stroke="#fff" strokeWidth="3" opacity=".5" />
      <path d="M24 42c9-2 20-1 28 3M24 54c9-2 20-1 28 3M24 66c9-2 20-1 28 3" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".6" fill="none" />
      <path d="M68 45c8-4 19-5 28-3M68 57c8-4 19-5 28-3" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".6" fill="none" />
      <path d="M78 6l4 9 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#ffd24a" />
    </>
  ),
  robot: (
    <>
      <path d="M60 8v14" stroke="#8892b0" strokeWidth="5" strokeLinecap="round" />
      <circle cx="60" cy="8" r="6" fill="#ff5d7a" />
      <rect x="24" y="22" width="72" height="54" rx="16" fill="#dfe6ff" />
      <rect x="32" y="32" width="56" height="34" rx="10" fill="#1c2748" />
      <circle cx="48" cy="48" r="8" fill="#22e0ff" />
      <circle cx="72" cy="48" r="8" fill="#22e0ff" />
      <circle cx="50" cy="46" r="3" fill="#fff" />
      <circle cx="74" cy="46" r="3" fill="#fff" />
      <path d="M50 58q10 6 20 0" stroke="#22e0ff" strokeWidth="3" strokeLinecap="round" fill="none" />
      <rect x="34" y="80" width="52" height="28" rx="10" fill="#a66bff" />
      <circle cx="60" cy="94" r="6" fill="#ffd24a" />
      <rect x="14" y="40" width="10" height="20" rx="5" fill="#8892b0" />
      <rect x="96" y="40" width="10" height="20" rx="5" fill="#8892b0" />
    </>
  ),
  planet: (
    <>
      <circle cx="60" cy="60" r="34" fill="#3b82ff" />
      <path d="M32 46c10 6 22 6 32 0s20-4 28 2M30 70c12 4 24 2 34-4s20-6 28 0" stroke="#22e0ff" strokeWidth="6" strokeLinecap="round" fill="none" opacity=".7" />
      <ellipse cx="60" cy="62" rx="56" ry="14" fill="none" stroke="#ffd24a" strokeWidth="6" transform="rotate(-18 60 62)" />
      <circle cx="96" cy="26" r="5" fill="#fff" />
      <circle cx="22" cy="24" r="3" fill="#fff" />
    </>
  ),
  pencil: (
    <>
      <g transform="rotate(40 60 60)">
        <rect x="46" y="8" width="28" height="74" rx="4" fill="#ffd24a" />
        <rect x="46" y="8" width="28" height="12" rx="4" fill="#ff5d7a" />
        <rect x="46" y="22" width="28" height="6" fill="#c0c8e6" />
        <path d="M46 82h28l-14 28z" fill="#ffe3b8" />
        <path d="M54 98h12l-6 12z" fill="#2b3556" />
        <path d="M60 8v74" stroke="#ffb02e" strokeWidth="4" />
      </g>
    </>
  ),
  cloud: (
    <>
      <path d="M32 74a18 18 0 0 1 2-36 26 26 0 0 1 50 4 16 16 0 0 1 4 32z" fill="#dfe6ff" />
      <path d="M84 42a16 16 0 0 1 4 32H60V38a26 26 0 0 1 24 4z" fill="#c0c8e6" />
      <g stroke="#22e0ff" strokeWidth="5" strokeLinecap="round">
        <path d="M38 88l-4 12M56 88l-4 12M74 88l-4 12M92 88l-4 12" />
      </g>
    </>
  ),
  star: (
    <>
      <path d="M60 8l14 32 35 3-26 23 8 34-31-18-31 18 8-34L11 43l35-3z" fill="#ffd24a" />
      <path d="M60 8l14 32 35 3-26 23 8 34-31-18z" fill="#ffb02e" />
      <circle cx="50" cy="52" r="3.5" fill="#2b3556" />
      <circle cx="70" cy="52" r="3.5" fill="#2b3556" />
      <path d="M52 62q8 8 16 0" stroke="#2b3556" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </>
  ),
  trophy: (
    <>
      <path d="M36 14h48v30c0 16-10 26-24 26S36 60 36 44z" fill="#ffd24a" />
      <path d="M60 14h24v30c0 16-10 26-24 26z" fill="#ffb02e" />
      <path d="M36 22H18c0 18 8 26 20 28M84 22h18c0 18-8 26-20 28" fill="none" stroke="#ffd24a" strokeWidth="6" strokeLinecap="round" />
      <rect x="52" y="70" width="16" height="16" fill="#ffb02e" />
      <rect x="38" y="86" width="44" height="14" rx="5" fill="#a66bff" />
      <path d="M60 26l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z" fill="#fff6cf" />
    </>
  ),
  heart: (
    <>
      <path d="M60 104C20 76 12 52 24 34c10-14 30-10 36 6 6-16 26-20 36-6 12 18 4 42-36 70z" fill="#ff5d7a" />
      <path d="M60 104C100 76 108 52 96 34c-10-14-30-10-36 6z" fill="#e8446a" />
      <path d="M30 44c3-8 10-10 16-8" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".7" />
    </>
  ),
};

export function Art({ name, className = '', style }: { name: ArtName; className?: string; style?: CSSProperties }) {
  return (
    <svg className={`art ${className}`} style={style} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      {SHAPES[name]}
    </svg>
  );
}
