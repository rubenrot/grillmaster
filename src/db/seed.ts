import { db } from './GrillBookDB';
import { buildBuiltinRecipes } from './builtinRecipes';
import { deduplicateBuiltinRecipes } from './deduplicateBuiltinRecipes';
import { buildKnowledgeSeed } from './knowledgeSeed';
import type { Grill } from '@/models';

/**
 * Siembra el catálogo de recetas locales. Disponible en cualquier entorno.
 *
 * Es completamente idempotente: ejecutarla 1, 10 o 100 veces produce
 * exactamente el mismo conjunto de recetas builtin, sin duplicados.
 *
 * Cada receta builtin tiene un ID estable (ver `BUILTIN_RECIPE_IDS` en
 * `builtinRecipes.ts`), así que en vez de comprobar `count() === 0` e
 * insertar con `bulkAdd` (vulnerable a condiciones de carrera si el efecto
 * de React se invoca dos veces, p. ej. bajo `React.StrictMode`), se
 * comprueba qué IDs ya existen dentro de una única transacción y solo se
 * insertan con `bulkPut` los que faltan. Esto además preserva cualquier
 * cambio del usuario sobre una receta builtin (p. ej. marcarla favorita),
 * porque nunca se sobrescribe un registro ya existente.
 */
export async function seedBuiltinRecipes(): Promise<void> {
  // Repara primero cualquier duplicado histórico causado por el bug de
  // condición de carrera (ver `deduplicateBuiltinRecipes`), antes de
  // comprobar qué recetas builtin faltan por sembrar.
  await deduplicateBuiltinRecipes();

  const builtins = buildBuiltinRecipes();

  await db.transaction('rw', db.recipes, async () => {
    const existingIds = new Set(
      await db.recipes.where('id').anyOf(builtins.map((r) => r.id)).primaryKeys(),
    );
    const missing = builtins.filter((r) => !existingIds.has(r.id));
    if (missing.length > 0) {
      await db.recipes.bulkPut(missing);
    }
  });

  if (import.meta.env.DEV) {
    await assertNoBuiltinRecipeDuplicates();
  }
}

/**
 * Comprobación de desarrollo (no es una solución de deduplicación en
 * runtime): agrupa las recetas `builtin` por nombre y avisa por consola
 * únicamente si detecta más de una copia representando la misma receta.
 * En condiciones normales no debería imprimir nada nunca; si aparece,
 * indica una regresión en el seed o en la migración.
 */
async function assertNoBuiltinRecipeDuplicates(): Promise<void> {
  const builtins = await db.recipes.where('source').equals('builtin').toArray();
  const byName = new Map<string, number>();
  for (const recipe of builtins) {
    byName.set(recipe.name, (byName.get(recipe.name) ?? 0) + 1);
  }
  const duplicated = [...byName.entries()].filter(([, count]) => count > 1);
  if (duplicated.length > 0) {
    // eslint-disable-next-line no-console
    console.error(
      '[GrillBook] Recetas builtin duplicadas detectadas:',
      duplicated.map(([name, count]) => `${name} (${count})`),
    );
  }
}

/** Siembra la base de conocimiento local. Disponible en cualquier entorno. */
export async function seedKnowledgeBase(): Promise<void> {
  const existingKnowledge = await db.knowledgeItems.count();
  if (existingKnowledge === 0) {
    await db.knowledgeItems.bulkAdd(buildKnowledgeSeed());
  }
}

/** Seed de desarrollo. Nunca debe ejecutarse en producción. */
export async function seedDevData(): Promise<void> {
  await seedBuiltinRecipes();
  await seedKnowledgeBase();

  if (!import.meta.env.DEV) return;

  // Mismo patrón de idempotencia que las recetas builtin: ID estable +
  // `put`, en vez de `count() === 0` + `add()` con UUID aleatorio.
  const devGrill: Grill = {
    id: 'dev-kingstone-black-angus',
    name: 'Kingstone Black Angus',
    type: 'charcoal',
    hasLid: true,
    supportsIndirectCooking: true,
    supportsSmoking: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const existingGrill = await db.grills.get(devGrill.id);
  if (!existingGrill) {
    await db.grills.put(devGrill);
  }
}

/**
 * Punto único de inicialización de datos de la aplicación.
 *
 * Debe llamarse una sola vez, desde el arranque de la app (`App.tsx`), y
 * nunca desde componentes de página (`HomePage`, `RecipesPage`, etc.) que
 * puedan montarse varias veces durante la navegación.
 *
 * Además de que `seedBuiltinRecipes`/`seedDevData` ya son en sí mismos
 * idempotentes (seguros de ejecutar en paralelo o repetidamente), esta
 * función añade una guarda adicional en memoria: cachea la promesa de la
 * primera ejecución y la reutiliza en cualquier llamada posterior dentro
 * de la misma sesión del navegador. Esto evita trabajo redundante cuando
 * `React.StrictMode` invoca el efecto de montaje dos veces en desarrollo.
 */
let initializationPromise: Promise<void> | undefined;

export function initializeDatabase(): Promise<void> {
  if (!initializationPromise) {
    initializationPromise = seedDevData().catch((error) => {
      // Si la inicialización falla, permite reintentarlo en la siguiente
      // llamada en vez de dejar la app permanentemente sin datos.
      initializationPromise = undefined;
      throw error;
    });
  }
  return initializationPromise;
}

