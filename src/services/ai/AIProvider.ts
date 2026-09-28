import type {
  AdaptRecipeRequest,
  AICookingAnswer,
  GenerateRecipeRequest,
  GrillBookAIContext,
  Recipe,
  RecipeVariant,
  RecommendationRequest,
} from '@/models';

/**
 * Contrato desacoplado para cualquier proveedor de inteligencia artificial.
 * La UI y los servicios de dominio nunca dependen de una implementación
 * concreta, solo de esta interfaz. Esto permite sustituir `MockAIProvider`
 * por un futuro `SupabaseAIProvider` (que llamaría a una Edge Function,
 * nunca a una API de IA directamente desde el cliente) sin tocar el resto
 * de la app.
 */
export interface AIProvider {
  generateRecipe(request: GenerateRecipeRequest, context: GrillBookAIContext): Promise<Recipe>;

  adaptRecipe(
    recipe: Recipe,
    request: AdaptRecipeRequest,
    context: GrillBookAIContext,
  ): Promise<RecipeVariant>;

  recommendRecipes(request: RecommendationRequest, context: GrillBookAIContext): Promise<Recipe[]>;

  answerCookingQuestion(question: string, context: GrillBookAIContext): Promise<AICookingAnswer>;
}
