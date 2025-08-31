// components/data/mockData.ts - DATOS CORREGIDOS CON CAUSA ESPECÍFICA

// Define Product type here since it's not exported from "../../types"
export interface Product {
  id: number;
  name: string;
  container: string;
  category: string;
  unit: string;
  quantity: number;
  price: number;
  realPrice: number;
  minStock: number;
  supplier: string;
  expiryDate: string;
  estimatedDaysToExpiry: number;
  packagedUnits: number;
  weightPerPackage: number;
  packagedExpiryDays: number;
  nearExpiryPackages: number;
  entryDate: string;
  state: string;
  lastUpdated: string;
}

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

// Productos base del inventario (catálogo completo) - CORREGIDO
export const mockInventoryProducts: InventoryProduct[] = [
  // PESCADOS - Congelador 1
  {
    id: '1',
    name: 'Lenguado Filetes',
    category: 'Pescados',
    basePrice: 28.50,
    unit: 'kg',
    description: 'Filetes frescos de lenguado para ceviche y jalea',
    minStock: 5,
    isPerishable: true,
    recommendedContainerTypes: ['Congelador 1 - Pescado'],
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
    recommendedContainerTypes: ['Congelador 1 - Pescado'],
    createdAt: new Date('2024-01-02'),
  },

  // MARISCOS - Congelador 2
  {
    id: '2',
    name: 'Pulpo',
    category: 'Mariscos',
    basePrice: 45.00,
    unit: 'kg',
    description: 'Pulpo fresco del norte, duración 1 mes congelado',
    minStock: 3,
    isPerishable: true,
    recommendedContainerTypes: ['Congelador 2 - Mariscos'],
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
    recommendedContainerTypes: ['Congelador 2 - Mariscos'],
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
    recommendedContainerTypes: ['Congelador 2 - Mariscos'],
    createdAt: new Date('2024-01-06'),
  },
  {
    id: '12',
    name: 'Conchas de Abanico',
    category: 'Mariscos',
    basePrice: 38.00,
    unit: 'kg',
    description: 'Conchas de abanico frescas',
    minStock: 2,
    isPerishable: true,
    recommendedContainerTypes: ['Congelador 2 - Mariscos'],
    createdAt: new Date('2024-01-07'),
  },

  // CAUSA - Congelador 3 (PLATO PERUANO PREPARADO)
  {
    id: '60',
    name: 'Causa',
    category: 'Causa',
    basePrice: 8.00,
    unit: 'porciones',
    description: 'Causa peruana preparada lista para servir',
    minStock: 10,
    isPerishable: true,
    recommendedContainerTypes: ['Congelador 3 - Causa'],
    createdAt: new Date('2024-01-30'),
  },

  // TUBÉRCULOS - Congelador 4 (Verduras)
  {
    id: '17',
    name: 'Papas Amarillas',
    category: 'Tubérculos',
    basePrice: 1.50,
    unit: 'kg',
    description: 'Papas amarillas peruanas para preparaciones',
    minStock: 10,
    isPerishable: true,
    recommendedContainerTypes: ['Congelador 4 - Verduras'],
    createdAt: new Date('2024-01-17'),
  },
  {
    id: '3',
    name: 'Yuca',
    category: 'Tubérculos',
    basePrice: 3.50,
    unit: 'kg',
    description: 'Yuca fresca pelada, se compra los jueves y se divide en bolsas de 1kg',
    minStock: 10,
    isPerishable: true,
    recommendedContainerTypes: ['Congelador 4 - Verduras'],
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '11',
    name: 'Camotes',
    category: 'Tubérculos',
    basePrice: 2.80,
    unit: 'kg',
    description: 'Camotes frescos naranjas',
    minStock: 8,
    isPerishable: true,
    recommendedContainerTypes: ['Congelador 4 - Verduras'],
    createdAt: new Date('2024-01-22'),
  },

  // CÍTRICOS - Congelador 4 (Verduras)
  {
    id: '7',
    name: 'Limones',
    category: 'Cítricos',
    basePrice: 2.80,
    unit: 'kg',
    description: 'Limones frescos para preparaciones',
    minStock: 15,
    isPerishable: true,
    recommendedContainerTypes: ['Congelador 4 - Verduras'],
    createdAt: new Date('2024-01-18'),
  },

  // CONDIMENTOS - Congelador 4 (Verduras)
  {
    id: '22',
    name: 'Ají Amarillo',
    category: 'Condimentos',
    basePrice: 6.50,
    unit: 'kg',
    description: 'Ají amarillo fresco para aderezos',
    minStock: 5,
    isPerishable: true,
    recommendedContainerTypes: ['Congelador 4 - Verduras'],
    createdAt: new Date('2024-01-19'),
  },
  {
    id: '4',
    name: 'Rocoto',
    category: 'Condimentos',
    basePrice: 8.00,
    unit: 'kg',
    description: 'Rocoto rojo fresco para rocoto relleno',
    minStock: 2,
    isPerishable: true,
    recommendedContainerTypes: ['Congelador 4 - Verduras'],
    createdAt: new Date('2024-01-25'),
  },

  // VERDURAS - Congelador 4
  {
    id: '16',
    name: 'Tomates',
    category: 'Verduras',
    basePrice: 3.20,
    unit: 'kg',
    description: 'Tomates frescos rojos para ensaladas y salsas',
    minStock: 5,
    isPerishable: true,
    recommendedContainerTypes: ['Congelador 4 - Verduras'],
    createdAt: new Date('2024-01-21'),
  },
  {
    id: '24',
    name: 'Cebolla',
    category: 'Verduras',
    basePrice: 2.50,
    unit: 'kg',
    description: 'Cebolla roja fresca',
    minStock: 8,
    isPerishable: true,
    recommendedContainerTypes: ['Congelador 4 - Verduras'],
    createdAt: new Date('2024-01-24'),
  },

  // BEBIDAS - Refrigerador 5 (Gaseosas)
  {
    id: '40',
    name: 'Inca Kola',
    category: 'Bebidas',
    basePrice: 2.50,
    unit: 'unidades',
    description: 'Gaseosa Inca Kola 500ml',
    minStock: 24,
    isPerishable: false,
    recommendedContainerTypes: ['Refrigerador 5 - Gaseosas'],
    createdAt: new Date('2024-01-28'),
  },
  {
    id: '41',
    name: 'Coca Cola',
    category: 'Bebidas',
    basePrice: 2.80,
    unit: 'unidades',
    description: 'Gaseosa Coca Cola 500ml',
    minStock: 24,
    isPerishable: false,
    recommendedContainerTypes: ['Refrigerador 5 - Gaseosas'],
    createdAt: new Date('2024-01-29'),
  },
  {
    id: '42',
    name: 'Sprite',
    category: 'Bebidas',
    basePrice: 2.70,
    unit: 'unidades',
    description: 'Gaseosa Sprite 500ml',
    minStock: 24,
    isPerishable: false,
    recommendedContainerTypes: ['Refrigerador 5 - Gaseosas'],
    createdAt: new Date('2024-01-30'),
  },

  // BEBIDAS ALCOHÓLICAS - Refrigerador 6 (Cervezas)
  {
    id: '44',
    name: 'Cerveza Pilsen',
    category: 'Bebidas Alcohólicas',
    basePrice: 3.80,
    unit: 'unidades',
    description: 'Cerveza Pilsen 330ml',
    minStock: 24,
    isPerishable: false,
    recommendedContainerTypes: ['Refrigerador 6 - Cervezas'],
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '45',
    name: 'Cerveza Cristal',
    category: 'Bebidas Alcohólicas',
    basePrice: 3.60,
    unit: 'unidades',
    description: 'Cerveza Cristal 330ml',
    minStock: 24,
    isPerishable: false,
    recommendedContainerTypes: ['Refrigerador 6 - Cervezas'],
    createdAt: new Date('2024-02-02'),
  },
  {
    id: '47',
    name: 'Vino Tinto',
    category: 'Bebidas Alcohólicas',
    basePrice: 12.00,
    unit: 'botellas',
    description: 'Vino tinto para cocina',
    minStock: 6,
    isPerishable: false,
    recommendedContainerTypes: ['Almacén Seco'],
    createdAt: new Date('2024-02-12'),
  },

  // ACEITES - Almacén Seco
  {
    id: '6',
    name: 'Aceite Vegetal',
    category: 'Aceites',
    basePrice: 4.20,
    unit: 'litros',
    description: 'Aceite vegetal para cocina - uso extremo controlado',
    minStock: 8,
    isPerishable: false,
    recommendedContainerTypes: ['Almacén Seco'],
    createdAt: new Date('2024-02-03'),
  },

  // GRANOS - Almacén Seco
  {
    id: '8',
    name: 'Cancha Serrana',
    category: 'Granos',
    basePrice: 4.50,
    unit: 'kg',
    description: 'Cancha serrana - mezcla de diente de burro, cacho y blanca',
    minStock: 8,
    isPerishable: false,
    recommendedContainerTypes: ['Almacén Seco'],
    createdAt: new Date('2024-02-04'),
  },
  {
    id: '26',
    name: 'Arroz Blanco',
    category: 'Granos',
    basePrice: 3.80,
    unit: 'kg',
    description: 'Arroz blanco de grano largo',
    minStock: 15,
    isPerishable: false,
    recommendedContainerTypes: ['Almacén Seco'],
    createdAt: new Date('2024-02-05'),
  },

  // HARINAS - Almacén Seco
  {
    id: '27',
    name: 'Harina',
    category: 'Harinas',
    basePrice: 2.20,
    unit: 'kg',
    description: 'Harina de trigo para preparaciones',
    minStock: 10,
    isPerishable: false,
    recommendedContainerTypes: ['Almacén Seco'],
    createdAt: new Date('2024-02-06'),
  },

  // SUMINISTROS - Almacén Seco
  {
    id: '48',
    name: 'Papel Higiénico',
    category: 'Suministros',
    basePrice: 1.80,
    unit: 'rollos',
    description: 'Papel higiénico',
    minStock: 12,
    isPerishable: false,
    recommendedContainerTypes: ['Almacén Seco'],
    createdAt: new Date('2024-02-13'),
  },
  {
    id: '51',
    name: 'Bolsas Plásticas',
    category: 'Suministros',
    basePrice: 2.50,
    unit: 'paquetes',
    description: 'Bolsas plásticas para alimentos',
    minStock: 5,
    isPerishable: false,
    recommendedContainerTypes: ['Almacén Seco'],
    createdAt: new Date('2024-02-16'),
  },

  // LIMPIEZA - Almacén Seco
  {
    id: '49',
    name: 'Detergente',
    category: 'Limpieza',
    basePrice: 5.50,
    unit: 'litros',
    description: 'Detergente para limpieza',
    minStock: 3,
    isPerishable: false,
    recommendedContainerTypes: ['Almacén Seco'],
    createdAt: new Date('2024-02-14'),
  },
  {
    id: '50',
    name: 'Lejía',
    category: 'Limpieza',
    basePrice: 3.00,
    unit: 'litros',
    description: 'Lejía desinfectante',
    minStock: 3,
    isPerishable: false,
    recommendedContainerTypes: ['Almacén Seco'],
    createdAt: new Date('2024-02-15'),
  }
];

