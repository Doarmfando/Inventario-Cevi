// src/features/movements/types/movement.types.ts
// TIPOS ACTUALIZADOS CON CAMPO EMPAQUETADO

export type MovementType = 'entrada' | 'salida' | 'ajuste';

// ===============================
// TIPOS BASE DE LA BD
// ===============================

export interface MotivoMovimiento {
  id: string;
  tipo_movimiento: MovementType;
  nombre: string;
  descripcion?: string;
  visible: boolean;
}

export interface AvailableProduct {
  id: string;
  nombre: string;
  categoria: string;
  unidad_medida: string;
  contenedor_fijo?: {
    id: string;
    nombre: string;
  };
  contenedores_recomendados: Array<{
    id: string;
    nombre: string;
  }>;
  stock_actual: number;
  precio_estimado: number;
  stock_min: number;
  total_empaquetados: number;
}

export interface Movement {
  id: string;
  producto_id: string;
  contenedor_id: string;
  motivo_movimiento_id: string;
  fecha_movimiento: string;
  cantidad: number;
  stock_anterior: number;
  stock_nuevo: number;
  precio_real?: number;
  numero_documento?: string;
  observacion?: string;
  empaquetado?: string; // AGREGADO: campo para empaquetado
  created_by?: string;
  
  // Datos joined para la vista
  producto_nombre?: string;
  contenedor_nombre?: string;
  categoria_nombre?: string;
  unidad_medida?: string;
  motivo?: MotivoMovimiento;
  valor_total?: number;
}

// ===============================
// TIPOS PARA FORMULARIOS
// ===============================

export interface MovementFormData {
  producto_id: string;
  contenedor_id: string;
  tipo_movimiento: MovementType;
  motivo_movimiento_id: string;
  cantidad: number;
  empaquetado?: string; // AGREGADO: campo para empaquetado/raciones
  precio_real?: number;
  numero_documento?: string;
  observacion?: string;
}

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

// ===============================
// TIPOS PARA VISTAS
// ===============================

export interface MovementWithCalculatedData extends Movement {
  formattedDate: string;
  movementTypeLabel: string;
  reasonLabel: string;
  stockChange: string;
  tipo_movimiento: MovementType;
}

export interface KardexEntry extends Movement {
  runningBalance: number;
}

export interface MovementTableColumn {
  key: keyof MovementWithCalculatedData | 'actions';
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}