import { z } from 'zod';

/**
 * Schemas Zod que reflejan (de forma deliberadamente independiente) los
 * modelos del frontend en `src/models`. GrillMaster API es un servicio
 * opcional y desacoplado: no importa código del frontend, así que estos
 * tipos se mantienen aquí como la "fuente de verdad" del backend.
 */

export const foodCategorySchema = z.enum([
  'beef',
  'pork',
  'chicken',
  'turkey',
  'lamb',
  'fish',
  'seafood',
  'vegetables',
  'fruit',
  'other',
]);

export const fuelTypeSchema = z.enum([
  'lump_charcoal',
  'briquettes',
  'wood',
  'pellets',
  'gas',
  'electric',
  'other',
]);

export const woodTypeSchema = z.enum([
  'oak',
  'beech',
  'cherry',
  'apple',
  'hickory',
  'pecan',
  'mesquite',
  'maple',
  'other',
]);

export const cookingMethodSchema = z.enum([
  'direct',
  'indirect',
  'mixed',
  'reverse_sear',
  'low_and_slow',
  'smoking',
  'plank',
  'rotisserie',
  'other',
]);

export const donenessSchema = z.enum([
  'rare',
  'medium_rare',
  'medium',
  'medium_well',
  'well_done',
  'custom',
]);

export const difficultySchema = z.enum(['easy', 'medium', 'hard']);

export const grillTypeSchema = z.enum(['charcoal', 'gas', 'pellet', 'kamado', 'electric', 'other']);

export const temperatureRangeSchema = z.object({
  min: z.number(),
  max: z.number(),
});

export const recipeIngredientSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().optional(),
  unit: z.string().optional(),
  optional: z.boolean().optional(),
  notes: z.string().optional(),
});

export const recipeStepSchema = z.object({
  id: z.string(),
  order: z.number(),
  title: z.string(),
  instruction: z.string(),
  duration: z.number().optional(),
  grillTemperature: temperatureRangeSchema.optional(),
  targetInternalTemperature: z.number().optional(),
  timerRecommended: z.boolean().optional(),
});

export const grillSetupSchema = z.object({
  grillType: grillTypeSchema.optional(),
  fuel: fuelTypeSchema.optional(),
  cookingMethod: cookingMethodSchema,
  woods: z.array(woodTypeSchema).optional(),
  grillTemperature: temperatureRangeSchema.optional(),
  lid: z.enum(['open', 'closed', 'mixed']).optional(),
  notes: z.string().optional(),
});

export const recipeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: foodCategorySchema,
  cut: z.string().optional(),
  servings: z.number().optional(),
  ingredients: z.array(recipeIngredientSchema),
  steps: z.array(recipeStepSchema),
  grillSetup: grillSetupSchema,
  targetInternalTemperature: z.number().optional(),
  prepTime: z.number().optional(),
  cookingTime: z.number().optional(),
  difficulty: difficultySchema.optional(),
  recommendedWoods: z.array(woodTypeSchema).optional(),
  tags: z.array(z.string()),
  source: z.enum(['builtin', 'user', 'ai']),
  isFavorite: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const recipeVariantSchema = z.object({
  id: z.string(),
  recipeId: z.string(),
  weight: z.number().optional(),
  thickness: z.number().optional(),
  servings: z.number().optional(),
  grillId: z.string().optional(),
  doneness: donenessSchema.optional(),
  ingredients: z.array(recipeIngredientSchema),
  steps: z.array(recipeStepSchema),
  grillSetup: grillSetupSchema,
  generatedByAI: z.boolean(),
  createdAt: z.string(),
});

export const grillSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: grillTypeSchema,
  hasLid: z.boolean().optional(),
  supportsIndirectCooking: z.boolean().optional(),
  supportsSmoking: z.boolean().optional(),
  supportedFuels: z.array(fuelTypeSchema).optional(),
  notes: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const userPreferencesSchema = z.object({
  temperatureUnit: z.enum(['C', 'F']),
  weightUnit: z.enum(['metric', 'imperial']),
  defaultDoneness: donenessSchema.optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  smokePreference: z.enum(['light', 'medium', 'strong']).optional(),
});

