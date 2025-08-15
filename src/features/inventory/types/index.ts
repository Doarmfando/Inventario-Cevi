
export interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  minStock: number;
  supplier: string;
  lastUpdated: string;
}

export interface NewProduct {
  name: string;
  category: string;
  quantity: number;
  price: number;
  minStock: number;
  supplier: string;
}

export type ViewType = 'dashboard' | 'inventory';