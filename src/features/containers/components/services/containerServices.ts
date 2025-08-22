// src/features/containers/services/containerServices.ts

import type { Container, ContainerProduct, ProductFormData } from '../../types/container.types';
import type { InventoryProduct } from '../../data/mockProductData';
import { calculateProductState } from '../../data/mockContainerData';

export interface ProductCreationResult {
  success: boolean;
  products?: ContainerProduct[];
  error?: string;
}

export interface InventoryProductCreationResult {
  success: boolean;
  product?: InventoryProduct;
  error?: string;
}

/**
 * Servicio para crear múltiples registros de productos empaquetados
 */
export const createContainerProducts = (
  formData: ProductFormData, 
  container: Container, 
  inventoryProduct: InventoryProduct
): ProductCreationResult => {
  try {
    // Validaciones
    if (!inventoryProduct) {
      return { success: false, error: 'Producto no encontrado en inventario' };
    }

    if (formData.totalQuantity <= 0 || formData.packagedUnits <= 0) {
      return { success: false, error: 'Cantidad total y empaquetados deben ser mayor a 0' };
    }

    // Calcular la cantidad por empaquetado
    const quantityPerPackage = formData.totalQuantity / formData.packagedUnits;

    // Determinar estado final del producto
    let finalState = formData.state;
    if (formData.expiryDate && inventoryProduct.isPerishable) {
      finalState = calculateProductState(new Date(formData.expiryDate));
    }

    // Crear los registros de productos empaquetados
    const newProducts: ContainerProduct[] = [];
    const baseTimestamp = Date.now();

    for (let i = 0; i < formData.packagedUnits; i++) {
      const newProduct: ContainerProduct = {
        id: `${baseTimestamp}-${i}`,
        productId: formData.productId,
        productName: inventoryProduct.name,
        containerId: container.id,
        containerName: container.name,
        category: inventoryProduct.category,
        totalQuantity: quantityPerPackage,
        unit: inventoryProduct.unit,
        packagedUnits: 1, // Cada registro representa 1 empaquetado
        quantityPerPackage: quantityPerPackage,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
        state: finalState,
        price: formData.price,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      newProducts.push(newProduct);
    }

    return { success: true, products: newProducts };
  } catch (error) {
    console.error('Error creating container products:', error);
    return { success: false, error: 'Error interno al crear productos' };
  }
};

/**
 * Servicio para crear un nuevo producto en el inventario
 */
export const createInventoryProduct = (
  productData: Partial<InventoryProduct>,
  containerType?: string
): InventoryProductCreationResult => {
  try {
    // Validaciones básicas
    if (!productData.name?.trim()) {
      return { success: false, error: 'El nombre del producto es requerido' };
    }

    if (!productData.category?.trim()) {
      return { success: false, error: 'La categoría es requerida' };
    }

    if (!productData.basePrice || productData.basePrice <= 0) {
      return { success: false, error: 'El precio base debe ser mayor a 0' };
    }

    // Generar ID único (en un entorno real, esto se haría en el backend)
    const newId = generateUniqueId();

    // Determinar tipos de contenedores recomendados
    let recommendedContainerTypes = productData.recommendedContainerTypes || [];
    if (containerType && !recommendedContainerTypes.includes(containerType)) {
      recommendedContainerTypes.push(containerType);
    }

    // Crear el nuevo producto
    const newProduct: InventoryProduct = {
      id: newId,
      name: productData.name.trim(),
      category: productData.category.trim(),
      basePrice: productData.basePrice,
      unit: productData.unit || 'kg',
      description: productData.description?.trim() || '',
      isPerishable: productData.isPerishable || false,
      recommendedContainerTypes,
      createdAt: new Date(),
      minStock: productData.minStock,
      maxStock: productData.maxStock,
    };

    return { success: true, product: newProduct };
  } catch (error) {
    console.error('Error creating inventory product:', error);
    return { success: false, error: 'Error interno al crear producto en inventario' };
  }
};

/**
 * Servicio para actualizar un producto del contenedor
 */
export const updateContainerProduct = (
  productId: string,
  updateData: Partial<ContainerProduct>
): { success: boolean; error?: string } => {
  try {
    // Validaciones
    if (!productId) {
      return { success: false, error: 'ID de producto requerido' };
    }

    // Validar datos de actualización
    if (updateData.totalQuantity !== undefined && updateData.totalQuantity <= 0) {
      return { success: false, error: 'La cantidad debe ser mayor a 0' };
    }

    if (updateData.price !== undefined && updateData.price <= 0) {
      return { success: false, error: 'El precio debe ser mayor a 0' };
    }

    // En un entorno real, aquí se haría la llamada al backend
    console.log('Actualizando producto:', productId, updateData);

    return { success: true };
  } catch (error) {
    console.error('Error updating container product:', error);
    return { success: false, error: 'Error interno al actualizar producto' };
  }
};

/**
 * Servicio para eliminar un producto del contenedor
 */
export const deleteContainerProduct = (productId: string): { success: boolean; error?: string } => {
  try {
    if (!productId) {
      return { success: false, error: 'ID de producto requerido' };
    }

    // En un entorno real, aquí se haría la llamada al backend
    console.log('Eliminando producto:', productId);

    return { success: true };
  } catch (error) {
    console.error('Error deleting container product:', error);
    return { success: false, error: 'Error interno al eliminar producto' };
  }
};

/**
 * Función para generar un ID único
 */
const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Función para validar fechas de vencimiento
 */
export const validateExpiryDate = (
  expiryDate: string | undefined, 
  isPerishable: boolean
): { isValid: boolean; error?: string } => {
  if (!isPerishable) {
    return { isValid: true };
  }

  if (!expiryDate) {
    return { isValid: false, error: 'Fecha de vencimiento requerida para productos perecederos' };
  }

  const expiry = new Date(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (expiry < today) {
    return { isValid: false, error: 'La fecha de vencimiento no puede ser anterior a hoy' };
  }

  return { isValid: true };
};

/**
 * Función para calcular estadísticas de productos por estado
 */
export const calculateProductStateStats = (products: ContainerProduct[]) => {
  const stats = products.reduce(
    (acc, product) => {
      acc.total += product.packagedUnits;
      
      switch (product.state) {
        case 'fresco':
          acc.fresh += product.packagedUnits;
          break;
        case 'congelado':
          acc.frozen += product.packagedUnits;
          break;
        case 'por-vencer':
          acc.expiringSoon += product.packagedUnits;
          break;
        case 'vencido':
          acc.expired += product.packagedUnits;
          break;
      }
      
      return acc;
    },
    {
      total: 0,
      fresh: 0,
      frozen: 0,
      expiringSoon: 0,
      expired: 0,
    }
  );

  return stats;
};

/**
 * Función para obtener productos que vencen pronto
 */
export const getExpiringProducts = (
  products: ContainerProduct[], 
  daysThreshold: number = 7
): ContainerProduct[] => {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

  return products.filter(product => {
    if (!product.expiryDate) return false;
    
    const expiryDate = new Date(product.expiryDate);
    return expiryDate <= thresholdDate && expiryDate >= new Date();
  });
};

/**
 * Función para validar capacidad del contenedor
 */
export const validateContainerCapacity = (
  container: Container,
  newProductWeight: number
): { canAdd: boolean; error?: string } => {
  const totalCapacityUsed = container.currentLoad + newProductWeight;
  
  if (totalCapacityUsed > container.capacity) {
    return {
      canAdd: false,
      error: `La capacidad del contenedor se excedería (${totalCapacityUsed}/${container.capacity} kg)`
    };
  }

  const capacityPercentage = (totalCapacityUsed / container.capacity) * 100;
  
  if (capacityPercentage > 95) {
    return {
      canAdd: true,
      error: `Advertencia: El contenedor estará al ${capacityPercentage.toFixed(1)}% de su capacidad`
    };
  }

  return { canAdd: true };
};