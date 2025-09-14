// src/features/movements/components/views/MovementView.tsx

import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import MovementsList from '../tables/MovementsList';
import MovementForm from '../forms/MovementForm';
import MovementFilters from '../tables/MovementFilters';
import KardexModal from '../modals/KardexModal';
import type { Movement, MovementFilters as Filters, MovementFormData } from '../../types/movement.types';
import { MovementsService } from '../../services/movementsService';

const MovementView: React.FC = () => {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [filteredMovements, setFilteredMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showKardex, setShowKardex] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // Cargar movimientos desde la BD
  const cargarMovimientos = async (filtros?: Filters) => {
    try {
      setLoading(true);
      setError(null);
      const movimientosData = await MovementsService.getMovimientos(filtros);
      setMovements(movimientosData);
      setFilteredMovements(movimientosData);
    } catch (err) {
      console.error('Error cargando movimientos:', err);
      setError('Error al cargar los movimientos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    cargarMovimientos();
  }, []);

  // Función para agregar nuevo movimiento
  const handleAddMovement = async (formData: MovementFormData) => {
    try {
      setLoading(true);
      const movimientoId = await MovementsService.crearMovimiento(formData);
      
      if (movimientoId) {
        console.log('Movimiento registrado exitosamente:', movimientoId);
        setShowForm(false);
        // Recargar movimientos para mostrar el nuevo
        await cargarMovimientos();
      } else {
        console.error('Error: No se pudo crear el movimiento');
        alert('Error al registrar el movimiento');
      }
    } catch (err) {
      console.error('Error creando movimiento:', err);
      alert('Error al registrar el movimiento');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el cambio de filtros
  const handleFiltersChange = async (newFilters: Filters) => {
    await cargarMovimientos(newFilters);
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

  // Calcular estadísticas basadas en motivos de la BD
  const entradas = movements.filter(m => m.motivo?.tipo_movimiento === 'entrada');
  const salidas = movements.filter(m => m.motivo?.tipo_movimiento === 'salida');
  const ajustes = movements.filter(m => m.motivo?.tipo_movimiento === 'ajuste');

  // Calcular totales de valor
  const valorTotalEntradas = entradas.reduce((sum, m) => sum + (m.valor_total || 0), 0);
  const valorTotalSalidas = salidas.reduce((sum, m) => sum + (m.valor_total || 0), 0);

  // Mostrar error si existe
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm font-bold">!</span>
            </div>
            <div>
              <h3 className="text-red-800 font-semibold">Error del Sistema</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button 
                onClick={() => cargarMovimientos()}
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
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Entradas */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Entradas</p>
                <p className="text-2xl font-semibold text-gray-900">{entradas.length}</p>
                <p className="text-sm text-gray-500">
                  S/. {valorTotalEntradas.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
          
          {/* Salidas */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Minus className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Salidas</p>
                <p className="text-2xl font-semibold text-gray-900">{salidas.length}</p>
                <p className="text-sm text-gray-500">
                  S/. {valorTotalSalidas.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* Total Movimientos */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Movimientos</p>
                <p className="text-2xl font-semibold text-gray-900">{movements.length}</p>
                <p className="text-sm text-gray-500">
                  {ajustes.length > 0 && `${ajustes.length} ajustes`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros con botón incluido */}
        <div className="mb-6">
          <MovementFilters 
            onFilter={handleFiltersChange} 
            onNewMovement={() => setShowForm(true)}
          />
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

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-700">Procesando movimientos...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovementView;