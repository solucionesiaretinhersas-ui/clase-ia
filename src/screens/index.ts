import type { ComponentType } from 'react';
import { Closing } from './Closing';
import { DemoScreen } from './DemoScreen';
import { Ethics } from './Ethics';
import { Gallery } from './Gallery';
import { HumanVsAI } from './HumanVsAI';
import { OpeningVote } from './OpeningVote';
import { PracticalWorkshop } from './PracticalWorkshop';
import { PromptLab } from './PromptLab';
import { Route } from './Route';
import { StudioStation } from './StudioStation';
import { DemoLive } from './DemoLive';
import { Potencia } from './IntroScreens';
import { AulaDemo, StudioIntro } from './StudioScreens';
import { Usos } from './Usos';
import { RocasCompare, RocasIntro } from './RocasScreens';
import { RocasGame } from './RocasGame';
import { FlowScreen } from './FlowScreen';
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
  potencia: Potencia,
  vibe: AulaDemo,
  'demo-vivo': DemoLive,
  rocas: RocasIntro,
  'rocas-vs': RocasCompare,
  'rocas-juego': RocasGame,
  lluvia: WallLluvia,
  dialogo: WallDialogo,
  reflexion: WallReflexion,
  'humano-ia': HumanVsAI,
  'ai-studio': StudioIntro,
  estacion: StudioStation,
  laboratorio: PromptLab,
  flujo: FlowScreen,
  usos: Usos,
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
