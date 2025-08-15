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
  container: string; // Contenedor/refrigerador asignado
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
  expiryDate: string;
  container: string;
  state: 'fresco' | 'congelado';
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