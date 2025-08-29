// src/features/movements/components/modals/KardexStats.tsx

import React from 'react';
import { TrendingUp, TrendingDown, RotateCcw, Package } from 'lucide-react';
import type { KardexStats as KardexStatsType } from '../../types/kardex.types';

interface KardexStatsProps {
  stats: KardexStatsType;
  currentStock: number;
}

export const KardexStats: React.FC<KardexStatsProps> = ({ stats, currentStock }) => {
  const statsItems = [
    {
      title: 'Total Entradas',
      value: stats.totalEntradas,
      icon: TrendingUp,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Total Salidas',
      value: stats.totalSalidas,
      icon: TrendingDown,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      title: 'Total Ajustes',
      value: stats.totalAjustes,
      icon: RotateCcw,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Stock Actual',
      value: currentStock,
      icon: Package,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 border-b border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statsItems.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className={`p-2 ${item.bgColor} rounded-lg`}>
                <item.icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">{item.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};