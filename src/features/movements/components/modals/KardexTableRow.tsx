// src/features/movements/components/modals/KardexTableRow.tsx

import React from 'react';
import { TrendingUp, TrendingDown, RotateCcw } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/kardex.utils';
import { getReasonLabel } from '../../utils/movementUtils';
import type { KardexEntry } from '../../types/movement.types';

interface KardexTableRowProps {
  entry: KardexEntry;
}

export const KardexTableRow: React.FC<KardexTableRowProps> = ({ entry }) => {
  const getMovementIcon = (type: KardexEntry['type']) => {
    switch (type) {
      case 'entrada':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'salida':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'ajuste':
        return <RotateCcw className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getMovementTypeClass = (type: KardexEntry['type']) => {
    switch (type) {
      case 'entrada':
        return 'bg-green-100 text-green-800';
      case 'salida':
        return 'bg-red-100 text-red-800';
      case 'ajuste':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMovementTypeName = (type: KardexEntry['type']) => {
    switch (type) {
      case 'entrada':
        return 'Entrada';
      case 'salida':
        return 'Salida';
      case 'ajuste':
        return 'Ajuste';
      default:
        return type;
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(entry.createdAt)}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          {getMovementIcon(entry.type)}
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMovementTypeClass(entry.type)}`}>
            {getMovementTypeName(entry.type)}
          </span>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
        {entry.type === 'entrada' || (entry.type === 'ajuste' && entry.quantity > 0) ? (
          <span className="text-green-600 font-medium">
            +{entry.quantity}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
        {entry.type === 'salida' || (entry.type === 'ajuste' && entry.quantity < 0) ? (
          <span className="text-red-600 font-medium">
            -{Math.abs(entry.quantity)}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-900">
        {entry.runningBalance}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
        {entry.unitPrice ? formatCurrency(entry.unitPrice) : '-'}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
        {entry.totalValue ? formatCurrency(entry.totalValue) : '-'}
      </td>
      
      <td className="px-6 py-4 text-sm text-gray-900">
        <div className="max-w-xs">
          <div className="font-medium">{getReasonLabel(entry.reason)}</div>
          {entry.observations && (
            <div className="text-xs text-gray-500 mt-1">
              {entry.observations}
            </div>
          )}
          {entry.documentNumber && (
            <div className="text-xs text-gray-500 mt-1">
              Doc: {entry.documentNumber}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};
