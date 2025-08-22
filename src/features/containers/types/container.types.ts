// src/features/containers/types/container.types.ts

export interface Container {
  id: string;
  name: string;
  type: 'frigider' | 'congelador' | 'almacen-seco' | 'almacen-humedo';
  capacity: number; // Capacidad máxima en kg
  currentLoad: number; // Carga actual en kg
  location?: string;
  temperature?: number;
  humidity?: number;
  status: 'activo' | 'mantenimiento' | 'inactivo';
  createdAt: Date;
  updatedAt?: Date;
  description?: string;
}

export interface ContainerProduct {
  id: string;
  productId: string;
  productName: string;
  containerId: string;
  containerName: string;
  category: string;
  totalQuantity: number;
  unit: string;
  packagedUnits: number;
  quantityPerPackage: number;
  expiryDate?: Date;
  state: ProductState;
  price: number;
  createdAt: Date;
  updatedAt?: Date;
}

export type ProductState = 'fresco' | 'congelado' | 'por-vencer' | 'vencido';

export interface ContainerStats {
  totalProducts: number;
  frescos: number;
  congelados: number;
  porVencer: number;
  vencidos: number;
  totalValue: number;
  capacityUsed: number;
  capacityPercentage: number;
}

export interface ContainerSummary extends Container {
  stats: ContainerStats;
  products: ContainerProduct[];
}

export interface ContainerFormData {
  name: string;
  type: Container['type'];
  capacity?: number;
  location?: string;
  temperature?: number;
  humidity?: number;
  description?: string;
}

export interface ProductFormData {
  productId: string;
  containerId: string;
  totalQuantity: number;
  packagedUnits: number;
  expiryDate?: string;
  state: ProductState;
  price: number;
}