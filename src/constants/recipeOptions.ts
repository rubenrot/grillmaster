import type { Difficulty } from '@/models';

export const DIFFICULTY_LEVELS: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Fácil' },
  { value: 'medium', label: 'Media' },
  { value: 'hard', label: 'Avanzada' },
];

export const COOK_SESSION_RESULT_TAGS: { value: string; label: string }[] = [
  { value: 'perfect', label: 'Perfecto' },
  { value: 'juicy', label: 'Jugoso' },
  { value: 'dry', label: 'Seco' },
  { value: 'undercooked', label: 'Poco hecho' },
  { value: 'overcooked', label: 'Pasado' },
  { value: 'tender', label: 'Tierno' },
  { value: 'tough', label: 'Duro' },
];

export const EXPERIENCE_LEVELS: { value: string; label: string }[] = [
  { value: 'beginner', label: 'Principiante' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
];

export const SMOKE_PREFERENCES: { value: string; label: string }[] = [
  { value: 'light', label: 'Suave' },
  { value: 'medium', label: 'Media' },
  { value: 'strong', label: 'Intensa' },
];

export { FOOD_CATEGORIES, FUEL_TYPES, WOOD_TYPES, COOKING_METHODS, DONENESS_OPTIONS, GRILL_TYPES } from './cookOptions';
