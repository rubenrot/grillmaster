import type {
  AdaptRecipeRequest,
  AICookingAnswer,
  GenerateRecipeRequest,
  GrillBookAIContext,
  Recipe,
  RecipeVariant,
  RecommendationRequest,
} from '@/models';
import type { AIProvider } from './AIProvider';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://localhost:8787';

interface ApiErrorBody {
  code: string;
  message: string;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('GrillBook AI necesita conexión a Internet. Tus recetas guardadas siguen disponibles.');
  }

  if (!res.ok) {
    const errorBody = (await res.json().catch(() => undefined)) as ApiErrorBody | undefined;
    throw new Error(errorBody?.message ?? `Error del servidor GrillMaster (${res.status}).`);
  }

  return (await res.json()) as T;
}

/**
 * Proveedor de IA que delega en GrillMaster API (`/grillmaster`), un
 * backend ligero y opcional. Implementa el mismo contrato `AIProvider`
 * que `MockAIProvider`, así que la UI y `AIService` no necesitan saber
 * cuál de los dos está activo: solo cambia la configuración en
 * `src/services/ai/index.ts` (o `VITE_AI_PROVIDER`).
 *
 * Nunca incluye API keys ni secretos: esos viven exclusivamente en el
 * servidor GrillMaster.
 */
export class RemoteAIProvider implements AIProvider {
  async generateRecipe(request: GenerateRecipeRequest, context: GrillBookAIContext): Promise<Recipe> {
    return post<Recipe>('/api/ai/generate-recipe', { request, context });
  }

  async adaptRecipe(recipe: Recipe, request: AdaptRecipeRequest, context: GrillBookAIContext): Promise<RecipeVariant> {
    return post<RecipeVariant>('/api/ai/adapt-recipe', { request: { ...request, recipe }, context });
  }

  async recommendRecipes(request: RecommendationRequest, context: GrillBookAIContext): Promise<Recipe[]> {
    return post<Recipe[]>('/api/ai/recommend', { request, context });
  }

  async answerCookingQuestion(question: string, context: GrillBookAIContext): Promise<AICookingAnswer> {
    return post<AICookingAnswer>('/api/ai/ask', { request: { question }, context });
  }
}
