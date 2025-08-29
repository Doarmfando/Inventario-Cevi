// src/features/containers/components/views/ContainersView.tsx

import React, { useState, useEffect } from 'react';
import { Container, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ContainerSummary, ContainerFormData } from '../../types/container.types';
import { getContainersSummary } from '../../data/mockContainerData';
import ContainerCard from '../cards/ContainerCard';
import ContainerForm from '../forms/ContainerForm';
import ContainerFilters from '../shared/ContainerFilters';
import StatsCards from '../ui/StatsCards';

const ContainersView: React.FC = () => {
  const navigate = useNavigate();
  const [containers, setContainers] = useState<ContainerSummary[]>([]);
  const [filteredContainers, setFilteredContainers] = useState<ContainerSummary[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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
        <StatsCards totalStats={totalStats} />

        {/* Filtros */}
        <ContainerFilters
          searchTerm={searchTerm}
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onTypeChange={setTypeFilter}
          onStatusChange={setStatusFilter}
          onClearFilters={clearFilters}
          onAddClick={() => setShowForm(true)}
          hasActiveFilters={hasActiveFilters()}
        />

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