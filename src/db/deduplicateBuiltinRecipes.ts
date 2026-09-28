import { db } from './GrillBookDB';
import { buildBuiltinRecipes } from './builtinRecipes';
import type { Recipe } from '@/models';

/**
 * Migración de limpieza (idempotente y segura) para el bug histórico por el
 * que las recetas builtin podían duplicarse en IndexedDB.
 *
 * Causa original: el seed comprobaba `count === 0` y usaba `bulkAdd` con IDs
 * generados por un contador en memoria. Bajo `React.StrictMode` (que monta
 * los efectos dos veces en desarrollo) o cualquier otra doble invocación,
 * dos llamadas concurrentes podían ver `count === 0` a la vez y ambas
 * insertar el catálogo completo, cada una con IDs distintos → duplicados
 * con el mismo contenido pero distinto `id`.
 *
 * Esta función:
 * 1. Agrupa las recetas con `source === 'builtin'` por nombre (seguro aquí
 *    porque el universo de nombres builtin es fijo y conocido; nunca se
 *    tocan recetas `user` ni `ai`, aunque compartan nombre).
 * 2. Para cada grupo con más de una copia, decide el ID canónico (estable)
 *    correspondiente según el catálogo actual de `buildBuiltinRecipes()`.
 * 3. Redirige referencias de `RecipeVariant.recipeId` y `CookSession.recipeId`
 *    desde los IDs duplicados hacia el ID canónico antes de borrar nada.
 * 4. Conserva `isFavorite: true` si cualquiera de las copias estaba marcada
 *    como favorita.
 * 5. Escribe el registro canónico (con el ID estable) y elimina el resto.
 *
 * Ejecutarla repetidamente no tiene efecto una vez que no quedan duplicados.
 */
export async function deduplicateBuiltinRecipes(): Promise<void> {
  const canonicalByName = new Map(buildBuiltinRecipes().map((r) => [r.name, r]));

  await db.transaction('rw', db.recipes, db.recipeVariants, db.cookSessions, async () => {
    const existingBuiltins = await db.recipes.where('source').equals('builtin').toArray();
    if (existingBuiltins.length === 0) return;

    const groups = new Map<string, Recipe[]>();
    for (const recipe of existingBuiltins) {
      const group = groups.get(recipe.name);
      if (group) group.push(recipe);
      else groups.set(recipe.name, [recipe]);
    }

    for (const [name, group] of groups) {
      const canonicalDef = canonicalByName.get(name);
      // Nombre builtin que ya no existe en el catálogo actual: no lo tocamos,
      // no sabemos a qué ID estable debería mapear.
      if (!canonicalDef) continue;

      const canonicalId = canonicalDef.id;
      const duplicateIds = group.map((r) => r.id).filter((id) => id !== canonicalId);
      if (duplicateIds.length === 0) continue; // ya está en su forma canónica, nada que hacer

      const anyFavorite = group.some((r) => r.isFavorite);
      const existingCanonical = group.find((r) => r.id === canonicalId);

      // Redirigir referencias de cada duplicado hacia el ID canónico antes de borrar.
      for (const oldId of duplicateIds) {
        await redirectRecipeReferences(oldId, canonicalId);
      }

      const canonicalRecord: Recipe = {
        ...canonicalDef,
        ...(existingCanonical ?? {}),
        id: canonicalId,
        isFavorite: anyFavorite,
      };

      await db.recipes.put(canonicalRecord);
      await db.recipes.bulkDelete(duplicateIds);
    }
  });
}

async function redirectRecipeReferences(oldRecipeId: string, newRecipeId: string): Promise<void> {
  const variants = await db.recipeVariants.where('recipeId').equals(oldRecipeId).toArray();
  if (variants.length > 0) {
    await db.recipeVariants.bulkPut(variants.map((v) => ({ ...v, recipeId: newRecipeId })));
  }

  const sessions = await db.cookSessions.where('recipeId').equals(oldRecipeId).toArray();
  if (sessions.length > 0) {
    await db.cookSessions.bulkPut(sessions.map((s) => ({ ...s, recipeId: newRecipeId })));
  }
}
