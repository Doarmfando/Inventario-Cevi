// src/features/movements/utils/formValidation.ts

import type { MovementFormData } from '../types/movement.types';

export interface FormErrors {
  productId?: string;
  quantity?: string;
  reason?: string;
  expiryDate?: string;
}

export const validateMovementForm = (formData: MovementFormData): FormErrors => {
  const errors: FormErrors = {};

  // Validar producto
  if (!formData.productId) {
    errors.productId = 'Selecciona un producto';
  }

  // Validar cantidad
  if (formData.quantity <= 0) {
    errors.quantity = 'La cantidad debe ser mayor a 0';
  }

  // Validar motivo
  if (!formData.reason.trim()) {
    errors.reason = 'El motivo es requerido';
  }

  // Validar fecha de vencimiento
  if (formData.expiryDate) {
    const selectedDate = new Date(formData.expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today && formData.type === 'entrada') {
      errors.expiryDate = 'No se pueden registrar entradas con productos ya vencidos';
    }
  }

  return errors;
};