import type {
  AdaptRecipeRequest,
  AICookingAnswer,
  CookingMethod,
  Difficulty,
  FoodCategory,
  GenerateRecipeRequest,
  GrillBookAIContext,
  Recipe,
  RecipeIngredient,
  RecipeStep,
  RecipeVariant,
  RecommendationRequest,
  WoodType,
} from '@/models';
import type { AIProvider } from './AIProvider';

function makeId(): string {
  return crypto.randomUUID();
}

function ingredient(name: string, quantity?: number, unit?: string, optional?: boolean): RecipeIngredient {
  return { id: makeId(), name, quantity, unit, optional };
}

function step(order: number, title: string, instruction: string, duration?: number, targetInternalTemperature?: number): RecipeStep {
  return { id: makeId(), order, title, instruction, duration, targetInternalTemperature };
}

const WOOD_BY_CATEGORY: Record<FoodCategory, WoodType[]> = {
  beef: ['oak', 'hickory', 'mesquite'],
  pork: ['apple', 'cherry', 'hickory'],
  chicken: ['apple', 'cherry', 'pecan'],
  turkey: ['apple', 'pecan'],
  lamb: ['oak', 'cherry'],
  fish: ['cherry', 'apple', 'beech'],
  seafood: ['beech', 'apple'],
  vegetables: ['beech', 'oak'],
  fruit: ['cherry', 'apple'],
  other: ['oak'],
};

function inferMethod(thickness?: number): CookingMethod {
  if (!thickness) return 'mixed';
  return thickness > 3 ? 'indirect' : 'direct';
}

function inferDifficulty(thickness?: number, weight?: number): Difficulty {
  if ((thickness ?? 0) > 5 || (weight ?? 0) > 1500) return 'hard';
  if ((thickness ?? 0) > 2 || (weight ?? 0) > 500) return 'medium';
  return 'easy';
}

function buildGenericSteps(cookingMethod: CookingMethod, targetInternal?: number): RecipeStep[] {
  const steps: RecipeStep[] = [
    step(1, 'Preparar la barbacoa', 'Enciende la brasa y espera a que alcance la temperatura de trabajo antes de cocinar.', 900),
    step(2, 'Preparar el alimento', 'Sazona y deja atemperar el alimento fuera de la nevera unos minutos antes de cocinar.', 600),
  ];

  if (cookingMethod === 'indirect' || cookingMethod === 'low_and_slow' || cookingMethod === 'smoking') {
    steps.push(step(3, 'Cocción indirecta', 'Coloca el alimento en la zona sin brasa directa y cierra la tapa hasta acercarte a la temperatura interna objetivo.', 2400, targetInternal));
    steps.push(step(4, 'Sellado final', 'Pasa el alimento a fuego directo unos minutos por cada lado para crear costra.', 240));
  } else if (cookingMethod === 'direct') {
    steps.push(step(3, 'Cocción directa', 'Cocina sobre la brasa dándole la vuelta con frecuencia hasta alcanzar el punto deseado.', 900, targetInternal));
  } else if (cookingMethod === 'reverse_sear') {
    steps.push(step(3, 'Cocción indirecta lenta', 'Cocina en indirecto hasta unos grados por debajo del objetivo.', 2400, targetInternal));
    steps.push(step(4, 'Sellado inverso', 'Termina con un sellado fuerte y rápido en fuego directo.', 180));
  } else {
    steps.push(step(3, 'Sellado', 'Sella el alimento a fuego fuerte por ambos lados.', 240));
    steps.push(step(4, 'Terminar en indirecto', 'Termina la cocción en la zona indirecta hasta alcanzar la temperatura interna objetivo.', 1200, targetInternal));
  }

  steps.push(step(steps.length + 1, 'Reposo', 'Deja reposar el alimento unos minutos antes de cortar para que los jugos se redistribuyan.', 300));
  return steps;
}

/**
 * Implementación local, sin backend, que simula el comportamiento de un
 * proveedor de IA real. Genera respuestas deterministas y razonables a
 * partir de reglas sencillas, siempre devolviendo datos estructurados.
 */
export class MockAIProvider implements AIProvider {
  async generateRecipe(request: GenerateRecipeRequest, context: GrillBookAIContext): Promise<Recipe> {
    const category = request.category ?? 'other';
    const cookingMethod = request.cookingMethod ?? inferMethod(request.thickness);
    const difficulty = request.difficulty ?? inferDifficulty(request.thickness, request.weight);
    const targetInternal = defaultTargetInternal(category);
    const now = new Date().toISOString();

    const ingredients: RecipeIngredient[] = [
      ingredient(request.foodName, request.weight, request.weight ? 'g' : undefined),
      ingredient('Sal gruesa', 1, 'tbsp'),
      ingredient('Aceite de oliva', 1, 'tbsp', true),
      ...(request.ingredients ?? []).map((name) => ingredient(name)),
      ...(request.condiments ?? []).map((name) => ingredient(name, undefined, undefined, true)),
    ];

    const recommendedWoods =
      request.wood ? [request.wood] : context.availableWoods.length
        ? context.availableWoods.filter((w) => WOOD_BY_CATEGORY[category].includes(w))
        : WOOD_BY_CATEGORY[category];

    const grill = context.grills.find((g) => g.id === request.grillId) ?? context.grills[0];

    const recipe: Recipe = {
      id: makeId(),
      name: `${request.foodName}${request.cut ? ` (${request.cut})` : ''}`,
      description: `Receta generada para ${request.foodName}${request.servings ? ` para ${request.servings} personas` : ''}.`,
      category,
      cut: request.cut,
      servings: request.servings ?? 4,
      ingredients,
      steps: buildGenericSteps(cookingMethod, targetInternal),
      grillSetup: {
        grillType: grill?.type,
        fuel: request.fuel,
        cookingMethod,
        woods: recommendedWoods.length ? recommendedWoods.slice(0, 2) : undefined,
        grillTemperature: defaultGrillTempRange(cookingMethod),
        lid: cookingMethod === 'direct' ? 'open' : 'closed',
        notes: grill ? `Ajustado para ${grill.name}.` : undefined,
      },
      targetInternalTemperature: targetInternal,
      recommendedWoods: recommendedWoods.length ? recommendedWoods.slice(0, 3) : undefined,
      prepTime: 15,
      cookingTime: cookingMethod === 'indirect' ? 60 : 25,
      difficulty,
      source: 'ai',
      tags: [category, cookingMethod],
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    };

    return recipe;
  }

