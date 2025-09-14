// src/features/inventory/types/index.ts
// TIPOS ADAPTADOS A TU SISTEMA DE INVENTARIO

// ===============================
// TIPOS BASE DE LA BD
// ===============================

export interface DBProducto {
  id: string;
  codigo?: string;
  nombre: string;
  descripcion?: string;
  categoria_id: string;
  unidad_medida_id: string;
  precio_estimado: number;
  stock_min: number;
  estado_inventario_id?: string;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBCategoria {
  id: string;
  nombre: string;
  descripcion?: string;
  visible: boolean;
}

export interface DBUnidadMedida {
  id: string;
  nombre: string;
  abreviatura: string;
  visible: boolean;
}

export interface DBContenedor {
  id: string;
  codigo?: string;
  nombre: string;
  descripcion?: string;
  capacidad?: number;
  tipo_contenedor_id?: string;
  visible: boolean;
}

export interface DBProductoContenedor {
  producto_id: string;
  contenedor_id: string;
  es_fijo: boolean; // TRUE = contenedor fijo, FALSE = recomendado
}

export interface DBDetalleContenedor {
  id: string;
  producto_id: string;
  contenedor_id: string;
  empaquetado?: string;
  fecha_vencimiento?: string;
  estado_producto_id?: string;
  precio_real_unidad?: number;
  cantidad: number;
  visible: boolean;
}

export interface DBMovimiento {
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
}

// ===============================
// TIPOS PARA LA VISTA INVENTARIO
// ===============================

export interface ProductoInventario {
  // Datos básicos
  id: string;
  nombre: string;
  descripcion?: string;
  
  // Relaciones
  categoria: DBCategoria;
  unidad_medida: DBUnidadMedida;
  contenedor_fijo?: DBContenedor; // Contenedor principal/fijo
  contenedores_recomendados: DBContenedor[]; // Contenedores alternativos
  
  // Stock y precios
  stock_actual: number; // Calculado sumando todos los detalles
  stock_min: number;
  precio_estimado: number;
  valor_total: number; // stock_actual * precio_estimado
  
  // Estado del inventario
  estado_inventario: 'Stock OK' | 'Stock Bajo' | 'Reponer' | 'Sin Stock';
  
  // Empaquetados (suma de todos los empaquetados en contenedores)
  total_empaquetados: number;
  empaquetados_detalle: string; // "5 bolsas, 3 cajas"
  
  // Fechas
  created_at: string;
  updated_at: string;
}

// Formulario para crear producto en inventario
export interface FormularioProducto {
  nombre: string;
  descripcion?: string;
  categoria_id: string;
  unidad_medida_id: string;
  contenedor_fijo_id: string; // OBLIGATORIO - contenedor principal
  contenedores_recomendados_ids: string[]; // OPCIONAL - alternativos
  precio_estimado: number;
  stock_min: number;
}

// ===============================
// TIPOS PARA LA VISTA MOVIMIENTOS
// ===============================

export type TipoMovimiento = 'entrada' | 'salida' | 'ajuste';

export interface MotivoMovimiento {
  id: string;
  tipo_movimiento: TipoMovimiento;
  nombre: string; // compra, venta, pérdida, etc.
  descripcion?: string;
}

export interface MovimientoVista {
  id: string;
  fecha_movimiento: string;
  
  // Producto y contenedor
  producto: {
    id: string;
    nombre: string;
    unidad_medida: string;
  };
  contenedor: {
    id: string;
    nombre: string;
  };
  
  // Detalles del movimiento
  tipo: TipoMovimiento;
  motivo: MotivoMovimiento;
  cantidad: number;
  stock_anterior: number;
  stock_nuevo: number;
  precio_real?: number;
  valor_total: number; // cantidad * precio_real
  
  // Documentación
  numero_documento?: string;
  observacion?: string;
  
  // Empaquetados (si aplica)
  empaquetados?: number;
  
  // Usuario que registró
  created_by?: string;
}

export interface FormularioMovimiento {
  producto_id: string;
  contenedor_id: string; // Se preselecciona el fijo, pero puede cambiarse
  tipo_movimiento: TipoMovimiento;
  motivo_movimiento_id: string;
  cantidad: number;
  precio_real?: number; // Si no se ingresa, usa el estimado
  empaquetados?: number;
  numero_documento?: string;
  observacion?: string;
}

// ===============================
// TIPOS PARA LA VISTA CONTENEDORES
// ===============================

export interface ContenedorVista {
  id: string;
  nombre: string;
  descripcion?: string;
  capacidad?: number;
  tipo_contenedor: {
    id: string;
    nombre: string; // Congelador, Refrigerador, etc.
  };
  
  // Resumen de contenido
  total_productos: number;
  total_items: number; // Suma de todas las cantidades
  valor_total: number;
  
  // Alertas
  productos_vencidos: number;
  productos_por_vencer: number;
  productos_frescos: number;
  productos_congelados: number;
}

export interface DetalleProductoContenedor {
  id: string;
  
  // Producto
  producto: {
    id: string;
    nombre: string;
    categoria: string;
    unidad_medida: string;
  };
  
  // Detalles en el contenedor
  empaquetado?: string;
  fecha_vencimiento?: string;
  estado: 'Fresco' | 'Congelado' | 'Por vencer' | 'Vencido';
  cantidad: number;
  precio_real_unidad?: number;
  precio_total: number; // cantidad * precio_real_unidad
  
  // Calculados
  dias_para_vencer?: number;
}

export interface FormularioAsignarProducto {
  producto_id: string; // Solo productos con este contenedor como fijo o recomendado
  cantidad: number;
  empaquetado?: string;
  fecha_vencimiento?: string;
  estado_producto_id: string;
  precio_real_unidad?: number;
}

// ===============================
// TIPOS PARA ESTADÍSTICAS
// ===============================

export interface EstadisticasInventario {
  // Totales
  total_productos: number;
  total_contenedores: number;
  valor_total_inventario: number;
  
  // Estados de stock
  productos_stock_ok: number;
  productos_stock_bajo: number;
  productos_sin_stock: number;
  productos_reponer: number;
  
  // Alertas
  productos_vencidos: number;
  productos_por_vencer: number;
  
  // Por categoría
  productos_por_categoria: {
    categoria: string;
    cantidad: number;
    valor: number;
  }[];
  
  // Por contenedor
  productos_por_contenedor: {
    contenedor: string;
    cantidad: number;
    valor: number;
  }[];
}

// ===============================
// HELPERS Y UTILIDADES
// ===============================

export const calcularEstadoInventario = (
  stock_actual: number, 
  stock_min: number
): ProductoInventario['estado_inventario'] => {
  if (stock_actual === 0) return 'Sin Stock';
  if (stock_actual <= stock_min * 0.5) return 'Reponer';
  if (stock_actual <= stock_min) return 'Stock Bajo';
  return 'Stock OK';
};

export const calcularEstadoProducto = (
  fecha_vencimiento?: string
): DetalleProductoContenedor['estado'] => {
  if (!fecha_vencimiento) return 'Fresco';
  
  const hoy = new Date();
  const vencimiento = new Date(fecha_vencimiento);
  const diasRestantes = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diasRestantes <= 0) return 'Vencido';
  if (diasRestantes <= 3) return 'Por vencer';
  return 'Fresco';
};

export const formatearEmpaquetados = (detalles: DBDetalleContenedor[]): string => {
  const empaquetados = detalles
    .filter(d => d.empaquetado)
    .reduce((acc, d) => {
      const key = d.empaquetado || 'sin empaque';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  return Object.entries(empaquetados)
    .map(([tipo, cantidad]) => `${cantidad} ${tipo}`)
    .join(', ') || 'Sin empaquetados';
};