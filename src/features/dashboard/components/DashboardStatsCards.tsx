import React from "react";
import { Package, DollarSign, AlertTriangle, TrendingDown, Archive, BarChart3 } from "lucide-react";
import type { DashboardStats } from "../services/dashboardService";

interface StatsCardsProps {
  stats: DashboardStats;
}

const DashboardStatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const statsData = [
    {
      title: "Total Productos",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      format: (value: number) => value.toString()
    },
    {
      title: "Categorías",
      value: stats.categoriesCount,
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      format: (value: number) => value.toString()
    },
    {
      title: "Valor Total",
      value: stats.totalValue,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      format: (value: number) => `S/. ${value.toFixed(2)}`
    },
    {
      title: "Stock Bajo",
      value: stats.lowStockItems,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      format: (value: number) => value.toString()
    },
    {
      title: "Sin Stock",
      value: stats.outOfStock,
      icon: Archive,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      format: (value: number) => value.toString()
    },
    {
      title: "Por Vencer",
      value: stats.expiringItems,
      icon: TrendingDown,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      format: (value: number) => value.toString()
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <div 
            key={index}
            className={`bg-white rounded-xl shadow-sm border ${stat.borderColor} p-6 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.format(stat.value)}
                </p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-full`}>
                <IconComponent className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            
            {/* Indicador visual para alertas */}
            {(stat.title === "Stock Bajo" || stat.title === "Sin Stock") && stat.value > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Requiere atención
                </span>
              </div>
            )}
            
            {stat.title === "Por Vencer" && stat.value > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Revisar pronto
                </span>
              </div>
            )}
            
            {(stat.title === "Total Productos" || stat.title === "Categorías") && stat.value > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Activo
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStatsCards;