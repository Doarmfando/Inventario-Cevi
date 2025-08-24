// src/features/containers/components/ContainersView.tsx

import React, { useState, useEffect } from 'react';
import { Plus, Container, Package, TrendingUp, AlertTriangle, Search, Filter, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ContainerSummary, ContainerFormData } from '../types/container.types';
import { getContainersSummary } from '../data/mockContainerData';
import ContainerCard from './ContainerCard.tsx';
import ContainerForm from './ContainerForm.tsx';

const ContainersView: React.FC = () => {
  const navigate = useNavigate();
  const [containers, setContainers] = useState<ContainerSummary[]>([]);
  const [filteredContainers, setFilteredContainers] = useState<ContainerSummary[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const containerTypes = [
    { value: '', label: 'Todos los tipos' },
    { value: 'frigider', label: 'Refrigeradores' },
    { value: 'congelador', label: 'Congeladores' },
    { value: 'almacen-seco', label: 'Almacén Seco' },
    { value: 'almacen-humedo', label: 'Almacén Húmedo' },
  ];

  const containerStates = [
    { value: '', label: 'Todos los estados' },
    { value: 'activo', label: 'Activos' },
    { value: 'mantenimiento', label: 'En Mantenimiento' },
    { value: 'inactivo', label: 'Inactivos' },
  ];

  useEffect(() => {
    const containerData = getContainersSummary();
    setContainers(containerData);
    setFilteredContainers(containerData);
  }, []);

  // Filtrar contenedores
  useEffect(() => {
    let filtered = containers;

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(container =>
        container.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (container.location && container.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtro por tipo
    if (typeFilter) {
      filtered = filtered.filter(container => container.type === typeFilter);
    }

    // Filtro por estado
    if (statusFilter) {
      filtered = filtered.filter(container => container.status === statusFilter);
    }

    setFilteredContainers(filtered);
  }, [containers, searchTerm, typeFilter, statusFilter]);

  const handleViewContainer = (containerId: string) => {
    navigate(`/containers/${containerId}/products`);
  };

  const handleEditContainer = (containerId: string) => {
    console.log('Editar contenedor:', containerId);
    // TODO: Implementar lógica de edición
  };

  const handleDeleteContainer = (containerId: string) => {
    console.log('Eliminar contenedor:', containerId);
    // TODO: Implementar lógica de eliminación
  };

  const handleCreateContainer = (data: ContainerFormData) => {
    console.log('Nuevo contenedor:', data);
    setShowForm(false);
    // TODO: Implementar lógica de creación
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setStatusFilter('');
  };

  const hasActiveFilters = () => {
    return searchTerm !== '' || typeFilter !== '' || statusFilter !== '';
  };

  // Calcular estadísticas generales
  const totalStats = filteredContainers.reduce(
    (acc, container) => ({
      totalContainers: acc.totalContainers + 1,
      totalProducts: acc.totalProducts + container.stats.totalProducts,
      totalValue: acc.totalValue + container.stats.totalValue,
      activeContainers: acc.activeContainers + (container.status === 'activo' ? 1 : 0),
      vencidos: acc.vencidos + container.stats.vencidos,
      porVencer: acc.porVencer + container.stats.porVencer,
    }),
    {
      totalContainers: 0,
      totalProducts: 0,
      totalValue: 0,
      activeContainers: 0,
      vencidos: 0,
      porVencer: 0,
    }
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Container className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Contenedores</p>
                <p className="text-2xl font-semibold text-gray-900">{totalStats.totalContainers}</p>
                <p className="text-xs text-green-600">{totalStats.activeContainers} activos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Productos</p>
                <p className="text-2xl font-semibold text-gray-900">{totalStats.totalProducts}</p>
                <p className="text-xs text-gray-500">empaquetados</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  S/ {totalStats.totalValue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Alertas</p>
                <p className="text-2xl font-semibold text-gray-900">{totalStats.vencidos + totalStats.porVencer}</p>
                <p className="text-xs text-red-600">
                  {totalStats.vencidos} vencidos, {totalStats.porVencer} por vencer
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros estilo TableFilters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col lg:flex-row gap-4 flex-1">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar contenedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                {/* Type Filter */}
                <div className="relative min-w-[140px]">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="appearance-none pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  >
                    {containerTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="relative min-w-[160px]">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  >
                    {containerStates.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
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
                    <span>Limpiar</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Add Container Button */}
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Contenedor</span>
            </button>
          </div>
        </div>

        {/* Contenedores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContainers.map((container) => (
            <ContainerCard
              key={container.id}
              container={container}
              onView={() => handleViewContainer(container.id)}
              onEdit={() => handleEditContainer(container.id)}
              onDelete={() => handleDeleteContainer(container.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredContainers.length === 0 && containers.length > 0 && (
          <div className="text-center py-12">
            <Container className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron contenedores</h3>
            <p className="text-gray-600 mb-4">
              No hay contenedores que coincidan con los filtros seleccionados.
            </p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Empty State - Sin contenedores */}
        {containers.length === 0 && (
          <div className="text-center py-12">
            <Container className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay contenedores</h3>
            <p className="text-gray-600 mb-4">Comienza agregando tu primer contenedor de almacenamiento.</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Contenedor</span>
            </button>
          </div>
        )}

        {/* Modal del formulario */}
        {showForm && (
          <ContainerForm
            onSubmit={handleCreateContainer}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ContainersView;