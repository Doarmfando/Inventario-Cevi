// src/features/movements/constants/formConstants.ts - LIMPIO PARA BD

import { ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import type { MovementType, MotivoMovimiento } from '../types/movement.types';

// Tipos de movimiento con sus iconos (esto sí puede estar hardcodeado porque es UI)
export const movementTypes = [
  { value: 'entrada' as MovementType, label: 'Entrada', icon: ArrowUp, color: 'text-green-600' },
  { value: 'salida' as MovementType, label: 'Salida', icon: ArrowDown, color: 'text-red-600' },
  { value: 'ajuste' as MovementType, label: 'Ajuste', icon: RotateCcw, color: 'text-yellow-600' },
];

// FUNCIÓN PARA OBTENER MOTIVOS SEGÚN EL TIPO (ahora usa datos de BD)
export const getReasonsByType = (
  type: MovementType, 
  motivosFromDB: MotivoMovimiento[]
) => {
  return motivosFromDB
    .filter(motivo => motivo.tipo_movimiento === type)
    .map(motivo => ({
      value: motivo.id,
      label: motivo.nombre
    }));
};

// VALIDACIONES DE NEGOCIO (estas sí pueden estar hardcodeadas)
export const VALIDATION_RULES = {
  MIN_CANTIDAD: 0.1,
  MAX_CANTIDAD: 9999,
  MIN_PRECIO: 0.01,
  MAX_PRECIO: 99999.99,
  MAX_OBSERVACION_LENGTH: 500,
  MAX_DOCUMENTO_LENGTH: 100
} as const;

// MENSAJES DE ERROR ESTÁNDARES
export const ERROR_MESSAGES = {
  REQUIRED_PRODUCT: 'Selecciona un producto',
  REQUIRED_CONTAINER: 'Selecciona un contenedor', 
  REQUIRED_REASON: 'Selecciona un motivo',
  REQUIRED_QUANTITY: 'La cantidad debe ser mayor a 0',
  REQUIRED_PRICE: 'El precio es requerido para entradas',
  INSUFFICIENT_STOCK: (available: number, unit: string) => 
    `Stock insuficiente. Disponible: ${available} ${unit}`,
  INVALID_QUANTITY: `La cantidad debe estar entre ${VALIDATION_RULES.MIN_CANTIDAD} y ${VALIDATION_RULES.MAX_CANTIDAD}`,
  INVALID_PRICE: `El precio debe estar entre ${VALIDATION_RULES.MIN_PRECIO} y ${VALIDATION_RULES.MAX_PRECIO}`
} as const;