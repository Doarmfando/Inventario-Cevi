// src/features/movements/constants/formConstants.ts

import { ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import type { MovementType, ProductState } from '../types/movement.types';

export const movementTypes = [
  { value: 'entrada' as MovementType, label: 'Entrada', icon: ArrowUp, color: 'text-green-600' },
  { value: 'salida' as MovementType, label: 'Salida', icon: ArrowDown, color: 'text-red-600' },
  { value: 'ajuste' as MovementType, label: 'Ajuste', icon: RotateCcw, color: 'text-yellow-600' },
];

export const productStates = [
  { value: 'fresco' as ProductState, label: 'Fresco', color: 'bg-green-100 text-green-800', description: 'Producto en estado óptimo' },
  { value: 'congelado' as ProductState, label: 'Congelado', color: 'bg-blue-100 text-blue-800', description: 'Producto conservado en frío' },
  { value: 'por-vencer' as ProductState, label: 'Por Vencer', color: 'bg-orange-100 text-orange-800', description: 'Próximo a vencer' },
  { value: 'vencido' as ProductState, label: 'Vencido', color: 'bg-red-100 text-red-800', description: 'Producto vencido' },
];