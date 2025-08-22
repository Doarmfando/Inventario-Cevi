// src/features/movements/components/MovementForm.tsx

import React, { useState, useEffect } from 'react';
import { X, Package, AlertTriangle, MapPin, Scale } from 'lucide-react';
import type { MovementFormData } from '../types/movement.types';
import { availableProducts } from '../data/mockData';
import { movementTypes, getReasonsByType } from '../constants/formConstants';

interface MovementFormProps {
  onSubmit: (data: MovementFormData) => void;
  onClose: () => void;
}

const MovementForm: React.FC<MovementFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<MovementFormData>({
    productId: '',
    type: 'entrada',
    quantity: 0,
    packagedUnits: 0,
    reason: 'compra', // Valor por defecto
    observations: '',
    documentNumber: '',
    unitPrice: undefined,
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

  // Actualizar precio unitario cuando se selecciona un producto
  useEffect(() => {
    if (selectedProduct && formData.unitPrice === undefined) {
      setFormData(prev => ({
        ...prev,
        unitPrice: selectedProduct.estimatedPrice
      }));
    }
  }, [selectedProduct, formData.unitPrice]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.productId) {
      newErrors.productId = 'Selecciona un producto';
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
      setErrors(prev => ({ ...prev, [field]: '' }));
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
  const reasonOptions = getReasonsByType(formData.type);

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
              Selecciona el Producto
            </label>
            <select
              id="productId"
              value={formData.productId}
              onChange={(e) => handleInputChange('productId', e.target.value)}
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.productId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecciona un producto...</option>
              {availableProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.container} - Stock: {product.currentStock} {product.unit} - Empaquetados: {product.currentPackaged}
                </option>
              ))}
            </select>
            {errors.productId && (
              <p className="mt-1 text-sm text-red-600">{errors.productId}</p>
            )}
          </div>

          {/* Información del Producto Seleccionado */}
          {selectedProduct && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Producto</p>
                    <p className="font-medium text-gray-900">{selectedProduct.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Contenedor</p>
                    <p className="font-medium text-gray-900">{selectedProduct.container}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Stock Actual</p>
                    <p className="font-medium text-gray-900">{selectedProduct.currentStock} {selectedProduct.unit}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Empaquetados</p>
                    <p className="font-medium text-gray-900">{selectedProduct.currentPackaged}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cantidad */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad {selectedProduct && `(${selectedProduct.unit})`}
              </label>
              <input
                type="number"
                id="quantity"
                min="0"
                step="0.1"
                value={formData.quantity === 0 ? '' : formData.quantity}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
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

            {/* Empaquetados */}
            <div>
              <label htmlFor="packagedUnits" className="block text-sm font-medium text-gray-700 mb-2">
                Empaquetados
              </label>
              <input
                type="number"
                id="packagedUnits"
                min="0"
                step="1"
                value={formData.packagedUnits === 0 ? '' : formData.packagedUnits}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                  handleInputChange('packagedUnits', isNaN(value) ? 0 : value);
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.packagedUnits ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Cantidad de empaquetados"
              />
              {errors.packagedUnits && (
                <p className="mt-1 text-sm text-red-600">{errors.packagedUnits}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Motivo */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Motivo
              </label>
              <select
                id="reason"
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.reason ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {reasonOptions.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
              )}
            </div>

            {/* Precio Unitario */}
            <div>
              <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Precio Unitario
                {selectedProduct && (
                  <span className="text-xs text-gray-500 ml-1">
                    (Estimado: S/ {selectedProduct.estimatedPrice.toFixed(2)})
                  </span>
                )}
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
              placeholder="Ej: FAC-001-2024, BOL-001-0156"
            />
          </div>

          {/* Observaciones */}
          <div>
            <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones (Opcional)
            </label>
            <textarea
              id="observations"
              rows={3}
              value={formData.observations || ''}
              onChange={(e) => handleInputChange('observations', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Describe detalles adicionales del movimiento..."
            />
          </div>

          {/* Preview del Nuevo Stock */}
          {newStockInfo && formData.quantity > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-800 mb-3">Previsualización del Movimiento</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-blue-600">Nuevo Stock</p>
                  <p className="text-lg font-semibold text-blue-900">
                    {newStockInfo.stock} {selectedProduct?.unit}
                  </p>
                  <p className={`text-xs ${newStockInfo.stock < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formData.type === 'entrada' ? '+' : '-'}{formData.quantity} {selectedProduct?.unit}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-blue-600">Empaquetados</p>
                  <p className="text-lg font-semibold text-blue-900">
                    {newStockInfo.packaged}
                  </p>
                  <p className={`text-xs ${newStockInfo.packaged < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formData.type === 'entrada' ? '+' : '-'}{formData.packagedUnits}
                  </p>
                </div>

                {formData.unitPrice && formData.quantity > 0 && (
                  <div>
                    <p className="text-xs text-blue-600">Valor Total</p>
                    <p className="text-lg font-semibold text-blue-900">
                      S/ {(formData.quantity * formData.unitPrice).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Alertas de Stock */}
          {newStockInfo && newStockInfo.stock < 0 && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Stock Insuficiente</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Este movimiento resultará en stock negativo. Verifica la cantidad disponible.
                  </p>
                </div>
              </div>
            </div>
          )}

          {newStockInfo && newStockInfo.packaged < 0 && (
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-orange-800">Empaquetados Insuficientes</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Este movimiento resultará en empaquetados negativos.
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