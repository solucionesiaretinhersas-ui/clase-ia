import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import './styles/global.css';
import './styles/presenter.css';
import './styles/screens.css';
import './styles/mobile.css';
import './styles/extra.css';
import './styles/whiteboard.css';
import './styles/join.css';
import './styles/student.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
