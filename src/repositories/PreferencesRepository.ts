import { db } from '@/db/GrillBookDB';
import type { UserPreferences } from '@/models';

const DEFAULT_PREFERENCES: UserPreferences = {
  id: 'user-preferences',
  temperatureUnit: 'C',
  weightUnit: 'metric',
  experienceLevel: 'beginner',
  smokePreference: 'medium',
  updatedAt: new Date().toISOString(),
};

export const PreferencesRepository = {
  async get(): Promise<UserPreferences> {
    const existing = await db.userPreferences.get('user-preferences');
    if (existing) return existing;
    await db.userPreferences.add(DEFAULT_PREFERENCES);
    return DEFAULT_PREFERENCES;
  },

  async update(changes: Partial<UserPreferences>): Promise<UserPreferences> {
    const current = await this.get();
    const updated: UserPreferences = {
      ...current,
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    await db.userPreferences.put(updated);
    return updated;
  },

  // -- Maderas disponibles --
  async listAvailableWoods() {
    return db.availableWoods.toArray();
  },

  async addAvailableWood(wood: import('@/models').WoodType) {
    const existing = await db.availableWoods.where('wood').equals(wood).first();
    if (existing) return existing;
    const entry = { id: crypto.randomUUID(), wood };
    await db.availableWoods.add(entry);
    return entry;
  },

  async removeAvailableWood(wood: import('@/models').WoodType) {
    await db.availableWoods.where('wood').equals(wood).delete();
  },

  // -- Combustibles disponibles --
  async listAvailableFuels() {
    return db.availableFuels.toArray();
  },

  async addAvailableFuel(fuel: import('@/models').FuelType) {
    const existing = await db.availableFuels.where('fuel').equals(fuel).first();
    if (existing) return existing;
    const entry = { id: crypto.randomUUID(), fuel };
    await db.availableFuels.add(entry);
    return entry;
  },

  async removeAvailableFuel(fuel: import('@/models').FuelType) {
    await db.availableFuels.where('fuel').equals(fuel).delete();
  },
};
