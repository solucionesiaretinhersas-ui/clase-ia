import { ArrowLeft } from 'lucide-react';
import { Ambient } from './components/ui';
import { ToastProvider } from './components/Toast';
import { Mission } from './demo/Mission';
import { Mobile } from './mobile/Mobile';
import { Presenter } from './presenter/Presenter';
import { SCREENS } from './data/workshop';
import { navigate, segments, useRoute } from './lib/router';

export default function App() {
  const path = useRoute();
  const [first, second] = segments(path);

  let view;
  if (first === 'm') view = <Mobile path={path} />;
  else if (first === 'demo')
    view = (
      <div className="demo-page">
        <button type="button" className="btn btn--ghost demo-page__back" onClick={() => navigate('/m')}>
          <ArrowLeft /> Menú
        </button>
        <Mission />
      </div>
    );
  else {
    const id = first === 's' && SCREENS.some((s) => s.id === second) ? second : 'inicio';
    view = <Presenter screenId={id} />;
  }

  return (
    <ToastProvider>
      <Ambient />
      <div className="app-layer">{view}</div>
    </ToastProvider>
  );
}
