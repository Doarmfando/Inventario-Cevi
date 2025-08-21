// src/features/movements/types/movement.types.ts

export type MovementType = 'entrada' | 'salida' | 'ajuste';

// Reutilizando el tipo de estado del inventario
export type ProductState = 'fresco' | 'congelado' | 'por-vencer' | 'vencido';

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
  
  // NUEVOS CAMPOS SOLICITADOS
  expiryDate?: string; // Fecha de vencimiento
  state: ProductState; // Estado (fresco, congelado, por-vencer, vencido)
}

export interface MovementFormData {
  productId: string;
  type: MovementType;
  quantity: number;
  reason: string;
  documentNumber?: string;
  unitPrice?: number;
  
  // NUEVOS CAMPOS SOLICITADOS
  expiryDate?: string; // Fecha de vencimiento
  state: ProductState; // Estado
}

export interface MovementFilters {
  type?: MovementType | 'all';
  productId?: string;
  dateFrom?: string;
  dateTo?: string;
  createdBy?: string;
  
  // NUEVOS FILTROS PARA LOS CAMPOS AGREGADOS
  state?: ProductState | 'all'; // Filtro por estado
  expiryFrom?: string; // Filtro por fecha de vencimiento desde
  expiryTo?: string; // Filtro por fecha de vencimiento hasta
}

export interface KardexEntry extends Movement {
  runningBalance: number;
}