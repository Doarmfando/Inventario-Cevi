// src/features/movements/components/MovementFilters.tsx - ACTUALIZADO

import React, { useState } from 'react';
import { Filter, X, Calendar, Package, MapPin } from 'lucide-react';
import type { MovementFilters as Filters, MovementReason } from '../types/movement.types';
import { availableProducts, movementReasonOptions } from '../data/mockData';

interface MovementFiltersProps {
  onFilter: (filters: Filters) => void;
}

const MovementFilters: React.FC<MovementFiltersProps> = ({ onFilter }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    productId: '',
    container: '',
    reason: 'all',
    dateFrom: '',
    dateTo: '',
    searchTerm: '',
  });

  const movementTypes = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'entrada', label: 'Entradas' },
    { value: 'salida', label: 'Salidas' },
    { value: 'ajuste', label: 'Ajustes' },
  ];

  // Obtener contenedores únicos
  const containers = [...new Set(availableProducts.map(p => p.container))].map(container => ({
    value: container,
    label: container
  }));

  // Obtener todas las opciones de motivos combinadas
  const getAllReasons = (): Array<{ value: MovementReason | 'all'; label: string }> => {
    const allReasons: Array<{ value: MovementReason | 'all'; label: string }> = [
      { value: 'all', label: 'Todos los motivos' }
    ];
    
    // Agregar motivos de entrada
    movementReasonOptions.entrada.forEach(reason => {
      allReasons.push({ value: reason.value, label: `📈 ${reason.label}` });
    });
    
    // Agregar motivos de salida
    movementReasonOptions.salida.forEach(reason => {
      allReasons.push({ value: reason.value, label: `📉 ${reason.label}` });
    });
    
    return allReasons;
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: Filters = {
      type: 'all',
      productId: '',
      container: '',
      reason: 'all',
      dateFrom: '',
      dateTo: '',
      searchTerm: '',
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  const hasActiveFilters = () => {
    return filters.type !== 'all' || 
           filters.productId !== '' || 
           filters.container !== '' ||
           filters.reason !== 'all' ||
           filters.dateFrom !== '' || 
           filters.dateTo !== '' ||
           filters.searchTerm !== '';
  };

  // Obtener fecha de hace 30 días para sugerencia
  const getThirtyDaysAgo = () => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  };

  const getSevenDaysAgo = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
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

        {/* Barra de búsqueda siempre visible */}
        <div className="mt-3">
          <div className="relative">
            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por producto, documento, observaciones..."
              value={filters.searchTerm || ''}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Filtros expandibles */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              <select
                id="product-filter"
                value={filters.productId || ''}
                onChange={(e) => handleFilterChange('productId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los productos</option>
                {availableProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Contenedor */}
            <div>
              <label htmlFor="container-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Contenedor
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  id="container-filter"
                  value={filters.container || ''}
                  onChange={(e) => handleFilterChange('container', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los contenedores</option>
                  {containers.map((container) => (
                    <option key={container.value} value={container.value}>
                      {container.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Motivo */}
            <div>
              <label htmlFor="reason-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Motivo
              </label>
              <select
                id="reason-filter"
                value={filters.reason || 'all'}
                onChange={(e) => handleFilterChange('reason', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {getAllReasons().map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Rango de fechas en una sola columna */}
            <div className="space-y-2">
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
          </div>

          {/* Filtros rápidos */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Filtros Rápidos</h4>
            
            {/* Filtros por fecha */}
            <div className="mb-3">
              <h5 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Por Fecha</h5>
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
                    handleFilterChange('dateFrom', getSevenDaysAgo());
                    handleFilterChange('dateTo', getToday());
                  }}
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Últimos 7 días
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
              </div>
            </div>

            {/* Filtros por tipo */}
            <div className="mb-3">
              <h5 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Por Tipo</h5>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange('type', 'entrada')}
                  className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  📈 Solo Entradas
                </button>
                
                <button
                  onClick={() => handleFilterChange('type', 'salida')}
                  className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  📉 Solo Salidas
                </button>
                
                <button
                  onClick={() => handleFilterChange('type', 'ajuste')}
                  className="px-3 py-1.5 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                >
                  🔄 Solo Ajustes
                </button>
              </div>
            </div>

            {/* Filtros por motivo */}
            <div>
              <h5 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Por Motivo Común</h5>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange('reason', 'compra')}
                  className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  🛒 Compras
                </button>
                
                <button
                  onClick={() => handleFilterChange('reason', 'venta')}
                  className="px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  💰 Ventas
                </button>
                
                <button
                  onClick={() => handleFilterChange('reason', 'perdida')}
                  className="px-3 py-1.5 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                >
                  ⚠️ Pérdidas
                </button>
                
                <button
                  onClick={() => handleFilterChange('reason', 'roto')}
                  className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  🔴 Rotos/Dañados
                </button>
              </div>
            </div>
          </div>

          {/* Resumen de filtros activos */}
          {hasActiveFilters() && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Filtros Activos:</h4>
              <div className="flex flex-wrap gap-2 text-sm">
                {filters.type !== 'all' && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Tipo: {movementTypes.find(t => t.value === filters.type)?.label}
                    <button 
                      onClick={() => handleFilterChange('type', 'all')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                
                {filters.productId && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Producto: {availableProducts.find(p => p.id === filters.productId)?.name}
                    <button 
                      onClick={() => handleFilterChange('productId', '')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                
                {filters.container && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Contenedor: {filters.container}
                    <button 
                      onClick={() => handleFilterChange('container', '')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                
                {filters.reason !== 'all' && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Motivo: {getAllReasons().find(r => r.value === filters.reason)?.label}
                    <button 
                      onClick={() => handleFilterChange('reason', 'all')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                
                {filters.dateFrom && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Desde: {new Date(filters.dateFrom).toLocaleDateString('es-PE')}
                    <button 
                      onClick={() => handleFilterChange('dateFrom', '')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                
                {filters.dateTo && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Hasta: {new Date(filters.dateTo).toLocaleDateString('es-PE')}
                    <button 
                      onClick={() => handleFilterChange('dateTo', '')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                
                {filters.searchTerm && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Búsqueda: "{filters.searchTerm}"
                    <button 
                      onClick={() => handleFilterChange('searchTerm', '')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
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