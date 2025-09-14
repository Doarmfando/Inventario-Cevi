// src/features/movements/types/movement.database.ts
// TIPOS DIRECTOS DE LA BASE DE DATOS

export type MovementType = 'entrada' | 'salida' | 'ajuste';

// Motivo dinámico desde la BD
export interface MotivoMovimiento {
  id: string;
  tipo_movimiento: MovementType;
  nombre: string;
  descripcion?: string;
  visible: boolean;
}

// Producto disponible para movimientos (basado en tu ProductoInventario)
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

// Movement adaptado a tu tabla movimientos
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
  created_by?: string;
  
  // Datos joined para la vista
  producto_nombre?: string;
  contenedor_nombre?: string;
  categoria_nombre?: string;
  unidad_medida?: string;
  motivo?: MotivoMovimiento;
  valor_total?: number;
}