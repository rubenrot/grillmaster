export * from './GrillRepository';
export * from './RecipeVariantRepository';
export * from './CookSessionRepository';
export * from './PreferencesRepository';
export * from './AIConversationRepository';
export * from './interfaces';

import { DexieRecipeRepository } from './dexie/DexieRecipeRepository';
import { DexieKnowledgeRepository } from './dexie/DexieKnowledgeRepository';
import type { RecipeRepository } from './interfaces/RecipeRepository';
import type { KnowledgeRepository } from './interfaces/KnowledgeRepository';

/**
 * Instancias activas de los repositorios basados en interfaz. Sustituir
 * `DexieRecipeRepository`/`DexieKnowledgeRepository` por una futura
 * implementación Supabase solo requiere cambiar estas dos líneas.
 */
export const recipeRepository: RecipeRepository = new DexieRecipeRepository();
export const knowledgeRepository: KnowledgeRepository = new DexieKnowledgeRepository();
