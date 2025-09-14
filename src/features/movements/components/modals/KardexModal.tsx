// src/features/movements/components/modals/KardexModal.tsx
// MODAL KARDEX CON DATOS REALES DE BD

import React, { useState } from 'react';
import { X, Download, RefreshCw, Calendar, AlertCircle } from 'lucide-react';
import { useKardexData } from '../../hooks/useKardexData';
import KardexStats from './KardexStats';
import { KardexTable } from './KardexTable';
import { KardexFilters } from './KardexFilters';
import type { KardexModalProps, KardexDateRange } from '../../types/kardex.types';
import { KardexExportUtils } from '../../utils/kardexExportUtils';

const KardexModal: React.FC<KardexModalProps> = ({ productId, onClose }) => {
  const {
    producto,
    movimientos,
    stats,
    loading,
    error,
    refrescarKardex,
    aplicarFiltros
  } = useKardexData(productId);

  const [showFilters, setShowFilters] = useState(false);
  const [filtrosAplicados, setFiltrosAplicados] = useState<KardexDateRange>({});

  const handleExportKardex = () => {
    if (!producto) return;
    
    try {
      // Exportación completa con múltiples hojas
      KardexExportUtils.exportToExcel({
        producto,
        movimientos,
        stats,
        filtros: filtrosAplicados
      });
      
      // Mostrar notificación de éxito (opcional)
      console.log('Kardex exportado exitosamente');
      
      // Aquí podrías agregar una notificación toast si la tienes implementada
    } catch (error) {
      console.error('Error al exportar kardex:', error);
      alert('Error al exportar el kardex. Por favor intenta nuevamente.');
    }
  };

  const handleApplyFilters = async (filtros: KardexDateRange) => {
    setFiltrosAplicados(filtros);
    await aplicarFiltros(filtros);
    setShowFilters(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Cargando kardex...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Error</h3>
              <p className="text-sm text-gray-600">{error || 'Producto no encontrado'}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Kardex de Producto</h2>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-600">
                  <span className="font-medium">{producto.nombre}</span>
                  {producto.codigo && (
                    <span className="text-gray-500 ml-2">({producto.codigo})</span>
                  )}
                </span>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                  {producto.categoria}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Filtros */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title="Filtros de fecha"
            >
              <Calendar className="w-5 h-5" />
            </button>
            
            {/* Refrescar */}
            <button
              onClick={refrescarKardex}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refrescar kardex"
              disabled={loading}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            {/* Exportar */}
            <button
              onClick={handleExportKardex}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Exportar kardex"
            >
              <Download className="w-5 h-5" />
            </button>
            
            {/* Cerrar */}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filtros */}
        {showFilters && (
          <KardexFilters
            onApplyFilters={handleApplyFilters}
            onClose={() => setShowFilters(false)}
          />
        )}

        {/* Stats */}
        <KardexStats 
          stats={stats} 
          producto={producto}
        />

        {/* Tabla */}
        <div className="flex-1 overflow-hidden">
          <KardexTable 
            movimientos={movimientos}
            unidad_medida={producto.unidad_medida}
          />
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Stock actual: <span className="font-semibold text-gray-900">
                {producto.stock_actual} {producto.unidad_medida}
              </span>
              {producto.stock_actual <= producto.stock_min && (
                <span className="ml-2 text-red-600 font-medium">
                  (Stock bajo - Mín: {producto.stock_min})
                </span>
              )}
            </div>
            <div>
              {stats.movimientos_periodo} movimiento{stats.movimientos_periodo !== 1 ? 's' : ''} en el período
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KardexModal;