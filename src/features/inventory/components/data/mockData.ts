// components/data/mockData.ts - DATOS DE EJEMPLO CON SISTEMA DE EMPAQUETADO GASTRONÓMICO + PRECIO REAL

import type { Product } from "../../types";

export interface InventoryProduct {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  unit: string;
  description?: string;
  minStock?: number;
  maxStock?: number;
  isPerishable: boolean;
  recommendedContainerTypes: string[];
  createdAt: Date;
}

// Productos base del inventario (catálogo completo)
export const mockInventoryProducts: InventoryProduct[] = [
  // PESCADOS
  {
    id: '1',
    name: 'Lenguado Filetes',
    category: 'Pescados',
    basePrice: 28.50,
    unit: 'kg',
    description: 'Filetes frescos de lenguado para ceviche y jalea',
    minStock: 5,
    isPerishable: true,
    recommendedContainerTypes: ['congelador', 'frigider'],
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '10',
    name: 'Corvina Entera',
    category: 'Pescados',
    basePrice: 22.00,
    unit: 'kg',
    description: 'Corvina fresca entera para diversos platos',
    minStock: 3,
    isPerishable: true,
    recommendedContainerTypes: ['congelador', 'frigider'],
    createdAt: new Date('2024-01-02'),
  },

  // MARISCOS
  {
    id: '2',
    name: 'Pulpo',
    category: 'Mariscos',
    basePrice: 45.00,
    unit: 'kg',
    description: 'Pulpo fresco del norte, duración 1 mes congelado',
    minStock: 3,
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-04'),
  },
  {
    id: '5',
    name: 'Langostinos',
    category: 'Mariscos',
    basePrice: 35.00,
    unit: 'kg',
    description: 'Langostinos frescos grandes para platos especiales',
    minStock: 4,
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-05'),
  },
  {
    id: '9',
    name: 'Camarones',
    category: 'Mariscos',
    basePrice: 42.00,
    unit: 'kg',
    description: 'Camarones medianos frescos, refrigeración 1 semana',
    minStock: 3,
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-06'),
  },

  // VERDURAS Y TUBÉRCULOS
  {
    id: '3',
    name: 'Yuca',
    category: 'Verduras',
    basePrice: 3.50,
    unit: 'kg',
    description: 'Yuca fresca pelada, se compra los jueves y se divide en bolsas de 1kg',
    minStock: 10,
    isPerishable: true,
    recommendedContainerTypes: ['frigider'],
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '11',
    name: 'Camotes',
    category: 'Verduras',
    basePrice: 2.80,
    unit: 'kg',
    description: 'Camotes frescos naranjas',
    minStock: 8,
    isPerishable: true,
    recommendedContainerTypes: ['frigider'],
    createdAt: new Date('2024-01-22'),
  },

  // CONDIMENTOS
  {
    id: '4',
    name: 'Rocoto',
    category: 'Condimentos',
    basePrice: 8.00,
    unit: 'kg',
    description: 'Rocoto rojo fresco para rocoto relleno',
    minStock: 2,
    isPerishable: true,
    recommendedContainerTypes: ['frigider'],
    createdAt: new Date('2024-01-25'),
  },
  {
    id: '7',
    name: 'Limones',
    category: 'Condimentos',
    basePrice: 2.80,
    unit: 'kg',
    description: 'Limones frescos para ceviche y causa',
    minStock: 15,
    isPerishable: true,
    recommendedContainerTypes: ['frigider'],
    createdAt: new Date('2024-01-18'),
  },
  {
    id: '22',
    name: 'Ají Amarillo',
    category: 'Condimentos',
    basePrice: 6.50,
    unit: 'kg',
    description: 'Ají amarillo fresco para causa y aderezos',
    minStock: 5,
    isPerishable: true,
    recommendedContainerTypes: ['frigider'],
    createdAt: new Date('2024-01-19'),
  },

  // INSUMOS SECOS
  {
    id: '6',
    name: 'Aceite Vegetal',
    category: 'Insumos',
    basePrice: 4.20,
    unit: 'litro',
    description: 'Aceite vegetal para cocina - uso extremo controlado',
    minStock: 8,
    isPerishable: false,
    recommendedContainerTypes: ['almacen-seco'],
    createdAt: new Date('2024-02-03'),
  },
  {
    id: '8',
    name: 'Cancha Serrana',
    category: 'Verduras',
    basePrice: 4.50,
    unit: 'kg',
    description: 'Cancha serrana - mezcla de diente de burro, cacho y blanca',
    minStock: 8,
    isPerishable: false,
    recommendedContainerTypes: ['almacen-seco'],
    createdAt: new Date('2024-02-04'),
  },
];

