import { useState } from "react";
import type { Product, NewProduct } from "../types";

export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Laptop Dell XPS 13',
      category: 'Electrónicos',
      quantity: 15,
      price: 1299.99,
      minStock: 5,
      supplier: 'Dell Inc.',
      lastUpdated: '2025-01-15'
    },
    {
      id: 2,
      name: 'Mouse Logitech MX Master',
      category: 'Accesorios',
      quantity: 45,
      price: 99.99,
      minStock: 10,
      supplier: 'Logitech',
      lastUpdated: '2025-01-14'
    },
    {
      id: 3,
      name: 'Monitor Samsung 27"',
      category: 'Electrónicos',
      quantity: 8,
      price: 329.99,
      minStock: 5,
      supplier: 'Samsung',
      lastUpdated: '2025-01-13'
    },
    {
      id: 4,
      name: 'Teclado Mecánico Corsair',
      category: 'Accesorios',
      quantity: 22,
      price: 149.99,
      minStock: 8,
      supplier: 'Corsair',
      lastUpdated: '2025-01-12'
    }
  ]);

  const addProduct = (productData: NewProduct) => {
    const newProduct: Product = {
      id: Date.now(),
      ...productData,
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
        ? { ...p, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
        : p
    ));
  };

  // Estadísticas calculadas
  const getStats = () => {
    const totalProducts = products.length;
    const lowStockItems = products.filter(item => item.quantity <= item.minStock).length;
    const totalValue = products.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const categories = [...new Set(products.map(item => item.category))];

    return {
      totalProducts,
      lowStockItems,
      totalValue,
      categoriesCount: categories.length,
      categories
    };
  };

  const getLowStockProducts = () => {
    return products.filter(item => item.quantity <= item.minStock);
  };

  const getProductsByCategory = () => {
    const categories = [...new Set(products.map(item => item.category))];
    return categories.map(category => {
      const categoryItems = products.filter(item => item.category === category);
      const categoryValue = categoryItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      
      return {
        category,
        count: categoryItems.length,
        value: categoryValue
      };
    });
  };

  return { 
    products, 
    addProduct, 
    deleteProduct, 
    updateProduct,
    getStats,
    getLowStockProducts,
    getProductsByCategory
  };
};