// src/features/containers/data/mockContainerData.ts

import type { Container, ContainerProduct, ContainerSummary, ContainerStats } from '../types/container.types';

export const mockContainers: Container[] = [
  {
    id: '1',
    name: 'Frigider 1 - Causa',
    type: 'frigider',
    capacity: 100,
    currentLoad: 45,
    location: 'Cocina Principal',
    temperature: 4,
    humidity: 65,
    status: 'activo',
    createdAt: new Date('2024-01-15'),
    description: 'Refrigerador principal para ingredientes de causa'
  },
  {
    id: '2',
    name: 'Frigider 2 - Pescado',
    type: 'frigider',
    capacity: 120,
    currentLoad: 68,
    location: 'Cocina Principal',
    temperature: 2,
    humidity: 70,
    status: 'activo',
    createdAt: new Date('2024-01-15'),
    description: 'Refrigerador especializado para pescados frescos'
  },
  {
    id: '3',
    name: 'Frigider 3 - Yuca',
    type: 'frigider',
    capacity: 80,
    currentLoad: 32,
    location: 'Cocina Principal',
    temperature: 6,
    humidity: 60,
    status: 'activo',
    createdAt: new Date('2024-01-15'),
    description: 'Refrigerador para tubérculos y vegetales'
  },
  {
    id: '4',
    name: 'Frigider 4 - Mariscos',
    type: 'frigider',
    capacity: 150,
    currentLoad: 89,
    location: 'Cocina Principal',
    temperature: 1,
    humidity: 75,
    status: 'activo',
    createdAt: new Date('2024-01-15'),
    description: 'Refrigerador para mariscos y productos del mar'
  },
  {
    id: '5',
    name: 'Congelador 1',
    type: 'congelador',
    capacity: 200,
    currentLoad: 145,
    location: 'Almacén',
    temperature: -18,
    humidity: 45,
    status: 'activo',
    createdAt: new Date('2024-01-15'),
    description: 'Congelador principal para productos de larga conservación'
  },
  {
    id: '6',
    name: 'Congelador 2',
    type: 'congelador',
    capacity: 180,
    currentLoad: 120,
    location: 'Almacén',
    temperature: -20,
    humidity: 40,
    status: 'activo',
    createdAt: new Date('2024-01-15'),
    description: 'Congelador secundario para mariscos'
  },
  {
    id: '7',
    name: 'Almacén Seco',
    type: 'almacen-seco',
    capacity: 300,
    currentLoad: 85,
    location: 'Despensa',
    temperature: 20,
    humidity: 35,
    status: 'activo',
    createdAt: new Date('2024-01-15'),
    description: 'Almacén para productos no perecederos'
  },
];

