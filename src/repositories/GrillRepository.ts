import { db } from '@/db/GrillBookDB';
import type { Grill, NewGrillInput } from '@/models';

export const GrillRepository = {
  async create(input: NewGrillInput): Promise<Grill> {
    const now = new Date().toISOString();
    const grill: Grill = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    await db.grills.add(grill);
    return grill;
  },

  async getById(id: string): Promise<Grill | undefined> {
    return db.grills.get(id);
  },

  async update(id: string, changes: Partial<Grill>): Promise<void> {
    await db.grills.update(id, { ...changes, updatedAt: new Date().toISOString() });
  },

  async delete(id: string): Promise<void> {
    await db.grills.delete(id);
  },

  async listAll(): Promise<Grill[]> {
    return db.grills.orderBy('createdAt').reverse().toArray();
  },
};
