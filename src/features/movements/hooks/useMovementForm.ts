// src/features/movements/hooks/useMovementForm.ts - CORREGIDO

import { useState, useEffect } from 'react';
import type { MovementFormData, AvailableProduct } from '../types/movement.types';
import { getReasonsByType } from '../constants/formConstants';

interface UseMovementFormProps {
  availableProducts: AvailableProduct[];
  onSubmit: (data: MovementFormData) => void;
}

interface UseMovementFormReturn {
  formData: MovementFormData;
  errors: Record<string, string>;
  selectedProduct: AvailableProduct | undefined;
  newStockInfo: { stock: number; packaged: number } | null;
  isValid: boolean;
  handleInputChange: (field: keyof MovementFormData, value: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  validateForm: () => boolean;
}

const useMovementForm = ({ 
  availableProducts, 
  onSubmit 
}: UseMovementFormProps): UseMovementFormReturn => {
  const [formData, setFormData] = useState<MovementFormData>({
    productId: '',
    type: 'entrada',
    quantity: 0,
    packagedUnits: 0,
    reason: 'compra',
    observations: '',
    documentNumber: '',
    unitPrice: undefined,
    selectedContainer: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedProduct = availableProducts.find(p => p.id === formData.productId);

  // Actualizar el motivo por defecto cuando cambia el tipo
  useEffect(() => {
    const reasonOptions = getReasonsByType(formData.type);
    if (reasonOptions.length > 0) {
      setFormData(prev => ({
        ...prev,
        reason: reasonOptions[0].value
      }));
    }
  }, [formData.type]);

  // Actualizar precio unitario y contenedor cuando se selecciona un producto
  useEffect(() => {
    if (selectedProduct) {
      setFormData(prev => ({
        ...prev,
        unitPrice: prev.unitPrice === undefined ? selectedProduct.estimatedPrice : prev.unitPrice,
        selectedContainer: prev.selectedContainer === undefined ? selectedProduct.container : prev.selectedContainer
      }));
    }
  }, [selectedProduct]);

  // Función para validar el formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.productId) {
      newErrors.productId = 'Selecciona un producto';
    }

    if (!formData.selectedContainer) {
      newErrors.selectedContainer = 'Selecciona un contenedor';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'La cantidad debe ser mayor a 0';
    }

    if (formData.packagedUnits < 0) {
      newErrors.packagedUnits = 'Los empaquetados no pueden ser negativos';
    }

    if (selectedProduct && formData.type === 'salida') {
      if (formData.quantity > selectedProduct.currentStock) {
        newErrors.quantity = `Stock insuficiente. Disponible: ${selectedProduct.currentStock} ${selectedProduct.unit}`;
      }
      if (formData.packagedUnits > selectedProduct.currentPackaged) {
        newErrors.packagedUnits = `Empaquetados insuficientes. Disponibles: ${selectedProduct.currentPackaged}`;
      }
    }

    if (!formData.reason) {
      newErrors.reason = 'Selecciona un motivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleInputChange = (field: keyof MovementFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Manejar submit del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        container: formData.selectedContainer,
      };
      onSubmit(submitData);
    }
  };

  // Calcular nuevo stock estimado
  const calculateNewStock = () => {
    if (!selectedProduct || formData.quantity === 0) return null;
    
    let newStock = selectedProduct.currentStock;
    let newPackaged = selectedProduct.currentPackaged;
    
    if (formData.type === 'entrada') {
      newStock += formData.quantity;
      newPackaged += formData.packagedUnits;
    } else if (formData.type === 'salida') {
      newStock -= formData.quantity;
      newPackaged -= formData.packagedUnits;
    }
    
    return { stock: newStock, packaged: newPackaged };
  };

  const newStockInfo = calculateNewStock();
  const isValid = Object.keys(errors).length === 0;

  return {
    formData,
    errors,
    selectedProduct,
    newStockInfo,
    isValid,
    handleInputChange,
    handleSubmit,
    validateForm
  };
};

export default useMovementForm;