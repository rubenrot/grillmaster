import type { NewRecipeInput, Recipe, RecipeSearchQuery } from '@/models';

/**
 * Contrato de persistencia de recetas, independiente de Dexie. Permite
 * sustituir la implementación actual (`DexieRecipeRepository`) por una
 * futura `SupabaseRecipeRepository` sin modificar servicios ni componentes.
 */
export interface RecipeRepository {
  getAll(): Promise<Recipe[]>;
  getById(id: string): Promise<Recipe | undefined>;
  save(recipe: Recipe): Promise<void>;
  create(input: NewRecipeInput): Promise<Recipe>;
  update(recipe: Recipe): Promise<void>;
  delete(id: string): Promise<void>;
  search(query: RecipeSearchQuery): Promise<Recipe[]>;
}
