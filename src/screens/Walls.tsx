import { IdeaWall, type WallConfig } from './IdeaWall';

const LLUVIA: WallConfig = {
  id: 'lluvia',
  screenId: 'lluvia',
  kicker: 'Lluvia de ideas · desde tu celular',
  title: '¿Qué tarea educativa quieres mejorar?',
  prompt: '¿Qué tarea educativa te gustaría mejorar con ayuda de la IA para tener más tiempo con tus estudiantes?',
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

const E_DONDE: WallConfig = {
  id: 'e-donde',
  screenId: 'e-donde',
  kicker: 'Nube de palabras · desde tu celular',
  title: '¿Dónde ves inteligencia artificial?',
  prompt: '¿Dónde has visto o usado inteligencia artificial? Escribe una palabra o frase corta.',
  cloud: true,
};

const E_PREDICCION: WallConfig = {
  id: 'e-prediccion',
  screenId: 'e-prediccion',
  kicker: 'Adivina la palabra · desde tu celular',
  title: 'Cuando llueve mucho, saco mi ____',
  prompt: 'Completa la frase con UNA sola palabra: “Cuando llueve mucho, saco mi ____”.',
  cloud: true,
};

const E_IDEA: WallConfig = {
  id: 'e-idea',
  screenId: 'e-idea',
  kicker: 'Lluvia de ideas · desde tu celular',
  title: '¿Qué aplicación o juego crearías?',
  prompt: 'Escribe la idea de una aplicación o juego que te gustaría crear.',
};

const E_REFLEXION: WallConfig = {
  id: 'e-reflexion',
  screenId: 'e-reflexion',
  kicker: 'Cierre · desde tu celular',
  title: 'Lo que me llevo de hoy',
  prompt: 'Escribe una frase: lo que aprendiste hoy o la app que vas a crear después.',
};

export const WallDonde = () => <IdeaWall cfg={E_DONDE} />;
export const WallPrediccion = () => <IdeaWall cfg={E_PREDICCION} />;
export const WallIdea = () => <IdeaWall cfg={E_IDEA} />;
export const WallEReflexion = () => <IdeaWall cfg={E_REFLEXION} />;