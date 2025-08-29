// src/features/containers/data/mockContainerData.ts - ESTRUCTURA ACTUALIZADA SEGÚN ESPECIFICACIONES

import type { Container, ContainerProduct, ContainerSummary, ContainerStats } from '../types/container.types';

export const mockContainers: Container[] = [
  // 4 CONGELADORES PRINCIPALES
  {
    id: '1',
    name: 'Congelador 1 - Pescado',
    type: 'congelador',
    capacity: 150,
    currentLoad: 78,
    location: 'Cocina Principal',
    temperature: -18,
    humidity: 45,
    status: 'activo',
    createdAt: new Date('2024-01-15'),
    description: 'Congelador especializado para pescados frescos y congelados'
  },
  {
    id: '2',
    name: 'Congelador 2 - Mariscos',
    type: 'congelador',
    capacity: 180,
    currentLoad: 120,
    location: 'Cocina Principal',
    temperature: -20,
    humidity: 40,
    status: 'activo',
    createdAt: new Date('2024-01-15'),
    description: 'Congelador para mariscos (pulpo, langostinos, camarones, etc.)'
  },
  {
    id: '3',
    name: 'Congelador 3 - Causas',
    type: 'congelador',
    capacity: 120,
    currentLoad: 65,
    location: 'Cocina Principal',
    temperature: -15,
    humidity: 50,
    status: 'activo',
    createdAt: new Date('2024-01-15'),
    description: 'Congelador para ingredientes de causa (papas, limones, etc.)'
  },
  {
    id: '4',
    name: 'Congelador 4 - Verduras',
    type: 'congelador',
    capacity: 100,
    currentLoad: 45,
    location: 'Cocina Principal',
    temperature: -12,
    humidity: 55,
    status: 'activo',
    createdAt: new Date('2024-01-15'),
    description: 'Congelador para verduras y tubérculos (yuca, tomate, conservantes)'
  },
  
  // 2 REFRIGERADORES PARA BEBIDAS
  {
    id: '5',
    name: 'Refrigerador 5 - Gaseosas',
    type: 'frigider',
    capacity: 200,
    currentLoad: 145,
    location: 'Bar/Servicio',
    temperature: 4,
    humidity: 60,
    status: 'activo',
    createdAt: new Date('2024-01-15'),
    description: 'Refrigerador para gaseosas (Inca Kola, Coca Cola, Sprite, Guaraná)'
  },
  {
    id: '6',
    name: 'Refrigerador 6 - Cervezas',
    type: 'frigider',
    capacity: 180,
    currentLoad: 95,
    location: 'Bar/Servicio',
    temperature: 2,
    humidity: 65,
    status: 'activo',
    createdAt: new Date('2024-01-15'),
    description: 'Refrigerador para cervezas y bebidas alcohólicas'
  },
  
  // ALMACÉN SECO
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
    description: 'Almacén para productos no perecederos (aceites, granos, etc.)'
  },
];

