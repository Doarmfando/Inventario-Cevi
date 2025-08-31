// src/features/movements/components/MovementFormFields.tsx

import React, { useEffect, useRef } from 'react';
import { Package, MapPin, Scale } from 'lucide-react';
import type { MovementFormData, AvailableProduct } from '../../types/movement.types';
import type { Container } from '../../../inventory/types';
import { movementTypes, getReasonsByType } from '../../constants/formConstants';

// Contenedores disponibles según el sistema de inventario
const availableContainers: Container[] = [
  'Congelador 1 - Pescado',
  'Congelador 2 - Mariscos',
  'Congelador 3 - Causa',
  'Congelador 4 - Verduras',
  'Refrigerador 5 - Gaseosas',
  'Refrigerador 6 - Cervezas',
  'Almacén Seco'
];

// Recomendaciones de contenedores por categoría
const CONTAINER_RECOMMENDATIONS: Record<string, Container[]> = {
  'Pescados': ['Congelador 1 - Pescado'],
  'Mariscos': ['Congelador 2 - Mariscos'],
  'Causa': ['Congelador 3 - Causa'],
  'Tubérculos': ['Congelador 3 - Causa', 'Congelador 4 - Verduras'],
  'Cítricos': ['Congelador 3 - Causa', 'Congelador 4 - Verduras'],
  'Condimentos': ['Congelador 3 - Causa', 'Congelador 4 - Verduras', 'Almacén Seco'],
  'Verduras': ['Congelador 4 - Verduras'],
  'Bebidas': ['Refrigerador 5 - Gaseosas'],
  'Bebidas Alcohólicas': ['Refrigerador 6 - Cervezas', 'Almacén Seco'],
  'Aceites': ['Almacén Seco'],
  'Granos': ['Almacén Seco'],
  'Harinas': ['Almacén Seco'],
  'Suministros': ['Almacén Seco'],
  'Limpieza': ['Almacén Seco']
};

// Función para obtener el contenedor por defecto según el producto seleccionado
const getDefaultContainer = (product: AvailableProduct): Container => {
  // Primero intentar usar el contenedor actual del producto
  if (product.container) {
    return product.container;
  }
  
  // Si no tiene contenedor actual, usar el primer recomendado para su categoría
  const recommendations = CONTAINER_RECOMMENDATIONS[product.category];
  if (recommendations && recommendations.length > 0) {
    return recommendations[0];
  }
  
  return 'Almacén Seco'; // Fallback
};

// Función para obtener contenedores recomendados para una categoría
const getRecommendedContainers = (category: string): Container[] => {
  return CONTAINER_RECOMMENDATIONS[category] || availableContainers;
};

interface MovementFormFieldsProps {
  formData: MovementFormData;
  errors: Record<string, string>;
  selectedProduct: AvailableProduct | undefined;
  availableProducts: AvailableProduct[];
  availableContainers: Container[];
  onInputChange: (field: keyof MovementFormData, value: any) => void;
}

const MovementFormFields: React.FC<MovementFormFieldsProps> = ({
  formData,
  errors,
  selectedProduct,
  availableProducts,
  availableContainers,
  onInputChange
}) => {
  const reasonOptions = getReasonsByType(formData.type);
  const previousProductId = useRef<string | null>(null);
  
  // Obtener contenedores recomendados basados en la categoría del producto seleccionado
  const recommendedContainers = selectedProduct 
    ? getRecommendedContainers(selectedProduct.category)
    : availableContainers;

  // Auto-seleccionar contenedor por defecto SOLO cuando cambie de producto
  useEffect(() => {
    if (selectedProduct && selectedProduct.id !== previousProductId.current) {
      const defaultContainer = getDefaultContainer(selectedProduct);
      onInputChange('selectedContainer', defaultContainer);
      previousProductId.current = selectedProduct.id;
    }
  }, [selectedProduct, onInputChange]); // Solo cuando cambie el ID del producto

  return (
    <div className="space-y-6">
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
                onClick={() => onInputChange('type', type.value)}
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

      {/* Motivo y Precio Unitario en la misma fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Motivo */}
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
            Motivo
          </label>
          <select
            id="reason"
            value={formData.reason}
            onChange={(e) => onInputChange('reason', e.target.value)}
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
                onInputChange('unitPrice', isNaN(value as number) ? undefined : value);
              }}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Selección de Producto y Contenedor en la misma fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selección de Producto */}
        <div>
          <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona el Producto
          </label>
          <select
            id="productId"
            value={formData.productId}
            onChange={(e) => onInputChange('productId', e.target.value)}
            className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.productId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecciona un producto...</option>
            {availableProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - Stock: {product.currentStock} {product.unit} - Empaquetados: {product.currentPackaged}
              </option>
            ))}
          </select>
          {errors.productId && (
            <p className="mt-1 text-sm text-red-600">{errors.productId}</p>
          )}
        </div>
        {/* Selección de Contenedor */}
        <div>
          <label
            htmlFor="selectedContainer"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Contenedor de Destino
            {selectedProduct?.container && (
              <span className="text-xs text-gray-500 ml-2">
                (Actual: {selectedProduct.container})
              </span>
            )}
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              id="selectedContainer"
              value={formData.selectedContainer}
              onChange={(e) => onInputChange("selectedContainer", e.target.value)}
              className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.selectedContainer ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Selecciona un contenedor...</option>

              {/* Contenedores recomendados primero */}
              <optgroup label="Recomendados para esta categoría">
                {recommendedContainers.map((container) => (
                  <option key={container} value={container}>
                    {container}
                    {selectedProduct?.container === container ? " (Actual)" : ""}
                  </option>
                ))}
              </optgroup>

              {/* Otros contenedores */}
              {recommendedContainers.length < availableContainers.length && (
                <optgroup label="Otros contenedores">
                  {availableContainers
                    .filter(
                      (container) => !recommendedContainers.includes(container)
                    )
                    .map((container) => (
                      <option key={container} value={container}>
                        {container}
                        {selectedProduct?.container === container ? " (Actual)" : ""}
                      </option>
                    ))}
                </optgroup>
              )}
            </select>
          </div>

          {errors.selectedContainer && (
            <p className="mt-1 text-sm text-red-600">{errors.selectedContainer}</p>
          )}
        </div>
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
                <p className="text-xs text-gray-500">Ubicación Actual</p>
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

      {/* Cantidad y Empaquetados */}
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
              onInputChange('quantity', isNaN(value) ? 0 : value);
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
              onInputChange('packagedUnits', isNaN(value) ? 0 : value);
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

      {/* Número de Documento */}
      <div>
        <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Número de Documento (Opcional)
        </label>
        <input
          type="text"
          id="documentNumber"
          value={formData.documentNumber || ''}
          onChange={(e) => onInputChange('documentNumber', e.target.value)}
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
          onChange={(e) => onInputChange('observations', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Describe detalles adicionales del movimiento..."
        />
      </div>
    </div>
  );
};

export default MovementFormFields;