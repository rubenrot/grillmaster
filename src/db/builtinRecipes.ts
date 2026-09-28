import type { Recipe, RecipeIngredient, RecipeStep } from '@/models';

let counter = 0;
function id(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

/**
 * IDs estables de las recetas builtin ("seed"). Deben permanecer fijos:
 * el seed depende de ellos para ser idempotente (usa `bulkPut` por ID en
 * vez de generar un `crypto.randomUUID()` nuevo en cada ejecución), y la
 * migración de deduplicación los usa para reconciliar copias antiguas
 * que se crearon con IDs aleatorios antes de esta corrección.
 */
export const BUILTIN_RECIPE_IDS = [
  'builtin-chuleton-brasa',
  'builtin-picanha',
  'builtin-costillas-cerdo',
  'builtin-pollo-entero',
  'builtin-salmon-brasa',
  'builtin-corvina-brasa',
  'builtin-pulpo-brasa',
  'builtin-verduras-parrilla',
] as const;

function ing(name: string, quantity?: number, unit?: string, optional?: boolean): RecipeIngredient {
  return { id: id('ing'), name, quantity, unit, optional };
}

function step(order: number, title: string, instruction: string, duration?: number, targetInternalTemperature?: number): RecipeStep {
  return { id: id('step'), order, title, instruction, duration, targetInternalTemperature };
}

const now = () => new Date().toISOString();

/** Catálogo de recetas locales ("builtin") para poder probar la UX desde el primer momento. */
export function buildBuiltinRecipes(): Recipe[] {
  const timestamp = now();

  const recipes: (Omit<Recipe, 'tags'> & { tags?: string[] })[] = [
    {
      id: 'builtin-chuleton-brasa',
      name: 'Chuletón a la brasa',
      description: 'Chuletón de vacuno madurado, cocinado en dos tiempos para un interior jugoso y una costra perfecta.',
      category: 'beef',
      cut: 'Chuletón',
      servings: 3,
      ingredients: [ing('Chuletón de vacuno', 1200, 'g'), ing('Sal gruesa', 1, 'tbsp'), ing('Pimienta negra', 1, 'pinch', true)],
      steps: [
        step(1, 'Preparar la brasa', 'Enciende el carbón y crea dos zonas: una de brasa intensa y otra sin brasa directa.', 1200),
        step(2, 'Cocción indirecta', 'Coloca el chuletón en la zona indirecta hasta unos 5 °C por debajo del punto deseado.', 1800, 50),
        step(3, 'Sellado', 'Pasa el chuletón a la zona directa y sella 90 segundos por cada lado.', 180),
        step(4, 'Reposo', 'Deja reposar 5 minutos antes de cortar.', 300),
      ],
      grillSetup: { grillType: 'charcoal', fuel: 'lump_charcoal', cookingMethod: 'mixed', woods: ['oak'], notes: 'Brasa muy caliente para el sellado final.' },
      targetInternalTemperature: 55,
      recommendedWoods: ['oak', 'hickory'],
      prepTime: 15,
      cookingTime: 35,
      difficulty: 'medium',
      source: 'builtin',
      isFavorite: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'builtin-picanha',
      name: 'Picanha',
      description: 'Corte brasileño cocinado en brochetas curvas, con la grasa hacia la brasa.',
      category: 'beef',
      cut: 'Picanha',
      servings: 4,
      ingredients: [ing('Picanha', 1000, 'g'), ing('Sal gruesa', 2, 'tbsp')],
      steps: [
        step(1, 'Preparar la pieza', 'Corta la picanha en porciones gruesas siguiendo la fibra, dejando la capa de grasa.', 600),
        step(2, 'Cocción directa', 'Cocina con la grasa hacia la brasa primero, girando poco.', 1200, 54),
        step(3, 'Reposo', 'Deja reposar antes de cortar en láminas finas.', 300),
      ],
      grillSetup: { grillType: 'charcoal', fuel: 'lump_charcoal', cookingMethod: 'direct', woods: ['oak'] },
      targetInternalTemperature: 54,
      recommendedWoods: ['oak'],
      prepTime: 10,
      cookingTime: 25,
      difficulty: 'easy',
      source: 'builtin',
      isFavorite: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'builtin-costillas-cerdo',
      name: 'Costillas de cerdo',
      description: 'Costillar cocinado lento y a baja temperatura hasta quedar tierno.',
      category: 'pork',
      cut: 'Costillar',
      servings: 4,
      ingredients: [ing('Costillar de cerdo', 1500, 'g'), ing('Especias BBQ', 2, 'tbsp'), ing('Salsa BBQ', 100, 'ml', true)],
      steps: [
        step(1, 'Preparar la barbacoa', 'Estabiliza la barbacoa en zona indirecta y baja temperatura.', 900),
        step(2, 'Ahumado lento', 'Cocina el costillar en indirecto con madera de manzano durante varias horas.', 10800),
        step(3, 'Glaseado', 'Pincela con salsa BBQ los últimos minutos para caramelizar.', 600),
      ],
      grillSetup: { grillType: 'charcoal', fuel: 'lump_charcoal', cookingMethod: 'indirect', woods: ['apple', 'cherry'] },
      targetInternalTemperature: 92,
      recommendedWoods: ['apple', 'cherry'],
      prepTime: 20,
      cookingTime: 240,
      difficulty: 'hard',
      source: 'builtin',
      isFavorite: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'builtin-pollo-entero',
      name: 'Pollo entero',
      description: 'Pollo entero a la brasa, jugoso por dentro y con la piel dorada.',
      category: 'chicken',
      cut: 'Entero',
      servings: 4,
      ingredients: [ing('Pollo entero', 1600, 'g'), ing('Limón', 1, 'unit'), ing('Ajo', 4, 'clove'), ing('Romero', 1, 'sprig', true)],
      steps: [
        step(1, 'Preparar el pollo', 'Sazona por dentro y por fuera con sal, ajo y romero.', 600),
        step(2, 'Cocción indirecta', 'Cocina con la tapa cerrada en zona indirecta hasta que la pechuga alcance 74 °C.', 4800, 74),
        step(3, 'Reposo', 'Deja reposar 10 minutos antes de trinchar.', 600),
      ],
      grillSetup: { grillType: 'charcoal', fuel: 'lump_charcoal', cookingMethod: 'indirect', woods: ['apple', 'pecan'] },
      targetInternalTemperature: 74,
      recommendedWoods: ['apple', 'pecan'],
      prepTime: 15,
      cookingTime: 80,
      difficulty: 'medium',
      source: 'builtin',
      isFavorite: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'builtin-salmon-brasa',
      name: 'Salmón a la brasa',
      description: 'Lomo de salmón cocinado sobre tabla, con un ahumado suave.',
      category: 'fish',
      cut: 'Lomo',
      servings: 2,
      ingredients: [ing('Lomo de salmón', 400, 'g'), ing('Eneldo', 1, 'sprig', true), ing('Limón', 0.5, 'unit', true)],
      steps: [
        step(1, 'Preparar la brasa', 'Prepara brasa media y una tabla de madera si se dispone de ella.', 600),
        step(2, 'Cocción directa suave', 'Cocina el salmón con la piel hacia la brasa hasta que se separe en láminas.', 720, 52),
      ],
      grillSetup: { grillType: 'charcoal', fuel: 'lump_charcoal', cookingMethod: 'direct', woods: ['cherry', 'beech'] },
      targetInternalTemperature: 52,
      recommendedWoods: ['cherry', 'beech'],
      prepTime: 10,
      cookingTime: 15,
      difficulty: 'easy',
      source: 'builtin',
      isFavorite: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'builtin-corvina-brasa',
      name: 'Corvina a la brasa',
      description: 'Pescado blanco entero cocinado entero sobre brasa suave.',
      category: 'fish',
      cut: 'Entera',
      servings: 3,
      ingredients: [ing('Corvina entera', 900, 'g'), ing('Sal gruesa', 1, 'tbsp'), ing('Aceite de oliva', 1, 'tbsp', true)],
      steps: [
        step(1, 'Preparar el pescado', 'Limpia y sazona el pescado por dentro y por fuera.', 600),
        step(2, 'Cocción directa', 'Cocina sobre brasa media, girando con cuidado a media cocción.', 1200, 60),
      ],
      grillSetup: { grillType: 'charcoal', fuel: 'lump_charcoal', cookingMethod: 'direct', woods: ['beech'] },
      targetInternalTemperature: 60,
      recommendedWoods: ['beech'],
      prepTime: 15,
      cookingTime: 20,
      difficulty: 'medium',
      source: 'builtin',
      isFavorite: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'builtin-pulpo-brasa',
      name: 'Pulpo a la brasa',
      description: 'Pulpo precocido y terminado a la brasa para conseguir un exterior crujiente.',
      category: 'seafood',
      cut: 'Tentáculos',
      servings: 3,
      ingredients: [ing('Pulpo cocido', 800, 'g'), ing('Pimentón', 1, 'tsp', true), ing('Aceite de oliva', 2, 'tbsp', true)],
      steps: [
        step(1, 'Preparar la brasa', 'Prepara brasa intensa y directa.', 600),
        step(2, 'Dorar el pulpo', 'Marca los tentáculos a fuego fuerte hasta que queden crujientes por fuera.', 480),
      ],
      grillSetup: { grillType: 'charcoal', fuel: 'lump_charcoal', cookingMethod: 'direct', woods: ['beech'], grillTemperature: { min: 220, max: 260 } },
      recommendedWoods: ['beech'],
      prepTime: 5,
      cookingTime: 10,
      difficulty: 'easy',
      source: 'builtin',
      isFavorite: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'builtin-verduras-parrilla',
      name: 'Verduras a la parrilla',
      description: 'Selección de verduras de temporada asadas a fuego directo.',
      category: 'vegetables',
      servings: 4,
      ingredients: [
        ing('Calabacín', 2, 'unit'),
        ing('Berenjena', 1, 'unit'),
        ing('Pimiento rojo', 2, 'unit'),
        ing('Aceite de oliva', 3, 'tbsp'),
        ing('Sal', 1, 'pinch'),
      ],
      steps: [
        step(1, 'Preparar las verduras', 'Corta las verduras en láminas y pincela con aceite de oliva.', 600),
        step(2, 'Asar a la brasa', 'Cocina a fuego directo medio, girando hasta que estén tiernas y marcadas.', 900),
      ],
      grillSetup: { grillType: 'charcoal', fuel: 'lump_charcoal', cookingMethod: 'direct', woods: ['beech', 'oak'], grillTemperature: { min: 180, max: 210 } },
      recommendedWoods: ['beech'],
      prepTime: 15,
      cookingTime: 15,
      difficulty: 'easy',
      source: 'builtin',
      isFavorite: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  return recipes.map(
    (recipe): Recipe => ({
      ...recipe,
      tags: recipe.tags && recipe.tags.length > 0 ? recipe.tags : [recipe.category],
      grillSetup: { lid: 'closed', ...recipe.grillSetup },
    }),
  );
}
