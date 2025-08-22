// src/features/containers/data/mockProductData.ts

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
  // Pescados
  {
    id: '1',
    name: 'Lenguado Filetes',
    category: 'Pescado',
    basePrice: 28.50,
    unit: 'kg',
    description: 'Filetes frescos de lenguado',
    isPerishable: true,
    recommendedContainerTypes: ['frigider'],
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '10',
    name: 'Corvina Entera',
    category: 'Pescado',
    basePrice: 22.00,
    unit: 'kg',
    description: 'Corvina fresca entera',
    isPerishable: true,
    recommendedContainerTypes: ['frigider'],
    createdAt: new Date('2024-01-02'),
  },
  {
    id: '14',
    name: 'Merluza Congelada',
    category: 'Pescado',
    basePrice: 12.80,
    unit: 'kg',
    description: 'Merluza congelada en bloques',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-03'),
  },

  // Mariscos
  {
    id: '2',
    name: 'Pulpo',
    category: 'Mariscos',
    basePrice: 45.00,
    unit: 'kg',
    description: 'Pulpo fresco del norte',
    isPerishable: true,
    recommendedContainerTypes: ['frigider', 'congelador'],
    createdAt: new Date('2024-01-04'),
  },
  {
    id: '5',
    name: 'Langostinos',
    category: 'Mariscos',
    basePrice: 35.00,
    unit: 'kg',
    description: 'Langostinos frescos grandes',
    isPerishable: true,
    recommendedContainerTypes: ['frigider', 'congelador'],
    createdAt: new Date('2024-01-05'),
  },
  {
    id: '9',
    name: 'Camarones',
    category: 'Mariscos',
    basePrice: 42.00,
    unit: 'kg',
    description: 'Camarones medianos frescos',
    isPerishable: true,
    recommendedContainerTypes: ['frigider', 'congelador'],
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
    recommendedContainerTypes: ['frigider'],
    createdAt: new Date('2024-01-07'),
  },
  {
    id: '13',
    name: 'Pota Congelada',
    category: 'Mariscos',
    basePrice: 18.50,
    unit: 'kg',
    description: 'Pota congelada en bloques',
    isPerishable: true,
    recommendedContainerTypes: ['congelador'],
    createdAt: new Date('2024-01-08'),
  },

  // Tubérculos
  {
    id: '3',
    name: 'Yuca',
    category: 'Tubérculos',
    basePrice: 3.50,
    unit: 'kg',
    description: 'Yuca fresca pelada',
    isPerishable: true,
    recommendedContainerTypes: ['frigider', 'almacen-seco'],
    createdAt: new Date('2024-01-09'),
  },
  {
    id: '8',
    name: 'Papas',
    category: 'Tubérculos',
    basePrice: 1.50,
    unit: 'kg',
    description: 'Papas amarillas peruanas',
    isPerishable: true,
    recommendedContainerTypes: ['frigider', 'almacen-seco'],
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '11',
    name: 'Camotes',
    category: 'Tubérculos',
    basePrice: 2.80,
    unit: 'kg',
    description: 'Camotes frescos naranjas',
    isPerishable: true,
    recommendedContainerTypes: ['frigider', 'almacen-seco'],
    createdAt: new Date('2024-01-11'),
  },

  // Aceites y líquidos
  {
    id: '6',
    name: 'Aceite Vegetal',
    category: 'Aceites',
    basePrice: 4.20,
    unit: 'litros',
    description: 'Aceite vegetal para cocina',
    isPerishable: false,
    recommendedContainerTypes: ['almacen-seco'],
    createdAt: new Date('2024-01-12'),
  },

  // Cítricos y frutas
  {
    id: '7',
    name: 'Limones',
    category: 'Cítricos',
    basePrice: 2.80,
    unit: 'kg',
    description: 'Limones frescos peruanos',
    isPerishable: true,
    recommendedContainerTypes: ['frigider', 'almacen-seco'],
    createdAt: new Date('2024-01-13'),
  },
  {
    id: '16',
    name: 'Aguacates',
    category: 'Frutas',
    basePrice: 4.20,
    unit: 'kg',
    description: 'Aguacates frescos Hass',
    isPerishable: true,
    recommendedContainerTypes: ['frigider'],
    createdAt: new Date('2024-01-14'),
  },

  // Granos y cereales
  {
    id: '15',
    name: 'Arroz Blanco',
    category: 'Granos',
    basePrice: 3.80,
    unit: 'kg',
    description: 'Arroz blanco de grano largo',
    isPerishable: false,
    recommendedContainerTypes: ['almacen-seco'],
    createdAt: new Date('2024-01-15'),
  },

  // Productos adicionales comunes
  {
    id: '17',
    name: 'Cebolla Roja',
    category: 'Vegetales',
    basePrice: 2.50,
    unit: 'kg',
    description: 'Cebolla roja fresca',
    isPerishable: true,
    recommendedContainerTypes: ['almacen-seco', 'frigider'],
    createdAt: new Date('2024-01-16'),
  },
  {
    id: '18',
    name: 'Ajo',
    category: 'Vegetales',
    basePrice: 8.00,
    unit: 'kg',
    description: 'Ajo fresco nacional',
    isPerishable: true,
    recommendedContainerTypes: ['almacen-seco', 'frigider'],
    createdAt: new Date('2024-01-17'),
  },
  {
    id: '19',
    name: 'Tomates',
    category: 'Vegetales',
    basePrice: 3.20,
    unit: 'kg',
    description: 'Tomates frescos rojos',
    isPerishable: true,
    recommendedContainerTypes: ['frigider'],
    createdAt: new Date('2024-01-18'),
  },
  {
    id: '20',
    name: 'Sal Marina',
    category: 'Condimentos',
    basePrice: 1.50,
    unit: 'kg',
    description: 'Sal marina refinada',
    isPerishable: false,
    recommendedContainerTypes: ['almacen-seco'],
    createdAt: new Date('2024-01-19'),
  },
  {
    id: '21',
    name: 'Azúcar Blanca',
    category: 'Endulzantes',
    basePrice: 2.80,
    unit: 'kg',
    description: 'Azúcar blanca refinada',
    isPerishable: false,
    recommendedContainerTypes: ['almacen-seco'],
    createdAt: new Date('2024-01-20'),
  },
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