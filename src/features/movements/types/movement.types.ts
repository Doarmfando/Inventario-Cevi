// src/features/movements/types/movement.types.ts - ACTUALIZADO SEGÚN REQUERIMIENTOS

export type MovementType = 'entrada' | 'salida' | 'ajuste';

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

// ⭐ NUEVO: Interface para el producto
export interface Product {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  price: number;
  category: string;
  container?: string; // Contenedor del producto
  packagedUnits?: number; // Unidades empaquetadas
  description?: string;
  barcode?: string;
  supplier?: string;
  location?: string;
  status?: 'active' | 'inactive' | 'discontinued';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Movement {
  id: string;
  productId: string;
  productName: string;
  productCode?: string;
  container: string; // ⭐ NUEVO: Contenedor del producto
  type: MovementType;
  quantity: number;
  packagedUnits: number; // ⭐ NUEVO: Cantidad de empaquetados afectados
  previousStock: number;
  newStock: number;
  unitPrice?: number; // Precio unitario del movimiento (puede diferir del inventario)
  totalValue?: number;
  reason: MovementReason; // ⭐ ACTUALIZADO: Motivo seleccionable
  observations?: string; // ⭐ NUEVO: Campo de observaciones
  documentNumber?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface MovementFormData {
  productId: string;
  type: MovementType;
  quantity: number;
  packagedUnits: number; // ⭐ NUEVO: Empaquetados a afectar
  reason: MovementReason; // ⭐ ACTUALIZADO: Motivo seleccionable
  observations?: string; // ⭐ NUEVO: Observaciones
  documentNumber?: string;
  unitPrice?: number;
}

export interface MovementFilters {
  type?: MovementType | 'all';
  productId?: string;
  container?: string; // ⭐ NUEVO: Filtro por contenedor
  reason?: MovementReason | 'all'; // ⭐ ACTUALIZADO: Filtro por motivo
  dateFrom?: string;
  dateTo?: string;
  createdBy?: string;
  searchTerm?: string; // ⭐ NUEVO: Búsqueda general
}

export interface KardexEntry extends Movement {
  runningBalance: number;
  runningPackagedBalance: number; // ⭐ NUEVO: Balance acumulado de empaquetados
}

// ⭐ NUEVO: Interface para mostrar datos calculados en la tabla
export interface MovementWithCalculatedData extends Movement {
  formattedDate: string; // Fecha formateada para mostrar
  movementTypeLabel: string; // "Entrada" | "Salida" | "Ajuste"
  reasonLabel: string; // Etiqueta del motivo en español
  packagedText: string; // Texto formateado: "3 emp."
  stockChange: string; // Cambio de stock: "+5" | "-3"
}

// ⭐ NUEVO: Opciones para selects del formulario
export interface MovementReasonOptions {
  entrada: Array<{ value: EntryReason; label: string }>;
  salida: Array<{ value: ExitReason; label: string }>;
}

// ⭐ NUEVO: Configuración de columnas para la tabla
export interface MovementTableColumn {
  key: keyof MovementWithCalculatedData | 'actions';
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}