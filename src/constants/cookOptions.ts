import type {
  CookResultTag,
  CookingMethod,
  Doneness,
  FoodCategory,
  FuelType,
  GrillType,
  WoodType,
} from '@/models';

export const FOOD_CATEGORIES: { value: FoodCategory; label: string }[] = [
  { value: 'beef', label: 'Vacuno' },
  { value: 'pork', label: 'Cerdo' },
  { value: 'chicken', label: 'Pollo' },
  { value: 'turkey', label: 'Pavo' },
  { value: 'lamb', label: 'Cordero' },
  { value: 'fish', label: 'Pescado' },
  { value: 'seafood', label: 'Marisco' },
  { value: 'vegetables', label: 'Vegetales' },
  { value: 'fruit', label: 'Fruta' },
  { value: 'other', label: 'Otro' },
];

export const FUEL_TYPES: { value: FuelType; label: string }[] = [
  { value: 'lump_charcoal', label: 'Carbón vegetal' },
  { value: 'briquettes', label: 'Briquetas' },
  { value: 'wood', label: 'Leña' },
  { value: 'pellets', label: 'Pellets' },
  { value: 'gas', label: 'Gas' },
  { value: 'electric', label: 'Eléctrico' },
  { value: 'other', label: 'Otro' },
];

export const WOOD_TYPES: { value: WoodType; label: string }[] = [
  { value: 'oak', label: 'Roble' },
  { value: 'beech', label: 'Haya' },
  { value: 'cherry', label: 'Cerezo' },
  { value: 'apple', label: 'Manzano' },
  { value: 'hickory', label: 'Nogal americano' },
  { value: 'pecan', label: 'Pacano' },
  { value: 'mesquite', label: 'Mezquite' },
  { value: 'maple', label: 'Arce' },
  { value: 'other', label: 'Otra' },
];

export const COOKING_METHODS: { value: CookingMethod; label: string }[] = [
  { value: 'direct', label: 'Directo' },
  { value: 'indirect', label: 'Indirecto' },
  { value: 'mixed', label: 'Mixto' },
  { value: 'reverse_sear', label: 'Sellado inverso' },
  { value: 'low_and_slow', label: 'Baja temperatura' },
  { value: 'smoking', label: 'Ahumado' },
  { value: 'plank', label: 'Tabla de madera' },
  { value: 'rotisserie', label: 'Asador giratorio' },
  { value: 'other', label: 'Otro' },
];

export const DONENESS_OPTIONS: { value: Doneness; label: string }[] = [
  { value: 'rare', label: 'Poco hecho' },
  { value: 'medium_rare', label: 'Al punto rosado' },
  { value: 'medium', label: 'Al punto' },
  { value: 'medium_well', label: 'Muy hecho' },
  { value: 'well_done', label: 'Bien hecho' },
  { value: 'custom', label: 'Personalizado' },
];

export const GRILL_TYPES: { value: GrillType; label: string }[] = [
  { value: 'charcoal', label: 'Carbón' },
  { value: 'gas', label: 'Gas' },
  { value: 'pellet', label: 'Pellet' },
  { value: 'kamado', label: 'Kamado' },
  { value: 'electric', label: 'Eléctrico' },
  { value: 'other', label: 'Otro' },
];

export const RESULT_TAGS: { value: CookResultTag; label: string }[] = [
  { value: 'perfect', label: 'Perfecto' },
  { value: 'juicy', label: 'Jugoso' },
  { value: 'tender', label: 'Tierno' },
  { value: 'dry', label: 'Seco' },
  { value: 'tough', label: 'Duro' },
  { value: 'undercooked', label: 'Poco hecho' },
  { value: 'overcooked', label: 'Pasado' },
];

