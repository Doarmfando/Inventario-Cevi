// src/features/containers/components/ui/StatsCards.tsx

import React from 'react';
import { Container, Package, TrendingUp, AlertTriangle } from 'lucide-react';

interface StatsCardsProps {
  totalStats: {
    totalContainers: number;
    totalProducts: number;
    totalValue: number;
    activeContainers: number;
    vencidos: number;
    porVencer: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ totalStats }) => {
  return (
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
  );
};

export default StatsCards;