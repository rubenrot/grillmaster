import { db } from '@/db/GrillBookDB';
import type { NewRecipeVariantInput, RecipeVariant } from '@/models';

export const RecipeVariantRepository = {
  async create(input: NewRecipeVariantInput): Promise<RecipeVariant> {
    const variant: RecipeVariant = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await db.recipeVariants.add(variant);
    return variant;
  },

  async getById(id: string): Promise<RecipeVariant | undefined> {
    return db.recipeVariants.get(id);
  },

  async listByRecipe(recipeId: string): Promise<RecipeVariant[]> {
    return db.recipeVariants.where('recipeId').equals(recipeId).sortBy('createdAt');
  },

  async delete(id: string): Promise<void> {
    await db.recipeVariants.delete(id);
  },
};
