// src/features/movements/components/MovementForm.tsx

import React, { useState } from 'react';
import { X, Package, Calendar, AlertTriangle } from 'lucide-react';
import type { MovementFormData } from '../types/movement.types';
import { mockProducts } from '../data/mockData';
import { movementTypes, productStates } from '../constants/formConstants';
import { calculateDaysToExpiry, getExpiryStatus, getTodayDate } from '../utils/formUtils';
import { validateMovementForm, type FormErrors } from '../utils/formValidation';

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
    expiryDate: '',
    state: 'fresco',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const daysToExpiry = calculateDaysToExpiry(formData.expiryDate || '');
  const expiryStatus = getExpiryStatus(daysToExpiry);
  const today = getTodayDate();

  const validateForm = (): boolean => {
    const newErrors = validateMovementForm(formData);
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
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const selectedProduct = mockProducts.find(p => p.id === formData.productId);

  // Obtener la fecha mínima (hoy)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
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
              {mockProducts.map((product) => (
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

          {/* Fecha de Vencimiento y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fecha de Vencimiento */}
            <div>
              <label htmlFor="expiryDate" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Fecha de Vencimiento (Opcional)
              </label>
              <input
                type="date"
                id="expiryDate"
                value={formData.expiryDate || ''}
                min={today}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.expiryDate && (
                <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
              )}
              
              {/* Indicador de días hasta vencimiento */}
              {expiryStatus && (
                <div className={`mt-2 flex items-center text-sm ${expiryStatus.color}`}>
                  <span className="mr-2">{expiryStatus.icon}</span>
                  <span className="font-medium">{expiryStatus.message}</span>
                </div>
              )}
            </div>

            {/* Estado del Producto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado del Producto
              </label>
              <div className="space-y-2">
                {productStates.map((state) => (
                  <label key={state.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="state"
                      value={state.value}
                      checked={formData.state === state.value}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex items-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${state.color}`}>
                        {state.label}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">{state.description}</span>
                    </div>
                  </label>
                ))}
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
              <div className="flex items-center justify-between mb-2">
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
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-700">Valor Total:</span>
                  <span className="text-lg font-semibold text-blue-900">
                    S/ {(formData.quantity * formData.unitPrice).toFixed(2)}
                  </span>
                </div>
              )}

              {formData.expiryDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">Fecha de Vencimiento:</span>
                  <span className="text-sm font-medium text-blue-900">
                    {new Date(formData.expiryDate).toLocaleDateString('es-PE')}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Alerta si el producto está por vencer o vencido */}
          {expiryStatus && (expiryStatus.color === 'text-red-600' || expiryStatus.color === 'text-orange-600') && (
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-orange-800">Atención</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Este producto {daysToExpiry && daysToExpiry < 0 ? 'está vencido' : 'está próximo a vencer'}. 
                    Verifica que sea correcto registrar este movimiento.
                  </p>
                </div>
              </div>
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