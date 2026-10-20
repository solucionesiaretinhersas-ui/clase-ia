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
import { Certificates } from './Certificates';
import { StudentLab } from './StudentLab';
import { StudentWorkshop } from './StudentWorkshop';
import { HowAI, StudioForStudents, VibeCoding, WhatIsAI } from './StudentScreens';
import { EConfiar, EIaONo } from './StudentClassify';
import { WallDialogo, WallDonde, WallEReflexion, WallIdea, WallLluvia, WallPrediccion, WallReflexion } from './Walls';

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
  certificados: Certificates,
  // Taller de estudiantes
  'e-inicio': Welcome,
  'e-ruta': Route,
  'e-votacion': OpeningVote,
  'e-que-es': WhatIsAI,
  'e-donde': WallDonde,
  'e-ia-o-no': EIaONo,
  'e-como': HowAI,
  'e-prediccion': WallPrediccion,
  'e-confiar': EConfiar,
  'e-studio': StudioForStudents,
  'e-vibe': VibeCoding,
  'e-demo': DemoScreen,
  'e-estacion': StudioStation,
  'e-idea': WallIdea,
  'e-lab': StudentLab,
  'e-taller': StudentWorkshop,
  'e-galeria': Gallery,
  'e-etica': Ethics,
  'e-reflexion': WallEReflexion,
  'e-certificados': Certificates,
};
