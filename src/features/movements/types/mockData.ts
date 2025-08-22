// src/features/movements/data/mockData.ts - RELACIONADO CON INVENTARIO EXISTENTE

import type { Movement, MovementReasonOptions } from '../types/movement.types';

// PRODUCTOS DISPONIBLES (coinciden con los del inventario)
export const availableProducts = [
  { 
    id: '1', 
    name: 'Lenguado Filetes', 
    container: 'Frigider 2 - Pescado',
    currentStock: 8,
    currentPackaged: 3,
    unit: 'kg',
    estimatedPrice: 28.50
  },
  { 
    id: '2', 
    name: 'Pulpo', 
    container: 'Congelador 2',
    currentStock: 12,
    currentPackaged: 2,
    unit: 'kg',
    estimatedPrice: 45.00
  },
  { 
    id: '3', 
    name: 'Yuca', 
    container: 'Frigider 3 - Yuca',
    currentStock: 15,
    currentPackaged: 5,
    unit: 'kg',
    estimatedPrice: 3.50
  },
  { 
    id: '4', 
    name: 'Rocoto', 
    container: 'Frigider 4 - Mariscos',
    currentStock: 0,
    currentPackaged: 0,
    unit: 'kg',
    estimatedPrice: 8.00
  },
  { 
    id: '5', 
    name: 'Langostinos', 
    container: 'Congelador 1',
    currentStock: 6,
    currentPackaged: 2,
    unit: 'kg',
    estimatedPrice: 35.00
  },
  { 
    id: '6', 
    name: 'Aceite Vegetal', 
    container: 'Almacén Seco',
    currentStock: 20,
    currentPackaged: 4,
    unit: 'litro',
    estimatedPrice: 4.20
  },
  { 
    id: '7', 
    name: 'Limones', 
    container: 'Frigider 1 - Causa',
    currentStock: 8,
    currentPackaged: 4,
    unit: 'kg',
    estimatedPrice: 2.80
  }
];

