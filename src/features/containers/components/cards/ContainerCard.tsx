// src/features/containers/components/cards/ContainerCard.tsx

import React from 'react';
import { 
  Package, 
  MapPin, 
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
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <TypeIcon type={container.type} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {container.name}
              </h3>
              <p className="text-sm text-gray-500">
                {getTypeLabel(container.type)}
              </p>
            </div>
          </div>
          {hasAlerts && (
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          )}
        </div>

        {/* Status and Location */}
        <div className="mt-3 flex items-center justify-between">
          <StatusBadge status={container.status} />
          {container.location && (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="truncate max-w-24">{container.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Package className="w-4 h-4 text-gray-400 mr-1" />
              <span className="text-sm font-medium text-gray-600">Productos</span>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              {container.stats.totalProducts}
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <span className="text-sm font-medium text-gray-600">Valor</span>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              S/ {container.stats.totalValue.toLocaleString('es-PE', { 
                minimumFractionDigits: 0,
                maximumFractionDigits: 0 
              })}
            </p>
          </div>
        </div>

        {/* Alerts */}
        {hasAlerts && (
          <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center text-amber-800">
              <AlertTriangle className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Alertas de productos</span>
            </div>
            <div className="mt-1 text-sm text-amber-700">
              {container.stats.vencidos > 0 && (
                <span>{container.stats.vencidos} vencidos</span>
              )}
              {container.stats.vencidos > 0 && container.stats.porVencer > 0 && ', '}
              {container.stats.porVencer > 0 && (
                <span>{container.stats.porVencer} por vencer</span>
              )}
            </div>
          </div>
        )}

        {/* Capacity if available */}
        {container.capacity && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Ocupación</span>
              <span>{Math.round((container.stats.totalProducts / container.capacity) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min((container.stats.totalProducts / container.capacity) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-gray-50 rounded-b-lg border-t border-gray-100">
        <div className="flex justify-between items-center">
          <button
            onClick={onView}
            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Ver productos</span>
          </button>
          
          <div className="flex space-x-1">
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-gray-100"
              title="Editar contenedor"
            >
              <Edit className="w-4 h-4" />
            </button>
            
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-gray-100"
              title="Eliminar contenedor"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContainerCard;