import { useCallback, useEffect, useState } from 'react';
import { RecipeService } from '@/services/RecipeService';
import type { Recipe } from '@/models';

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const all = await RecipeService.listAll();
    setRecipes(all);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { recipes, isLoading, refresh };
}

export function useRecipe(id: string | undefined) {
  const [recipe, setRecipe] = useState<Recipe | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!id) {
      setRecipe(undefined);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const found = await RecipeService.getById(id);
    setRecipe(found);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { recipe, isLoading, refresh };
}
