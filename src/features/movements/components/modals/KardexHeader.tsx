// src/features/movements/components/modals/KardexHeader.tsx

import React from 'react';
import { X, Package, Download } from 'lucide-react';
import type { Product } from '../../types/kardex.types';

interface KardexHeaderProps {
  product: Product;
  onClose: () => void;
  onExport: () => void;
}

export const KardexHeader: React.FC<KardexHeaderProps> = ({ 
  product, 
  onClose, 
  onExport 
}) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Package className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Kardex - {product.name}
          </h2>
          <p className="text-sm text-gray-600">
            Código: {product.code} • Stock Actual: {product.currentStock} unidades
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={onExport}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Exportar</span>
        </button>
        
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};