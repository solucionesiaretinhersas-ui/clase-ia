import { IdeaWall, type WallConfig } from './IdeaWall';

const LLUVIA: WallConfig = {
  id: 'lluvia',
  screenId: 'lluvia',
  kicker: 'Lluvia de ideas · desde tu celular',
  title: '¿Qué te gustaría que la IA hiciera por ti?',
  prompt: '¿Qué te gustaría que la IA hiciera por ti para tener más tiempo con tus estudiantes?',
};

const DIALOGO: WallConfig = {
  id: 'dialogo',
  screenId: 'dialogo',
  kicker: 'Diálogo · desde tu celular',
  title: '¿Qué nos dejan estos recursos?',
  prompt: 'Un aprendizaje, una duda o una idea que te dejaron los recursos presentados.',
};

const REFLEXION: WallConfig = {
  id: 'reflexion',
  screenId: 'reflexion',
  kicker: 'Reflexión · desde tu celular',
  title: 'Una regla ética para mi aula',
  prompt: 'Escribe una regla ética que aplicarás cuando uses IA con tus estudiantes.',
};

export const WallLluvia = () => <IdeaWall cfg={LLUVIA} />;
export const WallDialogo = () => <IdeaWall cfg={DIALOGO} />;
export const WallReflexion = () => <IdeaWall cfg={REFLEXION} />;
