// src/features/movements/components/tables/MovementsList.tsx - SIN UNIDAD DE MEDIDA

import React from 'react';
import { Eye, ArrowUp, ArrowDown, RotateCcw, Edit, Trash2 } from 'lucide-react';
import type { Movement, MovementType } from '../../types/movement.types';

interface MovementsListProps {
  movements: Movement[];
  onViewKardex: (productId: string) => void;
  onEdit?: (movement: Movement) => void;
  onDelete?: (movementId: string) => void;
}

const MovementsList: React.FC<MovementsListProps> = ({ 
  movements, 
  onViewKardex, 
  onEdit, 
  onDelete 
}) => {
  
  const getMovementIcon = (tipoMovimiento?: MovementType) => {
    switch (tipoMovimiento) {
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

  const getMovementTypeClass = (tipoMovimiento?: MovementType) => {
    switch (tipoMovimiento) {
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

  const getMovementTypeLabel = (tipoMovimiento?: MovementType) => {
    switch (tipoMovimiento) {
      case 'entrada':
        return 'Entrada';
      case 'salida':
        return 'Salida';
      case 'ajuste':
        return 'Ajuste';
      default:
        return 'Desconocido';
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    
    return {
      date: date.toLocaleDateString('es-PE', dateOptions),
      time: date.toLocaleTimeString('es-PE', timeOptions)
    };
  };

  const formatQuantity = (cantidad: number, tipoMovimiento?: MovementType) => {
    const sign = tipoMovimiento === 'entrada' ? '+' : tipoMovimiento === 'salida' ? '-' : '';
    return `${sign}${cantidad}`;
  };

  const truncateText = (text: string, maxLength: number = 30) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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
              {/* Fecha */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              
              {/* Producto */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              
              {/* Contenedor */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contenedor
              </th>
              
              {/* Tipo */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              
              {/* Cantidad */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              
              {/* Stock Anterior */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Anterior
              </th>
              
              {/* Stock Nuevo */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Nuevo
              </th>
              
              {/* Valor Total */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Total
              </th>
              
              {/* Motivo */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Motivo
              </th>
              
              {/* Observación */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Observación
              </th>
              
              {/* Acciones */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {movements.map((movement) => {
              const formatted = formatDate(movement.fecha_movimiento);
              const tipoMovimiento = movement.motivo?.tipo_movimiento;
              
              return (
                <tr key={movement.id} className="hover:bg-gray-50 transition-colors">
                  {/* Fecha */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">
                      {formatted.date}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatted.time}
                    </div>
                  </td>
                  
                  {/* Producto */}
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {movement.producto_nombre || 'Sin nombre'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {movement.categoria_nombre || 'Sin categoría'}
                    </div>
                  </td>
                  
                  {/* Contenedor */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {movement.contenedor_nombre || 'Sin contenedor'}
                    </div>
                  </td>
                  
                  {/* Tipo */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getMovementIcon(tipoMovimiento)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMovementTypeClass(tipoMovimiento)}`}>
                        {getMovementTypeLabel(tipoMovimiento)}
                      </span>
                    </div>
                  </td>
                  
                  {/* ✅ Cantidad SIN UNIDAD DE MEDIDA */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      tipoMovimiento === 'entrada' ? 'text-green-600' : 
                      tipoMovimiento === 'salida' ? 'text-red-600' : 
                      'text-yellow-600'
                    }`}>
                      {formatQuantity(movement.cantidad, tipoMovimiento)}
                    </span>
                  </td>
                  
                  {/* Stock Anterior */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {movement.stock_anterior}
                  </td>
                  
                  {/* Stock Nuevo */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      movement.stock_nuevo > movement.stock_anterior ? 'text-green-600' : 
                      movement.stock_nuevo < movement.stock_anterior ? 'text-red-600' : 
                      'text-gray-900'
                    }`}>
                      {movement.stock_nuevo}
                    </span>
                  </td>
                  
                  {/* Valor Total */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(movement.valor_total)}
                    </span>
                  </td>
                  
                  {/* Motivo */}
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {movement.motivo?.nombre || 'Sin motivo'}
                    </div>
                    {movement.numero_documento && (
                      <div className="text-xs text-gray-500 mt-1">
                        Doc: {movement.numero_documento}
                      </div>
                    )}
                  </td>
                  
                  {/* Observación */}
                  <td className="px-4 py-4">
                    {movement.observacion ? (
                      <div 
                        className="text-sm text-gray-600 max-w-xs"
                        title={movement.observacion}
                      >
                        {truncateText(movement.observacion, 25)}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  
                  {/* Acciones */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {/* Ver Kardex */}
                      <button
                        onClick={() => onViewKardex(movement.producto_id)}
                        className="inline-flex items-center p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                        title="Ver Kardex"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        <span className="text-xs font-medium">Kardex</span>
                      </button>
                      
                      {/* Editar (opcional) */}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(movement)}
                          className="inline-flex items-center p-1.5 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded transition-colors"
                          title="Editar movimiento"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      
                      {/* Eliminar (opcional) */}
                      {onDelete && (
                        <button
                          onClick={() => {
                            if (window.confirm('¿Estás seguro de que deseas eliminar este movimiento?')) {
                              onDelete(movement.id);
                            }
                          }}
                          className="inline-flex items-center p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar movimiento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Footer con estadísticas */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostrando {movements.length} movimiento{movements.length !== 1 ? 's' : ''}
          </div>
          
          {/* Estadísticas rápidas */}
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-green-600 font-medium">
              Entradas: {movements.filter(m => m.motivo?.tipo_movimiento === 'entrada').length}
            </span>
            <span className="text-red-600 font-medium">
              Salidas: {movements.filter(m => m.motivo?.tipo_movimiento === 'salida').length}
            </span>
            <span className="text-yellow-600 font-medium">
              Ajustes: {movements.filter(m => m.motivo?.tipo_movimiento === 'ajuste').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovementsList;