import { knowledgeRepository } from '@/repositories';
import type { KnowledgeItem, KnowledgeSearchQuery, NewKnowledgeItemInput } from '@/models';

/**
 * Capa de servicio para la knowledge base local. Aísla a la UI y a
 * `AIService` del repositorio concreto (Dexie hoy, potencialmente Supabase
 * en el futuro) y centraliza la lógica de búsqueda.
 */
export const KnowledgeService = {
  getAll: () => knowledgeRepository.getAll(),
  getById: (id: string) => knowledgeRepository.getById(id),
  search: (query: KnowledgeSearchQuery) => knowledgeRepository.search(query),
  create: (input: NewKnowledgeItemInput) => knowledgeRepository.create(input),
  saveMany: (items: KnowledgeItem[]) => knowledgeRepository.saveMany(items),
  count: () => knowledgeRepository.count(),
};
