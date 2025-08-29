// src/features/containers/components/ui/SummaryStats.tsx

import React from 'react';
import type { ContainerProduct } from '../../types/container.types';

interface SummaryStatsProps {
  filteredProducts: ContainerProduct[];
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ filteredProducts }) => {
  const totalWeight = filteredProducts.reduce((sum, p) => sum + p.totalQuantity, 0);
  const totalPackages = filteredProducts.reduce((sum, p) => sum + p.packagedUnits, 0);
  const totalValue = filteredProducts.reduce((sum, p) => sum + (p.totalQuantity * p.price), 0);

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{filteredProducts.length}</div>
          <div className="text-sm text-gray-600">Productos mostrados</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{totalPackages}</div>
          <div className="text-sm text-gray-600">Total empaquetados</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{totalWeight.toFixed(1)} kg</div>
          <div className="text-sm text-gray-600">Peso total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">S/ {totalValue.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Valor total</div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStats;