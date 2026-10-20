import { createContext, useContext } from 'react';

export interface PresenterApi {
  goTo: (id: string) => void;
  next: () => void;
  prev: () => void;
  current: string;
}

export const PresenterCtx = createContext<PresenterApi>({
  goTo: () => {},
  next: () => {},
  prev: () => {},
  current: 'inicio',
});

export const usePresenter = () => useContext(PresenterCtx);
