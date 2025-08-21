export interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string; // kg, bolsa, litro, unidad, etc.
  price: number;
  minStock: number;
  supplier: string;
  expiryDate: string; // Fecha de vencimiento
  entryDate: string; // Fecha de ingreso
  estimatedDaysToExpiry: number; // Días estimados hasta vencimiento

  // container: string; // Contenedor/refrigerador asignado - TEMPORALMENTE OCULTO
  state: 'fresco' | 'congelado' | 'por-vencer' | 'vencido';
  lastUpdated: string;
}

export interface NewProduct {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  minStock: number;
  supplier: string;
  estimatedDaysToExpiry: number; // Campo nuevo para días estimados
  expiryDate: string;
  // container: string; // TEMPORALMENTE OCULTO
  state: 'fresco' | 'congelado';
}

// Nuevo tipo para el estado de stock
export type StockStatus = 'Sin Stock' | 'Stock Bajo' | 'Reponer Pronto' | 'Stock OK';

// Interface para productos con datos calculados (lo que devuelve el hook)
export interface ProductWithCalculatedData extends Product {
  stockStatus: StockStatus;
  totalValue: number; // precio × cantidad del producto individual
}

export type ViewType = 'dashboard' | 'inventory';

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

// TEMPORALMENTE OCULTO - FUNCIONALIDAD DE CONTENEDORES
/*
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
*/