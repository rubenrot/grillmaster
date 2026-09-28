import { aiProvider } from './ai';
import { KnowledgeService } from './KnowledgeService';
import {
  GrillRepository,
  PreferencesRepository,
  recipeRepository,
  CookSessionRepository,
} from '@/repositories';
import type {
  AdaptRecipeRequest,
  AICookingAnswer,
  GenerateRecipeRequest,
  GrillBookAIContext,
  Recipe,
  RecipeVariant,
  RecommendationRequest,
} from '@/models';

async function buildContext(knowledgeQuery?: string): Promise<GrillBookAIContext> {
  const [grills, preferences, availableWoods, availableFuels, favoriteRecipes, recentRecipes, recentCookSessions] =
    await Promise.all([
      GrillRepository.listAll(),
      PreferencesRepository.get(),
      PreferencesRepository.listAvailableWoods(),
      PreferencesRepository.listAvailableFuels(),
      recipeRepository.search({ favoritesOnly: true }),
      recipeRepository.getAll(),
      CookSessionRepository.listRecent(5),
    ]);

  const knowledge = knowledgeQuery ? await KnowledgeService.search({ text: knowledgeQuery, limit: 5 }) : undefined;

  return {
    grills,
    availableWoods: availableWoods.map((w) => w.wood),
    availableFuels: availableFuels.map((f) => f.fuel),
    preferences,
    favoriteRecipes,
    recentRecipes: recentRecipes.slice(0, 5),
    recentCookSessions,
    knowledge,
  };
}

/**
 * Servicio de alto nivel que orquesta el contexto del usuario (incluyendo
 * conocimiento local relevante) y delega en el proveedor de IA configurado
 * (`MockAIProvider` por ahora). La UI nunca llama directamente al proveedor
 * de IA: siempre pasa por este servicio. No existe backend: todo funciona
 * en el navegador.
 */
export const AIService = {
  async generateRecipe(request: GenerateRecipeRequest): Promise<Recipe> {
    const context = await buildContext(request.foodName);
    return aiProvider.generateRecipe(request, context);
  },

  async adaptRecipe(recipe: Recipe, request: AdaptRecipeRequest): Promise<RecipeVariant> {
    const context = await buildContext();
    return aiProvider.adaptRecipe(recipe, request, context);
  },

  async recommendRecipes(request: RecommendationRequest = {}): Promise<Recipe[]> {
    const context = await buildContext();
    return aiProvider.recommendRecipes(request, context);
  },

  async answerCookingQuestion(question: string): Promise<AICookingAnswer> {
    const context = await buildContext(question);
    return aiProvider.answerCookingQuestion(question, context);
  },

  async cookWithWhatIHave(ingredients: string[], category?: Recipe['category']): Promise<Recipe[]> {
    const context = await buildContext(ingredients.join(' '));
    const requests: GenerateRecipeRequest[] = [
      { foodName: ingredients[0] ?? 'Tus ingredientes', ingredients, category },
      { foodName: `${ingredients[0] ?? 'Receta'} al punto`, ingredients, category, difficulty: 'medium' },
      { foodName: `${ingredients[0] ?? 'Receta'} rápida`, ingredients, category, difficulty: 'easy' },
    ];
    return Promise.all(requests.map((r) => aiProvider.generateRecipe(r, context)));
  },
};
