// src/features/movements/types/movement.view.ts
// TIPOS PARA VISTAS Y PRESENTACIÓN

import type { Movement, MovementType } from './movement.database';

// Movement con datos calculados para la vista
export interface MovementWithCalculatedData extends Movement {
  formattedDate: string;
  movementTypeLabel: string;
  reasonLabel: string;
  stockChange: string;
  tipo_movimiento: MovementType; // Para compatibilidad
}

// Para el kardex
export interface KardexEntry extends Movement {
  runningBalance: number;
}

// Para las columnas de tabla
export interface MovementTableColumn {
  key: keyof MovementWithCalculatedData | 'actions';
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}