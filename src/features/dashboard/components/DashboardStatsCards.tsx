import React from "react";
import { Package, TrendingUp, AlertTriangle, BarChart3 } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalProducts: number;
    totalValue: number;
    lowStockItems: number;
    categoriesCount: number;
  };
}

const DashboardStatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: "Total Productos",
      value: stats.totalProducts.toString(),
      icon: Package,
      gradient: "from-blue-500 to-blue-600",
      textColor: "text-blue-100",
      iconColor: "text-blue-200"
    },
    {
      title: "Valor Total",
      value: `S/${stats.totalValue.toLocaleString()}`,
      icon: TrendingUp,
      gradient: "from-green-500 to-green-600",
      textColor: "text-green-100",
      iconColor: "text-green-200"
    },
    {
      title: "Stock Bajo",
      value: stats.lowStockItems.toString(),
      icon: AlertTriangle,
      gradient: "from-red-500 to-red-600",
      textColor: "text-red-100",
      iconColor: "text-red-200"
    },
    {
      title: "Categorías",
      value: stats.categoriesCount.toString(),
      icon: BarChart3,
      gradient: "from-purple-500 to-purple-600",
      textColor: "text-purple-100",
      iconColor: "text-purple-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div 
            key={index}
            className={`bg-gradient-to-r ${card.gradient} p-6 rounded-xl text-white transform hover:scale-105 transition-transform duration-200 shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`${card.textColor} text-sm font-medium`}>
                  {card.title}
                </p>
                <p className="text-3xl font-bold mt-1">
                  {card.value}
                </p>
              </div>
              <IconComponent className={`w-8 h-8 ${card.iconColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStatsCards;
