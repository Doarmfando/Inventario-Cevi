// src/features/movements/constants/formConstants.ts

import { ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import type { MovementType, EntryReason, ExitReason } from '../types/movement.types';

export const movementTypes = [
  { value: 'entrada' as MovementType, label: 'Entrada', icon: ArrowUp, color: 'text-green-600' },
  { value: 'salida' as MovementType, label: 'Salida', icon: ArrowDown, color: 'text-red-600' },
  { value: 'ajuste' as MovementType, label: 'Ajuste', icon: RotateCcw, color: 'text-yellow-600' },
];

// MOTIVOS PARA ENTRADAS
export const entryReasons = [
  { value: 'compra' as EntryReason, label: 'Compra' },
  { value: 'reposicion' as EntryReason, label: 'Reposición' },
  { value: 'ajuste-positivo' as EntryReason, label: 'Ajuste Positivo' },
  { value: 'devolucion' as EntryReason, label: 'Devolución' },
  { value: 'transferencia-entrada' as EntryReason, label: 'Transferencia de Entrada' },
  { value: 'donacion' as EntryReason, label: 'Donación' },
  { value: 'produccion-interna' as EntryReason, label: 'Producción Interna' },
];

// MOTIVOS PARA SALIDAS
export const exitReasons = [
  { value: 'venta' as ExitReason, label: 'Venta' },
  { value: 'perdida' as ExitReason, label: 'Pérdida' },
  { value: 'roto' as ExitReason, label: 'Roto/Dañado' },
  { value: 'vencido' as ExitReason, label: 'Producto Vencido' },
  { value: 'ajuste-negativo' as ExitReason, label: 'Ajuste Negativo' },
  { value: 'transferencia-salida' as ExitReason, label: 'Transferencia de Salida' },
  { value: 'consumo-interno' as ExitReason, label: 'Consumo Interno' },
  { value: 'merma' as ExitReason, label: 'Merma' },
  { value: 'degustacion' as ExitReason, label: 'Degustación' },
];

// FUNCIÓN PARA OBTENER MOTIVOS SEGÚN EL TIPO
export const getReasonsByType = (type: MovementType) => {
  switch (type) {
    case 'entrada':
      return entryReasons;
    case 'salida':
      return exitReasons;
    case 'ajuste':
      return [...entryReasons, ...exitReasons]; // Para ajustes se pueden usar ambos
    default:
      return [];
  }
};