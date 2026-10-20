import { createContext, useContext } from 'react';

export interface PresenterApi {
  goTo: (id: string) => void;
  next: () => void;
  prev: () => void;
  current: string;
  /** Muestra el QR de ingreso a pantalla grande. */
  openJoin: () => void;
  /** Abre la ruleta de docentes. */
  openWheel: () => void;
}

export const PresenterCtx = createContext<PresenterApi>({
  goTo: () => {},
  next: () => {},
  prev: () => {},
  current: 'inicio',
  openJoin: () => {},
  openWheel: () => {},
});

export const usePresenter = () => useContext(PresenterCtx);
