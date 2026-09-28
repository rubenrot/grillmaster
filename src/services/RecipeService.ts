import { recipeRepository, RecipeVariantRepository } from '@/repositories';
import { AIService } from './AIService';
import type { AdaptRecipeRequest, NewRecipeInput, Recipe, RecipeSearchQuery, RecipeVariant } from '@/models';

/** Operaciones de dominio sobre recetas, aislando a la UI de repositories/IA. */
export const RecipeService = {
  listAll: () => recipeRepository.getAll(),
  getById: (id: string) => recipeRepository.getById(id),
  search: (query: RecipeSearchQuery) => recipeRepository.search(query),

  async listByCategory(category: string | null): Promise<Recipe[]> {
    if (!category) return recipeRepository.getAll();
    return recipeRepository.search({ category: category as Recipe['category'] });
  },

  listFavorites: () => recipeRepository.search({ favoritesOnly: true }),

  async toggleFavorite(id: string): Promise<void> {
    const recipe = await recipeRepository.getById(id);
    if (!recipe) return;
    await recipeRepository.update({ ...recipe, isFavorite: !recipe.isFavorite });
  },

  async createUserRecipe(input: Omit<NewRecipeInput, 'source'>): Promise<Recipe> {
    return recipeRepository.create({ ...input, source: 'user' });
  },

  async saveAIRecipe(recipe: Recipe): Promise<Recipe> {
    return recipeRepository.create({ ...recipe, source: 'ai' });
  },

  async adaptRecipe(recipe: Recipe, request: AdaptRecipeRequest): Promise<RecipeVariant> {
    const variant = await AIService.adaptRecipe(recipe, request);
    return RecipeVariantRepository.create(variant);
  },

  listVariants: RecipeVariantRepository.listByRecipe,
  getVariant: RecipeVariantRepository.getById,
};
