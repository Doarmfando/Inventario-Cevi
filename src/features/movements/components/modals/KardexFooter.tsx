// src/features/movements/components/modals/KardexFooter.tsx

import React from 'react';
import { formatDate } from '../../utils/kardex.utils';

interface KardexFooterProps {
  entriesCount: number;
  productName: string;
}

export const KardexFooter: React.FC<KardexFooterProps> = ({ 
  entriesCount, 
  productName 
}) => {
  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Mostrando {entriesCount} movimiento{entriesCount !== 1 ? 's' : ''} 
          para {productName}
        </div>
        
        <div className="text-sm text-gray-600">
          Última actualización: {formatDate(new Date())}
        </div>
      </div>
    </div>
  );
};