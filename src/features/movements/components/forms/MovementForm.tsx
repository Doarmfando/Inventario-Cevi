// src/features/movements/components/forms/MovementForm.tsx

import React from 'react';
import { X, Package } from 'lucide-react';
import type { MovementFormData, AvailableProduct } from '../../types/movement.types';
import type { Container } from '../../../inventory/types';
import { availableProducts } from '../../data/mockData';
import MovementFormFields from './MovementFormFields';
import MovementFormPreview from './MovementFormPreview';
import useMovementForm from '../../hooks/useMovementForm';

interface MovementFormProps {
  onSubmit: (data: MovementFormData) => void;
  onClose: () => void;
}

// Lista de contenedores disponibles - ACTUALIZADA SEGÚN TU SISTEMA
const availableContainers: Container[] = [
  'Congelador 1 - Pescado',
  'Congelador 2 - Mariscos',
  'Congelador 3 - Causa',
  'Congelador 4 - Verduras',
  'Refrigerador 5 - Gaseosas',
  'Refrigerador 6 - Cervezas',
  'Almacén Seco'
];

const MovementForm: React.FC<MovementFormProps> = ({ onSubmit, onClose }) => {
  const {
    formData,
    errors,
    newStockInfo,
    handleInputChange,
    handleSubmit
  } = useMovementForm({ 
    availableProducts, 
    onSubmit 
  });

  // 🔹 Forzar que el selectedProduct sea un AvailableProduct (usando el mockData)
  const matchedProduct: AvailableProduct | undefined =
    availableProducts.find(p => p.id === formData.productId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Nuevo Movimiento</h2>
              <p className="text-sm text-gray-600">Registra una entrada, salida o ajuste de inventario</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Campos del formulario */}
          <MovementFormFields
            formData={formData}
            errors={errors}
            selectedProduct={matchedProduct}  // ✅ ahora sí es AvailableProduct | undefined
            availableProducts={availableProducts}
            availableContainers={availableContainers}
            onInputChange={handleInputChange}
          />

          {/* Preview y Alertas */}
          <MovementFormPreview
            formData={formData}
            selectedProduct={matchedProduct}  // ✅ igual aquí
            newStockInfo={newStockInfo}
          />

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
            >
              Registrar Movimiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovementForm;