export const knowledgeItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  type: z.string(),
  category: foodCategorySchema.optional(),
  tags: z.array(z.string()),
  createdAt: z.string(),
});

export const cookSessionSchema = z.object({
  id: z.string(),
  recipeId: z.string(),
  recipeVariantId: z.string().optional(),
  startedAt: z.string(),
  finishedAt: z.string().optional(),
  rating: z.number().optional(),
  notes: z.string().optional(),
  finalInternalTemperature: z.number().optional(),
  resultTags: z.array(z.string()).optional(),
  createdAt: z.string(),
});

/** Contexto de usuario enviado por el frontend en cada petición de IA. */
export const aiContextSchema = z.object({
  grills: z.array(grillSchema).default([]),
  availableWoods: z.array(woodTypeSchema).default([]),
  availableFuels: z.array(fuelTypeSchema).default([]),
  preferences: userPreferencesSchema,
  favoriteRecipes: z.array(recipeSchema).default([]),
  recentRecipes: z.array(recipeSchema).default([]),
  recentCookSessions: z.array(cookSessionSchema).default([]),
  knowledge: z.array(knowledgeItemSchema).optional(),
});

export const generateRecipeRequestSchema = z.object({
  foodName: z.string().min(1),
  cut: z.string().optional(),
  weight: z.number().optional(),
  thickness: z.number().optional(),
  servings: z.number().optional(),
  ingredients: z.array(z.string()).optional(),
  condiments: z.array(z.string()).optional(),
  category: foodCategorySchema.optional(),
  difficulty: difficultySchema.optional(),
  cookingMethod: cookingMethodSchema.optional(),
  fuel: fuelTypeSchema.optional(),
  wood: woodTypeSchema.optional(),
  grillId: z.string().optional(),
  doneness: donenessSchema.optional(),
  maxCookingTime: z.number().optional(),
});

export const adaptRecipeRequestSchema = z.object({
  recipe: recipeSchema,
  weight: z.number().optional(),
  thickness: z.number().optional(),
  servings: z.number().optional(),
  grillId: z.string().optional(),
  doneness: donenessSchema.optional(),
  fuel: fuelTypeSchema.optional(),
  wood: z.array(woodTypeSchema).optional(),
  cookingMethod: cookingMethodSchema.optional(),
});

export const recommendationRequestSchema = z.object({
  category: foodCategorySchema.optional(),
  limit: z.number().optional(),
});

export const askRequestSchema = z.object({
  question: z.string().min(1),
});

export const generateRecipeBodySchema = z.object({
  request: generateRecipeRequestSchema,
  context: aiContextSchema,
});

export const adaptRecipeBodySchema = z.object({
  request: adaptRecipeRequestSchema,
  context: aiContextSchema,
});

export const recommendBodySchema = z.object({
  request: recommendationRequestSchema,
  context: aiContextSchema,
});

export const askBodySchema = z.object({
  request: askRequestSchema,
  context: aiContextSchema,
});

export type AIContext = z.infer<typeof aiContextSchema>;
export type GenerateRecipeRequest = z.infer<typeof generateRecipeRequestSchema>;
export type AdaptRecipeRequest = z.infer<typeof adaptRecipeRequestSchema>;
export type RecommendationRequest = z.infer<typeof recommendationRequestSchema>;
export type Recipe = z.infer<typeof recipeSchema>;
export type RecipeVariant = z.infer<typeof recipeVariantSchema>;
export type RecipeStep = z.infer<typeof recipeStepSchema>;
export type RecipeIngredient = z.infer<typeof recipeIngredientSchema>;
export type CookingMethod = z.infer<typeof cookingMethodSchema>;
export type FoodCategory = z.infer<typeof foodCategorySchema>;
export type Difficulty = z.infer<typeof difficultySchema>;
export type WoodType = z.infer<typeof woodTypeSchema>;
