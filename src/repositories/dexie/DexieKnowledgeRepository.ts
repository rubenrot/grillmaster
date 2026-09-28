import { db } from '@/db/GrillBookDB';
import type { KnowledgeItem, KnowledgeSearchQuery, NewKnowledgeItemInput } from '@/models';
import type { KnowledgeRepository } from '../interfaces/KnowledgeRepository';

/**
 * Implementación Dexie/IndexedDB del repositorio de conocimiento.
 * La búsqueda es local (texto/tags/categoría/tipo), sin embeddings ni
 * vector store: suficiente para el tamaño inicial de la knowledge base.
 */
export class DexieKnowledgeRepository implements KnowledgeRepository {
  async getAll(): Promise<KnowledgeItem[]> {
    return db.knowledgeItems.toArray();
  }

  async getById(id: string): Promise<KnowledgeItem | undefined> {
    return db.knowledgeItems.get(id);
  }

  async save(item: KnowledgeItem): Promise<void> {
    await db.knowledgeItems.put(item);
  }

  async create(input: NewKnowledgeItemInput): Promise<KnowledgeItem> {
    const item: KnowledgeItem = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await db.knowledgeItems.add(item);
    return item;
  }

  async saveMany(items: KnowledgeItem[]): Promise<void> {
    await db.knowledgeItems.bulkPut(items);
  }

  async count(): Promise<number> {
    return db.knowledgeItems.count();
  }

  async search(query: KnowledgeSearchQuery): Promise<KnowledgeItem[]> {
    const all = await this.getAll();
    const text = query.text?.trim().toLowerCase();

    const scored = all
      .map((item) => ({ item, score: score(item, text, query.tags) }))
      .filter(({ item, score: s }) => {
        if (query.category && item.category !== query.category) return false;
        if (query.type && item.type !== query.type) return false;
        if (text) return s > 0;
        return true;
      })
      .sort((a, b) => b.score - a.score);

    const limited = query.limit ? scored.slice(0, query.limit) : scored;
    return limited.map(({ item }) => item);
  }
}

/**
 * Puntuación de relevancia simple basada en coincidencias de texto y tags.
 * Sin dependencias externas; la arquitectura permite sustituir este motor
 * por MiniSearch/Fuse.js o una futura búsqueda vectorial sin tocar
 * `KnowledgeService` ni componentes.
 */
function score(item: KnowledgeItem, text?: string, tags?: string[]): number {
  let s = 0;

  if (text) {
    const haystack = `${item.title} ${item.content} ${item.tags.join(' ')}`.toLowerCase();
    if (haystack.includes(text)) s += 2;
    for (const word of text.split(/\s+/)) {
      if (word.length > 2 && haystack.includes(word)) s += 1;
    }
  } else {
    s += 1;
  }

  if (tags?.length) {
    const matches = tags.filter((t) => item.tags.includes(t)).length;
    s += matches * 2;
  }

  return s;
}
