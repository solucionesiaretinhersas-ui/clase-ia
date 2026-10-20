import type { ComponentType } from 'react';
import { AIStudioIntro } from './AIStudioIntro';
import { Closing } from './Closing';
import { DemoScreen } from './DemoScreen';
import { Gallery } from './Gallery';
import { Inspiration } from './Inspiration';
import { OpeningVote } from './OpeningVote';
import { PedagogicalChallenge } from './PedagogicalChallenge';
import { PracticalWorkshop } from './PracticalWorkshop';
import { PromptBuilder } from './PromptBuilder';
import { PromptLab } from './PromptLab';
import { QrCenter } from './QrCenter';
import { Route } from './Route';
import { StudioStation } from './StudioStation';
import { TraditionalVsInteractive } from './TraditionalVsInteractive';
import { Welcome } from './Welcome';

export const SCREEN_COMPONENTS: Record<string, ComponentType> = {
  inicio: Welcome,
  ruta: Route,
  inspiracion: Inspiration,
  votacion: OpeningVote,
  tradicional: TraditionalVsInteractive,
  'ai-studio': AIStudioIntro,
  estacion: StudioStation,
  reto: PedagogicalChallenge,
  construir: PromptBuilder,
  laboratorio: PromptLab,
  demo: DemoScreen,
  taller: PracticalWorkshop,
  qr: QrCenter,
  galeria: Gallery,
  cierre: Closing,
};
