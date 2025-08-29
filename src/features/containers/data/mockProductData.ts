// src/features/containers/data/mockProductData.ts - PRODUCTOS ACTUALIZADOS CON NUEVA ESTRUCTURA

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

export const mockInventoryProducts: InventoryProduct[] = [
  // PESCADOS - Congelador 1
  {
    id: '1',
    name: 'Lenguado Filetes',
    category: 'Pescado',
    basePrice: 28.50,
    unit: 'kg',
    description: 'Filetes frescos de lenguado para ceviche y jalea',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '10',
    name: 'Corvina Entera',
    category: 'Pescado',
    basePrice: 22.00,
    unit: 'kg',
    description: 'Corvina fresca entera para diversos platos',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-02'),
  },
  {
    id: '18',
    name: 'Merluza Congelada',
    category: 'Pescado',
    basePrice: 12.80,
    unit: 'kg',
    description: 'Merluza congelada en bloques',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-03'),
  },

  // MARISCOS - Congelador 2
  {
    id: '2',
    name: 'Pulpo',
    category: 'Mariscos',
    basePrice: 45.00,
    unit: 'kg',
    description: 'Pulpo fresco del norte, duración 1 mes congelado',
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
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-06'),
  },
  {
    id: '12',
    name: 'Conchas de Abanico',
    category: 'Mariscos',
    basePrice: 38.00,
    unit: 'kg',
    description: 'Conchas de abanico frescas',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-07'),
  },
  {
    id: '19',
    name: 'Pota Congelada',
    category: 'Mariscos',
    basePrice: 18.50,
    unit: 'kg',
    description: 'Pota congelada en bloques',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-08'),
  },
  {
    id: '20',
    name: 'Cangrejo',
    category: 'Mariscos',
    basePrice: 25.00,
    unit: 'kg',
    description: 'Cangrejo fresco, refrigeración 1 semana',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-09'),
  },
  {
    id: '21',
    name: 'Almejas',
    category: 'Mariscos',
    basePrice: 15.00,
    unit: 'kg',
    description: 'Almejas frescas del mar',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '34',
    name: 'Pata de Mula',
    category: 'Mariscos',
    basePrice: 20.00,
    unit: 'kg',
    description: 'Pata de mula para picante',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-11'),
  },
  {
    id: '35',
    name: 'Pata de Cabra',
    category: 'Mariscos',
    basePrice: 18.00,
    unit: 'kg',
    description: 'Pata de cabra fresca',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-12'),
  },
  {
    id: '36',
    name: 'Zapato',
    category: 'Mariscos',
    basePrice: 22.00,
    unit: 'kg',
    description: 'Zapato (molusco marino)',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-13'),
  },
  {
    id: '37',
    name: 'Langostas',
    category: 'Mariscos',
    basePrice: 55.00,
    unit: 'kg',
    description: 'Langostas frescas',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-14'),
  },
  {
    id: '38',
    name: 'Maruchas',
    category: 'Mariscos',
    basePrice: 30.00,
    unit: 'kg',
    description: 'Maruchas frescas',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '39',
    name: 'Caracoles',
    category: 'Mariscos',
    basePrice: 16.00,
    unit: 'kg',
    description: 'Caracoles marinos',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-16'),
  },

  // CAUSAS - Congelador 3
  {
    id: '17',
    name: 'Papas Amarillas',
    category: 'Tubérculos',
    basePrice: 1.50,
    unit: 'kg',
    description: 'Papas amarillas peruanas para causa',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-17'),
  },
  {
    id: '7',
    name: 'Limones',
    category: 'Cítricos',
    basePrice: 2.80,
    unit: 'kg',
    description: 'Limones frescos para ceviche y causa',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-18'),
  },
  {
    id: '22',
    name: 'Ají Amarillo',
    category: 'Condimentos',
    basePrice: 6.50,
    unit: 'kg',
    description: 'Ají amarillo fresco para causa y aderezos',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-19'),
  },

  // VERDURAS Y TUBÉRCULOS - Congelador 4
  {
    id: '3',
    name: 'Yuca',
    category: 'Tubérculos',
    basePrice: 3.50,
    unit: 'kg',
    description: 'Yuca fresca pelada, se compra los jueves y se divide en bolsas de 1kg',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '16',
    name: 'Tomates',
    category: 'Verduras',
    basePrice: 3.20,
    unit: 'kg',
    description: 'Tomates frescos rojos para ensaladas y salsas',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-21'),
  },
  {
    id: '11',
    name: 'Camotes',
    category: 'Tubérculos',
    basePrice: 2.80,
    unit: 'kg',
    description: 'Camotes frescos naranjas',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-22'),
  },
  {
    id: '23',
    name: 'Choclo',
    category: 'Verduras',
    basePrice: 4.00,
    unit: 'kg',
    description: 'Choclo fresco desgranado',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-23'),
  },
  {
    id: '24',
    name: 'Cebolla',
    category: 'Verduras',
    basePrice: 2.50,
    unit: 'kg',
    description: 'Cebolla roja fresca',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-24'),
  },
  {
    id: '4',
    name: 'Rocoto',
    category: 'Condimentos',
    basePrice: 8.00,
    unit: 'kg',
    description: 'Rocoto rojo fresco para rocoto relleno',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-25'),
  },
  {
    id: '29',
    name: 'Apio',
    category: 'Verduras',
    basePrice: 3.00,
    unit: 'kg',
    description: 'Apio fresco para preparaciones',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-26'),
  },
  {
    id: '30',
    name: 'Ajos',
    category: 'Condimentos',
    basePrice: 8.00,
    unit: 'kg',
    description: 'Ajo fresco nacional',
    isPerishable: true,
    recommendedContainerTypes: ['congelador', 'almacen-seco'],
    createdAt: new Date('2024-01-27'),
  },

  // GASEOSAS - Refrigerador 5
  {
    id: '40',
    name: 'Inca Kola',
    category: 'Bebidas',
    basePrice: 2.50,
    unit: 'unidades',
    description: 'Gaseosa Inca Kola 500ml',
    isPerishable: false,
    recommendedContainerTypes: ['frigider'],
    createdAt: new Date('2024-01-28'),
  },
  {
    id: '41',
    name: 'Coca Cola',
    category: 'Bebidas',
    basePrice: 2.80,
    unit: 'unidades',
    description: 'Gaseosa Coca Cola 500ml',
    isPerishable: false,
    recommendedContainerTypes: ['frigider'],
    createdAt: new Date('2024-01-29'),
  },
  {
    id: '42',
    name: 'Sprite',
    category: 'Bebidas',
    basePrice: 2.70,
    unit: 'unidades',
    description: 'Gaseosa Sprite 500ml',
    isPerishable: false,
    recommendedContainerTypes: ['frigider'],
    createdAt: new Date('2024-01-30'),
  },
  {
    id: '43',
    name: 'Guaraná',
    category: 'Bebidas',
    basePrice: 2.60,
    unit: 'unidades',
    description: 'Gaseosa Guaraná 500ml',
    isPerishable: false,
    recommendedContainerTypes: ['frigider'],
    createdAt: new Date('2024-01-31'),
  },

  // CERVEZAS - Refrigerador 6
  {
    id: '44',
    name: 'Cerveza Pilsen',
    category: 'Bebidas Alcohólicas',
    basePrice: 3.80,
    unit: 'unidades',
    description: 'Cerveza Pilsen 330ml',
    isPerishable: false,
    recommendedContainerTypes: ['frigider'],
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '45',
    name: 'Cerveza Cristal',
    category: 'Bebidas Alcohólicas',
    basePrice: 3.60,
    unit: 'unidades',
    description: 'Cerveza Cristal 330ml',
    isPerishable: false,
    recommendedContainerTypes: ['frigider'],
    createdAt: new Date('2024-02-02'),
  },

  // ALMACÉN SECO
  {
    id: '6',
    name: 'Aceite Vegetal',
    category: 'Aceites',
    basePrice: 4.20,
    unit: 'litros',
    description: 'Aceite vegetal para cocina - uso extremo controlado',
    isPerishable: false,
    recommendedContainerTypes: ['almacen-seco'],
    createdAt: new Date('2024-02-03'),
  },
  {
    id: '8',
    name: 'Cancha Serrana',
    category: 'Granos',
    basePrice: 4.50,
    unit: 'kg',
    description: 'Cancha serrana - mezcla de diente de burro, cacho y blanca',
    isPerishable: false,
    recommendedContainerTypes: ['almacen-seco'],
    createdAt: new Date('2024-02-04'),
  },
  {
    id: '26',
    name: 'Arroz Blanco',
    category: 'Granos',
    basePrice: 3.80,
    unit: 'kg',
    description: 'Arroz blanco de grano largo',
    isPerishable: false,
    recommendedContainerTypes: ['almacen-seco'],
    createdAt: new Date('2024-02-05'),
  },
  {
    id: '27',
    name: 'Harina',
    category: 'Harinas',
    basePrice: 2.20,
    unit: 'kg',
    description: 'Harina de trigo para preparaciones',
    isPerishable: false,
    recommendedContainerTypes: ['almacen-seco'],
    createdAt: new Date('2024-02-06'),
  },
  {
    id: '28',
    name: 'Sal Marina',
    category: 'Condimentos',
    basePrice: 1.50,
    unit: 'kg',
    description: 'Sal marina refinada',
    isPerishable: false,
    recommendedContainerTypes: ['almacen-seco'],
    createdAt: new Date('2024-02-07'),
  },
  {
    id: '31',
    name: 'Leche',
    category: 'Lácteos',
    basePrice: 4.50,
    unit: 'litros',
    description: 'Leche fresca entera',
    isPerishable: true,
    recommendedContainerTypes: ['frigider'],
    createdAt: new Date('2024-02-08'),
  },
  {
    id: '32',
    name: 'Huevos',
    category: 'Proteínas',
    basePrice: 6.00,
    unit: 'kg',
    description: 'Huevos frescos de gallina',
    isPerishable: true,
    recommendedContainerTypes: ['frigider'],
    createdAt: new Date('2024-02-09'),
  },
  {
    id: '33',
    name: 'Cremas',
    category: 'Lácteos',
    basePrice: 8.50,
    unit: 'litros',
    description: 'Crema de leche para preparaciones',
    isPerishable: true,
    recommendedContainerTypes: ['frigider'],
    createdAt: new Date('2024-02-10'),
  },
  {
    id: '46',
    name: 'Spaghetti',
    category: 'Pastas',
    basePrice: 3.20,
    unit: 'kg',
    description: 'Spaghetti para preparaciones',
    isPerishable: false,
    recommendedContainerTypes: ['almacen-seco'],
    createdAt: new Date('2024-02-11'),
  },
  {
    id: '47',
    name: 'Vino Tinto',
    category: 'Bebidas Alcohólicas',
    basePrice: 12.00,
    unit: 'botellas',
    description: 'Vino tinto para cocina',
    isPerishable: false,
    recommendedContainerTypes: ['almacen-seco'],
    createdAt: new Date('2024-02-12'),
  },

  // PRODUCTOS DE LIMPIEZA Y SUMINISTROS
  {
    id: '48',
    name: 'Papel Higiénico',
    category: 'Suministros',
    basePrice: 1.80,
    unit: 'rollos',
    description: 'Papel higiénico',
    isPerishable: false,
    recommendedContainerTypes: ['almacen-seco'],
    createdAt: new Date('2024-02-13'),
  },
  {
    id: '49',
    name: 'Detergente',
    category: 'Limpieza',
    basePrice: 5.50,
    unit: 'litros',
    description: 'Detergente para limpieza',
    isPerishable: false,
    recommendedContainerTypes: ['almacen-seco'],
    createdAt: new Date('2024-02-14'),
  },
  {
    id: '50',
    name: 'Lejía',
    category: 'Limpieza',
    basePrice: 3.00,
    unit: 'litros',
    description: 'Lejía desinfectante',
    isPerishable: false,
    recommendedContainerTypes: ['almacen-seco'],
    createdAt: new Date('2024-02-15'),
  },
  {
    id: '51',
    name: 'Bolsas Plásticas',
    category: 'Suministros',
    basePrice: 2.50,
    unit: 'paquetes',
    description: 'Bolsas plásticas para alimentos',
    isPerishable: false,
    recommendedContainerTypes: ['almacen-seco'],
    createdAt: new Date('2024-02-16'),
  },
  {
    id: '52',
    name: 'Envases',
    category: 'Suministros',
    basePrice: 4.00,
    unit: 'paquetes',
    description: 'Envases para delivery',
    isPerishable: false,
    recommendedContainerTypes: ['almacen-seco'],
    createdAt: new Date('2024-02-17'),
  }
];

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
    'Congelador 1 - Pescado': ['Pescado'],
    'Congelador 2 - Mariscos': ['Mariscos'],
    'Congelador 3 - Causas': ['Tubérculos', 'Cítricos', 'Condimentos'],
    'Congelador 4 - Verduras': ['Verduras', 'Tubérculos'],
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