export const mockContainerProducts: ContainerProduct[] = [
  // CONGELADOR 1 - PESCADO
  {
    id: '1',
    productId: '1',
    productName: 'Lenguado Filetes',
    containerId: '1',
    containerName: 'Congelador 1 - Pescado',
    category: 'Pescado',
    totalQuantity: 8,
    unit: 'kg',
    packagedUnits: 3,
    quantityPerPackage: 2.5,
    expiryDate: new Date('2025-08-23'),
    state: 'fresco',
    price: 28.50,
    createdAt: new Date('2025-08-16'),
  },
  {
    id: '2',
    productId: '10',
    productName: 'Corvina Entera',
    containerId: '1',
    containerName: 'Congelador 1 - Pescado',
    category: 'Pescado',
    totalQuantity: 15,
    unit: 'kg',
    packagedUnits: 3,
    quantityPerPackage: 5,
    expiryDate: new Date('2025-08-27'),
    state: 'congelado',
    price: 22.00,
    createdAt: new Date('2025-08-17'),
  },

  // CONGELADOR 2 - MARISCOS
  {
    id: '3',
    productId: '2',
    productName: 'Pulpo',
    containerId: '2',
    containerName: 'Congelador 2 - Mariscos',
    category: 'Mariscos',
    totalQuantity: 12,
    unit: 'kg',
    packagedUnits: 2,
    quantityPerPackage: 6,
    expiryDate: new Date('2025-09-13'),
    state: 'congelado',
    price: 45.00,
    createdAt: new Date('2025-08-14'),
  },
  {
    id: '4',
    productId: '5',
    productName: 'Langostinos',
    containerId: '2',
    containerName: 'Congelador 2 - Mariscos',
    category: 'Mariscos',
    totalQuantity: 6,
    unit: 'kg',
    packagedUnits: 2,
    quantityPerPackage: 3,
    expiryDate: new Date('2025-08-21'),
    state: 'por-vencer',
    price: 35.00,
    createdAt: new Date('2025-08-15'),
  },
  {
    id: '5',
    productId: '9',
    productName: 'Camarones',
    containerId: '2',
    containerName: 'Congelador 2 - Mariscos',
    category: 'Mariscos',
    totalQuantity: 20,
    unit: 'kg',
    packagedUnits: 6,
    quantityPerPackage: 3,
    expiryDate: new Date('2025-09-15'),
    state: 'congelado',
    price: 42.00,
    createdAt: new Date('2025-08-18'),
  },
  {
    id: '6',
    productId: '12',
    productName: 'Conchas de Abanico',
    containerId: '2',
    containerName: 'Congelador 2 - Mariscos',
    category: 'Mariscos',
    totalQuantity: 4,
    unit: 'kg',
    packagedUnits: 8,
    quantityPerPackage: 0.5,
    expiryDate: new Date('2025-08-25'),
    state: 'por-vencer',
    price: 38.00,
    createdAt: new Date('2025-08-19'),
  },

  // CONGELADOR 3 - CAUSAS
  {
    id: '7',
    productId: '7',
    productName: 'Limones',
    containerId: '3',
    containerName: 'Congelador 3 - Causas',
    category: 'Cítricos',
    totalQuantity: 8,
    unit: 'kg',
    packagedUnits: 4,
    quantityPerPackage: 2,
    expiryDate: new Date('2025-08-20'),
    state: 'por-vencer',
    price: 2.80,
    createdAt: new Date('2025-08-15'),
  },
  {
    id: '8',
    productId: '17',
    productName: 'Papas Amarillas',
    containerId: '3',
    containerName: 'Congelador 3 - Causas',
    category: 'Tubérculos',
    totalQuantity: 12,
    unit: 'kg',
    packagedUnits: 3,
    quantityPerPackage: 4,
    expiryDate: new Date('2025-09-02'),
    state: 'fresco',
    price: 1.50,
    createdAt: new Date('2025-08-14'),
  },
  {
    id: '9',
    productId: '10',
    productName: 'Ají Amarillo',
    containerId: '3',
    containerName: 'Congelador 3 - Causas',
    category: 'Condimentos',
    totalQuantity: 3,
    unit: 'kg',
    packagedUnits: 2,
    quantityPerPackage: 1.5,
    expiryDate: new Date('2025-08-19'),
    state: 'vencido',
    price: 6.50,
    createdAt: new Date('2025-08-10'),
  },

  // CONGELADOR 4 - VERDURAS
  {
    id: '10',
    productId: '3',
    productName: 'Yuca',
    containerId: '4',
    containerName: 'Congelador 4 - Verduras',
    category: 'Tubérculos',
    totalQuantity: 15,
    unit: 'kg',
    packagedUnits: 5,
    quantityPerPackage: 3,
    expiryDate: new Date('2025-08-26'),
    state: 'fresco',
    price: 3.50,
    createdAt: new Date('2025-08-15'),
  },
  {
    id: '11',
    productId: '16',
    productName: 'Tomates',
    containerId: '4',
    containerName: 'Congelador 4 - Verduras',
    category: 'Verduras',
    totalQuantity: 5,
    unit: 'kg',
    packagedUnits: 2,
    quantityPerPackage: 2.5,
    expiryDate: new Date('2025-08-25'),
    state: 'fresco',
    price: 3.20,
    createdAt: new Date('2025-08-16'),
  },
  {
    id: '12',
    productId: '11',
    productName: 'Camotes',
    containerId: '4',
    containerName: 'Congelador 4 - Verduras',
    category: 'Tubérculos',
    totalQuantity: 8,
    unit: 'kg',
    packagedUnits: 4,
    quantityPerPackage: 2,
    expiryDate: new Date('2025-09-01'),
    state: 'fresco',
    price: 2.80,
    createdAt: new Date('2025-08-18'),
  },

  // REFRIGERADOR 5 - GASEOSAS
  {
    id: '13',
    productId: '11',
    productName: 'Inca Kola',
    containerId: '5',
    containerName: 'Refrigerador 5 - Gaseosas',
    category: 'Bebidas',
    totalQuantity: 48,
    unit: 'unidades',
    packagedUnits: 2,
    quantityPerPackage: 24,
    expiryDate: new Date('2025-12-15'),
    state: 'fresco',
    price: 2.50,
    createdAt: new Date('2025-08-18'),
  },
  {
    id: '14',
    productId: '12',
    productName: 'Coca Cola',
    containerId: '5',
    containerName: 'Refrigerador 5 - Gaseosas',
    category: 'Bebidas',
    totalQuantity: 36,
    unit: 'unidades',
    packagedUnits: 3,
    quantityPerPackage: 12,
    expiryDate: new Date('2025-11-20'),
    state: 'fresco',
    price: 2.80,
    createdAt: new Date('2025-08-18'),
  },
  {
    id: '15',
    productId: '13',
    productName: 'Sprite',
    containerId: '5',
    containerName: 'Refrigerador 5 - Gaseosas',
    category: 'Bebidas',
    totalQuantity: 24,
    unit: 'unidades',
    packagedUnits: 2,
    quantityPerPackage: 12,
    expiryDate: new Date('2025-10-30'),
    state: 'fresco',
    price: 2.70,
    createdAt: new Date('2025-08-17'),
  },

  // REFRIGERADOR 6 - CERVEZAS
  {
    id: '16',
    productId: '14',
    productName: 'Cerveza Pilsen',
    containerId: '6',
    containerName: 'Refrigerador 6 - Cervezas',
    category: 'Bebidas Alcohólicas',
    totalQuantity: 36,
    unit: 'unidades',
    packagedUnits: 3,
    quantityPerPackage: 12,
    expiryDate: new Date('2025-12-31'),
    state: 'fresco',
    price: 3.80,
    createdAt: new Date('2025-08-18'),
  },
  {
    id: '17',
    productId: '15',
    productName: 'Cerveza Cristal',
    containerId: '6',
    containerName: 'Refrigerador 6 - Cervezas',
    category: 'Bebidas Alcohólicas',
    totalQuantity: 24,
    unit: 'unidades',
    packagedUnits: 2,
    quantityPerPackage: 12,
    expiryDate: new Date('2025-11-15'),
    state: 'fresco',
    price: 3.60,
    createdAt: new Date('2025-08-17'),
  },

  // ALMACÉN SECO
  {
    id: '18',
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
    id: '19',
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
  {
    id: '20',
    productId: '8',
    productName: 'Cancha Serrana',
    containerId: '7',
    containerName: 'Almacén Seco',
    category: 'Granos',
    totalQuantity: 12,
    unit: 'kg',
    packagedUnits: 3,
    quantityPerPackage: 4,
    expiryDate: new Date('2025-10-02'),
    state: 'fresco',
    price: 4.50,
    createdAt: new Date('2025-08-12'),
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