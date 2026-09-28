import Dexie, { type EntityTable } from 'dexie';
import type {
  Grill,
  Recipe,
  RecipeVariant,
  CookSession,
  UserPreferences,
  AIConversation,
  AIMessage,
  KnowledgeItem,
  WoodType,
  FuelType,
} from '@/models';

export interface AvailableWoodEntry {
  id: string;
  wood: WoodType;
}

export interface AvailableFuelEntry {
  id: string;
  fuel: FuelType;
}

export class GrillBookDB extends Dexie {
  grills!: EntityTable<Grill, 'id'>;

  recipes!: EntityTable<Recipe, 'id'>;
  recipeVariants!: EntityTable<RecipeVariant, 'id'>;
  cookSessions!: EntityTable<CookSession, 'id'>;
  userPreferences!: EntityTable<UserPreferences, 'id'>;
  availableWoods!: EntityTable<AvailableWoodEntry, 'id'>;
  availableFuels!: EntityTable<AvailableFuelEntry, 'id'>;
  aiConversations!: EntityTable<AIConversation, 'id'>;
  aiMessages!: EntityTable<AIMessage, 'id'>;
  knowledgeItems!: EntityTable<KnowledgeItem, 'id'>;

  constructor() {
    super('GrillBookDB');

    this.version(1).stores({
      cooks: 'id, category, grillId, createdAt, isFavorite, startedAt, finishedAt',
      cookEvents: 'id, cookId, type, timestamp',
      grills: 'id, type, createdAt',
      settings: 'id',
    });

    // v2: se introduce el nuevo dominio de recetas / asistente IA.
    this.version(2).stores({
      cooks: 'id, category, grillId, createdAt, isFavorite, startedAt, finishedAt',
      cookEvents: 'id, cookId, type, timestamp',
      grills: 'id, type, createdAt',
      settings: 'id',
      recipes: 'id, category, source, isFavorite, createdAt',
      recipeVariants: 'id, recipeId, createdAt',
      cookSessions: 'id, recipeId, createdAt, startedAt',
      userPreferences: 'id',
      availableWoods: 'id, wood',
      availableFuels: 'id, fuel',
      aiConversations: 'id, createdAt',
      aiMessages: 'id, conversationId, createdAt',
    });

    // v3: se deprecan las tablas legacy del antiguo diario de eventos
    // (`cooks`, `cookEvents`, `settings`), sin datos reales en producción, y
    // se añade la knowledge base local. Dexie elimina las tablas marcadas
    // con `null` sin borrar el resto de datos del usuario.
    this.version(3).stores({
      cooks: null,
      cookEvents: null,
      settings: null,
      grills: 'id, type, createdAt',
      recipes: 'id, category, source, isFavorite, createdAt',
      recipeVariants: 'id, recipeId, createdAt',
      cookSessions: 'id, recipeId, createdAt, startedAt',
      userPreferences: 'id',
      availableWoods: 'id, wood',
      availableFuels: 'id, fuel',
      aiConversations: 'id, createdAt',
      aiMessages: 'id, conversationId, createdAt',
      knowledgeItems: 'id, type, category, createdAt',
    });
  }
}

export const db = new GrillBookDB();
