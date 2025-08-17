// src/features/movements/components/MovementsList.tsx

import React from 'react';
import { Eye, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import type { Movement } from '../types/movement.types';

interface MovementsListProps {
  movements: Movement[];
  onViewKardex: (productId: string) => void;
}

const MovementsList: React.FC<MovementsListProps> = ({ movements, onViewKardex }) => {
  const getMovementIcon = (type: Movement['type']) => {
    switch (type) {
      case 'entrada':
        return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'salida':
        return <ArrowDown className="w-4 h-4 text-red-600" />;
      case 'ajuste':
        return <RotateCcw className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getMovementTypeClass = (type: Movement['type']) => {
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

  const getMovementTypeName = (type: Movement['type']) => {
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  if (movements.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <ArrowUp className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay movimientos</h3>
          <p className="text-gray-600">Comienza registrando tu primer movimiento de inventario.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Anterior
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Nuevo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Motivo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {movements.map((movement) => (
              <tr key={movement.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(movement.createdAt)}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {movement.productName}
                    </div>
                    {movement.productCode && (
                      <div className="text-sm text-gray-500">
                        {movement.productCode}
                      </div>
                    )}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getMovementIcon(movement.type)}
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMovementTypeClass(movement.type)}`}>
                      {getMovementTypeName(movement.type)}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    movement.type === 'entrada' ? 'text-green-600' : 
                    movement.type === 'salida' ? 'text-red-600' : 
                    'text-yellow-600'
                  }`}>
                    {movement.type === 'entrada' ? '+' : movement.type === 'salida' ? '-' : '±'}
                    {movement.quantity}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {movement.previousStock}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {movement.newStock}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {movement.totalValue ? formatCurrency(movement.totalValue) : '-'}
                </td>
                
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs">
                    {movement.reason}
                    {movement.documentNumber && (
                      <div className="text-xs text-gray-500 mt-1">
                        Doc: {movement.documentNumber}
                      </div>
                    )}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => onViewKardex(movement.productId)}
                    className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-900 transition-colors"
                    title="Ver Kardex"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Kardex</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Mostrando {movements.length} movimiento{movements.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default MovementsList;