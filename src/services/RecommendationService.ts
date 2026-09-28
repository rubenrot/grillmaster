import { recipeRepository, PreferencesRepository } from '@/repositories';
import type { FoodCategory, Recipe, WoodType } from '@/models';

const WOOD_COMPATIBILITY: Partial<Record<WoodType, FoodCategory[]>> = {
  cherry: ['pork', 'chicken', 'fish'],
  apple: ['pork', 'chicken'],
  hickory: ['beef', 'pork'],
  mesquite: ['beef'],
  oak: ['beef', 'lamb'],
  beech: ['fish', 'seafood', 'vegetables'],
  pecan: ['chicken', 'pork'],
};

/**
 * Motor de recomendaciones basado en reglas locales. La arquitectura permite
 * sustituir o combinar esta lógica con recomendaciones generadas por IA en el
 * futuro (ver `AIService.recommendRecipes`).
 */
export const RecommendationService = {
  async recommendedForYou(limit = 6): Promise<Recipe[]> {
    const [all, woods, preferences] = await Promise.all([
      recipeRepository.getAll(),
      PreferencesRepository.listAvailableWoods(),
      PreferencesRepository.get(),
    ]);

    const compatibleCategories = new Set(
      woods.flatMap((w) => WOOD_COMPATIBILITY[w.wood] ?? []),
    );

    const scored = all.map((recipe) => {
      let score = 0;
      if (compatibleCategories.has(recipe.category)) score += 2;
      if (preferences.defaultDoneness && recipe.category !== 'fish' && recipe.category !== 'seafood') {
        score += 1;
      }
      if (recipe.isFavorite) score += 1;
      return { recipe, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.recipe);
  },

  async popular(limit = 6): Promise<Recipe[]> {
    const all = await recipeRepository.search({ source: 'builtin' });
    return all.slice(0, limit);
  },
};
