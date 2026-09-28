import type { KnowledgeItem, KnowledgeSearchQuery, NewKnowledgeItemInput } from '@/models';

/**
 * Contrato de persistencia de la knowledge base, independiente de Dexie.
 * Permite sustituir la implementación local por una futura implementación
 * remota (Supabase) sin modificar `KnowledgeService` ni componentes.
 */
export interface KnowledgeRepository {
  getAll(): Promise<KnowledgeItem[]>;
  getById(id: string): Promise<KnowledgeItem | undefined>;
  search(query: KnowledgeSearchQuery): Promise<KnowledgeItem[]>;
  save(item: KnowledgeItem): Promise<void>;
  create(input: NewKnowledgeItemInput): Promise<KnowledgeItem>;
  saveMany(items: KnowledgeItem[]): Promise<void>;
  count(): Promise<number>;
}