// Productos activos en el inventario (con stock y estado actual)
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Lenguado Filetes',
    container: 'Frigider 2 - Pescado',
    category: 'Pescados',
    unit: 'kg',
    quantity: 8, // Stock Total: 8kg
    price: 28.50, // PRECIO ESTIMADO - Para cálculos internos
    realPrice: 30.00, // PRECIO REAL - Precio real de compra
    minStock: 5,
    supplier: 'Mercado Pesquero Central',
    expiryDate: '2025-08-23',
    estimatedDaysToExpiry: 4,
    // Empaquetado gastronómico
    packagedUnits: 3, // 3 empaquetados
    weightPerPackage: 2, // 2kg cada empaquetado = 6kg empaquetados
    packagedExpiryDays: 2, // Los empaquetados vencen en 2 días
    nearExpiryPackages: 3, // Los 3 empaquetados están por vencer
    entryDate: '2025-08-16',
    state: 'fresco',
    lastUpdated: '2025-08-19'
  },
  {
    id: 2,
    name: 'Pulpo',
    container: 'Congelador 2',
    category: 'Mariscos',
    unit: 'kg',
    quantity: 12, // Stock Total: 12kg
    price: 45.00, // PRECIO ESTIMADO
    realPrice: 48.50, // PRECIO REAL
    minStock: 3,
    supplier: 'Mariscos del Sur',
    expiryDate: '2025-09-13',
    estimatedDaysToExpiry: 25,
    // Empaquetado gastronómico
    packagedUnits: 2, // 2 empaquetados
    weightPerPackage: 2, // 2kg cada empaquetado = 4kg empaquetados
    packagedExpiryDays: 25, // Congelado, no por vencer
    nearExpiryPackages: 0, // Ninguno por vencer (congelado)
    entryDate: '2025-08-14',
    state: 'congelado',
    lastUpdated: '2025-08-19'
  },
  {
    id: 3,
    name: 'Yuca',
    container: 'Frigider 3 - Yuca',
    category: 'Verduras',
    unit: 'kg',
    quantity: 15, // Stock Total: 15kg
    price: 3.50, // PRECIO ESTIMADO
    realPrice: 3.20, // PRECIO REAL
    minStock: 10,
    supplier: 'Distribuidora Los Andes',
    expiryDate: '2025-08-26',
    estimatedDaysToExpiry: 7,
    // Empaquetado gastronómico
    packagedUnits: 5, // 5 empaquetados
    weightPerPackage: 1, // 1kg cada empaquetado = 5kg empaquetados
    packagedExpiryDays: 3, // Empaquetados vencen en 3 días
    nearExpiryPackages: 2, // 2 empaquetados por vencer
    entryDate: '2025-08-15',
    state: 'fresco',
    lastUpdated: '2025-08-19'
  },
  {
    id: 4,
    name: 'Rocoto',
    container: 'Frigider 4 - Mariscos',
    category: 'Condimentos',
    unit: 'kg',
    quantity: 0, // Sin Stock
    price: 8.00, // PRECIO ESTIMADO
    // realPrice no definido - usará precio estimado
    minStock: 2,
    supplier: 'Verduras San Juan',
    expiryDate: '2025-08-30',
    estimatedDaysToExpiry: 11,
    // Sin empaquetado
    packagedUnits: 0,
    weightPerPackage: 1,
    packagedExpiryDays: 0,
    nearExpiryPackages: 0,
    entryDate: '2025-08-14',
    state: 'fresco',
    lastUpdated: '2025-08-19'
  },
  {
    id: 5,
    name: 'Langostinos',
    container: 'Congelador 1',
    category: 'Mariscos',
    unit: 'kg',
    quantity: 6, // Stock Total: 6kg
    price: 35.00, // PRECIO ESTIMADO
    realPrice: 38.00, // PRECIO REAL
    minStock: 4,
    supplier: 'Mariscos Premium',
    expiryDate: '2025-08-21',
    estimatedDaysToExpiry: 2,
    // Empaquetado gastronómico
    packagedUnits: 2, // 2 empaquetados
    weightPerPackage: 1.5, // 1.5kg cada empaquetado = 3kg empaquetados
    packagedExpiryDays: 1, // Vencen mañana
    nearExpiryPackages: 2, // Los 2 empaquetados por vencer
    entryDate: '2025-08-15',
    state: 'por-vencer',
    lastUpdated: '2025-08-19'
  },
  {
    id: 6,
    name: 'Aceite Vegetal',
    container: 'Almacén Seco',
    category: 'Insumos',
    unit: 'litro',
    quantity: 20, // Stock OK: 20L
    price: 4.20, // PRECIO ESTIMADO
    realPrice: 4.50, // PRECIO REAL
    minStock: 8,
    supplier: 'Distribuidora Central',
    expiryDate: '2025-12-17',
    estimatedDaysToExpiry: 120,
    // Empaquetado gastronómico
    packagedUnits: 4, // 4 empaquetados
    weightPerPackage: 2, // 2L cada empaquetado = 8L empaquetados
    packagedExpiryDays: 120, // No por vencer
    nearExpiryPackages: 0,
    entryDate: '2025-08-10',
    state: 'fresco',
    lastUpdated: '2025-08-19'
  },
  {
    id: 7,
    name: 'Limones',
    container: 'Frigider 1 - Causa',
    category: 'Condimentos',
    unit: 'kg',
    quantity: 8, // Stock Total: 8kg
    price: 2.80, // PRECIO ESTIMADO
    realPrice: 2.50, // PRECIO REAL
    minStock: 15,
    supplier: 'Cítricos del Norte',
    expiryDate: '2025-08-20',
    estimatedDaysToExpiry: 1,
    // Empaquetado gastronómico
    packagedUnits: 4, // 4 empaquetados
    weightPerPackage: 1, // 1kg cada empaquetado = 4kg empaquetados
    packagedExpiryDays: 0, // VENCIDOS HOY
    nearExpiryPackages: 4, // Todos los empaquetados vencidos
    entryDate: '2025-08-15',
    state: 'por-vencer',
    lastUpdated: '2025-08-19'
  },
  {
    id: 8,
    name: 'Cancha Serrana',
    container: 'Almacén Seco',
    category: 'Verduras',
    unit: 'kg',
    quantity: 12, // Stock Total: 12kg
    price: 4.50, // PRECIO ESTIMADO
    realPrice: 4.20, // PRECIO REAL
    minStock: 8,
    supplier: 'Granos Andinos',
    expiryDate: '2025-10-02',
    estimatedDaysToExpiry: 44,
    // Empaquetado gastronómico
    packagedUnits: 3, // 3 empaquetados
    weightPerPackage: 2, // 2kg cada empaquetado = 6kg empaquetados
    packagedExpiryDays: 44, // No por vencer
    nearExpiryPackages: 0,
    entryDate: '2025-08-12',
    state: 'fresco',
    lastUpdated: '2025-08-19'
  },
  {
    id: 9,
    name: 'Camarones',
    container: 'Congelador 3',
    category: 'Mariscos',
    unit: 'kg',
    quantity: 20, // Stock Total: 20kg
    price: 42.00, // PRECIO ESTIMADO
    realPrice: 45.50, // PRECIO REAL
    minStock: 3,
    supplier: 'Mariscos Premium',
    expiryDate: '2025-09-15',
    estimatedDaysToExpiry: 27,
    // Empaquetado gastronómico
    packagedUnits: 6, // 6 empaquetados
    weightPerPackage: 2, // 2kg cada empaquetado = 12kg empaquetados
    packagedExpiryDays: 27, // Congelado, no por vencer
    nearExpiryPackages: 0,
    entryDate: '2025-08-18',
    state: 'congelado',
    lastUpdated: '2025-08-19'
  },
    {
    id: 10,
    name: 'Coca-Cola',
    container: 'Refri 1 - Bebidas',
    category: 'Mariscos',
    unit: 'kg',
    quantity: 20, // Stock Total: 20kg
    price: 42.00, // PRECIO ESTIMADO
    realPrice: 45.50, // PRECIO REAL
    minStock: 3,
    supplier: 'Coca-Cola S.A.',
    expiryDate: '2025-09-15',
    estimatedDaysToExpiry: 27,
    // Empaquetado gastronómico
    packagedUnits: 6, // 6 empaquetados
    weightPerPackage: 2, // 2kg cada empaquetado = 12kg empaquetados
    packagedExpiryDays: 27, // Congelado, no por vencer
    nearExpiryPackages: 0,
    entryDate: '2025-08-18',
    state: 'fresco',
    lastUpdated: '2025-08-19'
  },
  {
    id: 11,
    name: 'Ají Amarillo',
    container: 'Frigider 1 - Causa',
    category: 'Condimentos',
    unit: 'kg',
    quantity: 3, // Stock Total: 3kg
    price: 6.50, // PRECIO ESTIMADO
    realPrice: 7.00, // PRECIO REAL
    minStock: 5,
    supplier: 'Verduras San Juan',
    expiryDate: '2025-08-19',
    estimatedDaysToExpiry: 0,
    // Empaquetado gastronómico
    packagedUnits: 2, // 2 empaquetados
    weightPerPackage: 1, // 1kg cada empaquetado = 2kg empaquetados
    packagedExpiryDays: -1, // YA VENCIDOS
    nearExpiryPackages: 2, // Los 2 empaquetados vencidos
    entryDate: '2025-08-10',
    state: 'vencido',
    lastUpdated: '2025-08-19'
  }
];


