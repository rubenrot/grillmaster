import { CookSessionRepository } from '@/repositories';
import type { CookResultTag, Recipe, RecipeStep, RecipeVariant } from '@/models';

export interface GuideStep {
  index: number;
  total: number;
  step: RecipeStep;
}

/** Construye la guía paso a paso a partir de una receta y, opcionalmente, una variante adaptada. */
export function buildGuideSteps(recipe: Recipe, variant?: RecipeVariant): RecipeStep[] {
  return variant?.steps.length ? variant.steps : recipe.steps;
}

export interface FinishCookSessionInput {
  recipeId: string;
  recipeVariantId?: string;
  startedAt: string;
  rating?: number;
  resultTags?: CookResultTag[];
  notes?: string;
  finalInternalTemperature?: number;
}

export const CookingGuideService = {
  async startSession(recipeId: string, recipeVariantId?: string) {
    return CookSessionRepository.create({
      recipeId,
      recipeVariantId,
      startedAt: new Date().toISOString(),
    });
  },

  async finishSession(sessionId: string, input: Omit<FinishCookSessionInput, 'recipeId' | 'startedAt'>) {
    await CookSessionRepository.update(sessionId, {
      finishedAt: new Date().toISOString(),
      ...input,
    });
  },
};
