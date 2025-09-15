// src/features/containers/types/container.types.ts
// TIPOS ACTUALIZADOS PARA BASE DE DATOS REAL

// Tipos base de la BD
export interface Container {
  id: string;
  codigo?: string;
  nombre: string;
  descripcion?: string;
  capacidad?: number;
  tipo_contenedor_id: string;
  visible: boolean;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  
  // Datos joined
  tipo_contenedor?: {
    id: string;
    nombre: string;
    descripcion?: string;
  };
}

export interface TipoContenedor {
  id: string;
  nombre: string;
  descripcion?: string;
  visible: boolean;
}

export interface DetalleContenedor {
  id: string;
  producto_id: string;
  contenedor_id: string;
  empaquetado?: string;
  fecha_vencimiento?: string;
  estado_producto_id?: string;
  precio_real_unidad?: number;
  cantidad: number;
  visible: boolean;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  
  // Datos joined
  producto?: {
    id: string;
    nombre: string;
    categoria: string;
    unidad_medida: string;
  };
  estado_producto?: {
    id: string;
    nombre: string;
  };
}

// Tipos para vistas y formularios
export interface ContainerWithDetails {
  id: string;
  codigo?: string;
  nombre: string;
  descripcion?: string;
  capacidad?: number;
  tipo_contenedor_nombre: string;
  tipo_contenedor_descripcion?: string;
  
  // Stats calculados
  total_productos: number;
  cantidad_total: number;
  valor_total: number;
  productos_vencidos: number;
  productos_por_vencer: number;
  ocupacion_porcentaje: number;
}

export interface ContainerProduct {
  id: string;
  producto_id: string;
  producto_nombre: string;
  categoria: string;
  unidad_medida: string;
  cantidad: number;
  empaquetado?: string;
  fecha_vencimiento?: string;
  estado_producto?: string;
  precio_real_unidad?: number;
  valor_total: number;
  dias_vencimiento?: number;
  estado_calculado: 'fresco' | 'por_vencer' | 'vencido';
}

export interface ContainerStats {
  totalProducts: number;
  totalQuantity: number;
  totalValue: number;
  vencidos: number;
  porVencer: number;
  frescos: number;
  capacityUsed: number;
  capacityPercentage: number;
}

export interface ContainerSummary {
  id: string;
  name: string;
  type: string;
  capacity?: number;
  status: 'activo' | 'mantenimiento' | 'inactivo';
  stats: ContainerStats;
}

// Formularios
export interface ContainerFormData {
  codigo?: string;
  nombre: string;
  descripcion?: string;
  capacidad?: number;
  tipo_contenedor_id: string;
}

export interface ProductToContainerFormData {
  producto_id: string;
  contenedor_id: string;
  cantidad: number;
  empaquetado?: string;
  fecha_vencimiento?: string;
  estado_producto_id?: string;
  precio_real_unidad?: number;
}

// NUEVO: Tipos para el formulario de productos en vista
export interface ProductFormData {
  productId: string;
  containerId: string;
  totalQuantity: number;
  packagedUnits: number;
  expiryDate?: string;
  state: string;
  price: number;
}

// Filtros
export interface ContainerFilters {
  tipo_contenedor_id?: string;
  estado?: 'activo' | 'mantenimiento' | 'inactivo';
  tiene_productos?: boolean;
  tiene_vencidos?: boolean;
  capacidad_min?: number;
  capacidad_max?: number;
  search?: string;
}