// Función para calcular empaquetados por vencer según reglas gastronómicas
export const calculateNearExpiryPackages = (
  packagedUnits: number, 
  packagedExpiryDays: number, 
  state: string,
  category: string
): number => {
  if (packagedUnits === 0) return 0;
  if (state === 'congelado') return 0;
  
  // Reglas por categoría (según imagen 2)
  let maxDaysBeforeExpiry = 3; // Default
  
  switch (category.toLowerCase()) {
    case 'pescados':
      maxDaysBeforeExpiry = 2; // Pescado 10-12 días, considerar últimos 2 como "por vencer"
      break;
    case 'mariscos':
      maxDaysBeforeExpiry = 3; // Mariscos más delicados
      break;
    case 'verduras':
      maxDaysBeforeExpiry = 2;
      break;
    case 'condimentos':
      maxDaysBeforeExpiry = 1; // Condimentos frescos
      break;
    default:
      maxDaysBeforeExpiry = 3;
  }
  
  if (packagedExpiryDays <= maxDaysBeforeExpiry) {
    return packagedUnits; // Todos los empaquetados están por vencer
  }
  
  return 0;
};

// Función para formatear texto de empaquetados
export const formatPackagedText = (units: number, weightPerPackage: number): string => {
  if (units === 0) return "0 emp.";
  const totalWeight = units * weightPerPackage;
  return `${units} emp. (${totalWeight}kg)`;
};

// Función para obtener productos recomendados según el tipo de contenedor
export const getRecommendedProducts = (containerType: string): InventoryProduct[] => {
  return mockInventoryProducts.filter(product => 
    product.recommendedContainerTypes.includes(containerType)
  );
};

// Función para buscar productos por categoría
export const getProductsByCategory = (category: string): InventoryProduct[] => {
  return mockInventoryProducts.filter(product => 
    product.category.toLowerCase().includes(category.toLowerCase())
  );
};

// Función para buscar productos por nombre
export const searchProducts = (searchTerm: string): InventoryProduct[] => {
  const term = searchTerm.toLowerCase();
  return mockInventoryProducts.filter(product => 
    product.name.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term)
  );
};

// Función para obtener todas las categorías
export const getCategories = (): string[] => {
  const categories = mockInventoryProducts.map(product => product.category);
  return [...new Set(categories)].sort();
};

// Función para obtener productos por contenedor específico
export const getProductsByContainer = (containerName: string): InventoryProduct[] => {
  const containerMapping: { [key: string]: string[] } = {
    'Frigider 2 - Pescado': ['Pescados'],
    'Congelador 2': ['Mariscos'],
    'Frigider 3 - Yuca': ['Verduras'],
    'Frigider 4 - Mariscos': ['Condimentos'],
    'Congelador 1': ['Mariscos'],
    'Almacén Seco': ['Insumos', 'Verduras'],
    'Frigider 1 - Causa': ['Condimentos'],
    'Congelador 3': ['Mariscos']
  };

  const categories = containerMapping[containerName] || [];
  return mockInventoryProducts.filter(product => 
    categories.some(category => 
      product.category.toLowerCase().includes(category.toLowerCase())
    )
  );
};