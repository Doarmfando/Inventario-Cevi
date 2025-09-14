// src/features/movements/components/forms/MovementForm.tsx - COMPLETO

import React from 'react';
import { X, Package } from 'lucide-react';
import type { MovementFormData } from '../../types/movement.types';
import MovementFormFields from './MovementFormFields';
import MovementFormPreview from './MovementFormPreview';
import useMovementForm from '../../hooks/useMovementForm';

interface MovementFormProps {
  onSubmit: (data: MovementFormData) => void;
  onClose: () => void;
}

const MovementForm: React.FC<MovementFormProps> = ({ onSubmit, onClose }) => {
  const {
    formData,
    loading,
    selectedProduct,
    availableProducts,
    containers,
    errors,
    newStockInfo,
    isValid,
    handleInputChange,
    handleSubmit,
    validateForm
  } = useMovementForm({ onSubmit });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      handleSubmit(e);
    }
  };

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
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
          {/* Loading State */}
          {loading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-blue-800 text-sm">Cargando datos...</span>
              </div>
            </div>
          )}

          {/* Campos del formulario */}
          <MovementFormFields
            formData={formData}
            errors={errors}
            selectedProduct={selectedProduct}
            availableProducts={availableProducts}
            containers={containers}
            onInputChange={handleInputChange}
          />

          {/* Preview del movimiento */}
          {selectedProduct && (
            <MovementFormPreview
              formData={formData}
              selectedProduct={selectedProduct}
              newStockInfo={newStockInfo}
            />
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isValid || loading}
              className={`px-6 py-2 text-sm font-medium text-white border border-transparent rounded-lg transition-colors ${
                isValid && !loading
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Registrando...</span>
                </span>
              ) : (
                'Registrar Movimiento'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovementForm;