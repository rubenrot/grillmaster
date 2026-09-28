import { db } from '@/db/GrillBookDB';

export interface ExportedData {
  version: 3;
  exportedAt: string;
  grills: unknown[];
  recipes: unknown[];
  recipeVariants: unknown[];
  cookSessions: unknown[];
  userPreferences: unknown[];
  availableWoods: unknown[];
  availableFuels: unknown[];
  aiConversations: unknown[];
  aiMessages: unknown[];
  knowledgeItems: unknown[];
}

const ALL_TABLES = [
  'grills',
  'recipes',
  'recipeVariants',
  'cookSessions',
  'userPreferences',
  'availableWoods',
  'availableFuels',
  'aiConversations',
  'aiMessages',
  'knowledgeItems',
] as const;

/** Exporta toda la base de datos local a un objeto JSON serializable. */
export async function exportAllData(): Promise<ExportedData> {
  const [
    grills,
    recipes,
    recipeVariants,
    cookSessions,
    userPreferences,
    availableWoods,
    availableFuels,
    aiConversations,
    aiMessages,
    knowledgeItems,
  ] = await Promise.all(ALL_TABLES.map((table) => db.table(table).toArray()));

  return {
    version: 3,
    exportedAt: new Date().toISOString(),
    grills,
    recipes,
    recipeVariants,
    cookSessions,
    userPreferences,
    availableWoods,
    availableFuels,
    aiConversations,
    aiMessages,
    knowledgeItems,
  };
}

/** Importa datos previamente exportados, sobrescribiendo el contenido actual. */
export async function importAllData(data: ExportedData): Promise<void> {
  const tables = ALL_TABLES.map((name) => db.table(name));
  await db.transaction('rw', tables, async () => {
    await Promise.all(tables.map((t) => t.clear()));
    await Promise.all(
      ALL_TABLES.map((name) => {
        const rows = (data as unknown as Record<string, unknown[]>)[name] ?? [];
        return rows.length ? db.table(name).bulkAdd(rows as never[]) : Promise.resolve();
      }),
    );
  });
}

/** Elimina todos los datos almacenados localmente. */
export async function deleteAllData(): Promise<void> {
  const tables = ALL_TABLES.map((name) => db.table(name));
  await db.transaction('rw', tables, async () => {
    await Promise.all(tables.map((t) => t.clear()));
  });
}
