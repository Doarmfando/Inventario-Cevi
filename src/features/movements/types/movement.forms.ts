// src/features/movements/types/movement.forms.ts
// TIPOS PARA FORMULARIOS Y FILTROS

import type { MovementType } from './movement.database';

// Formulario adaptado a tu BD
export interface MovementFormData {
  producto_id: string;
  contenedor_id: string;
  tipo_movimiento: MovementType;
  motivo_movimiento_id: string;
  cantidad: number;
  precio_real?: number;
  numero_documento?: string;
  observacion?: string;
}

// Filtros para movimientos
export interface MovementFilters {
  tipo_movimiento?: MovementType | 'all';
  producto_id?: string;
  contenedor_id?: string;
  motivo_movimiento_id?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  created_by?: string;
  searchTerm?: string;
}

// Para las opciones del formulario
export interface MovementReasonOption {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface MovementReasonOptions {
  entrada: MovementReasonOption[];
  salida: MovementReasonOption[];
  ajuste: MovementReasonOption[];
}