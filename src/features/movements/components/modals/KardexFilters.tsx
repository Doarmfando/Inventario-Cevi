// src/features/movements/components/modals/KardexFilters.tsx

import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import type { KardexDateRange } from '../../types/kardex.types';

interface KardexFiltersProps {
  onApplyFilters: (filtros: KardexDateRange) => void;
  onClose: () => void;
}

export const KardexFilters: React.FC<KardexFiltersProps> = ({ onApplyFilters, onClose }) => {
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const handleApply = () => {
    const filtros: KardexDateRange = {};
    
    if (fechaDesde) {
      filtros.fecha_desde = new Date(fechaDesde).toISOString();
    }
    
    if (fechaHasta) {
      // Agregar 23:59:59 para incluir todo el día
      const hasta = new Date(fechaHasta);
      hasta.setHours(23, 59, 59, 999);
      filtros.fecha_hasta = hasta.toISOString();
    }
    
    onApplyFilters(filtros);
  };

  const handleClear = () => {
    setFechaDesde('');
    setFechaHasta('');
    onApplyFilters({});
  };

  // Obtener fecha de hoy en formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-4 bg-blue-50 border-b border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-medium text-blue-900">Filtros de Fecha</h3>
        </div>
        <button
          onClick={onClose}
          className="text-blue-600 hover:text-blue-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-1">
            Fecha Desde
          </label>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            max={today}
            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-900 mb-1">
            Fecha Hasta
          </label>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            min={fechaDesde || undefined}
            max={today}
            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3">
        <button
          onClick={handleClear}
          className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
        >
          Limpiar
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
};