import React from "react";
import { ChefHat, AlertTriangle, Clock, TrendingUp } from "lucide-react";

interface Stats {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  expiringItems: number;
  expiredItems: number;
}

interface StatsCardsProps {
  stats: Stats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Total Productos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Productos</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalProducts}
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <ChefHat className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Valor Total */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Valor Total</p>
            <p className="text-2xl font-bold text-gray-900">
              S/ {stats.totalValue.toLocaleString("es-PE", { 
                minimumFractionDigits: 2 
              })}
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Stock Bajo */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
            <p className="text-2xl font-bold text-orange-600">
              {stats.lowStockItems}
            </p>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Por Vencer */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Por Vencer</p>
            <p className="text-2xl font-bold text-red-600">
              {stats.expiringItems + stats.expiredItems}
            </p>
          </div>
          <div className="bg-red-100 p-3 rounded-lg">
            <Clock className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;