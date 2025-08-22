// components/data/mockData.ts - DATOS DE EJEMPLO CON SISTEMA DE EMPAQUETADO GASTRONÓMICO + PRECIO REAL

import type { Product } from "../../types";

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