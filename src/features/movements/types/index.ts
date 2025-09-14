// src/features/movements/types/index.ts
// ARCHIVO PRINCIPAL - EXPORTA TODOS LOS TIPOS LIMPIOS

// Base de Datos
export type { 
  MovementType,
  MotivoMovimiento,
  AvailableProduct,
  Movement
} from './movement.database';

// Formularios
export type {
  MovementFormData,
  MovementFilters,
  MovementReasonOption,
  MovementReasonOptions
} from './movement.forms';

// Vistas
export type {
  MovementWithCalculatedData,
  KardexEntry,
  MovementTableColumn
} from './movement.view';