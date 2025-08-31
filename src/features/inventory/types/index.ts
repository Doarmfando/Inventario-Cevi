// src/types/index.ts - TIPOS UNIFICADOS PARA TODO EL SISTEMA

// ===============================
// TIPOS BÁSICOS UNIFICADOS
// ===============================

export type ProductCategory = 
  | 'Pescados'
  | 'Mariscos' 
  | 'Causa'
  | 'Tubérculos'
  | 'Cítricos'
  | 'Condimentos'
  | 'Verduras'
  | 'Bebidas'
  | 'Bebidas Alcohólicas'
  | 'Aceites'
  | 'Granos';

export type ProductUnit = 
  | 'kg' 
  | 'litros'
  | 'unidades'
  | 'botellas'
  | 'rollos'
  | 'paquetes'
  | 'atados';

export type Container = 
  | 'Congelador 1 - Pescado'
  | 'Congelador 2 - Mariscos'
  | 'Congelador 3 - Causa'
  | 'Congelador 4 - Verduras'
  | 'Refrigerador 5 - Gaseosas'
  | 'Refrigerador 6 - Cervezas'
  | 'Almacén Seco';

export type StockStatus = 'Sin Stock' | 'Stock Bajo' | 'Reponer Pronto' | 'Stock OK';
export type ProductState = 'fresco' | 'por-vencer' | 'vencido' | 'congelado';

// ===============================
// INTERFACES PRINCIPALES
// ===============================

export interface Product {
  id: number;
  name: string;
  container: Container;
  category: ProductCategory;
  unit: ProductUnit;
  quantity: number;
  price: number; // Precio estimado
  realPrice?: number; // Precio real (opcional)
  minStock: number;
  supplier: string;
  expiryDate: string;
  estimatedDaysToExpiry: number;
  packagedUnits: number;
  weightPerPackage: number;
  packagedExpiryDays: number;
  nearExpiryPackages: number;
  entryDate: string;
  state: ProductState;
  lastUpdated: string;
}

// ✅ NUEVA INTERFACE PARA FORMULARIO CON CATEGORÍA OPCIONAL
export interface NewProductForm {
  name: string;
  container: string; // Puede estar vacío inicialmente
  category: ProductCategory | ""; // ✅ PERMITE VACÍO INICIAL
  unit: ProductUnit;
  quantity: number;
  price: number;
  realPrice?: number;
  minStock: number;
  supplier: string;
  estimatedDaysToExpiry: number;
  packagedUnits?: number;
  weightPerPackage?: number;
  packagedExpiryDays?: number;
  state: 'fresco' | 'congelado';
  recommendedContainers?: Container[];
}

export interface NewProduct {
  name: string;
  container: Container;
  category: ProductCategory;
  unit: ProductUnit;
  quantity: number;
  price: number;
  realPrice?: number;
  minStock: number;
  supplier: string;
  estimatedDaysToExpiry: number;
  packagedUnits?: number;
  weightPerPackage?: number;
  packagedExpiryDays?: number;
  state: 'fresco' | 'congelado';
  recommendedContainers?: Container[];
}

export interface ProductWithCalculatedData extends Product {
  stockStatus: StockStatus;
  totalValue: number;
  realTotalValue?: number;
  availableStock: number;
  packagedWeight: number;
  empaquetados: string;
  porVencer: string;
}

// ===============================
// TIPOS PARA MOVIMIENTOS
// ===============================

export type MovementType = 'entrada' | 'salida' | 'ajuste';

export interface MovementFormData {
  type: MovementType;
  productId: string;
  quantity: number;
  packagedUnits: number;
  reason: string;
  observations?: string;
  selectedContainer: Container;
  unitPrice?: number;
  documentNumber?: string;
}

export interface AvailableProduct {
  id: string;
  name: string;
  container: Container;
  category: ProductCategory;
  unit: ProductUnit;
  currentStock: number;
  currentPackaged: number;
  estimatedPrice: number;
  minStock: number;
}

export interface Movement {
  id: string;
  productId: string;
  productName: string;
  container: Container;
  type: MovementType;
  quantity: number;
  packagedUnits: number;
  previousStock: number;
  newStock: number;
  unitPrice: number;
  totalValue: number;
  reason: string;
  observations?: string;
  documentNumber?: string;
  createdBy: string;
  createdAt: Date;
}

// ===============================
// CONSTANTES DE RECOMENDACIONES
// ===============================

export const CONTAINER_RECOMMENDATIONS: Record<ProductCategory, Container[]> = {
  'Pescados': ['Congelador 1 - Pescado'],
  'Mariscos': ['Congelador 2 - Mariscos'],
  'Causa': ['Congelador 3 - Causa'], 
  'Tubérculos': ['Congelador 3 - Causa', 'Congelador 4 - Verduras'], 
  'Cítricos': ['Congelador 3 - Causa', 'Congelador 4 - Verduras'], 
  'Condimentos': ['Congelador 3 - Causa', 'Congelador 4 - Verduras', 'Almacén Seco'], 
  'Verduras': ['Congelador 4 - Verduras'],
  'Bebidas': ['Refrigerador 5 - Gaseosas'],
  'Bebidas Alcohólicas': ['Refrigerador 6 - Cervezas', 'Almacén Seco'], 
  'Aceites': ['Almacén Seco'],
  'Granos': ['Almacén Seco']
};

// ===============================
// ARRAYS DE OPCIONES
// ===============================

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Pescados',
  'Mariscos',
  'Causa',
  'Tubérculos',
  'Cítricos',
  'Condimentos',
  'Verduras',
  'Bebidas',
  'Bebidas Alcohólicas',
  'Aceites',
  'Granos'
];

export const PRODUCT_UNITS: ProductUnit[] = [
  'kg',
  'litros',
  'unidades',
  'botellas',
  'rollos',
  'paquetes',
  'atados'
];

export const AVAILABLE_CONTAINERS: Container[] = [
  'Congelador 1 - Pescado',
  'Congelador 2 - Mariscos',
  'Congelador 3 - Causa',
  'Congelador 4 - Verduras',
  'Refrigerador 5 - Gaseosas',
  'Refrigerador 6 - Cervezas',
  'Almacén Seco'
];