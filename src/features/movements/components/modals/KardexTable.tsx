// src/features/movements/components/modals/KardexTable.tsx

import React from 'react';
import { TrendingUp, TrendingDown, RotateCcw, Package } from 'lucide-react';
import type { KardexMovement } from '../../types/kardex.types';

interface KardexTableProps {
  movimientos: KardexMovement[];
  unidad_medida: string;
}

export const KardexTable: React.FC<KardexTableProps> = ({ movimientos, unidad_medida }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      time: date.toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    };
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  const getMovementIcon = (tipo: string) => {
    switch (tipo) {
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

  const getMovementTypeClass = (tipo: string) => {
    switch (tipo) {
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

  if (movimientos.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay movimientos</h3>
          <p className="text-gray-600">No se encontraron movimientos para este producto.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-auto flex-1">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Entrada ({unidad_medida})
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Salida ({unidad_medida})
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Saldo ({unidad_medida})
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              P. Unit.
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Detalles
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {movimientos.map((movement) => {
            const formatted = formatDate(movement.fecha_movimiento);
            
            return (
              <tr key={movement.id} className="hover:bg-gray-50">
                {/* Fecha */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="font-medium">{formatted.date}</div>
                  <div className="text-xs text-gray-500">{formatted.time}</div>
                </td>
                
                {/* Tipo */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getMovementIcon(movement.tipo_movimiento)}
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMovementTypeClass(movement.tipo_movimiento)}`}>
                      {movement.tipo_movimiento.charAt(0).toUpperCase() + movement.tipo_movimiento.slice(1)}
                    </span>
                  </div>
                </td>
                
                {/* Entrada */}
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                  {movement.tipo_movimiento === 'entrada' ? (
                    <span className="text-green-600 font-medium">
                      +{movement.cantidad}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                
                {/* Salida */}
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                  {movement.tipo_movimiento === 'salida' ? (
                    <span className="text-red-600 font-medium">
                      -{movement.cantidad}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                
                {/* Saldo */}
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-900">
                  {movement.saldo_corriente}
                </td>
                
                {/* Precio Unitario */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {formatCurrency(movement.precio_real)}
                </td>
                
                {/* Valor Total */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {formatCurrency(movement.valor_total)}
                </td>
                
                {/* Detalles */}
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-xs">
                    <div className="font-medium">{movement.motivo_nombre}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {movement.contenedor_nombre}
                    </div>
                    {movement.empaquetado && (
                      <div className="text-xs text-gray-500 mt-1">
                        Empaquetado: {movement.empaquetado}
                      </div>
                    )}
                    {movement.numero_documento && (
                      <div className="text-xs text-gray-500 mt-1">
                        Doc: {movement.numero_documento}
                      </div>
                    )}
                    {movement.observacion && (
                      <div className="text-xs text-gray-500 mt-1" title={movement.observacion}>
                        {movement.observacion.length > 30 
                          ? `${movement.observacion.substring(0, 30)}...` 
                          : movement.observacion}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};