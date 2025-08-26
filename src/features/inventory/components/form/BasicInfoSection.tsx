// types/index.ts - ACTUALIZADO CON CONTENEDORES RECOMENDADOS

export interface Product {
  id: number;
  name: string;
  container: string; // ACTIVADO: Necesario según la imagen - Ubicación principal
  recommendedContainers?: Container[]; // NUEVO: Contenedores recomendados para distribución
  category: string;
  unit: string; // kg, bolsa, litro, unidad, etc.
  quantity: number; // Stock Total (en la unidad base)
  price: number; // PRECIO ESTIMADO - Precio de referencia/estimado para cálculos internos
  realPrice?: number; // PRECIO REAL - Precio real de compra/venta del producto
  minStock: number;
  supplier: string;
  expiryDate: string; // Fecha de vencimiento
  entryDate: string; // Fecha de ingreso
  estimatedDaysToExpiry: number; // Días hasta vencimiento del stock general
  
  // EMPAQUETADO - Sistema gastronómico específico
  packagedUnits: number; // Número de empaquetados (ej: 3 empaquetados)
  weightPerPackage: number; // Peso por empaquetado (ej: 2kg c/u)
  packagedExpiryDays: number; // Días hasta vencimiento de empaquetados
  nearExpiryPackages: number; // # Por Vencer - SOLO empaquetados vencidos/próximos a vencer
  
  state: 'fresco' | 'congelado' | 'por-vencer' | 'vencido';
  lastUpdated: string;
}

export interface NewProduct {
  name: string;
  container: string; // ACTIVADO - Ubicación principal
  recommendedContainers?: Container[]; // NUEVO: Contenedores recomendados para distribución
  category: string;
  unit: string;
  quantity: number;
  price: number; // PRECIO ESTIMADO - Para cálculos de inventario
  realPrice?: number; // PRECIO REAL - Precio real del producto (opcional en creación)
  minStock: number;
  supplier: string;
  estimatedDaysToExpiry: number;
  expiryDate: string;
  packagedUnits?: number; // Número de empaquetados, default 0
  weightPerPackage?: number; // Peso por empaquetado, default 1
  packagedExpiryDays?: number; // Días vencimiento empaquetados, default estimatedDaysToExpiry
  state: 'fresco' | 'congelado';
}

// Estados de stock según la imagen
export type StockStatus = 'Sin Stock' | 'Stock Bajo' | 'Reponer Pronto' | 'Stock OK';

// Interface para productos con datos calculados (coincide con las columnas de la imagen)
export interface ProductWithCalculatedData extends Product {
  stockStatus: StockStatus; // Estado Stock
  totalValue: number; // Valor Total (precio × cantidad) - Usando precio estimado
  realTotalValue?: number; // Valor Total Real (precio real × cantidad) - Si existe precio real
  availableStock: number; // Stock Total - Empaquetados
  packagedWeight: number; // Peso total de empaquetados (packagedUnits * weightPerPackage)
  empaquetados: string; // Texto formateado: "3 emp. (6kg)"
  porVencer: string; // Texto formateado de empaquetados por vencer: "2 emp. (4kg)"
}

export type ViewType = 'dashboard' | 'inventory';

// Categorías actualizadas según tus datos
export type ProductCategory = 
  | 'Pescados' 
  | 'Mariscos' 
  | 'Verduras' 
  | 'Condimentos' 
  | 'Insumos' 
  | 'Suministros';

export type ProductUnit = 
  | 'kg' 
  | 'bolsa' 
  | 'litro' 
  | 'unidad' 
  | 'cubeta' 
  | 'atado' 
  | 'caja';

// Contenedores según la imagen y tus comentarios
export type Container = 
  | 'Frigider 1 - Causa'
  | 'Frigider 2 - Pescado' 
  | 'Frigider 3 - Yuca'
  | 'Frigider 4 - Mariscos'
  | 'Congelador 1'
  | 'Congelador 2' 
  | 'Congelador 3'
  | 'Congelador 4'
  | 'Almacén Seco';

// NUEVO: Recomendaciones de contenedores por categoría
export const CONTAINER_RECOMMENDATIONS: Record<ProductCategory, Container[]> = {
  'Pescados': ['Frigider 2 - Pescado', 'Congelador 1', 'Congelador 2'],
  'Mariscos': ['Frigider 4 - Mariscos', 'Congelador 3', 'Congelador 4'],
  'Verduras': ['Frigider 1 - Causa', 'Frigider 3 - Yuca'],
  'Condimentos': ['Almacén Seco', 'Frigider 1 - Causa'],
  'Insumos': ['Almacén Seco', 'Congelador 1'],
  'Suministros': ['Almacén Seco']
};

// Filtros para la tabla
export interface TableFilters {
  category?: ProductCategory | 'all';
  stockStatus?: StockStatus | 'all';
  container?: Container | 'all';
  searchTerm?: string;
}

// Configuración de columnas de la tabla
export interface TableColumn {
  key: keyof ProductWithCalculatedData | 'actions';
  label: string;
  sortable?: boolean;
  width?: string;
}

// NUEVO: Interface para movimientos de distribución
export interface DistributionMovement {
  id: number;
  productId: number;
  fromContainer: Container;
  toContainer: Container;
  quantity: number;
  unit: string;
  packagedUnits?: number;
  weightPerPackage?: number;
  movementType: 'distribution' | 'packaging' | 'transfer';
  notes?: string;
  createdAt: string;
  createdBy?: string;
}

// NUEVO: Interface para planificación de distribución
export interface DistributionPlan {
  productId: number;
  totalQuantity: number;
  distributions: {
    container: Container;
    quantity: number;
    packagedUnits?: number;
    weightPerPackage?: number;
  }[];
}