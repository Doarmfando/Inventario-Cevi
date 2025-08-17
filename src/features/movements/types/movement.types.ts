// src/features/movements/types/movement.types.ts

export type MovementType = 'entrada' | 'salida' | 'ajuste';

export interface Movement {
  id: string;
  productId: string;
  productName: string;
  productCode?: string;
  type: MovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  unitPrice?: number;
  totalValue?: number;
  reason: string;
  documentNumber?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface MovementFormData {
  productId: string;
  type: MovementType;
  quantity: number;
  reason: string;
  documentNumber?: string;
  unitPrice?: number;
}

export interface MovementFilters {
  type?: MovementType | 'all';
  productId?: string;
  dateFrom?: string;
  dateTo?: string;
  createdBy?: string;
}

export interface KardexEntry extends Movement {
  runningBalance: number;
}