export const mockContainerProducts: ContainerProduct[] = [
  // Frigider 1 - Causa
  {
    id: '1',
    productId: '7',
    productName: 'Limones',
    containerId: '1',
    containerName: 'Frigider 1 - Causa',
    category: 'Cítricos',
    totalQuantity: 8,
    unit: 'kg',
    packagedUnits: 4,
    quantityPerPackage: 2,
    expiryDate: new Date('2025-08-30'),
    state: 'fresco',
    price: 2.80,
    createdAt: new Date('2025-08-15'),
  },
  {
    id: '2',
    productId: '8',
    productName: 'Papas',
    containerId: '1',
    containerName: 'Frigider 1 - Causa',
    category: 'Tubérculos',
    totalQuantity: 12,
    unit: 'kg',
    packagedUnits: 3,
    quantityPerPackage: 4,
    expiryDate: new Date('2025-09-05'),
    state: 'fresco',
    price: 1.50,
    createdAt: new Date('2025-08-16'),
  },
  {
    id: '3',
    productId: '9',
    productName: 'Aguacates',
    containerId: '1',
    containerName: 'Frigider 1 - Causa',
    category: 'Frutas',
    totalQuantity: 5,
    unit: 'kg',
    packagedUnits: 5,
    quantityPerPackage: 1,
    expiryDate: new Date('2025-08-26'),
    state: 'por-vencer',
    price: 4.20,
    createdAt: new Date('2025-08-20'),
  },

  // Frigider 2 - Pescado
  {
    id: '4',
    productId: '1',
    productName: 'Lenguado Filetes',
    containerId: '2',
    containerName: 'Frigider 2 - Pescado',
    category: 'Pescado',
    totalQuantity: 6,
    unit: 'kg',
    packagedUnits: 2,
    quantityPerPackage: 3,
    expiryDate: new Date('2025-08-25'),
    state: 'fresco',
    price: 28.50,
    createdAt: new Date('2025-08-20'),
  },
  {
    id: '5',
    productId: '1',
    productName: 'Lenguado Filetes',
    containerId: '2',
    containerName: 'Frigider 2 - Pescado',
    category: 'Pescado',
    totalQuantity: 2,
    unit: 'kg',
    packagedUnits: 1,
    quantityPerPackage: 2,
    expiryDate: new Date('2025-08-24'),
    state: 'por-vencer',
    price: 28.50,
    createdAt: new Date('2025-08-18'),
  },
  {
    id: '6',
    productId: '10',
    productName: 'Corvina Entera',
    containerId: '2',
    containerName: 'Frigider 2 - Pescado',
    category: 'Pescado',
    totalQuantity: 8,
    unit: 'kg',
    packagedUnits: 2,
    quantityPerPackage: 4,
    expiryDate: new Date('2025-08-27'),
    state: 'fresco',
    price: 22.00,
    createdAt: new Date('2025-08-21'),
  },

  // Frigider 3 - Yuca
  {
    id: '7',
    productId: '3',
    productName: 'Yuca',
    containerId: '3',
    containerName: 'Frigider 3 - Yuca',
    category: 'Tubérculos',
    totalQuantity: 15,
    unit: 'kg',
    packagedUnits: 5,
    quantityPerPackage: 3,
    expiryDate: new Date('2025-08-28'),
    state: 'fresco',
    price: 3.50,
    createdAt: new Date('2025-08-15'),
  },
  {
    id: '8',
    productId: '11',
    productName: 'Camotes',
    containerId: '3',
    containerName: 'Frigider 3 - Yuca',
    category: 'Tubérculos',
    totalQuantity: 6,
    unit: 'kg',
    packagedUnits: 3,
    quantityPerPackage: 2,
    expiryDate: new Date('2025-09-02'),
    state: 'fresco',
    price: 2.80,
    createdAt: new Date('2025-08-19'),
  },

  // Frigider 4 - Mariscos
  {
    id: '9',
    productId: '9',
    productName: 'Camarones',
    containerId: '4',
    containerName: 'Frigider 4 - Mariscos',
    category: 'Mariscos',
    totalQuantity: 4,
    unit: 'kg',
    packagedUnits: 2,
    quantityPerPackage: 2,
    expiryDate: new Date('2025-08-23'),
    state: 'vencido',
    price: 42.00,
    createdAt: new Date('2025-08-10'),
  },
  {
    id: '10',
    productId: '12',
    productName: 'Conchas de Abanico',
    containerId: '4',
    containerName: 'Frigider 4 - Mariscos',
    category: 'Mariscos',
    totalQuantity: 3,
    unit: 'kg',
    packagedUnits: 6,
    quantityPerPackage: 0.5,
    expiryDate: new Date('2025-08-25'),
    state: 'por-vencer',
    price: 38.00,
    createdAt: new Date('2025-08-20'),
  },

  // Congelador 1
  {
    id: '11',
    productId: '5',
    productName: 'Langostinos',
    containerId: '5',
    containerName: 'Congelador 1',
    category: 'Mariscos',
    totalQuantity: 6,
    unit: 'kg',
    packagedUnits: 2,
    quantityPerPackage: 3,
    expiryDate: new Date('2025-12-15'),
    state: 'congelado',
    price: 35.00,
    createdAt: new Date('2025-08-15'),
  },
  {
    id: '12',
    productId: '13',
    productName: 'Pota Congelada',
    containerId: '5',
    containerName: 'Congelador 1',
    category: 'Mariscos',
    totalQuantity: 20,
    unit: 'kg',
    packagedUnits: 4,
    quantityPerPackage: 5,
    expiryDate: new Date('2026-01-20'),
    state: 'congelado',
    price: 18.50,
    createdAt: new Date('2025-08-12'),
  },

  // Congelador 2
  {
    id: '13',
    productId: '2',
    productName: 'Pulpo',
    containerId: '6',
    containerName: 'Congelador 2',
    category: 'Mariscos',
    totalQuantity: 12,
    unit: 'kg',
    packagedUnits: 2,
    quantityPerPackage: 6,
    expiryDate: new Date('2025-11-30'),
    state: 'congelado',
    price: 45.00,
    createdAt: new Date('2025-08-14'),
  },
  {
    id: '14',
    productId: '14',
    productName: 'Merluza Congelada',
    containerId: '6',
    containerName: 'Congelador 2',
    category: 'Pescado',
    totalQuantity: 15,
    unit: 'kg',
    packagedUnits: 3,
    quantityPerPackage: 5,
    expiryDate: new Date('2025-12-31'),
    state: 'congelado',
    price: 12.80,
    createdAt: new Date('2025-08-16'),
  },

  // Almacén Seco
  {
    id: '15',
    productId: '6',
    productName: 'Aceite Vegetal',
    containerId: '7',
    containerName: 'Almacén Seco',
    category: 'Aceites',
    totalQuantity: 20,
    unit: 'litros',
    packagedUnits: 4,
    quantityPerPackage: 5,
    expiryDate: new Date('2026-02-15'),
    state: 'fresco',
    price: 4.20,
    createdAt: new Date('2025-08-10'),
  },
  {
    id: '16',
    productId: '15',
    productName: 'Arroz Blanco',
    containerId: '7',
    containerName: 'Almacén Seco',
    category: 'Granos',
    totalQuantity: 25,
    unit: 'kg',
    packagedUnits: 5,
    quantityPerPackage: 5,
    expiryDate: new Date('2026-06-30'),
    state: 'fresco',
    price: 3.80,
    createdAt: new Date('2025-08-08'),
  },
];

