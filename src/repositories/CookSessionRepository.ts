import { db } from '@/db/GrillBookDB';
import type { CookSession, NewCookSessionInput } from '@/models';

export const CookSessionRepository = {
  async create(input: NewCookSessionInput): Promise<CookSession> {
    const session: CookSession = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await db.cookSessions.add(session);
    return session;
  },

  async getById(id: string): Promise<CookSession | undefined> {
    return db.cookSessions.get(id);
  },

  async update(id: string, changes: Partial<CookSession>): Promise<void> {
    await db.cookSessions.update(id, changes);
  },

  async listAll(): Promise<CookSession[]> {
    return db.cookSessions.orderBy('createdAt').reverse().toArray();
  },

  async listByRecipe(recipeId: string): Promise<CookSession[]> {
    return db.cookSessions.where('recipeId').equals(recipeId).sortBy('createdAt');
  },

  async listRecent(limit = 5): Promise<CookSession[]> {
    return db.cookSessions.orderBy('createdAt').reverse().limit(limit).toArray();
  },
};
