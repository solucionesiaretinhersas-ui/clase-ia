import { ArrowLeft } from 'lucide-react';
import { Ambient } from './components/ui';
import { ToastProvider } from './components/Toast';
import { Mission } from './demo/Mission';
import { Mobile } from './mobile/Mobile';
import { DemoPanel } from './screens/DemoLive';
import { Presenter } from './presenter/Presenter';
import { useWorkshop } from './data/workshops';
import { navigate, segments, useRoute } from './lib/router';

export default function App() {
  const path = useRoute();
  const ws = useWorkshop();
  const [first, second] = segments(path);

  let view;
  if (first === 'm') view = <Mobile path={path} />;
  else if (first === 'panel') view = <DemoPanel />;
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
    const id = first === 's' && ws.screens.some((s) => s.id === second) ? second : ws.introCover;
    view = <Presenter screenId={id} />;
  }

  return (
    <ToastProvider>
      <Ambient />
      <div className="app-layer">{view}</div>
    </ToastProvider>
  );
}
