import type { ComponentType } from 'react';
import { AIStudioIntro } from './AIStudioIntro';
import { Closing } from './Closing';
import { Copilot } from './Copilot';
import { DemoScreen } from './DemoScreen';
import { Ethics } from './Ethics';
import { Gallery } from './Gallery';
import { HumanVsAI } from './HumanVsAI';
import { OpeningVote } from './OpeningVote';
import { PedagogicalChallenge } from './PedagogicalChallenge';
import { PracticalWorkshop } from './PracticalWorkshop';
import { PromptBuilder } from './PromptBuilder';
import { PromptLab } from './PromptLab';
import { Route } from './Route';
import { StudioStation } from './StudioStation';
import { TraditionalVsInteractive } from './TraditionalVsInteractive';
import { Welcome } from './Welcome';
import { WallDialogo, WallLluvia, WallReflexion } from './Walls';

export const SCREEN_COMPONENTS: Record<string, ComponentType> = {
  inicio: Welcome,
  ruta: Route,
  votacion: OpeningVote,
  copiloto: Copilot,
  lluvia: WallLluvia,
  dialogo: WallDialogo,
  reflexion: WallReflexion,
  'humano-ia': HumanVsAI,
  'ai-studio': AIStudioIntro,
  estacion: StudioStation,
  reto: PedagogicalChallenge,
  tradicional: TraditionalVsInteractive,
  construir: PromptBuilder,
  laboratorio: PromptLab,
  demo: DemoScreen,
  taller: PracticalWorkshop,
  galeria: Gallery,
  etica: Ethics,
  cierre: Closing,
};
