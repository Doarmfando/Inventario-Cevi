// src/features/movements/components/MovementFilters.tsx - CORREGIDO

import React, { useState } from 'react';
import { Filter, X, MapPin, Plus, Search, Clock } from 'lucide-react';
import type { MovementFilters as Filters, MovementReason } from '../../types/movement.types';
import type { Container } from '../../../inventory/types';
import { availableProducts, movementReasonOptions } from '../../data/mockData';

interface MovementFiltersProps {
  onFilter: (filters: Filters) => void;
  onNewMovement: () => void;
}

const MovementFilters: React.FC<MovementFiltersProps> = ({ onFilter, onNewMovement }) => {
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    productId: '',
    container: undefined, // ✅ Usar undefined en lugar de cadena vacía
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
      allReasons.push({ value: reason.value, label: reason.label });
    });
    
    // Agregar motivos de salida
    movementReasonOptions.salida.forEach(reason => {
      allReasons.push({ value: reason.value, label: reason.label });
    });
    
    return allReasons;
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    let processedValue: any = value;
    
    // ✅ Manejar el tipo Container correctamente
    if (key === 'container') {
      processedValue = value === '' ? undefined : value as Container;
    }
    
    const newFilters = { ...filters, [key]: processedValue };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: Filters = {
      type: 'all',
      productId: '',
      container: undefined, // ✅ Usar undefined
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
           filters.container !== undefined || // ✅ Comparar con undefined
           filters.reason !== 'all' ||
           filters.searchTerm !== '';
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col lg:flex-row gap-4 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos o proveedores..."
              value={filters.searchTerm || ''}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Movement Type Filter */}
            <div className="relative min-w-[140px]">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filters.type || 'all'}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
              >
                {movementTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Container Filter */}
            <div className="relative min-w-[160px]">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filters.container || ''}
                onChange={(e) => handleFilterChange('container', e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
              >
                <option value="">Todos los contenedores</option>
                {containers.map((container) => (
                  <option key={container.value} value={container.value}>
                    {container.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason Filter */}
            <div className="relative min-w-[140px]">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filters.reason || 'all'}
                onChange={(e) => handleFilterChange('reason', e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
              >
                {getAllReasons().map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters() && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Add Movement Button */}
        <button
          onClick={onNewMovement}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Movimiento</span>
        </button>
      </div>
    </div>
  );
};

export default MovementFilters;