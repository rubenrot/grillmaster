import type { Doneness } from './Cook';

export type TemperatureUnit = 'C' | 'F';
export type WeightUnit = 'metric' | 'imperial';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type SmokePreference = 'light' | 'medium' | 'strong';

export interface UserPreferences {
  id: 'user-preferences';

  temperatureUnit: TemperatureUnit;
  weightUnit: WeightUnit;

  defaultDoneness?: Doneness;
  experienceLevel?: ExperienceLevel;
  smokePreference?: SmokePreference;

  updatedAt: string;
}

export type NewUserPreferencesInput = Partial<Omit<UserPreferences, 'id' | 'updatedAt'>>;

