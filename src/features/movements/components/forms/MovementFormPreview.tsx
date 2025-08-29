// src/features/movements/components/MovementFormPreview.tsx

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { MovementFormData } from '../../types/movement.types';

interface Product {
  id: string;
  name: string;
  container: string;
  currentStock: number;
  currentPackaged: number;
  unit: string;
  estimatedPrice: number;
}

interface MovementFormPreviewProps {
  formData: MovementFormData;
  selectedProduct: Product | undefined;
  newStockInfo: { stock: number; packaged: number } | null;
}

const MovementFormPreview: React.FC<MovementFormPreviewProps> = ({
  formData,
  selectedProduct,
  newStockInfo
}) => {
  if (!newStockInfo || !selectedProduct || formData.quantity === 0) {
    return null;
  }

  const isContainerChanged = formData.selectedContainer !== selectedProduct.container;

  return (
    <div className="space-y-4">
      {/* Preview del Nuevo Stock */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-800 mb-3">Previsualización del Movimiento</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-blue-600">Nuevo Stock</p>
            <p className="text-lg font-semibold text-blue-900">
              {newStockInfo.stock} {selectedProduct.unit}
            </p>
            <p className={`text-xs ${newStockInfo.stock < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formData.type === 'entrada' ? '+' : '-'}{formData.quantity} {selectedProduct.unit}
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

        {/* Mostrar información del cambio de contenedor */}
        {isContainerChanged && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-600">Contenedor de Destino</p>
            <p className="text-sm font-medium text-blue-900">
              {formData.selectedContainer}
            </p>
          </div>
        )}
      </div>

      {/* Alertas de Stock Negativo */}
      {newStockInfo.stock < 0 && (
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

      {/* Alertas de Empaquetados Negativos */}
      {newStockInfo.packaged < 0 && (
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
    </div>
  );
};

export default MovementFormPreview;