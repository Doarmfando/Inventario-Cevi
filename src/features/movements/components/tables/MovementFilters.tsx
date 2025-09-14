// src/features/movements/components/tables/MovementFilters.tsx - ADAPTADO A LA BD

import React, { useState, useEffect } from 'react';
import { Filter, X, MapPin, Plus, Search, Clock } from 'lucide-react';
import type { MovementFilters as Filters, AvailableProduct, MotivoMovimiento } from '../../types/movement.types';
import { MovementsService } from '../../services/movementsService';

interface MovementFiltersProps {
  onFilter: (filters: Filters) => void;
  onNewMovement: () => void;
}

const MovementFilters: React.FC<MovementFiltersProps> = ({ onFilter, onNewMovement }) => {
  const [filters, setFilters] = useState<Filters>({
    tipo_movimiento: 'all',
    producto_id: '',
    contenedor_id: '',
    motivo_movimiento_id: '',
    fecha_desde: '',
    fecha_hasta: '',
    searchTerm: '',
  });

  // Estados para datos de la BD
  const [productos, setProductos] = useState<AvailableProduct[]>([]);
  const [motivos, setMotivos] = useState<MotivoMovimiento[]>([]);
  const [contenedores, setContenedores] = useState<Array<{id: string; nombre: string}>>([]);
  const [loading, setLoading] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      const [productosData, motivosData] = await Promise.all([
        MovementsService.getProductosDisponibles(),
        MovementsService.getMotivosMovimiento()
      ]);

      setProductos(productosData);
      setMotivos(motivosData);

      // Extraer contenedores únicos de los productos
      const contenedoresUnicos = new Map();
      productosData.forEach(producto => {
        if (producto.contenedor_fijo) {
          contenedoresUnicos.set(producto.contenedor_fijo.id, producto.contenedor_fijo);
        }
        producto.contenedores_recomendados.forEach(cont => {
          contenedoresUnicos.set(cont.id, cont);
        });
      });

      setContenedores(Array.from(contenedoresUnicos.values()));
    } catch (error) {
      console.error('Error cargando datos para filtros:', error);
    } finally {
      setLoading(false);
    }
  };

  const movementTypes = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'entrada', label: 'Entradas' },
    { value: 'salida', label: 'Salidas' },
    { value: 'ajuste', label: 'Ajustes' },
  ];

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { 
      ...filters, 
      [key]: value === '' || value === 'all' ? undefined : value 
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: Filters = {
      tipo_movimiento: 'all',
      producto_id: '',
      contenedor_id: '',
      motivo_movimiento_id: '',
      fecha_desde: '',
      fecha_hasta: '',
      searchTerm: '',
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  const hasActiveFilters = () => {
    return filters.tipo_movimiento !== 'all' || 
           filters.producto_id !== '' || 
           filters.contenedor_id !== '' || 
           filters.motivo_movimiento_id !== '' ||
           filters.searchTerm !== '' ||
           filters.fecha_desde !== '' ||
           filters.fecha_hasta !== '';
  };

  // Filtrar motivos por tipo seleccionado
  const getMotivosDisponibles = () => {
    if (!filters.tipo_movimiento || filters.tipo_movimiento === 'all') {
      return motivos;
    }
    return motivos.filter(m => m.tipo_movimiento === filters.tipo_movimiento);
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
              placeholder="Buscar productos..."
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
                value={filters.tipo_movimiento || 'all'}
                onChange={(e) => handleFilterChange('tipo_movimiento', e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
              >
                {movementTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Filter */}
            <div className="relative min-w-[160px]">
              <select
                value={filters.producto_id || ''}
                onChange={(e) => handleFilterChange('producto_id', e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                disabled={loading}
              >
                <option value="">Todos los productos</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre} ({producto.categoria})
                  </option>
                ))}
              </select>
            </div>

            {/* Container Filter */}
            <div className="relative min-w-[160px]">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filters.contenedor_id || ''}
                onChange={(e) => handleFilterChange('contenedor_id', e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                disabled={loading}
              >
                <option value="">Todos los contenedores</option>
                {contenedores.map((contenedor) => (
                  <option key={contenedor.id} value={contenedor.id}>
                    {contenedor.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason Filter */}
            <div className="relative min-w-[140px]">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filters.motivo_movimiento_id || ''}
                onChange={(e) => handleFilterChange('motivo_movimiento_id', e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                disabled={loading}
              >
                <option value="">Todos los motivos</option>
                {getMotivosDisponibles().map((motivo) => (
                  <option key={motivo.id} value={motivo.id}>
                    {motivo.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filters */}
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.fecha_desde || ''}
                onChange={(e) => handleFilterChange('fecha_desde', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Desde"
              />
              <input
                type="date"
                value={filters.fecha_hasta || ''}
                onChange={(e) => handleFilterChange('fecha_hasta', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Hasta"
              />
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

      {/* Loading indicator */}
      {loading && (
        <div className="mt-2 text-sm text-gray-500 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
          <span>Cargando opciones...</span>
        </div>
      )}
    </div>
  );
};

export default MovementFilters;