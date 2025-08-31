// src/features/containers/components/cards/ContainerCard.tsx

import React from 'react';
import { 
  Package, 
  AlertTriangle, 
  Eye, 
  Edit, 
  Trash2 
} from 'lucide-react';
import type { ContainerSummary } from '../../types/container.types';
import StatusBadge from '../shared/StatusBadge';
import TypeIcon, { getTypeLabel } from '../shared/TypeIcon';

interface ContainerCardProps {
  container: ContainerSummary;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ContainerCard: React.FC<ContainerCardProps> = ({
  container,
  onView,
  onEdit,
  onDelete
}) => {
  const hasAlerts = container.stats.vencidos > 0 || container.stats.porVencer > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="flex-shrink-0">
              <TypeIcon type={container.type} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                {container.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {getTypeLabel(container.type)}
              </p>
            </div>
          </div>
          {hasAlerts && (
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
          )}
        </div>

        {/* Status */}
        <div className="mt-2 sm:mt-3">
          <StatusBadge status={container.status} />
        </div>
      </div>

      {/* Stats */}
      <div className="p-3 sm:p-4">
        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Package className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mr-1" />
              <span className="text-xs sm:text-sm font-medium text-gray-600">Productos</span>
            </div>
            <p className="text-lg sm:text-xl font-semibold text-gray-900">
              {container.stats.totalProducts}
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <span className="text-xs sm:text-sm font-medium text-gray-600">Valor</span>
            </div>
            <p className="text-lg sm:text-xl font-semibold text-gray-900">
              <span className="hidden sm:inline">S/ </span>
              <span className="sm:hidden text-xs">S/</span>
              {container.stats.totalValue.toLocaleString('es-PE', { 
                minimumFractionDigits: 0,
                maximumFractionDigits: 0 
              })}
            </p>
          </div>
        </div>

        {/* Alerts - Responsive */}
        {hasAlerts && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center text-amber-800">
              <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">Alertas</span>
            </div>
            <div className="mt-1 text-xs sm:text-sm text-amber-700">
              {container.stats.vencidos > 0 && (
                <span className="block sm:inline">
                  {container.stats.vencidos} vencido{container.stats.vencidos > 1 ? 's' : ''}
                </span>
              )}
              {container.stats.vencidos > 0 && container.stats.porVencer > 0 && (
                <span className="hidden sm:inline">, </span>
              )}
              {container.stats.porVencer > 0 && (
                <span className="block sm:inline">
                  {container.stats.porVencer} por vencer
                </span>
              )}
            </div>
          </div>
        )}

        {/* Capacity - Responsive */}
        {container.capacity && (
          <div className="mb-3 sm:mb-4">
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
              <span>Ocupación</span>
              <span>{Math.round((container.stats.totalProducts / container.capacity) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
              <div 
                className="bg-blue-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min((container.stats.totalProducts / container.capacity) * 100, 100)}%` 
                }}
              ></div>
            </div>
            <div className="mt-1 text-xs text-gray-500 text-center">
              {container.stats.totalProducts} / {container.capacity} productos
            </div>
          </div>
        )}
      </div>

      {/* Actions - Responsive */}
      <div className="px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 rounded-b-lg border-t border-gray-100">
        <div className="flex justify-between items-center gap-2">
          <button
            onClick={onView}
            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none justify-center sm:justify-start"
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Ver productos</span>
            <span className="xs:hidden">Ver</span>
          </button>
          
          <div className="flex space-x-1">
            <button
              onClick={onEdit}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-gray-100"
              title="Editar contenedor"
            >
              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            
            <button
              onClick={onDelete}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-gray-100"
              title="Eliminar contenedor"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContainerCard;