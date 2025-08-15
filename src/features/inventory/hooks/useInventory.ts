import { useState } from "react";
import type { Product, NewProduct } from "../types";

export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Lenguado Filetes',
      category: 'Pescados',
      quantity: 15,
      unit: 'kg',
      price: 28.50,
      minStock: 5,
      supplier: 'Mercado Pesquero Central',
      expiryDate: '2025-08-20',
      entryDate: '2025-08-16',
      // container: 'Frigider 2 - Pescado', // TEMPORALMENTE OCULTO
      state: 'fresco',
      lastUpdated: '2025-08-15'
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
      expiryDate: '2025-09-10',
      entryDate: '2025-08-14',
      // container: 'Congelador 1', // TEMPORALMENTE OCULTO
      state: 'congelado',
      lastUpdated: '2025-08-15'
    },
    {
      id: 3,
      name: 'Yuca',
      category: 'Verduras',
      quantity: 25,
      unit: 'bolsa',
      price: 3.50,
      minStock: 10,
      supplier: 'Distribuidora Los Andes',
      expiryDate: '2025-08-25',
      entryDate: '2025-08-15',
      // container: 'Frigider 3 - Yuca', // TEMPORALMENTE OCULTO
      state: 'fresco',
      lastUpdated: '2025-08-15'
    },
    {
      id: 4,
      name: 'Rocoto',
      category: 'Condimentos',
      quantity: 5,
      unit: 'kg',
      price: 8.00,
      minStock: 2,
      supplier: 'Verduras San Juan',
      expiryDate: '2025-08-30',
      entryDate: '2025-08-14',
      // container: 'Frigider 1 - Causa', // TEMPORALMENTE OCULTO
      state: 'fresco',
      lastUpdated: '2025-08-15'
    },
    {
      id: 5,
      name: 'Langostinos',
      category: 'Mariscos',
      quantity: 12,
      unit: 'kg',
      price: 35.00,
      minStock: 4,
      supplier: 'Mariscos Premium',
      expiryDate: '2025-08-22',
      entryDate: '2025-08-15',
      // container: 'Frigider 4 - Mariscos', // TEMPORALMENTE OCULTO
      state: 'fresco',
      lastUpdated: '2025-08-15'
    },
    {
      id: 6,
      name: 'Aceite Vegetal',
      category: 'Insumos',
      quantity: 20,
      unit: 'litro',
      price: 4.20,
      minStock: 8,
      supplier: 'Distribuidora Central',
      expiryDate: '2025-12-15',
      entryDate: '2025-08-10',
      // container: 'Almacén Seco', // TEMPORALMENTE OCULTO
      state: 'fresco',
      lastUpdated: '2025-08-15'
    },
    {
      id: 7,
      name: 'Limones',
      category: 'Condimentos',
      quantity: 50,
      unit: 'kg',
      price: 2.80,
      minStock: 15,
      supplier: 'Cítricos del Norte',
      expiryDate: '2025-08-18',
      entryDate: '2025-08-15',
      // container: 'Frigider 1 - Causa', // TEMPORALMENTE OCULTO
      state: 'por-vencer',
      lastUpdated: '2025-08-15'
    },
    {
      id: 8,
      name: 'Cancha Serrana',
      category: 'Verduras',
      quantity: 15,
      unit: 'bolsa',
      price: 4.50,
      minStock: 8,
      supplier: 'Granos Andinos',
      expiryDate: '2025-09-30',
      entryDate: '2025-08-12',
      // container: 'Almacén Seco', // TEMPORALMENTE OCULTO
      state: 'fresco',
      lastUpdated: '2025-08-15'
    }
  ]);

  // Función para calcular el estado del producto basado en la fecha de vencimiento
  const calculateProductState = (expiryDate: string, currentState: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (currentState === 'congelado') return 'congelado';
    if (daysUntilExpiry < 0) return 'vencido';
    if (daysUntilExpiry <= 3) return 'por-vencer';
    return 'fresco';
  };

  const addProduct = (productData: NewProduct) => {
    const newProduct: Product = {
      id: Date.now(),
      ...productData,
      entryDate: new Date().toISOString().split('T')[0],
      state: calculateProductState(productData.expiryDate, productData.state),
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
            state: updates.expiryDate ? calculateProductState(updates.expiryDate, updates.state || p.state) : p.state,
            lastUpdated: new Date().toISOString().split('T')[0] 
          }
        : p
    ));
  };

  // Actualizar estados de productos basado en fechas
  const updateProductStates = () => {
    setProducts(prev => prev.map(p => ({
      ...p,
      state: calculateProductState(p.expiryDate, p.state)
    })));
  };

  // Estadísticas calculadas
  const getStats = () => {
    const totalProducts = products.length;
    const lowStockItems = products.filter(item => item.quantity <= item.minStock).length;
    const expiringItems = products.filter(item => item.state === 'por-vencer').length;
    const expiredItems = products.filter(item => item.state === 'vencido').length;
    const totalValue = products.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const categories = [...new Set(products.map(item => item.category))];

    return {
      totalProducts,
      lowStockItems,
      expiringItems,
      expiredItems,
      totalValue,
      categoriesCount: categories.length,
      categories
    };
  };

  const getLowStockProducts = () => {
    return products.filter(item => item.quantity <= item.minStock);
  };

  const getExpiringProducts = () => {
    return products.filter(item => item.state === 'por-vencer' || item.state === 'vencido');
  };

  const getProductsByCategory = () => {
    const categories = [...new Set(products.map(item => item.category))];
    return categories.map(category => {
      const categoryItems = products.filter(item => item.category === category);
      const categoryValue = categoryItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      
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
    /*
    const containers = [...new Set(products.map(item => item.container))];
    return containers.map(container => {
      const containerItems = products.filter(item => item.container === container);
      return {
        container,
        count: containerItems.length,
        items: containerItems
      };
    });
    */
    return [];
  };

  return { 
    products, 
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