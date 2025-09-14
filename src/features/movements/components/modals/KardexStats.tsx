// src/features/movements/components/modals/KardexStats.tsx

import React from 'react';
import { TrendingUp, TrendingDown, RotateCcw, Package } from 'lucide-react';
import type { KardexStats as KardexStatsType, KardexProduct } from '../../types/kardex.types';

interface KardexStatsProps {
  stats: KardexStatsType;
  producto: KardexProduct;
}

const KardexStats: React.FC<KardexStatsProps> = ({ stats, producto }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  const statsItems = [
    {
      title: 'Entradas',
      count: stats.total_entradas,
      quantity: stats.cantidad_entradas,
      value: stats.valor_total_entradas,
      icon: TrendingUp,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-800'
    },
    {
      title: 'Salidas',
      count: stats.total_salidas,
      quantity: stats.cantidad_salidas,
      value: stats.valor_total_salidas,
      icon: TrendingDown,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      textColor: 'text-red-800'
    },
    {
      title: 'Ajustes',
      count: stats.total_ajustes,
      quantity: stats.cantidad_ajustes,
      value: 0,
      icon: RotateCcw,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-800'
    },
    {
      title: 'Stock Actual',
      count: 1,
      quantity: producto.stock_actual,
      value: producto.stock_actual * producto.precio_estimado,
      icon: Package,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-800'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 border-b border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statsItems.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-2 ${item.bgColor} rounded-lg`}>
                  <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">{item.title}</p>
                  <div className="flex items-center space-x-2">
                    <p className={`text-lg font-semibold ${item.textColor}`}>
                      {item.quantity} {producto.unidad_medida}
                    </p>
                    {item.count > 1 && (
                      <span className="text-xs text-gray-500">
                        ({item.count} mov.)
                      </span>
                    )}
                  </div>
                  {item.value > 0 && (
                    <p className="text-xs text-gray-500">
                      {formatCurrency(item.value)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KardexStats;