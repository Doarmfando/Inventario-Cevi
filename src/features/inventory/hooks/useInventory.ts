// hooks/useInventory.ts - CORREGIDO PARA RESOLVER ERRORES DE TYPESCRIPT

import { useState } from "react";
import type { Product, NewProduct, ProductWithCalculatedData, StockStatus } from "../types"; // ✅ RUTA CORREGIDA
import { mockProducts, calculateNearExpiryPackages, formatPackagedText } from "../components/data/mockData";

export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  // Función para calcular el estado del stock
  const getStockStatus = (quantity: number, minStock: number): StockStatus => {
    if (quantity === 0) return 'Sin Stock';
    if (quantity <= minStock) return 'Stock Bajo';
    if (quantity <= minStock * 1.5) return 'Reponer Pronto';
    return 'Stock OK';
  };

  // Función para calcular el estado del producto basado en los días estimados
  const calculateProductState = (estimatedDays: number, currentState: string): Product['state'] => {
    if (currentState === 'congelado') return 'congelado';
    if (estimatedDays <= 0) return 'vencido';
    if (estimatedDays <= 3) return 'por-vencer';
    return 'fresco';
  };

  // FUNCIÓN PRINCIPAL - Productos con datos calculados para la tabla
  const getProductsWithCalculatedData = (): ProductWithCalculatedData[] => {
    return products.map(product => {
      const packagedWeight = product.packagedUnits * product.weightPerPackage;
      const availableStock = Math.max(0, product.quantity - packagedWeight);
      
      // Recalcular empaquetados por vencer
      const nearExpiryPackages = calculateNearExpiryPackages(
        product.packagedUnits,
        product.packagedExpiryDays,
        product.state,
        product.category
      );
      
      return {
        ...product,
        stockStatus: getStockStatus(product.quantity, product.minStock),
        totalValue: product.price * product.quantity, // Valor con precio estimado
        realTotalValue: product.realPrice ? product.realPrice * product.quantity : undefined, // Valor con precio real (si existe)
        availableStock,
        packagedWeight,
        empaquetados: formatPackagedText(product.packagedUnits, product.weightPerPackage),
        porVencer: formatPackagedText(nearExpiryPackages, product.weightPerPackage),
        nearExpiryPackages
      };
    });
  };

  // CRUD Operations
  const addProduct = (productData: NewProduct) => {
    const newProduct: Product = {
      id: Date.now(),
      ...productData,
      packagedUnits: productData.packagedUnits || 0,
      weightPerPackage: productData.weightPerPackage || 1,
      packagedExpiryDays: productData.packagedExpiryDays || productData.estimatedDaysToExpiry,
      nearExpiryPackages: calculateNearExpiryPackages(
        productData.packagedUnits || 0,
        productData.packagedExpiryDays || productData.estimatedDaysToExpiry,
        productData.state,
        productData.category
      ),
      entryDate: new Date().toISOString().split('T')[0],
      state: calculateProductState(productData.estimatedDaysToExpiry, productData.state),
      lastUpdated: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + productData.estimatedDaysToExpiry * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
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
            nearExpiryPackages: updates.packagedUnits !== undefined || updates.packagedExpiryDays !== undefined ? 
              calculateNearExpiryPackages(
                updates.packagedUnits || p.packagedUnits,
                updates.packagedExpiryDays || p.packagedExpiryDays,
                updates.state || p.state,
                updates.category || p.category
              ) : p.nearExpiryPackages,
            state: updates.estimatedDaysToExpiry ? 
              calculateProductState(updates.estimatedDaysToExpiry, updates.state || p.state) : p.state,
            lastUpdated: new Date().toISOString().split('T')[0] 
          }
        : p
    ));
  };

  // Actualizar estados de productos y empaquetados por vencer
  const updateProductStates = () => {
    setProducts(prev => prev.map(p => ({
      ...p,
      state: calculateProductState(p.estimatedDaysToExpiry, p.state),
      nearExpiryPackages: calculateNearExpiryPackages(
        p.packagedUnits,
        p.packagedExpiryDays,
        p.state,
        p.category
      )
    })));
  };

  // ESTADÍSTICAS PARA TARJETAS SUPERIORES
  const getStats = () => {
    const productsWithData = getProductsWithCalculatedData();
    const totalProducts = products.length;
    const lowStockItems = productsWithData.filter(item => 
      item.stockStatus === 'Sin Stock' || item.stockStatus === 'Stock Bajo'
    ).length;
    const expiringItems = products.filter(item => item.state === 'por-vencer').length;
    const expiredItems = products.filter(item => item.state === 'vencido').length;
    
    // Valores calculados con precio estimado y precio real
    const totalInventoryValue = productsWithData.reduce((sum, item) => sum + item.totalValue, 0);
    const totalRealInventoryValue = productsWithData.reduce((sum, item) => 
      sum + (item.realTotalValue || item.totalValue), 0
    );
    
    // Estadísticas de empaquetado gastronómico
    const totalPackagedUnits = products.reduce((sum, item) => sum + item.packagedUnits, 0);
    const totalPackagedWeight = productsWithData.reduce((sum, item) => sum + item.packagedWeight, 0);
    const totalNearExpiryPackages = productsWithData.reduce((sum, item) => sum + item.nearExpiryPackages, 0);
    const totalNearExpiryWeight = productsWithData.reduce((sum, item) => 
      sum + (item.nearExpiryPackages * item.weightPerPackage), 0
    );
    
    const categories = [...new Set(products.map(item => item.category))];
    const containers = [...new Set(products.map(item => item.container))];

    return {
      totalProducts,
      lowStockItems,
      expiringItems,
      expiredItems,
      totalValue: totalInventoryValue, // Valor estimado
      totalRealValue: totalRealInventoryValue, // Valor real
      // Estadísticas de empaquetado
      totalPackagedUnits,
      totalPackagedWeight,
      totalNearExpiryPackages,
      totalNearExpiryWeight,
      categoriesCount: categories.length,
      containersCount: containers.length,
      categories,
      containers
    };
  };

  // FUNCIONES DE FILTRADO Y AGRUPACIÓN
  const getLowStockProducts = () => {
    const productsWithData = getProductsWithCalculatedData();
    return productsWithData.filter(item => 
      item.stockStatus === 'Sin Stock' || item.stockStatus === 'Stock Bajo'
    );
  };

  const getExpiringProducts = () => {
    return products.filter(item => item.state === 'por-vencer' || item.state === 'vencido');
  };

  // Productos con empaquetados por vencer (específico para negocio gastronómico)
  const getPackagesNearExpiry = () => {
    const productsWithData = getProductsWithCalculatedData();
    return productsWithData.filter(item => item.nearExpiryPackages > 0);
  };

  const getProductsByCategory = () => {
    const categories = [...new Set(products.map(item => item.category))];
    return categories.map(category => {
      const categoryItems = products.filter(item => item.category === category);
      const productsWithData = getProductsWithCalculatedData().filter(item => item.category === category);
      
      // Valores con precio estimado y precio real
      const categoryValue = categoryItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const categoryRealValue = categoryItems.reduce((sum, item) => 
        sum + ((item.realPrice || item.price) * item.quantity), 0
      );
      
      const categoryPackagedUnits = categoryItems.reduce((sum, item) => sum + item.packagedUnits, 0);
      const categoryPackagedWeight = productsWithData.reduce((sum, item) => sum + item.packagedWeight, 0);
      const categoryNearExpiry = productsWithData.reduce((sum, item) => sum + item.nearExpiryPackages, 0);
      
      return {
        category,
        count: categoryItems.length,
        value: categoryValue, // Valor estimado
        realValue: categoryRealValue, // Valor real
        packagedUnits: categoryPackagedUnits,
        packagedWeight: categoryPackagedWeight,
        nearExpiryPackages: categoryNearExpiry,
        items: categoryItems
      };
    });
  };

  const getProductsByContainer = () => {
    const containers = [...new Set(products.map(item => item.container))];
    return containers.map(container => {
      const containerItems = products.filter(item => item.container === container);
      const productsWithData = getProductsWithCalculatedData().filter(item => item.container === container);
      
      // Valores con precio estimado y precio real
      const containerValue = containerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const containerRealValue = containerItems.reduce((sum, item) => 
        sum + ((item.realPrice || item.price) * item.quantity), 0
      );
      
      const containerPackagedUnits = containerItems.reduce((sum, item) => sum + item.packagedUnits, 0);
      const containerPackagedWeight = productsWithData.reduce((sum, item) => sum + item.packagedWeight, 0);
      const containerNearExpiry = productsWithData.reduce((sum, item) => sum + item.nearExpiryPackages, 0);
      
      return {
        container,
        count: containerItems.length,
        value: containerValue, // Valor estimado
        realValue: containerRealValue, // Valor real
        packagedUnits: containerPackagedUnits,
        packagedWeight: containerPackagedWeight,
        nearExpiryPackages: containerNearExpiry,
        items: containerItems
      };
    });
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
    getPackagesNearExpiry, // NUEVA: Específica para empaquetados por vencer
    getProductsByCategory,
    getProductsByContainer
  };
};