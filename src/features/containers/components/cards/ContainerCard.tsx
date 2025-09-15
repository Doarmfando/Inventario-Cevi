// src/features/containers/components/cards/ContainerCard.tsx
// ACTUALIZADO PARA BASE DE DATOS REAL CON NAVEGACIÓN A PRODUCTOS

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  AlertTriangle, 
  Eye, 
  Edit, 
  Trash2,
  Thermometer,
  Archive
} from 'lucide-react';
import type { ContainerSummary } from '../../types/container.types';

interface ContainerCardProps {
  container: ContainerSummary;
  onEdit: () => void;
  onDelete: () => void;
}

const ContainerCard: React.FC<ContainerCardProps> = ({
  container,
  onEdit,
  onDelete
}) => {
  const navigate = useNavigate();
  const hasAlerts = container.stats.vencidos > 0 || container.stats.porVencer > 0;

  // Función para navegar a los productos del contenedor
  const handleViewProducts = () => {
    navigate(`/containers/${container.id}/products`);
  };

  const getTypeIcon = (type: string) => {
    if (type.toLowerCase().includes('congelador') || type.toLowerCase().includes('congelación')) {
      return <Thermometer className="w-5 h-5 text-blue-600" />;
    }
    if (type.toLowerCase().includes('refrigerador') || type.toLowerCase().includes('refrigeración')) {
      return <Thermometer className="w-5 h-5 text-green-600" />;
    }
    return <Archive className="w-5 h-5 text-gray-600" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'mantenimiento':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactivo':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'activo':
        return 'Activo';
      case 'mantenimiento':
        return 'Mantenimiento';
      case 'inactivo':
        return 'Inactivo';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="flex-shrink-0">
              {getTypeIcon(container.type)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                {container.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {container.type}
              </p>
            </div>
          </div>
          {hasAlerts && (
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
          )}
        </div>

        {/* Status */}
        <div className="mt-2 sm:mt-3">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(container.status)}`}>
            {getStatusLabel(container.status)}
          </span>
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
            <p className="text-xs text-gray-500">
              {container.stats.totalQuantity.toLocaleString('es-PE', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 1
              })} unidades
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
        {container.capacity && container.capacity > 0 && (
          <div className="mb-3 sm:mb-4">
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
              <span>Ocupación</span>
              <span>{container.stats.capacityPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
              <div 
                className="bg-blue-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(container.stats.capacityPercentage, 100)}%` 
                }}
              ></div>
            </div>
            <div className="mt-1 text-xs text-gray-500 text-center">
              {container.stats.capacityUsed.toLocaleString('es-PE', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 1
              })} / {container.capacity} kg
            </div>
          </div>
        )}

        {/* Distribución de productos */}
        <div className="flex justify-between text-xs text-gray-600">
          <span className="text-green-600">
            {container.stats.frescos} frescos
          </span>
          {container.stats.porVencer > 0 && (
            <span className="text-yellow-600">
              {container.stats.porVencer} por vencer
            </span>
          )}
          {container.stats.vencidos > 0 && (
            <span className="text-red-600">
              {container.stats.vencidos} vencidos
            </span>
          )}
        </div>
      </div>

      {/* Actions - Responsive */}
      <div className="px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 rounded-b-lg border-t border-gray-100">
        <div className="flex justify-between items-center gap-2">
          <button
            onClick={handleViewProducts}
            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none justify-center sm:justify-start hover:bg-blue-50 px-2 py-1 rounded-md"
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