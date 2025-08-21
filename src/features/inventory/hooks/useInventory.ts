// hooks/useInventory.ts - ACTUALIZADO CON DIVERSOS ESTADOS DE STOCK
import { useState } from "react";
import type { Product, NewProduct, ProductWithCalculatedData } from "../types";

export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Lenguado Filetes',
      category: 'Pescados',
      quantity: 4, // CAMBIADO: 4 ≤ 5 (minStock) = Stock Bajo
      unit: 'kg',
      price: 28.50,
      minStock: 5,
      supplier: 'Mercado Pesquero Central',
      expiryDate: '2025-08-23',
      estimatedDaysToExpiry: 4,
      entryDate: '2025-08-16',
      state: 'fresco',
      lastUpdated: '2025-08-19'
    },
    {
      id: 2,
      name: 'Pulpo',
      category: 'Mariscos',
      quantity: 8,
      unit: 'kg',
      price: 45.00,
      minStock: 3,
      supplier: 'Mariscos del Sur',
      expiryDate: '2025-09-13',
      estimatedDaysToExpiry: 25,
      entryDate: '2025-08-14',
      state: 'congelado',
      lastUpdated: '2025-08-19'
    },
    {
      id: 3,
      name: 'Yuca',
      category: 'Verduras',
      quantity: 10, // CAMBIADO: 12 ≤ 15 (10 × 1.5) = Reponer Pronto
      unit: 'bolsa',
      price: 3.50,
      minStock: 10,
      supplier: 'Distribuidora Los Andes',
      expiryDate: '2025-08-26',
      estimatedDaysToExpiry: 7,
      entryDate: '2025-08-15',
      state: 'fresco',
      lastUpdated: '2025-08-19'
    },
    {
      id: 4,
      name: 'Rocoto',
      category: 'Condimentos',
      quantity: 0, // CAMBIADO: 0 = Sin Stock
      unit: 'kg',
      price: 8.00,
      minStock: 2,
      supplier: 'Verduras San Juan',
      expiryDate: '2025-08-30',
      estimatedDaysToExpiry: 11,
      entryDate: '2025-08-14',
      state: 'fresco',
      lastUpdated: '2025-08-19'
    },
    {
      id: 5,
      name: 'Langostinos',
      category: 'Mariscos',
      quantity: 3, // CAMBIADO: 3 ≤ 4 (minStock) = Stock Bajo
      unit: 'kg',
      price: 35.00,
      minStock: 4,
      supplier: 'Mariscos Premium',
      expiryDate: '2025-08-21',
      estimatedDaysToExpiry: 2,
      entryDate: '2025-08-15',
      state: 'por-vencer',
      lastUpdated: '2025-08-19'
    },
    {
      id: 6,
      name: 'Aceite Vegetal',
      category: 'Insumos',
      quantity: 20, // Stock OK: 20 > 12 (8 × 1.5)
      unit: 'litro',
      price: 4.20,
      minStock: 8,
      supplier: 'Distribuidora Central',
      expiryDate: '2025-12-17',
      estimatedDaysToExpiry: 120,
      entryDate: '2025-08-10',
      state: 'fresco',
      lastUpdated: '2025-08-19'
    },
    {
      id: 7,
      name: 'Limones',
      category: 'Condimentos',
      quantity: 10, // CAMBIADO: 10 ≤ 22.5 (15 × 1.5) = Reponer Pronto
      unit: 'kg',
      price: 2.80,
      minStock: 15,
      supplier: 'Cítricos del Norte',
      expiryDate: '2025-08-20',
      estimatedDaysToExpiry: 1,
      entryDate: '2025-08-15',
      state: 'por-vencer',
      lastUpdated: '2025-08-19'
    },
    {
      id: 8,
      name: 'Cancha Serrana',
      category: 'Verduras',
      quantity: 6, // CAMBIADO: 6 ≤ 8 (minStock) = Stock Bajo
      unit: 'bolsa',
      price: 4.50,
      minStock: 8,
      supplier: 'Granos Andinos',
      expiryDate: '2025-10-02',
      estimatedDaysToExpiry: 44,
      entryDate: '2025-08-12',
      state: 'fresco',
      lastUpdated: '2025-08-19'
    },
    {
      id: 9,
      name: 'Camarones',
      category: 'Mariscos',
      quantity: 25, // Stock OK: 25 > 4.5 (3 × 1.5)
      unit: 'kg',
      price: 42.00,
      minStock: 3,
      supplier: 'Mariscos Premium',
      expiryDate: '2025-09-15',
      estimatedDaysToExpiry: 27,
      entryDate: '2025-08-18',
      state: 'congelado',
      lastUpdated: '2025-08-19'
    },
    {
      id: 10,
      name: 'Ají Amarillo',
      category: 'Condimentos',
      quantity: 1, // CAMBIADO: 1 ≤ 5 (minStock) = Stock Bajo
      unit: 'kg',
      price: 6.50,
      minStock: 5,
      supplier: 'Verduras San Juan',
      expiryDate: '2025-08-19',
      estimatedDaysToExpiry: 0, // VENCIDO HOY
      entryDate: '2025-08-10',
      state: 'vencido',
      lastUpdated: '2025-08-19'
    }
  ]);

  // Función para calcular el estado del stock - CORREGIDA
  const getStockStatus = (quantity: number, minStock: number): 'Sin Stock' | 'Stock Bajo' | 'Reponer Pronto' | 'Stock OK' => {
    if (quantity === 0) return 'Sin Stock';
    if (quantity <= minStock) return 'Stock Bajo';
    if (quantity <= minStock * 1.5) return 'Reponer Pronto';
    return 'Stock OK';
  };

  // Función para calcular el estado del producto basado en los días estimados
  const calculateProductState = (estimatedDays: number, currentState: string) => {
    if (currentState === 'congelado') return 'congelado';
    if (estimatedDays <= 0) return 'vencido';
    if (estimatedDays <= 3) return 'por-vencer';
    return 'fresco';
  };

  // Función para obtener productos con datos calculados
  const getProductsWithCalculatedData = (): ProductWithCalculatedData[] => {
    return products.map(product => ({
      ...product,
      stockStatus: getStockStatus(product.quantity, product.minStock),
      totalValue: product.price * product.quantity
    }));
  };

  const addProduct = (productData: NewProduct) => {
    const newProduct: Product = {
      id: Date.now(),
      ...productData,
      entryDate: new Date().toISOString().split('T')[0],
      state: calculateProductState(productData.estimatedDaysToExpiry, productData.state),
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setProducts(prev => [...prev, newProduct]);
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => 
      p.id === id 
        ? { 
            ...p, 
            ...updates, 
            state: updates.estimatedDaysToExpiry ? 
              calculateProductState(updates.estimatedDaysToExpiry, updates.state || p.state) : p.state,
            lastUpdated: new Date().toISOString().split('T')[0] 
          }
        : p
    ));
  };

  // Actualizar estados de productos basado en días estimados
  const updateProductStates = () => {
    setProducts(prev => prev.map(p => ({
      ...p,
      state: calculateProductState(p.estimatedDaysToExpiry, p.state)
    })));
  };

  // Estadísticas calculadas
  const getStats = () => {
    const productsWithData = getProductsWithCalculatedData();
    const totalProducts = products.length;
    const lowStockItems = productsWithData.filter(item => 
      item.stockStatus === 'Sin Stock' || item.stockStatus === 'Stock Bajo'
    ).length;
    const expiringItems = products.filter(item => item.state === 'por-vencer').length;
    const expiredItems = products.filter(item => item.state === 'vencido').length;
    const totalInventoryValue = productsWithData.reduce((sum, item) => sum + item.totalValue, 0);
    const categories = [...new Set(products.map(item => item.category))];

    return {
      totalProducts,
      lowStockItems,
      expiringItems,
      expiredItems,
      totalValue: totalInventoryValue,
      categoriesCount: categories.length,
      categories
    };
  };

  const getLowStockProducts = () => {
    const productsWithData = getProductsWithCalculatedData();
    return productsWithData.filter(item => 
      item.stockStatus === 'Sin Stock' || item.stockStatus === 'Stock Bajo'
    );
  };

  const getExpiringProducts = () => {
    return products.filter(item => item.state === 'por-vencer' || item.state === 'vencido');
  };

  const getProductsByCategory = () => {
    const categories = [...new Set(products.map(item => item.category))];
    return categories.map(category => {
      const categoryItems = products.filter(item => item.category === category);
      const categoryValue = categoryItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        category,
        count: categoryItems.length,
        value: categoryValue,
        items: categoryItems
      };
    });
  };

  const getProductsByContainer = () => {
    // TEMPORALMENTE OCULTO - FUNCIONALIDAD DE CONTENEDORES
    return [];
  };

  return { 
    products: getProductsWithCalculatedData(),
    addProduct, 
    deleteProduct, 
    updateProduct,
    updateProductStates,
    getStats,
    getLowStockProducts,
    getExpiringProducts,
    getProductsByCategory,
    getProductsByContainer
  };
};