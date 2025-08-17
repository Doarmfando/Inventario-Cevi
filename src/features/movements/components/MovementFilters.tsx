// src/features/movements/components/MovementFilters.tsx

import React, { useState } from 'react';
import { Filter, X, Calendar, Package } from 'lucide-react';
import type { MovementFilters as Filters } from '../types/movement.types';

interface MovementFiltersProps {
  onFilter: (filters: Filters) => void;
}

const MovementFilters: React.FC<MovementFiltersProps> = ({ onFilter }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    productId: '',
    dateFrom: '',
    dateTo: '',
  });

  // Mock data - En tu app real, esto vendría de tu estado/API
  const products = [
    { id: '1', name: 'Lenguado Filetes' },
    { id: '2', name: 'Pulpo' },
    { id: '3', name: 'Yuca' },
    { id: '4', name: 'Rocoto' },
    { id: '5', name: 'Langostinos' },
  ];

  const movementTypes = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'entrada', label: 'Entradas' },
    { value: 'salida', label: 'Salidas' },
    { value: 'ajuste', label: 'Ajustes' },
  ];

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: Filters = {
      type: 'all',
      productId: '',
      dateFrom: '',
      dateTo: '',
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  const hasActiveFilters = () => {
    return filters.type !== 'all' || 
           filters.productId !== '' || 
           filters.dateFrom !== '' || 
           filters.dateTo !== '';
  };

  // Obtener fecha de hace 30 días para sugerencia
  const getThirtyDaysAgo = () => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  };

  const getToday = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header siempre visible */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
            {hasActiveFilters() && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Activos
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {hasActiveFilters() && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Limpiar</span>
              </button>
            )}
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>{isExpanded ? 'Ocultar' : 'Mostrar'} filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filtros expandibles */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tipo de Movimiento */}
            <div>
              <label htmlFor="movement-type" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Movimiento
              </label>
              <select
                id="movement-type"
                value={filters.type || 'all'}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {movementTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Producto */}
            <div>
              <label htmlFor="product-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Producto
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  id="product-filter"
                  value={filters.productId || ''}
                  onChange={(e) => handleFilterChange('productId', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los productos</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fecha Desde */}
            <div>
              <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 mb-1">
                Desde
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  id="date-from"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Fecha Hasta */}
            <div>
              <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 mb-1">
                Hasta
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  id="date-to"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Filtros rápidos */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Filtros Rápidos</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  handleFilterChange('dateFrom', getToday());
                  handleFilterChange('dateTo', getToday());
                }}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hoy
              </button>
              
              <button
                onClick={() => {
                  handleFilterChange('dateFrom', getThirtyDaysAgo());
                  handleFilterChange('dateTo', getToday());
                }}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Últimos 30 días
              </button>
              
              <button
                onClick={() => handleFilterChange('type', 'entrada')}
                className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                Solo Entradas
              </button>
              
              <button
                onClick={() => handleFilterChange('type', 'salida')}
                className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Solo Salidas
              </button>
              
              <button
                onClick={() => handleFilterChange('type', 'ajuste')}
                className="px-3 py-1.5 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
              >
                Solo Ajustes
              </button>
            </div>
          </div>

          {/* Resumen de filtros activos */}
          {hasActiveFilters() && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-1">Filtros Activos:</h4>
              <div className="text-sm text-blue-700">
                {filters.type !== 'all' && (
                  <span className="inline-block mr-2">
                    Tipo: {movementTypes.find(t => t.value === filters.type)?.label}
                  </span>
                )}
                {filters.productId && (
                  <span className="inline-block mr-2">
                    Producto: {products.find(p => p.id === filters.productId)?.name}
                  </span>
                )}
                {filters.dateFrom && (
                  <span className="inline-block mr-2">
                    Desde: {new Date(filters.dateFrom).toLocaleDateString('es-PE')}
                  </span>
                )}
                {filters.dateTo && (
                  <span className="inline-block mr-2">
                    Hasta: {new Date(filters.dateTo).toLocaleDateString('es-PE')}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MovementFilters;