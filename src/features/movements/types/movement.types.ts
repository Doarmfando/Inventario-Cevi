// src/features/movements/types/movement.types.ts - TIPOS UNIFICADOS

import type { Container, ProductCategory, ProductUnit } from '../../inventory/types';

export type MovementType = 'entrada' | 'salida' | 'ajuste';
export type MovementState = 'pending' | 'completed' | 'cancelled' | 'all';

// MOTIVOS PREDEFINIDOS PARA ENTRADAS
export type EntryReason = 
  | 'compra'
  | 'reposicion'
  | 'ajuste-positivo'
  | 'devolucion'
  | 'transferencia-entrada'
  | 'donacion'
  | 'produccion-interna';

// MOTIVOS PREDEFINIDOS PARA SALIDAS  
export type ExitReason = 
  | 'venta'
  | 'perdida'
  | 'roto'
  | 'vencido'
  | 'ajuste-negativo'
  | 'transferencia-salida'
  | 'consumo-interno'
  | 'merma'
  | 'degustacion';

// UNIÓN DE TODOS LOS MOTIVOS
export type MovementReason = EntryReason | ExitReason;

// ✅ NUEVO: Tipo para productos disponibles en movimientos (basado en Product del inventario)
export interface AvailableProduct {
  id: string;
  name: string;
  container: Container;
  category: ProductCategory;
  unit: ProductUnit;
  currentStock: number;
  currentPackaged: number;
  estimatedPrice: number;
  minStock?: number;
  description?: string;
}

export interface Movement {
  id: string;
  productId: string;
  productName: string;
  productCode?: string;
  container: Container;
  type: MovementType;
  quantity: number;
  packagedUnits: number;
  previousStock: number;
  newStock: number;
  unitPrice?: number;
  totalValue?: number;
  reason: MovementReason;
  observations?: string;
  documentNumber?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  expiryDate?: string;
  state?: MovementState;
}

// ⭐ ACTUALIZADO: MovementFormData con selectedContainer
export interface MovementFormData {
  productId: string;
  type: MovementType;
  quantity: number;
  packagedUnits: number;
  reason: MovementReason;
  observations?: string;
  documentNumber?: string;
  unitPrice?: number;
  selectedContainer?: Container;
  container?: Container;
  expiryDate?: string;
  state?: MovementState;
}

export interface MovementFilters {
  type?: MovementType | 'all';
  productId?: string;
  container?: Container;
  reason?: MovementReason | 'all';
  dateFrom?: string;
  dateTo?: string;
  createdBy?: string;
  searchTerm?: string;
  state?: MovementState;
  expiryFrom?: string;
  expiryTo?: string;
}

export interface KardexEntry extends Movement {
  runningBalance: number;
  runningPackagedBalance: number;
}

export interface MovementWithCalculatedData extends Movement {
  formattedDate: string;
  movementTypeLabel: string;
  reasonLabel: string;
  packagedText: string;
  stockChange: string;
}

export interface MovementReasonOptions {
  entrada: Array<{ value: EntryReason; label: string }>;
  salida: Array<{ value: ExitReason; label: string }>;
}

export interface MovementTableColumn {
  key: keyof MovementWithCalculatedData | 'actions';
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}