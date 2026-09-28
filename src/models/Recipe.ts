import type { CookingMethod, Doneness, FoodCategory, FuelType, WoodType } from './Cook';
import type { GrillType } from './Grill';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type RecipeSource = 'builtin' | 'user' | 'ai';

export interface TemperatureRange {
  min: number;
  max: number;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
  optional?: boolean;
  notes?: string;
}

export interface RecipeStep {
  id: string;
  order: number;
  title: string;
  instruction: string;
  duration?: number;
  grillTemperature?: TemperatureRange;
  targetInternalTemperature?: number;
  timerRecommended?: boolean;
}

export interface GrillSetup {
  grillType?: GrillType;
  fuel?: FuelType;
  cookingMethod: CookingMethod;
  woods?: WoodType[];
  grillTemperature?: TemperatureRange;
  lid?: 'open' | 'closed' | 'mixed';
  notes?: string;
}

export interface Recipe {
  id: string;

  name: string;
  description?: string;

  category: FoodCategory;
  cut?: string;

  servings?: number;

  ingredients: RecipeIngredient[];
  steps: RecipeStep[];

  grillSetup: GrillSetup;

  targetInternalTemperature?: number;

  prepTime?: number;
  cookingTime?: number;

  difficulty?: Difficulty;

  recommendedWoods?: WoodType[];

  tags: string[];

  source: RecipeSource;

  isFavorite: boolean;

  createdAt: string;
  updatedAt: string;
}

export type NewRecipeInput = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite' | 'tags'> & {
  isFavorite?: boolean;
  tags?: string[];
};

export interface RecipeVariant {
  id: string;
  recipeId: string;

  weight?: number;
  thickness?: number;
  servings?: number;

  grillId?: string;

  doneness?: Doneness;

  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  grillSetup: GrillSetup;

  generatedByAI: boolean;

  createdAt: string;
}

export type NewRecipeVariantInput = Omit<RecipeVariant, 'id' | 'createdAt'>;

export interface RecipeSearchQuery {
  text?: string;
  category?: FoodCategory;
  cookingMethod?: CookingMethod;
  difficulty?: Difficulty;
  wood?: WoodType;
  grillType?: GrillType;
  favoritesOnly?: boolean;
  source?: RecipeSource;
}