// Productos activos en el inventario (con stock y estado actual) - CORREGIDO
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Lenguado Filetes',
    container: 'Congelador 1 - Pescado',
    category: 'Pescados',
    unit: 'kg',
    quantity: 8,
    price: 28.50,
    realPrice: 30.00,
    minStock: 5,
    supplier: 'Mercado Pesquero Central',
    expiryDate: '2025-08-23',
    estimatedDaysToExpiry: 4,
    packagedUnits: 3,
    weightPerPackage: 2,
    packagedExpiryDays: 2,
    nearExpiryPackages: 3,
    entryDate: '2025-08-16',
    state: 'fresco',
    lastUpdated: '2025-08-19'
  },
  {
    id: 2,
    name: 'Pulpo',
    container: 'Congelador 2 - Mariscos',
    category: 'Mariscos',
    unit: 'kg',
    quantity: 12,
    price: 45.00,
    realPrice: 48.50,
    minStock: 3,
    supplier: 'Mariscos del Sur',
    expiryDate: '2025-09-13',
    estimatedDaysToExpiry: 25,
    packagedUnits: 2,
    weightPerPackage: 2,
    packagedExpiryDays: 25,
    nearExpiryPackages: 0,
    entryDate: '2025-08-14',
    state: 'congelado',
    lastUpdated: '2025-08-19'
  },
  {
    id: 3,
    name: 'Causa',
    container: 'Congelador 3 - Causa',
    category: 'Causa',
    unit: 'porciones',
    quantity: 20,
    price: 8.00,
    realPrice: 8.50,
    minStock: 10,
    supplier: 'Cocina Interna',
    expiryDate: '2025-08-22',
    estimatedDaysToExpiry: 3,
    packagedUnits: 4,
    weightPerPackage: 5,
    packagedExpiryDays: 3,
    nearExpiryPackages: 0,
    entryDate: '2025-08-17',
    state: 'fresco',
    lastUpdated: '2025-08-19'
  },
  {
    id: 4,
    name: 'Inca Kola',
    container: 'Refrigerador 5 - Gaseosas',
    category: 'Bebidas',
    unit: 'unidades',
    quantity: 48,
    price: 2.50,
    realPrice: 2.30,
    minStock: 24,
    supplier: 'Distribuidora Inca Kola',
    expiryDate: '2025-12-15',
    estimatedDaysToExpiry: 118,
    packagedUnits: 2,
    weightPerPackage: 24,
    packagedExpiryDays: 118,
    nearExpiryPackages: 0,
    entryDate: '2025-08-18',
    state: 'fresco',
    lastUpdated: '2025-08-19'
  },
  {
    id: 5,
    name: 'Cerveza Pilsen',
    container: 'Refrigerador 6 - Cervezas',
    category: 'Bebidas Alcohólicas',
    unit: 'unidades',
    quantity: 36,
    price: 3.80,
    realPrice: 3.50,
    minStock: 24,
    supplier: 'Distribuidora SAB Miller',
    expiryDate: '2025-12-31',
    estimatedDaysToExpiry: 134,
    packagedUnits: 3,
    weightPerPackage: 12,
    packagedExpiryDays: 134,
    nearExpiryPackages: 0,
    entryDate: '2025-08-18',
    state: 'fresco',
    lastUpdated: '2025-08-19'
  },
  {
    id: 6,
    name: 'Papas Amarillas',
    container: 'Congelador 4 - Verduras',
    category: 'Tubérculos',
    unit: 'kg',
    quantity: 12,
    price: 1.50,
    realPrice: 1.40,
    minStock: 10,
    supplier: 'Distribuidora Los Andes',
    expiryDate: '2025-09-02',
    estimatedDaysToExpiry: 14,
    packagedUnits: 3,
    weightPerPackage: 4,
    packagedExpiryDays: 14,
    nearExpiryPackages: 0,
    entryDate: '2025-08-14',
    state: 'fresco',
    lastUpdated: '2025-08-19'
  },
  {
    id: 7,
    name: 'Yuca',
    container: 'Congelador 4 - Verduras',
    category: 'Tubérculos',
    unit: 'kg',
    quantity: 15,
    price: 3.50,
    realPrice: 3.20,
    minStock: 10,
    supplier: 'Distribuidora Los Andes',
    expiryDate: '2025-08-26',
    estimatedDaysToExpiry: 7,
    packagedUnits: 5,
    weightPerPackage: 1,
    packagedExpiryDays: 3,
    nearExpiryPackages: 2,
    entryDate: '2025-08-15',
    state: 'fresco',
    lastUpdated: '2025-08-19'
  },
  {
    id: 8,
    name: 'Limones',
    container: 'Congelador 4 - Verduras',
    category: 'Cítricos',
    unit: 'kg',
    quantity: 8,
    price: 2.80,
    realPrice: 2.50,
    minStock: 15,
    supplier: 'Cítricos del Norte',
    expiryDate: '2025-08-20',
    estimatedDaysToExpiry: 1,
    packagedUnits: 4,
    weightPerPackage: 1,
    packagedExpiryDays: 0,
    nearExpiryPackages: 4,
    entryDate: '2025-08-15',
    state: 'por-vencer',
    lastUpdated: '2025-08-19'
  },
  {
    id: 9,
    name: 'Aceite Vegetal',
    container: 'Almacén Seco',
    category: 'Aceites',
    unit: 'litros',
    quantity: 20,
    price: 4.20,
    realPrice: 4.50,
    minStock: 8,
    supplier: 'Distribuidora Central',
    expiryDate: '2026-02-15',
    estimatedDaysToExpiry: 180,
    packagedUnits: 4,
    weightPerPackage: 5,
    packagedExpiryDays: 180,
    nearExpiryPackages: 0,
    entryDate: '2025-08-10',
    state: 'fresco',
    lastUpdated: '2025-08-19'
  },
  {
    id: 10,
    name: 'Arroz Blanco',
    container: 'Almacén Seco',
    category: 'Granos',
    unit: 'kg',
    quantity: 25,
    price: 3.80,
    realPrice: 3.60,
    minStock: 15,
    supplier: 'Granos del Sur',
    expiryDate: '2026-06-30',
    estimatedDaysToExpiry: 315,
    packagedUnits: 5,
    weightPerPackage: 5,
    packagedExpiryDays: 315,
    nearExpiryPackages: 0,
    entryDate: '2025-08-08',
    state: 'fresco',
    lastUpdated: '2025-08-19'
  },
  {
    id: 11,
    name: 'Ají Amarillo',
    container: 'Congelador 4 - Verduras',
    category: 'Condimentos',
    unit: 'kg',
    quantity: 3,
    price: 6.50,
    realPrice: 7.00,
    minStock: 5,
    supplier: 'Verduras San Juan',
    expiryDate: '2025-08-19',
    estimatedDaysToExpiry: 0,
    packagedUnits: 2,
    weightPerPackage: 1,
    packagedExpiryDays: -1,
    nearExpiryPackages: 2,
    entryDate: '2025-08-10',
    state: 'vencido',
    lastUpdated: '2025-08-19'
  },
  {
    id: 12,
    name: 'Tomates',
    container: 'Congelador 4 - Verduras',
    category: 'Verduras',
    unit: 'kg',
    quantity: 5,
    price: 3.20,
    realPrice: 3.00,
    minStock: 5,
    supplier: 'Verduras del Valle',
    expiryDate: '2025-08-25',
    estimatedDaysToExpiry: 6,
    packagedUnits: 2,
    weightPerPackage: 2.5,
    packagedExpiryDays: 6,
    nearExpiryPackages: 0,
    entryDate: '2025-08-16',
    state: 'fresco',
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
  
  let maxDaysBeforeExpiry = 3;
  
  switch (category.toLowerCase()) {
    case 'pescados':
      maxDaysBeforeExpiry = 2;
      break;
    case 'mariscos':
      maxDaysBeforeExpiry = 3;
      break;
    case 'verduras':
    case 'tubérculos':
      maxDaysBeforeExpiry = 2;
      break;
    case 'condimentos':
    case 'cítricos':
      maxDaysBeforeExpiry = 1;
      break;
    case 'causa':
      maxDaysBeforeExpiry = 2;
      break;
    default:
      maxDaysBeforeExpiry = 3;
  }
  
  if (packagedExpiryDays <= maxDaysBeforeExpiry) {
    return packagedUnits;
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

// Función para obtener todos los contenedores - CORREGIDO
export const getContainers = (): string[] => {
  return [
    'Congelador 1 - Pescado',
    'Congelador 2 - Mariscos', 
    'Congelador 3 - Causa',
    'Congelador 4 - Verduras',
    'Refrigerador 5 - Gaseosas',
    'Refrigerador 6 - Cervezas',
    'Almacén Seco'
  ];
};

// Función para obtener productos por contenedor específico - CORREGIDO
export const getProductsByContainer = (containerName: string): InventoryProduct[] => {
  const containerMapping: { [key: string]: string[] } = {
    'Congelador 1 - Pescado': ['Pescados'],
    'Congelador 2 - Mariscos': ['Mariscos'], 
    'Congelador 3 - Causa': ['Causa'],
    'Congelador 4 - Verduras': ['Verduras', 'Tubérculos', 'Cítricos', 'Condimentos'],
    'Refrigerador 5 - Gaseosas': ['Bebidas'],
    'Refrigerador 6 - Cervezas': ['Bebidas Alcohólicas'],
    'Almacén Seco': ['Aceites', 'Granos', 'Harinas', 'Lácteos', 'Proteínas', 'Pastas', 'Suministros', 'Limpieza']
  };

  const categories = containerMapping[containerName] || [];
  return mockInventoryProducts.filter(product => 
    categories.some(category => 
      product.category.toLowerCase().includes(category.toLowerCase())
    )
  );
};