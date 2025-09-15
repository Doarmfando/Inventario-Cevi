// src/features/containers/components/views/ContainersView.tsx
// VISTA PRINCIPAL DE CONTENEDORES CON FORMULARIO INTEGRADO - CORREGIDA

import React, { useState } from 'react';
import { Plus, Package, AlertTriangle, RefreshCw } from 'lucide-react';
import { useContainers } from '../../hooks/useContainers';
import ContainerCard from '../cards/ContainerCard';
import ContainerForm from '../forms/ContainerForm';
import type { ContainerSummary, ContainerFormData } from '../../types/container.types';

const ContainersView: React.FC = () => {
  const {
    containers,
    tiposContenedor,
    loading,
    error,
    refrescar,
    crearContenedor,
    actualizarContenedor,
    eliminarContenedor
  } = useContainers();

  const [selectedContainer, setSelectedContainer] = useState<ContainerSummary | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Calcular estadísticas globales
  const totalContainers = containers.length;
  const containersWithAlerts = containers.filter(c => 
    c.stats.vencidos > 0 || c.stats.porVencer > 0
  ).length;
  const totalProducts = containers.reduce((sum, c) => sum + c.stats.totalProducts, 0);
  const totalValue = containers.reduce((sum, c) => sum + c.stats.totalValue, 0);

  const handleEditContainer = (container: ContainerSummary) => {
    setSelectedContainer(container);
    setShowForm(true);
  };

  const handleDeleteContainer = async (container: ContainerSummary) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el contenedor "${container.name}"?`)) {
      const success = await eliminarContenedor(container.id);
      if (success) {
        console.log('Contenedor eliminado exitosamente');
      } else {
        console.error('Error al eliminar contenedor');
      }
    }
  };

  const handleNewContainer = () => {
    setSelectedContainer(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: ContainerFormData) => {
    let success = false;
    
    if (selectedContainer) {
      // Editar contenedor existente
      success = await actualizarContenedor(selectedContainer.id, data);
    } else {
      // Crear nuevo contenedor
      success = await crearContenedor(data);
    }

    if (success) {
      setShowForm(false);
      setSelectedContainer(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedContainer(null);
  };

  // Preparar datos iniciales para edición
  const getInitialFormData = (): Partial<ContainerFormData> | undefined => {
    if (!selectedContainer) return undefined;

    // Buscar el tipo de contenedor por nombre
    const tipoEncontrado = tiposContenedor.find(
      tipo => tipo.nombre === selectedContainer.type
    );

    return {
      nombre: selectedContainer.name,
      tipo_contenedor_id: tipoEncontrado?.id || '',
      capacidad: selectedContainer.capacity,
      // Aquí puedes agregar más campos si los tienes disponibles
      descripcion: '',
      codigo: ''
    };
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <h3 className="text-red-800 font-semibold">Error del Sistema</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button 
                onClick={refrescar}
                className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Contenedores</h1>
              <p className="mt-1 text-sm text-gray-600">
                Gestiona tus contenedores y su inventario
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={refrescar}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refrescar"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={handleNewContainer}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Nuevo Contenedor</span>
                <span className="sm:hidden">Nuevo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Contenedores</p>
                <p className="text-xl font-semibold text-gray-900">{totalContainers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Productos</p>
                <p className="text-xl font-semibold text-gray-900">{totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Con Alertas</p>
                <p className="text-xl font-semibold text-gray-900">{containersWithAlerts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 font-semibold text-sm">S/</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-xl font-semibold text-gray-900">
                  {totalValue.toLocaleString('es-PE', { 
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && containers.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Cargando contenedores...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && containers.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay contenedores</h3>
            <p className="text-gray-600 mb-6">
              Comienza creando tu primer contenedor para organizar tu inventario.
            </p>
            <button
              onClick={handleNewContainer}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Crear Primer Contenedor</span>
            </button>
          </div>
        )}

        {/* Containers Grid */}
        {!loading && containers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {containers.map((container) => (
              <ContainerCard
                key={container.id}
                container={container}
                onEdit={() => handleEditContainer(container)}
                onDelete={() => handleDeleteContainer(container)}
              />
            ))}
          </div>
        )}

        {/* Container Form Modal */}
        {showForm && (
          <ContainerForm
            onSubmit={handleFormSubmit}
            onClose={handleFormClose}
            initialData={getInitialFormData()}
            isEdit={!!selectedContainer}
            tiposContenedor={tiposContenedor}
          />
        )}
      </div>
    </div>
  );
};

export default ContainersView;