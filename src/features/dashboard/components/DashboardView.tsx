import React from "react";
import { Package, TrendingUp, AlertTriangle, BarChart3 } from "lucide-react";
import { useInventory } from "../../inventory/hooks/useInventory";

const DashboardView: React.FC = () => {
  const { getStats, getLowStockProducts, getProductsByCategory } = useInventory();
  const stats = getStats();
  const lowStockProducts = getLowStockProducts();
  const categoryStats = getProductsByCategory();

  return (
    <div className="p-6">
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Productos</p>
              <p className="text-3xl font-bold">{stats.totalProducts}</p>
            </div>
            <Package className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Valor Total</p>
              <p className="text-3xl font-bold">${stats.totalValue.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Stock Bajo</p>
              <p className="text-3xl font-bold">{stats.lowStockItems}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Categorías</p>
              <p className="text-3xl font-bold">{stats.categoriesCount}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Productos con stock bajo */}
      {stats.lowStockItems > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            Productos con Stock Bajo
          </h3>
          <div className="space-y-3">
            {lowStockProducts.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">Stock actual: {item.quantity} | Mínimo: {item.minStock}</p>
                </div>
                <span className="px-3 py-1 bg-red-500 text-white text-xs rounded-full">
                  Crítico
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumen de categorías */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen por Categorías</h3>
        <div className="space-y-4">
          {categoryStats.map(({ category, count, value }) => (
            <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">{category}</p>
                <p className="text-sm text-gray-600">{count} productos</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">${value.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Valor total</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;