// MOVIMIENTOS REALES DEL SISTEMA
export const mockMovements: Movement[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Lenguado Filetes',
    container: 'Frigider 2 - Pescado',
    type: 'entrada',
    quantity: 10,
    packagedUnits: 3, // Se dividió en 3 empaquetados
    previousStock: 0,
    newStock: 10,
    unitPrice: 30.00, // Precio real de compra
    totalValue: 300.00,
    reason: 'compra',
    observations: 'Compra inicial para el fin de semana. Producto fresco del mercado pesquero.',
    documentNumber: 'FAC-001-2024',
    createdBy: 'admin',
    createdAt: new Date('2025-08-16T09:15:00'),
  },
  {
    id: '2',
    productId: '1',
    productName: 'Lenguado Filetes',
    container: 'Frigider 2 - Pescado',
    type: 'salida',
    quantity: 2,
    packagedUnits: 1, // Se usó 1 empaquetado completo
    previousStock: 10,
    newStock: 8,
    unitPrice: 30.00,
    totalValue: 60.00,
    reason: 'venta',
    observations: 'Venta para mesa 5 - Ceviche especial',
    documentNumber: 'BOL-001-0156',
    createdBy: 'mesero1',
    createdAt: new Date('2025-08-17T13:45:00'),
  },
  {
    id: '3',
    productId: '2',
    productName: 'Pulpo',
    container: 'Congelador 2',
    type: 'entrada',
    quantity: 15,
    packagedUnits: 2, // Se dividió en 2 empaquetados grandes
    previousStock: 0,
    newStock: 15,
    unitPrice: 48.50, // Precio real mayor al estimado
    totalValue: 727.50,
    reason: 'reposicion',
    observations: 'Reposición semanal. Pulpo congelado de calidad premium.',
    documentNumber: 'FAC-002-2024',
    createdBy: 'admin',
    createdAt: new Date('2025-08-14T08:30:00'),
  },
  {
    id: '4',
    productId: '2',
    productName: 'Pulpo',
    container: 'Congelador 2',
    type: 'salida',
    quantity: 3,
    packagedUnits: 0, // Salida parcial de empaquetado
    previousStock: 15,
    newStock: 12,
    unitPrice: 48.50,
    totalValue: 145.50,
    reason: 'venta',
    observations: 'Pulpo al olivo para evento empresarial',
    documentNumber: 'BOL-001-0157',
    createdBy: 'chef1',
    createdAt: new Date('2025-08-18T11:20:00'),
  },
  {
    id: '5',
    productId: '3',
    productName: 'Yuca',
    container: 'Frigider 3 - Yuca',
    type: 'entrada',
    quantity: 20,
    packagedUnits: 5, // 5 empaquetados de 1kg c/u (5kg empaquetados)
    previousStock: 0,
    newStock: 20,
    unitPrice: 3.20, // Precio real menor al estimado
    totalValue: 64.00,
    reason: 'compra',
    observations: 'Yuca fresca del mercado mayorista. Buena calidad.',
    documentNumber: 'FAC-003-2024',
    createdBy: 'admin',
    createdAt: new Date('2025-08-15T07:45:00'),
  },
  {
    id: '6',
    productId: '3',
    productName: 'Yuca',
    container: 'Frigider 3 - Yuca',
    type: 'salida',
    quantity: 5,
    packagedUnits: 2, // Se usaron 2 empaquetados completos
    previousStock: 20,
    newStock: 15,
    unitPrice: 3.20,
    totalValue: 16.00,
    reason: 'consumo-interno',
    observations: 'Para preparación de yuca frita del menú del día',
    createdBy: 'chef2',
    createdAt: new Date('2025-08-17T16:30:00'),
  },
  {
    id: '7',
    productId: '5',
    productName: 'Langostinos',
    container: 'Congelador 1',
    type: 'entrada',
    quantity: 8,
    packagedUnits: 2, // 2 empaquetados de 1.5kg c/u
    previousStock: 0,
    newStock: 8,
    unitPrice: 38.00, // Precio real
    totalValue: 304.00,
    reason: 'compra',
    observations: 'Langostinos grandes para platos especiales',
    documentNumber: 'FAC-004-2024',
    createdBy: 'admin',
    createdAt: new Date('2025-08-15T10:00:00'),
  },
  {
    id: '8',
    productId: '5',
    productName: 'Langostinos',
    container: 'Congelador 1',
    type: 'salida',
    quantity: 2,
    packagedUnits: 0, // Salida parcial
    previousStock: 8,
    newStock: 6,
    unitPrice: 38.00,
    totalValue: 76.00,
    reason: 'venta',
    observations: 'Langostinos al ajillo - mesa VIP',
    documentNumber: 'BOL-001-0158',
    createdBy: 'chef1',
    createdAt: new Date('2025-08-19T19:15:00'),
  },
  {
    id: '9',
    productId: '7',
    productName: 'Limones',
    container: 'Frigider 1 - Causa',
    type: 'entrada',
    quantity: 10,
    packagedUnits: 4, // 4 empaquetados de 1kg c/u
    previousStock: 0,
    newStock: 10,
    unitPrice: 2.50, // Precio real
    totalValue: 25.00,
    reason: 'compra',
    observations: 'Limones frescos para ceviche y causa',
    documentNumber: 'FAC-005-2024',
    createdBy: 'admin',
    createdAt: new Date('2025-08-15T06:30:00'),
  },
  {
    id: '10',
    productId: '7',
    productName: 'Limones',
    container: 'Frigider 1 - Causa',
    type: 'salida',
    quantity: 2,
    packagedUnits: 1, // 1 empaquetado usado
    previousStock: 10,
    newStock: 8,
    unitPrice: 2.50,
    totalValue: 5.00,
    reason: 'consumo-interno',
    observations: 'Para preparación de leche de tigre',
    createdBy: 'chef2',
    createdAt: new Date('2025-08-18T14:20:00'),
  },
  {
    id: '11',
    productId: '4',
    productName: 'Rocoto',
    container: 'Frigider 4 - Mariscos',
    type: 'entrada',
    quantity: 3,
    packagedUnits: 2, // 2 empaquetados pequeños
    previousStock: 0,
    newStock: 3,
    unitPrice: 7.00, // Precio real menor al estimado
    totalValue: 21.00,
    reason: 'compra',
    observations: 'Rocoto rojo fresco para rocoto relleno',
    documentNumber: 'FAC-006-2024',
    createdBy: 'admin',
    createdAt: new Date('2025-08-10T08:00:00'),
  },
  {
    id: '12',
    productId: '4',
    productName: 'Rocoto',
    container: 'Frigider 4 - Mariscos',
    type: 'salida',
    quantity: 3,
    packagedUnits: 2, // Se usaron todos los empaquetados
    previousStock: 3,
    newStock: 0,
    unitPrice: 7.00,
    totalValue: 21.00,
    reason: 'roto',
    observations: 'Se malogró por exceso de humedad en el frigider',
    createdBy: 'admin',
    createdAt: new Date('2025-08-19T09:30:00'),
  },
];

// OPCIONES DE MOTIVOS PARA EL FORMULARIO
export const movementReasonOptions: MovementReasonOptions = {
  entrada: [
    { value: 'compra', label: 'Compra' },
    { value: 'reposicion', label: 'Reposición' },
    { value: 'ajuste-positivo', label: 'Ajuste Positivo' },
    { value: 'devolucion', label: 'Devolución' },
    { value: 'transferencia-entrada', label: 'Transferencia de Entrada' },
    { value: 'donacion', label: 'Donación' },
    { value: 'produccion-interna', label: 'Producción Interna' },
  ],
  salida: [
    { value: 'venta', label: 'Venta' },
    { value: 'perdida', label: 'Pérdida' },
    { value: 'roto', label: 'Roto/Dañado' },
    { value: 'vencido', label: 'Producto Vencido' },
    { value: 'ajuste-negativo', label: 'Ajuste Negativo' },
    { value: 'transferencia-salida', label: 'Transferencia de Salida' },
    { value: 'consumo-interno', label: 'Consumo Interno' },
    { value: 'merma', label: 'Merma' },
    { value: 'degustacion', label: 'Degustación' },
  ],
};

// FUNCIÓN PARA FORMATEAR DATOS CALCULADOS
export const formatMovementData = (movement: Movement) => {
  return {
    ...movement,
    formattedDate: new Date(movement.createdAt).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    movementTypeLabel: movement.type === 'entrada' ? 'Entrada' : movement.type === 'salida' ? 'Salida' : 'Ajuste',
    reasonLabel: movementReasonOptions[movement.type as 'entrada' | 'salida']
      ?.find(option => option.value === movement.reason)?.label || movement.reason,
    packagedText: movement.packagedUnits > 0 ? `${movement.packagedUnits} emp.` : '-',
    stockChange: movement.type === 'entrada' ? `+${movement.quantity}` : `-${movement.quantity}`,
  };
};