// Función para calcular estadísticas de un contenedor
export const calculateContainerStats = (containerId: string): ContainerStats => {
  const products = mockContainerProducts.filter(p => p.containerId === containerId);
  
  const stats = products.reduce(
    (acc, product) => {
      acc.totalProducts += product.packagedUnits;
      acc.totalValue += product.totalQuantity * product.price;
      
      switch (product.state) {
        case 'fresco':
          acc.frescos += product.packagedUnits;
          break;
        case 'congelado':
          acc.congelados += product.packagedUnits;
          break;
        case 'por-vencer':
          acc.porVencer += product.packagedUnits;
          break;
        case 'vencido':
          acc.vencidos += product.packagedUnits;
          break;
      }
      
      return acc;
    },
    {
      totalProducts: 0,
      frescos: 0,
      congelados: 0,
      porVencer: 0,
      vencidos: 0,
      totalValue: 0,
      capacityUsed: 0,
      capacityPercentage: 0,
    }
  );
  
  const container = mockContainers.find(c => c.id === containerId);
  if (container) {
    stats.capacityUsed = container.currentLoad;
    stats.capacityPercentage = Math.round((container.currentLoad / container.capacity) * 100);
  }
  
  return stats;
};

// Función para obtener resumen completo de contenedores
export const getContainersSummary = (): ContainerSummary[] => {
  return mockContainers.map(container => ({
    ...container,
    stats: calculateContainerStats(container.id),
    products: mockContainerProducts.filter(p => p.containerId === container.id),
  }));
};

// Función para obtener productos de un contenedor específico
export const getContainerProducts = (containerId: string): ContainerProduct[] => {
  return mockContainerProducts.filter(p => p.containerId === containerId);
};

// Función para calcular el estado del producto basado en fecha de vencimiento
export const calculateProductState = (expiryDate: Date | undefined): 'fresco' | 'por-vencer' | 'vencido' => {
  if (!expiryDate) return 'fresco';
  
  const now = new Date();
  const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'vencido';
  if (diffDays <= 10) return 'por-vencer';
  return 'fresco';
};