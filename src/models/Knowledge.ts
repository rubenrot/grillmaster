import type { FoodCategory } from './Cook';

export type KnowledgeType =
  | 'technique'
  | 'fuel'
  | 'fire_management'
  | 'smoking'
  | 'wood'
  | 'temperature'
  | 'ingredient'
  | 'equipment'
  | 'safety'
  | 'maintenance'
  | 'tip'
  | 'other';

export type KnowledgeSourceType = 'book' | 'official' | 'grillbook' | 'user';

export interface KnowledgeSource {
  id?: string;
  name?: string;
  page?: number;
  type: KnowledgeSourceType;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  type: KnowledgeType;
  category?: FoodCategory;
  tags: string[];
  source?: KnowledgeSource;
  createdAt: string;
}

export type NewKnowledgeItemInput = Omit<KnowledgeItem, 'id' | 'createdAt'>;

export interface KnowledgeSearchQuery {
  text?: string;
  category?: FoodCategory;
  type?: KnowledgeType;
  tags?: string[];
  limit?: number;
}
