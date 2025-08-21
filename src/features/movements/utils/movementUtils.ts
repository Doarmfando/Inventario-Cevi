// src/features/movements/utils/movementUtils.ts

import type { Movement, MovementFormData, MovementFilters as Filters } from '../types/movement.types';

export const calculateNewStock = (
  type: Movement['type'], 
  previousStock: number, 
  quantity: number
): number => {
  switch (type) {
    case 'entrada':
      return previousStock + quantity;
    case 'salida':
      return previousStock - quantity;
    case 'ajuste':
      // Para ajustes, la cantidad puede ser positiva o negativa
      return previousStock + quantity;
    default:
      return previousStock;
  }
};

export const createMovement = (
  formData: MovementFormData,
  selectedProduct: { id: string; name: string; code?: string },
  previousStock: number
): Movement => {
  const newStock = calculateNewStock(formData.type, previousStock, formData.quantity);
  
  return {
    id: Date.now().toString(),
    productId: formData.productId,
    productName: selectedProduct.name,
    productCode: selectedProduct.code,
    type: formData.type,
    quantity: formData.quantity,
    previousStock,
    newStock,
    unitPrice: formData.unitPrice,
    totalValue: formData.unitPrice ? formData.quantity * formData.unitPrice : undefined,
    reason: formData.reason,
    documentNumber: formData.documentNumber,
    createdBy: 'admin', // En tu app real, obtener del contexto de usuario
    createdAt: new Date(),
    expiryDate: formData.expiryDate,
    state: formData.state,
  };
};

export const applyMovementFilters = (movements: Movement[], filters: Filters): Movement[] => {
  let filtered = [...movements];

  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter(movement => movement.type === filters.type);
  }
  
  if (filters.productId) {
    filtered = filtered.filter(movement => movement.productId === filters.productId);
  }

  if (filters.state && filters.state !== 'all') {
    filtered = filtered.filter(movement => movement.state === filters.state);
  }
  
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    filtered = filtered.filter(movement => 
      new Date(movement.createdAt) >= fromDate
    );
  }
  
  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo + 'T23:59:59');
    filtered = filtered.filter(movement => 
      new Date(movement.createdAt) <= toDate
    );
  }

  if (filters.expiryFrom) {
    const fromDate = new Date(filters.expiryFrom);
    filtered = filtered.filter(movement => 
      movement.expiryDate && new Date(movement.expiryDate) >= fromDate
    );
  }

  if (filters.expiryTo) {
    const toDate = new Date(filters.expiryTo);
    filtered = filtered.filter(movement => 
      movement.expiryDate && new Date(movement.expiryDate) <= toDate
    );
  }

  return filtered;
};

export const getLastMovementForProduct = (movements: Movement[], productId: string): Movement | undefined => {
  return movements
    .filter(m => m.productId === productId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
};