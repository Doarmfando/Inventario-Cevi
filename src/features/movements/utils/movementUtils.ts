// src/features/movements/utils/movementUtils.ts - CORREGIDO

import type { Movement, MovementFormData, MovementFilters as Filters } from '../types/movement.types';
import type { Container } from '../../inventory/types';

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

// ⭐ CORREGIDO: Función para crear movimiento con contenedor seleccionado
export const createMovement = (
  formData: MovementFormData,
  selectedProduct: { id: string; name: string; code?: string; container?: Container },
  previousStock: number
): Movement => {
  const newStock = calculateNewStock(formData.type, previousStock, formData.quantity);
  
  // ✅ CORREGIDO: Usar el contenedor seleccionado por el usuario o el del producto por defecto
  const finalContainer: Container = formData.selectedContainer || formData.container || selectedProduct.container || 'Almacén Seco';
  
  return {
    id: Date.now().toString(),
    productId: formData.productId,
    productName: selectedProduct.name,
    productCode: selectedProduct.code,
    container: finalContainer, // ✅ CORREGIDO: Ahora es tipo Container
    type: formData.type,
    quantity: formData.quantity,
    packagedUnits: formData.packagedUnits || 0,
    previousStock,
    newStock,
    unitPrice: formData.unitPrice,
    totalValue: formData.unitPrice ? formData.quantity * formData.unitPrice : undefined,
    reason: formData.reason,
    observations: formData.observations,
    documentNumber: formData.documentNumber,
    createdBy: 'admin', // En tu app real, obtener del contexto de usuario
    createdAt: new Date(),
    expiryDate: formData.expiryDate,
    state: formData.state || 'completed',
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

  if (filters.container) {
    filtered = filtered.filter(movement => movement.container === filters.container);
  }

  if (filters.reason && filters.reason !== 'all') {
    filtered = filtered.filter(movement => movement.reason === filters.reason);
  }

  if (filters.state && filters.state !== 'all') {
    filtered = filtered.filter(movement => movement.state === filters.state);
  }
  
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(movement => 
      movement.productName.toLowerCase().includes(term) ||
      movement.container.toLowerCase().includes(term) ||
      movement.observations?.toLowerCase().includes(term) ||
      movement.documentNumber?.toLowerCase().includes(term)
    );
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

// Función para obtener el stock actual de un producto basado en sus movimientos
export const getCurrentStock = (movements: Movement[], productId: string): number => {
  const productMovements = movements
    .filter(m => m.productId === productId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  if (productMovements.length === 0) return 0;

  // El último movimiento tiene el stock actual
  const lastMovement = productMovements[productMovements.length - 1];
  return lastMovement.newStock;
};

// Función para obtener las unidades empaquetadas actuales de un producto
export const getCurrentPackagedUnits = (movements: Movement[], productId: string): number => {
  const productMovements = movements
    .filter(m => m.productId === productId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  if (productMovements.length === 0) return 0;

  // Sumar todas las unidades empaquetadas (entradas positivas, salidas negativas)
  return productMovements.reduce((total, movement) => {
    if (movement.type === 'entrada') {
      return total + movement.packagedUnits;
    } else if (movement.type === 'salida') {
      return total - movement.packagedUnits;
    }
    return total; // Para ajustes, mantener el total
  }, 0);
};

// Función para validar si hay suficiente stock para una salida
export const validateStockForExit = (
  movements: Movement[], 
  productId: string, 
  quantityToExit: number
): { isValid: boolean; currentStock: number; message?: string } => {
  const currentStock = getCurrentStock(movements, productId);
  
  if (currentStock < quantityToExit) {
    return {
      isValid: false,
      currentStock,
      message: `Stock insuficiente. Stock actual: ${currentStock}, cantidad solicitada: ${quantityToExit}`
    };
  }
  
  return { isValid: true, currentStock };
};

// ⭐ NUEVA: Función para obtener todos los contenedores únicos de los movimientos
export const getUniqueContainers = (movements: Movement[]): Container[] => {
  const containers = movements.map(m => m.container).filter(Boolean);
  return [...new Set(containers)].sort();
};

// ⭐ NUEVA: Función para obtener movimientos de un producto en un contenedor específico
export const getMovementsByProductAndContainer = (
  movements: Movement[], 
  productId: string, 
  container: Container
): Movement[] => {
  return movements
    .filter(m => m.productId === productId && m.container === container)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Agregar esta función al archivo existente movement.utils.ts
export const getReasonLabel = (reason: string) => {
  const reasonLabels: Record<string, string> = {
    compra: 'Compra',
    reposicion: 'Reposición',
    'ajuste-positivo': 'Ajuste Positivo',
    devolucion: 'Devolución',
    'transferencia-entrada': 'Transferencia Entrada',
    donacion: 'Donación',
    'produccion-interna': 'Producción Interna',
    venta: 'Venta',
    perdida: 'Pérdida',
    roto: 'Roto',
    vencido: 'Vencido',
    'ajuste-negativo': 'Ajuste Negativo',
    'transferencia-salida': 'Transferencia Salida',
    'consumo-interno': 'Consumo Interno',
    merma: 'Merma',
    degustacion: 'Degustación',
  };
  return reasonLabels[reason] || reason;
};