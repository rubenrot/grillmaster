import type { CookingMethod, Doneness, FoodCategory, FuelType, WoodType } from './Cook';
import type { Grill } from './Grill';
import type { Difficulty, Recipe } from './Recipe';
import type { UserPreferences } from './Settings';
import type { CookSession } from './CookSession';
import type { KnowledgeItem } from './Knowledge';

export interface AIConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export type AIMessageRole = 'user' | 'assistant';

export interface AIMessage {
  id: string;
  conversationId: string;
  role: AIMessageRole;
  content: string;
  createdAt: string;
}

/** Contexto del usuario que se envía al proveedor de IA para personalizar respuestas. */
export interface GrillBookAIContext {
  grills: Grill[];
  availableWoods: WoodType[];
  availableFuels: FuelType[];
  preferences: UserPreferences;
  favoriteRecipes: Recipe[];
  recentRecipes: Recipe[];
  recentCookSessions: CookSession[];
  knowledge?: KnowledgeItem[];
}

export type AIIntent =
  | 'question'
  | 'generate_recipe'
  | 'adapt_recipe'
  | 'recommendation'
  | 'wood_pairing'
  | 'technique'
  | 'temperature'
  | 'unknown';

/** Respuesta enriquecida del asistente, con sugerencias y referencias de conocimiento utilizado. */
export interface AICookingAnswer {
  content: string;
  suggestions?: string[];
  relatedRecipeIds?: string[];
  knowledgeItemIds?: string[];
}

export interface GenerateRecipeRequest {
  foodName: string;
  cut?: string;
  weight?: number;
  thickness?: number;
  servings?: number;
  ingredients?: string[];
  condiments?: string[];
  category?: FoodCategory;
  difficulty?: Difficulty;
  cookingMethod?: CookingMethod;
  fuel?: FuelType;
  wood?: WoodType;
  grillId?: string;
  doneness?: Doneness;
  maxCookingTime?: number;
}

export interface AdaptRecipeRequest {
  weight?: number;
  thickness?: number;
  servings?: number;
  grillId?: string;
  doneness?: Doneness;
  fuel?: FuelType;
  wood?: WoodType[];
  cookingMethod?: CookingMethod;
}

export interface RecommendationRequest {
  category?: FoodCategory;
  limit?: number;
}
