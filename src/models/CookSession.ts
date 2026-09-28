export type CookResultTag =
  | 'perfect'
  | 'juicy'
  | 'tender'
  | 'dry'
  | 'tough'
  | 'undercooked'
  | 'overcooked';

/**
 * Registro simple de una preparación real, sustituyendo al antiguo modelo
 * detallado de `CookEvent`. El objetivo es capturar el resultado final para
 * poder personalizar futuras recomendaciones, no registrar cada evento.
 */
export interface CookSession {
  id: string;
  recipeId: string;
  recipeVariantId?: string;

  startedAt: string;
  finishedAt?: string;

  rating?: number;
  resultTags?: CookResultTag[];
  notes?: string;

  finalInternalTemperature?: number;

  createdAt: string;
}

export type NewCookSessionInput = Omit<CookSession, 'id' | 'createdAt'>;
