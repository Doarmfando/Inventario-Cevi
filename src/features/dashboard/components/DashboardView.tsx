import React, { useState } from "react";
import { useDashboard } from "../hooks/useDashboard";
import DashboardStatsCards from "./DashboardStatsCards";
import LowStockAlert from "./LowStockAlert";
import CategorySummary from "./CategorySummary";
import InventoryTrends from "./InventoryTrends";
import { BarChart3, TrendingUp, Package, AlertCircle } from "lucide-react";

type DashboardTab = 'overview' | 'trends' | 'categories' | 'alerts';

const DashboardView: React.FC = () => {
  const { stats, lowStockProducts, expiringProducts, categoryStats, loading, error } = useDashboard();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar el dashboard</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'overview' as DashboardTab,
      name: 'Resumen General',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'trends' as DashboardTab,
      name: 'Tendencias',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'categories' as DashboardTab,
      name: 'Categorías',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'alerts' as DashboardTab,
      name: 'Alertas',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      badge: (lowStockProducts.length + expiringProducts.length) || undefined
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Inventario</h1>
          <p className="text-gray-600">Resumen general del estado de tu inventario</p>
        </div>

        {/* Estadísticas principales (siempre visibles) */}
        <DashboardStatsCards stats={stats} />

        {/* Navegación por pestañas */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      isActive
                        ? `border-blue-500 ${tab.color}`
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 mr-2 ${
                      isActive ? tab.color : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    {tab.name}
                    {tab.badge && tab.badge > 0 && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Contenido de las pestañas */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Alertas rápidas */}
              {(lowStockProducts.length > 0 || expiringProducts.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {lowStockProducts.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        Stock Bajo - Vista Rápida
                      </h3>
                      <div className="space-y-2">
                        {lowStockProducts.slice(0, 3).map(product => (
                          <div key={product.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                            <span className="text-sm font-medium text-gray-800">{product.name}</span>
                            <span className="text-xs text-red-600 font-medium">
                              {product.quantity} / {product.minStock}
                            </span>
                          </div>
                        ))}
                        {lowStockProducts.length > 3 && (
                          <button
                            onClick={() => setActiveTab('alerts')}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Ver todos ({lowStockProducts.length})
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {expiringProducts.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
                        Próximos a Vencer
                      </h3>
                      <div className="space-y-2">
                        {expiringProducts.slice(0, 3).map(product => (
                          <div key={product.id} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                            <span className="text-sm font-medium text-gray-800">{product.name}</span>
                            <span className="text-xs text-orange-600 font-medium">
                              {new Date(product.expiryDate).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                        {expiringProducts.length > 3 && (
                          <button
                            onClick={() => setActiveTab('alerts')}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Ver todos ({expiringProducts.length})
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Resumen de categorías */}
              <CategorySummary categoryStats={categoryStats} />
            </div>
          )}

          {activeTab === 'trends' && (
            <InventoryTrends />
          )}

          {activeTab === 'categories' && (
            <CategorySummary categoryStats={categoryStats} />
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <LowStockAlert lowStockProducts={lowStockProducts} />
              
              {expiringProducts.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
                      Productos Próximos a Vencer
                    </h3>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full font-medium">
                      {expiringProducts.length} productos
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {expiringProducts.map(product => {
                      const daysUntilExpiry = Math.ceil(
                        (new Date(product.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                      );
                      
                      return (
                        <div key={product.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100">
                          <div>
                            <p className="font-medium text-gray-800">{product.name}</p>
                            <p className="text-sm text-gray-600">
                              Vence: {new Date(product.expiryDate).toLocaleDateString()} 
                              ({daysUntilExpiry === 0 ? 'Hoy' : `${daysUntilExpiry} días`})
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                            daysUntilExpiry <= 0 
                              ? 'bg-red-600 text-white' 
                              : daysUntilExpiry <= 3
                              ? 'bg-orange-600 text-white'
                              : 'bg-orange-500 text-white'
                          }`}>
                            {daysUntilExpiry <= 0 
                              ? 'Vencido' 
                              : daysUntilExpiry <= 3 
                              ? 'Crítico' 
                              : 'Por Vencer'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {lowStockProducts.length === 0 && expiringProducts.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Package className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    ¡Todo en orden!
                  </h3>
                  <p className="text-gray-600">
                    No hay productos con stock bajo ni próximos a vencer.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;