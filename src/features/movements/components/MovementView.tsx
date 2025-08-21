// src/features/movements/components/MovementView.tsx

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import MovementsList from './MovementsList';
import MovementForm from './MovementForm';
import MovementFilters from './MovementFilters';
import KardexModal from './KardexModal';
import type { Movement, MovementFilters as Filters, MovementFormData } from '../types/movement.types';
import { mockProducts, mockMovements } from '../data/mockData';
import { createMovement, applyMovementFilters, getLastMovementForProduct } from '../utils/movementUtils';

const MovementView: React.FC = () => {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [filteredMovements, setFilteredMovements] = useState<Movement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showKardex, setShowKardex] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // Cargar datos mock iniciales
  useEffect(() => {
    setMovements(mockMovements);
  }, []);

  // Efecto para filtrar movimientos cuando cambien los filtros o movimientos
  useEffect(() => {
    setFilteredMovements(movements);
  }, [movements]);

  // Función para agregar nuevo movimiento
  const handleAddMovement = (formData: MovementFormData) => {
    const selectedProduct = mockProducts.find(p => p.id === formData.productId);
    
    if (!selectedProduct) {
      console.error('Producto no encontrado');
      return;
    }

    // Obtener el último movimiento del producto
    const lastMovement = getLastMovementForProduct(movements, formData.productId);
    const previousStock = lastMovement ? lastMovement.newStock : selectedProduct.currentStock;
    
    // Crear el nuevo movimiento
    const newMovement = createMovement(formData, selectedProduct, previousStock);

    setMovements(prev => [newMovement, ...prev]);
    setShowForm(false);

    console.log('Movimiento registrado exitosamente:', newMovement);
  };

  // Función para manejar el cambio de filtros
  const handleFiltersChange = (newFilters: Filters) => {
    const filtered = applyMovementFilters(movements, newFilters);
    setFilteredMovements(filtered);
  };

  // Función para mostrar kardex
  const handleViewKardex = (productId: string) => {
    setSelectedProductId(productId);
    setShowKardex(true);
  };

  // Función para cerrar el formulario
  const handleCloseForm = () => {
    setShowForm(false);
  };

  // Función para cerrar el modal de kardex
  const handleCloseKardex = () => {
    setShowKardex(false);
    setSelectedProductId('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Movimientos de Inventario</h1>
            <p className="text-gray-600">Gestiona las entradas, salidas y ajustes de tu inventario</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span>Nuevo Movimiento</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Movimientos</p>
                <p className="text-2xl font-semibold text-gray-900">{movements.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Entradas</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {movements.filter(m => m.type === 'entrada').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Plus className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Salidas</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {movements.filter(m => m.type === 'salida').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Plus className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ajustes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {movements.filter(m => m.type === 'ajuste').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <MovementFilters onFilter={handleFiltersChange} />
        </div>

        {/* Lista de movimientos */}
        <div className="mb-6">
          <MovementsList
            movements={filteredMovements}
            onViewKardex={handleViewKardex}
          />
        </div>

        {/* Modal del formulario */}
        {showForm && (
          <MovementForm
            onSubmit={handleAddMovement}
            onClose={handleCloseForm}
          />
        )}

        {/* Modal del kardex */}
        {showKardex && (
          <KardexModal
            productId={selectedProductId}
            onClose={handleCloseKardex}
          />
        )}
      </div>
    </div>
  );
};

export default MovementView;