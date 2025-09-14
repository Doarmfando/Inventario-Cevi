// src/features/movements/components/forms/MovementFormPreview.tsx - LIMPIO SIN DUPLICACIONES

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { MovementFormData, AvailableProduct } from '../../types/movement.types';

interface MovementFormPreviewProps {
  formData: MovementFormData;
  selectedProduct: AvailableProduct | undefined;
  newStockInfo: { stock: number } | null;
}

const MovementFormPreview: React.FC<MovementFormPreviewProps> = ({
  formData,
  selectedProduct,
  newStockInfo
}) => {
  if (!newStockInfo || !selectedProduct || formData.cantidad === 0) {
    return null;
  }

  const valorTotal = formData.precio_real ? formData.cantidad * formData.precio_real : null;

  return (
    <div className="space-y-4">
      {/* Preview del Movimiento */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-800 mb-3">
          Previsualización del Movimiento
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-blue-600">Nuevo Stock</p>
            <p className="text-lg font-semibold text-blue-900">
              {newStockInfo.stock} {selectedProduct.unidad_medida}
            </p>
            <p className="text-xs text-blue-600">
              {formData.tipo_movimiento === 'entrada' ? '+' : 
               formData.tipo_movimiento === 'salida' ? '-' : '='}{formData.cantidad}
            </p>
          </div>

          {valorTotal && (
            <div>
              <p className="text-xs text-blue-600">Valor Total</p>
              <p className="text-lg font-semibold text-blue-900">
                S/ {valorTotal.toFixed(2)}
              </p>
            </div>
          )}

          <div>
            <p className="text-xs text-blue-600">Producto</p>
            <p className="text-sm font-semibold text-blue-900">
              {selectedProduct.nombre}
            </p>
            <p className="text-xs text-blue-600">{selectedProduct.categoria}</p>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {newStockInfo.stock < 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Stock Insuficiente</h4>
              <p className="text-sm text-red-700 mt-1">
                Este movimiento resultará en stock negativo ({newStockInfo.stock} {selectedProduct.unidad_medida}).
              </p>
            </div>
          </div>
        </div>
      )}

      {newStockInfo.stock >= 0 && newStockInfo.stock <= selectedProduct.stock_min && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Stock Bajo</h4>
              <p className="text-sm text-yellow-700 mt-1">
                El stock quedará por debajo del mínimo ({selectedProduct.stock_min} {selectedProduct.unidad_medida}).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovementFormPreview;