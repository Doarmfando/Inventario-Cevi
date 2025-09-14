// src/features/movements/types/kardex.types.ts
// TIPOS PARA KARDEX CON DATOS REALES DE BD

import type { MovementType } from './movement.types';

export interface KardexProduct {
  id: string;
  nombre: string;
  codigo?: string;
  categoria: string;
  unidad_medida: string;
  stock_actual: number;
  precio_estimado: number;
  stock_min: number;
}

export interface KardexMovement {
  id: string;
  fecha_movimiento: string;
  tipo_movimiento: MovementType;
  cantidad: number;
  stock_anterior: number;
  stock_nuevo: number;
  precio_real?: number;
  numero_documento?: string;
  observacion?: string;
  empaquetado?: string;
  
  // Datos joined
  contenedor_nombre: string;
  motivo_nombre: string;
  motivo_descripcion?: string;
  
  // Calculados
  saldo_corriente: number;
  valor_total?: number;
}

export interface KardexStats {
  total_entradas: number;
  total_salidas: number;
  total_ajustes: number;
  cantidad_entradas: number;
  cantidad_salidas: number;
  cantidad_ajustes: number;
  valor_total_entradas: number;
  valor_total_salidas: number;
  movimientos_periodo: number;
}

export interface KardexModalProps {
  productId: string;
  onClose: () => void;
}

export interface KardexDateRange {
  fecha_desde?: string;
  fecha_hasta?: string;
}