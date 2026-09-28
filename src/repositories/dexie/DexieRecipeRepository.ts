import { db } from '@/db/GrillBookDB';
import type { NewRecipeInput, Recipe, RecipeSearchQuery } from '@/models';
import type { RecipeRepository } from '../interfaces/RecipeRepository';

/** Implementación Dexie/IndexedDB del repositorio de recetas. */
export class DexieRecipeRepository implements RecipeRepository {
  async getAll(): Promise<Recipe[]> {
    return db.recipes.orderBy('createdAt').reverse().toArray();
  }

  async getById(id: string): Promise<Recipe | undefined> {
    return db.recipes.get(id);
  }

  async save(recipe: Recipe): Promise<void> {
    await db.recipes.put(recipe);
  }

  async create(input: NewRecipeInput): Promise<Recipe> {
    const now = new Date().toISOString();
    const recipe: Recipe = {
      ...input,
      id: crypto.randomUUID(),
      isFavorite: input.isFavorite ?? false,
      tags: input.tags ?? [],
      createdAt: now,
      updatedAt: now,
    };
    await db.recipes.add(recipe);
    return recipe;
  }

  async update(recipe: Recipe): Promise<void> {
    await db.recipes.put({ ...recipe, updatedAt: new Date().toISOString() });
  }

  async delete(id: string): Promise<void> {
    await db.recipes.delete(id);
  }

  async search(query: RecipeSearchQuery): Promise<Recipe[]> {
    const all = await this.getAll();
    const text = query.text?.trim().toLowerCase();

    return all.filter((recipe) => {
      if (text) {
        const matchesText =
          recipe.name.toLowerCase().includes(text) ||
          (recipe.cut ?? '').toLowerCase().includes(text) ||
          recipe.tags.some((tag) => tag.toLowerCase().includes(text));
        if (!matchesText) return false;
      }
      if (query.category && recipe.category !== query.category) return false;
      if (query.cookingMethod && recipe.grillSetup.cookingMethod !== query.cookingMethod) return false;
      if (query.difficulty && recipe.difficulty !== query.difficulty) return false;
      if (query.wood && !(recipe.recommendedWoods ?? recipe.grillSetup.woods ?? []).includes(query.wood)) return false;
      if (query.grillType && recipe.grillSetup.grillType !== query.grillType) return false;
      if (query.favoritesOnly && !recipe.isFavorite) return false;
      if (query.source && recipe.source !== query.source) return false;
      return true;
    });
  }
}
