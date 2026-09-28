import type { FuelType } from './Cook';

export type GrillType = 'charcoal' | 'gas' | 'pellet' | 'kamado' | 'electric' | 'other';

export interface Grill {
  id: string;
  name: string;
  type: GrillType;

  hasLid: boolean;
  supportsIndirectCooking: boolean;
  supportsSmoking: boolean;
  supportedFuels?: FuelType[];

  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type NewGrillInput = Omit<Grill, 'id' | 'createdAt' | 'updatedAt'>;