  async adaptRecipe(
    recipe: Recipe,
    request: AdaptRecipeRequest,
    _context: GrillBookAIContext,
  ): Promise<RecipeVariant> {
    const baseWeight = recipe.ingredients[0]?.quantity ?? 1000;
    const newWeight = request.weight ?? baseWeight;
    const scale = newWeight / (baseWeight || 1);

    const scaledIngredients = recipe.ingredients.map((ing) => ({
      ...ing,
      id: makeId(),
      quantity: ing.quantity !== undefined ? Math.round(ing.quantity * scale * 10) / 10 : ing.quantity,
    }));

    const method = request.cookingMethod ?? recipe.grillSetup.cookingMethod;

    const durationScale = request.thickness ? request.thickness / 3 : 1;

    const adaptedSteps = recipe.steps.map((s) => ({
      ...s,
      id: makeId(),
      duration: s.duration ? Math.round(s.duration * Math.max(0.6, Math.min(2, durationScale || 1))) : s.duration,
    }));

    const woods = request.wood ?? recipe.recommendedWoods ?? recipe.grillSetup.woods;

    return {
      id: makeId(),
      recipeId: recipe.id,
      weight: newWeight,
      thickness: request.thickness,
      servings: request.servings,
      grillId: request.grillId,
      doneness: request.doneness,
      generatedByAI: true,
      ingredients: scaledIngredients,
      steps:
        method !== recipe.grillSetup.cookingMethod
          ? buildGenericSteps(method, recipe.targetInternalTemperature)
          : adaptedSteps,
      grillSetup: {
        ...recipe.grillSetup,
        cookingMethod: method,
        fuel: request.fuel ?? recipe.grillSetup.fuel,
        woods,
      },
      createdAt: new Date().toISOString(),
    };
  }

  async recommendRecipes(request: RecommendationRequest, context: GrillBookAIContext): Promise<Recipe[]> {
    const pool = [...context.favoriteRecipes, ...context.recentRecipes];
    const seen = new Set<string>();
    const unique = pool.filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });

    const filtered = request.category ? unique.filter((r) => r.category === request.category) : unique;
    return filtered.slice(0, request.limit ?? 3);
  }

  async answerCookingQuestion(question: string, context: GrillBookAIContext): Promise<AICookingAnswer> {
    const grillName = context.grills[0]?.name;
    const woods = context.availableWoods.slice(0, 3).join(', ');

    let content =
      'Para conseguir un buen resultado, ajusta la temperatura según el grosor de la pieza: ' +
      'piezas gruesas piden cocción indirecta y piezas finas se benefician de fuego directo.';
    const suggestions: string[] = ['¿Cómo adapto esta receta?', '¿Qué madera me recomiendas?'];

    const lower = question.toLowerCase();
    if (lower.includes('madera') || lower.includes('salmón') || lower.includes('salmon')) {
      content = `Para pescados como el salmón, las maderas suaves como el haya o el cerezo aportan un ahumado delicado sin dominar el sabor.${
        woods ? ` Ya tienes disponible: ${woods}.` : ''
      }`;
    } else if (lower.includes('chuletón') || lower.includes('chuleton')) {
      content = `Para un chuletón grueso, empieza en indirecto hasta unos 5 °C por debajo del punto deseado y termina con un sellado fuerte en directo.${
        grillName ? ` En tu ${grillName} controla bien las rejillas de ventilación para mantener la temperatura estable.` : ''
      }`;
    } else if (lower.includes('pollo')) {
      content =
        'Con pollo entero, cocina siempre en indirecto y con la tapa cerrada hasta que la pechuga alcance 74 °C internos.';
    }

    if (context.knowledge?.length) {
      const extra = context.knowledge[0]?.content;
      if (extra) content += ` ${extra}`;
    }

    return {
      content,
      suggestions,
      relatedRecipeIds: context.recentRecipes.slice(0, 2).map((r) => r.id),
      knowledgeItemIds: context.knowledge?.map((k) => k.id) ?? [],
    };
  }
}

function defaultTargetInternal(category: FoodCategory): number {
  switch (category) {
    case 'beef':
    case 'lamb':
      return 55;
    case 'pork':
      return 63;
    case 'chicken':
    case 'turkey':
      return 74;
    case 'fish':
    case 'seafood':
      return 52;
    default:
      return 65;
  }
}

function defaultGrillTempRange(method: CookingMethod): { min: number; max: number } {
  if (method === 'indirect' || method === 'low_and_slow' || method === 'smoking') return { min: 110, max: 140 };
  if (method === 'direct') return { min: 200, max: 250 };
  return { min: 150, max: 220 };
}
