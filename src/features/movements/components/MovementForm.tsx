// src/features/movements/components/MovementForm.tsx

import React, { useState } from 'react';
import { X, Package, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import type { MovementFormData, MovementType } from '../types/movement.types';

interface MovementFormProps {
  onSubmit: (data: MovementFormData) => void;
  onClose: () => void;
}

const MovementForm: React.FC<MovementFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<MovementFormData>({
    productId: '',
    type: 'entrada',
    quantity: 0,
    reason: '',
    documentNumber: '',
    unitPrice: undefined,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MovementFormData, string>>>({});

  // Mock data - En tu app real, esto vendría de tu estado/API
  const products = [
    { id: '1', name: 'Lenguado Filetes', code: 'LF001', currentStock: 15 },
    { id: '2', name: 'Pulpo', code: 'P001', currentStock: 8 },
    { id: '3', name: 'Yuca', code: 'Y001', currentStock: 25 },
    { id: '4', name: 'Rocoto', code: 'R001', currentStock: 5 },
  ];

  const movementTypes = [
    { value: 'entrada' as MovementType, label: 'Entrada', icon: ArrowUp, color: 'text-green-600' },
    { value: 'salida' as MovementType, label: 'Salida', icon: ArrowDown, color: 'text-red-600' },
    { value: 'ajuste' as MovementType, label: 'Ajuste', icon: RotateCcw, color: 'text-yellow-600' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof MovementFormData, string>> = {};

    if (!formData.productId) {
      newErrors.productId = 'Selecciona un producto';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'La cantidad debe ser mayor a 0';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'El motivo es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof MovementFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const selectedProduct = products.find(p => p.id === formData.productId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
          {/* Tipo de Movimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Movimiento
            </label>
            <div className="grid grid-cols-3 gap-3">
              {movementTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('type', type.value)}
                    className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
                      formData.type === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${type.color}`} />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Producto */}
          <div>
            <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-2">
              Producto
            </label>
            <select
              id="productId"
              value={formData.productId}
              onChange={(e) => handleInputChange('productId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.productId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecciona un producto...</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.code} (Stock: {product.currentStock})
                </option>
              ))}
            </select>
            {errors.productId && (
              <p className="mt-1 text-sm text-red-600">{errors.productId}</p>
            )}
          </div>

          {/* Stock Actual */}
          {selectedProduct && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Stock Actual:</span>
                <span className="text-lg font-semibold text-gray-900">
                  {selectedProduct.currentStock} unidades
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cantidad */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                step="1"
                value={formData.quantity === 0 ? '' : formData.quantity}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                  handleInputChange('quantity', isNaN(value) ? 0 : value);
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.quantity ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ingresa la cantidad"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
              )}
            </div>

            {/* Precio Unitario (opcional) */}
            <div>
              <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Precio Unitario (Opcional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  S/
                </span>
                <input
                  type="number"
                  id="unitPrice"
                  min="0"
                  step="0.01"
                  value={formData.unitPrice || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                    handleInputChange('unitPrice', isNaN(value as number) ? undefined : value);
                  }}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Número de Documento */}
          <div>
            <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Número de Documento (Opcional)
            </label>
            <input
              type="text"
              id="documentNumber"
              value={formData.documentNumber || ''}
              onChange={(e) => handleInputChange('documentNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Factura 001-001-0001"
            />
          </div>

          {/* Motivo */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Motivo
            </label>
            <textarea
              id="reason"
              rows={3}
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                errors.reason ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe el motivo del movimiento..."
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
            )}
          </div>

          {/* Preview del Nuevo Stock */}
          {selectedProduct && formData.quantity > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">Nuevo Stock (Estimado):</span>
                <span className="text-lg font-semibold text-blue-900">
                  {formData.type === 'entrada'
                    ? selectedProduct.currentStock + formData.quantity
                    : formData.type === 'salida'
                    ? selectedProduct.currentStock - formData.quantity
                    : selectedProduct.currentStock
                  } unidades
                </span>
              </div>
              {formData.unitPrice && (
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-blue-700">Valor Total:</span>
                  <span className="text-lg font-semibold text-blue-900">
                    S/ {(formData.quantity * formData.unitPrice).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
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